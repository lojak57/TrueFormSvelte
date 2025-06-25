# Route Reorganization Plan with Route Groups

## Current Structure Issues

- Admin routes mixed with public routes
- No clear separation between authenticated and public areas
- API routes scattered without grouping
- Duplicate routes (companies, contacts appear in both root and admin)

## Proposed Structure with Route Groups

```
src/routes/
├── (public)/                    # Public routes (no auth required)
│   ├── +layout.svelte          # Public layout (header, footer)
│   ├── +page.svelte            # Homepage
│   ├── about/
│   ├── contact/
│   ├── services/
│   │   └── [slug]/
│   ├── privacy/
│   ├── terms/
│   └── request/                # Public form
│       └── success/
│
├── (auth)/                     # Authenticated routes
│   ├── +layout.server.ts      # Auth check for entire group
│   ├── +layout.svelte         # Authenticated layout
│   ├── login/
│   │   └── +page.svelte
│   └── auth/
│       └── signout/
│
├── (app)/                      # Main app (authenticated users)
│   ├── +layout.server.ts      # Auth protection
│   ├── +layout.svelte         # App layout with sidebar
│   ├── dashboard/
│   ├── companies/
│   ├── contacts/
│   ├── projects/
│   └── proposals/
│
├── (admin)/                    # Admin panel (admin users only)
│   ├── +layout.server.ts      # Admin auth check
│   ├── +layout.svelte         # Admin layout
│   └── admin/
│       ├── dashboard/
│       ├── companies/
│       ├── contacts/
│       ├── projects/
│       ├── proposals/
│       ├── invoices/
│       ├── opportunities/
│       ├── verticals/
│       └── settings/
│
├── (api)/                      # API routes grouped
│   └── api/
│       ├── (public)/          # Public API endpoints
│       │   ├── wizard-submissions/
│       │   └── stripe-webhook/
│       └── (protected)/       # Protected API endpoints
│           ├── +layout.server.ts  # API auth check
│           ├── companies/
│           ├── contacts/
│           ├── projects/
│           ├── proposals/
│           └── verticals/
│
└── (dev)/                      # Development routes
    ├── design-system/
    ├── business-demo/
    └── test-db/
```

## Benefits of This Structure

### 1. **Clear Separation of Concerns**

- Public routes are clearly separated from authenticated routes
- Admin routes are isolated with their own auth checks
- API routes are grouped and can have shared middleware

### 2. **Better Authentication Flow**

- Each route group can have its own `+layout.server.ts` for auth checks
- No need to check auth in every single route file
- Centralized auth logic per group

### 3. **Improved Developer Experience**

- Easy to find related routes
- Clear mental model of the application structure
- Easier onboarding for new developers

### 4. **Enhanced Security**

- Auth checks at the group level
- Harder to accidentally expose protected routes
- Clear boundary between public and private areas

### 5. **Better Code Organization**

- Related routes stay together
- Shared layouts and logic per group
- Easier to maintain and scale

## Implementation Example

### (app)/+layout.server.ts

```typescript
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(303, "/login");
  }

  return {
    user: locals.user,
  };
};
```

### (admin)/+layout.server.ts

```typescript
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals }) => {
  // Check if user is authenticated AND is admin
  if (!locals.user) {
    throw redirect(303, "/login");
  }

  if (locals.user.role !== "admin") {
    throw redirect(303, "/dashboard");
  }

  return {
    user: locals.user,
  };
};
```

## Migration Strategy

1. **Phase 1**: Create route groups and move existing routes
2. **Phase 2**: Add group-level layouts and auth checks
3. **Phase 3**: Remove auth checks from individual routes
4. **Phase 4**: Clean up and test thoroughly

## Note on URLs

The parentheses in route groups do NOT appear in the URL. For example:

- `/(app)/dashboard` → URL is still `/dashboard`
- `/(admin)/admin/companies` → URL is still `/admin/companies`
- `/(public)/about` → URL is still `/about`

This means we can reorganize without breaking any existing links!
