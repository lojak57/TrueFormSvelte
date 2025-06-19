# Multi-Tenant Architecture Plan for TrueForm

## Executive Summary

This document outlines a pragmatic approach to evolving TrueForm from a single-tenant administrative system to a true multi-tenant SaaS platform capable of hosting hundreds of client websites with isolated data and authentication.

## Current State Analysis

### What We Have

- Single database with basic RLS policies
- Authentication for TrueForm staff only
- Tables prefixed with `tf_` for internal operations
- No tenant isolation or multi-tenant awareness

### What We Need

- Isolated data per client website
- Separate authentication for each client's customers
- Scalable architecture supporting 100+ tenants
- Performance that doesn't degrade with tenant growth

## Proposed Architecture: Hybrid Approach

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Prepare codebase for multi-tenancy without breaking existing functionality

#### 1.1 Database Schema Evolution

```sql
-- Create tenant management table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Billing/plan information
  plan_type TEXT DEFAULT 'starter',
  max_users INTEGER DEFAULT 100,
  max_storage_gb INTEGER DEFAULT 10
);

-- Add tenant_id to all existing tables
ALTER TABLE tf_companies ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE tf_contacts ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- ... repeat for all tables

-- Create index for performance
CREATE INDEX idx_tenant_id ON tf_companies(tenant_id);
-- ... repeat for all tables
```

#### 1.2 Update RLS Policies

```sql
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS authenticated_users_all ON tf_companies;

-- Create tenant-aware policies
CREATE POLICY tenant_isolation ON tf_companies
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM tenant_users
      WHERE tenant_id = tf_companies.tenant_id
    )
  );
```

#### 1.3 Create Tenant Context System

```typescript
// src/lib/server/tenant.ts
export async function getTenantFromRequest(
  request: Request
): Promise<string | null> {
  const url = new URL(request.url);

  // Check subdomain
  const subdomain = url.hostname.split(".")[0];
  if (subdomain !== "www" && subdomain !== "app") {
    return subdomain;
  }

  // Check custom domain
  const tenant = await supabase
    .from("tenants")
    .select("id")
    .eq("custom_domain", url.hostname)
    .single();

  return tenant?.data?.id || null;
}

// src/hooks.server.ts
export async function handle({ event, resolve }) {
  const tenantId = await getTenantFromRequest(event.request);
  event.locals.tenantId = tenantId;

  // Inject tenant context into all queries
  if (tenantId) {
    event.locals.supabase = createTenantClient(tenantId);
  }

  return resolve(event);
}
```

### Phase 2: Client Website Infrastructure (Weeks 3-4)

**Goal:** Enable clients to have their own websites with isolated data

#### 2.1 Website Builder Tables

```sql
-- Client website configuration
CREATE TABLE tenant_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  theme_config JSONB DEFAULT '{}',
  navigation JSONB DEFAULT '[]',
  pages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client's customers (their website users)
CREATE TABLE tenant_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  email TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- Dynamic content per tenant
CREATE TABLE tenant_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  type TEXT NOT NULL, -- 'product', 'blog_post', 'service', etc
  slug TEXT NOT NULL,
  content JSONB NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, type, slug)
);
```

#### 2.2 Routing Strategy

```typescript
// src/routes/[tenant]/+layout.server.ts
export async function load({ params, locals }) {
  const { tenant } = params;

  // Verify tenant exists and is active
  const tenantData = await locals.supabase
    .from("tenants")
    .select("*")
    .eq("subdomain", tenant)
    .single();

  if (!tenantData) {
    throw error(404, "Site not found");
  }

  // Load tenant-specific configuration
  const website = await locals.supabase
    .from("tenant_websites")
    .select("*")
    .eq("tenant_id", tenantData.id)
    .single();

  return {
    tenant: tenantData,
    website: website,
    theme: website.theme_config,
  };
}
```

### Phase 3: Authentication Separation (Weeks 5-6)

**Goal:** Separate TrueForm admin auth from client customer auth

#### 3.1 Dual Authentication Strategy

```typescript
// src/lib/auth/tenant-auth.ts
export class TenantAuth {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  async signUp(email: string, password: string) {
    // Create auth user
    const { data: authUser, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tenant_id: this.tenantId,
          role: "customer",
        },
      },
    });

    // Create tenant customer record
    if (authUser) {
      await supabase.from("tenant_customers").insert({
        id: authUser.user.id,
        tenant_id: this.tenantId,
        email: email,
      });
    }

    return { authUser, error };
  }
}
```

#### 3.2 JWT Claims for Tenant Isolation

```sql
-- Function to add tenant claims to JWT
CREATE OR REPLACE FUNCTION public.custom_jwt_claims()
RETURNS JSON AS $$
  SELECT json_build_object(
    'tenant_id', COALESCE(
      current_setting('request.jwt.claims', true)::json->>'tenant_id',
      (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    ),
    'role', COALESCE(
      current_setting('request.jwt.claims', true)::json->>'role',
      'customer'
    )
  );
$$ LANGUAGE SQL STABLE;
```

### Phase 4: Performance & Scale (Weeks 7-8)

**Goal:** Ensure system performs well with 100+ tenants

#### 4.1 Database Optimizations

```sql
-- Partition large tables by tenant
CREATE TABLE tenant_content_2024 PARTITION OF tenant_content
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01')
  PARTITION BY HASH (tenant_id);

-- Materialized views for common queries
CREATE MATERIALIZED VIEW tenant_stats AS
SELECT
  tenant_id,
  COUNT(DISTINCT customer_id) as total_customers,
  COUNT(DISTINCT page_id) as total_pages,
  SUM(storage_bytes) as storage_used
FROM tenant_analytics
GROUP BY tenant_id;

-- Create composite indexes
CREATE INDEX idx_tenant_content_lookup
  ON tenant_content(tenant_id, type, slug)
  WHERE published = true;
```

#### 4.2 Caching Strategy

```typescript
// src/lib/cache/tenant-cache.ts
import { Redis } from "@upstash/redis";

export class TenantCache {
  private redis: Redis;
  private tenantId: string;

  async getCachedContent(type: string, slug: string) {
    const key = `tenant:${this.tenantId}:${type}:${slug}`;
    const cached = await this.redis.get(key);

    if (!cached) {
      const fresh = await this.fetchFromDB(type, slug);
      await this.redis.set(key, fresh, { ex: 3600 }); // 1 hour
      return fresh;
    }

    return cached;
  }
}
```

### Phase 5: Tenant Management UI (Weeks 9-10)

**Goal:** Give TrueForm admins tools to manage tenants

#### 5.1 Admin Dashboard Features

- Tenant creation wizard
- Resource usage monitoring
- Billing integration
- Tenant health dashboard
- One-click tenant provisioning

#### 5.2 Tenant Self-Service Portal

```typescript
// src/routes/portal/[tenant]/+page.svelte
<script lang="ts">
  export let data;

  const stats = {
    customers: data.customerCount,
    storage: data.storageUsed,
    bandwidth: data.bandwidthUsed,
    uptime: data.uptimePercentage
  };
</script>

<TenantDashboard {stats} />
<ResourceUsage current={data.usage} limit={data.plan.limits} />
<BillingOverview subscription={data.subscription} />
```

## Migration Strategy

### For Existing TrueForm Data

1. Create default tenant for TrueForm operations
2. Migrate all existing data to default tenant
3. Update all queries to include tenant context
4. Test thoroughly with existing functionality

### For New Clients

1. Use tenant creation wizard
2. Automatic provisioning of tables/schemas
3. Subdomain setup with SSL
4. Initial theme/content deployment

## Technical Considerations

### Security

- Tenant isolation at every layer
- Regular security audits
- Penetration testing for tenant boundary violations
- Encrypted tenant data at rest

### Performance

- Monitor query performance per tenant
- Implement query complexity limits
- Use connection pooling per tenant
- CDN for static assets per tenant

### Scalability Checkpoints

- **10 tenants**: Current architecture sufficient
- **50 tenants**: Implement caching layer
- **100 tenants**: Consider read replicas
- **500+ tenants**: Evaluate sharding strategy

## Rollout Plan

### MVP (Month 1)

- Basic tenant isolation
- Subdomain routing
- Simple website builder
- Customer authentication

### Beta (Month 2)

- 5-10 pilot clients
- Performance monitoring
- Bug fixes and optimizations
- Documentation

### Production (Month 3)

- Public launch
- Automated provisioning
- Full monitoring suite
- 24/7 support readiness

## Cost Implications

### Infrastructure

- **Database**: ~$100/month for initial setup
- **Caching**: ~$50/month (Redis)
- **CDN**: ~$20/month (Cloudflare)
- **Monitoring**: ~$50/month (Sentry + analytics)

### Per Tenant Costs

- **Storage**: ~$0.10/GB/month
- **Bandwidth**: ~$0.05/GB
- **Compute**: Negligible with proper caching

## Risk Mitigation

### Technical Risks

1. **Data Leakage**: Comprehensive RLS testing suite
2. **Performance Degradation**: Automated performance testing
3. **Tenant Provisioning Failures**: Rollback mechanisms

### Business Risks

1. **Over-promising**: Start with limited feature set
2. **Support Burden**: Self-service documentation
3. **Pricing Model**: Clear tier limitations

## Success Metrics

- Tenant provisioning time < 5 minutes
- Page load time < 500ms per tenant
- 99.9% uptime SLA
- Zero data leakage incidents
- Support ticket rate < 5% of tenants/month

## Conclusion

This plan provides a pragmatic path from single-tenant to multi-tenant architecture. The hybrid approach balances immediate needs with long-term scalability, allowing TrueForm to grow from 1 to 100+ clients without major architectural rewrites.

The key is starting with strong foundations (proper tenant isolation, RLS policies) and iterating based on actual usage patterns rather than over-engineering from day one.
