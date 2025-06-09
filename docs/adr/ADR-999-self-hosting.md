# ADR-999: Future Self-Hosting Roadmap (Deferred)

**Date**: 2025-01-08  
**Status**: Proposed — implementation blocked by hardware availability  
**Context**: SaaS-first architecture with future self-hosting capability  

## Background

TrueForm is currently architected for SaaS deployment via Vercel (frontend) and Supabase (backend). However, enterprise clients may require on-premise hosting for compliance, data sovereignty, or performance reasons.

## Decision

**Deferred Implementation**: Self-hosting capabilities will be implemented when dedicated server hardware is acquired.

## Future Implementation Plan

Once a dedicated server is acquired, TrueForm will:

1. **Infrastructure Setup**
   - Provision Docker Compose stack including:
     - SvelteKit application server
     - PostgreSQL database
     - Supabase Studio (self-hosted)
     - MinIO (S3-compatible storage)
     - Traefik (reverse proxy & SSL termination)

2. **Configuration Management**
   - Mirror SaaS environment variables via `.env.selfhost`
   - Swap external dependencies:
     - Cloudflare R2 → MinIO object storage
     - Sentry SaaS → Loki + Grafana stack
     - Vercel → Docker container deployment

3. **File Structure**
   ```
   /infra/
   ├── docker/
   │   ├── docker-compose.yml
   │   ├── docker-compose.prod.yml
   │   ├── nginx/
   │   └── ssl/
   └── scripts/
       ├── deploy.sh
       └── backup.sh
   ```

## Technical Requirements

### Minimum Hardware Specification
- **CPU**: 8-core x86_64 processor
- **RAM**: 16GB DDR4
- **Storage**: 500GB NVMe SSD
- **Network**: Gigabit Ethernet
- **GPU**: Optional - NVIDIA RTX 4070+ for future AI features

### Software Stack
- **OS**: Ubuntu Server 22.04 LTS
- **Container Runtime**: Docker Engine + Docker Compose
- **Reverse Proxy**: Traefik v3 with Let's Encrypt
- **Monitoring**: Prometheus + Grafana + Loki
- **Backup**: Automated daily snapshots to external storage

## Migration Strategy

1. **Code Compatibility**: No application code changes required
2. **Data Migration**: Export/import scripts for user data and configurations  
3. **DNS Cutover**: Blue/green deployment strategy
4. **Rollback Plan**: Ability to revert to SaaS deployment within 1 hour

## Success Criteria

- [ ] Complete environment parity between SaaS and self-hosted
- [ ] One-command deployment: `docker-compose up -d`
- [ ] Automated SSL certificate management
- [ ] Daily automated backups with tested restore procedures
- [ ] Monitoring and alerting equivalent to SaaS providers

## Notes

- **Current Status**: Hardware procurement pending
- **Timeline**: Implementation within 2 weeks of hardware availability
- **Dependencies**: Docker expertise, server administration capabilities

---

*This ADR will be activated and detailed implementation will commence once hardware infrastructure is available.* 