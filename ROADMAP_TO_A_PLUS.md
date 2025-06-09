# TrueForm Svelte — Road to a **Rock-Solid A+**

*Version 2025-01-08 — merges Claude's original roadmap with "Digital General Contractor" guard-rails, performance budgets, and SaaS-first architecture.*

---

## 0 · North-Star Objectives
| Pillar | How We'll Measure "A+" |
|--------|------------------------|
| **Security & Stability** | 0 critical vulns in Trivy/Snyk · All webhooks verified · 99.9 % uptime in staging |
| **Maintainability** | 200 / 300 / 400 LOC caps enforced · ADRs for every architectural fork · Storybook catalogue green |
| **Test Coverage** | ≥ 80 % lines (unit) · 100 % happy-path E2E flows · Lighthouse-CI & axe-core budgets green each PR |
| **Performance** | LCP < 2.5 s · JS ≤ 180 kB gz · API p95 < 400 ms |
| **SaaS Architecture** | Sentry telemetry · Vercel deployment · Supabase backend |

---

## 1 · Phase 1 — Critical Security & Raw Stability (1 day)

### 1.1 Stripe Webhook Hardening
- **Fix raw-body trap**  
  > `+page.server.ts` → `handleStripeWebhook` reads `await request.rawBody()` **before** `json()`, passes to `stripe.webhooks.constructEvent`.  
- **Env guard**: `envsafe` schema includes `STRIPE_WEBHOOK_SECRET`.
- **Test**: Playwright tests Stripe CLI event on localhost → expect `200`, invalid sig → `400`.

### 1.2 Cleanup & Repo Hygiene
- Purge `*_BACKUP.*` and stray files.  
- Add **DangerJS** rule: fail PR if filename contains `BACKUP` or `copy`.

---

## 2 · Phase 2 — Foundation Refactors & Shared Types (2 days)

> **Order swap:** consolidate types *first* so wizard refactor writes against stable interfaces.

### 2.1 Type Consolidation
- Create `src/lib/types/database.types.ts`  
- Move all Supabase-generated types + `UserSession`, `Organization`, etc.  
- Barrel-export from `src/lib/types/index.ts`.  
- CI fails if `grep -R "@supabase/supabase-js" src | wc -l` in components > 0 (enforces service layer).

### 2.2 Validation Layer Clarification
| Layer | File | Purpose |
|-------|------|---------|
| Generic helpers | `src/lib/utils/validation.ts` | Custom Zod primitives, reusable helpers |
| App schemas | `src/lib/services/validation/validationService.ts` | Entity schemas, `parseOrThrow` wrappers |
| **Generator** | `pnpm zod:gen` | Emits `.d.ts` for API & DB validators |

### 2.3 Storybook (Histoire) Setup
- `packages/ui` Storybook with auto-docs.  
- CI publishes to Vercel sub-domain on every `main` push.  
- Components fail CI if not added to `.storybook/preview.mdx`.

---

## 3 · Phase 3 — Wizard & Store Refactor (3 days)

| File | Action | After-refactor Size |
|------|--------|---------------------|
| `SiteRequestWizard.svelte` | Split into `WizardContainer`, step loaders; move heavy logic to services | < 200 LOC |
| `proposalStore.ts` | Break into `proposalDataStore` + `proposalUIStore`; util funcs extracted | each < 150 LOC |
| `Header.svelte` | Create `DesktopNav`, `MobileNav`, `UserDropdown` | parent < 120 LOC |

- **Monorepo boundaries**: `eslint-plugin-boundaries` rule prohibits UI importing from `routes`.

---

## 4 · Phase 4 — Testing Scaffold First (½ day)

- Install **Vitest**, **@testing-library/svelte**, **vitest-axe**.  
- Add coverage gate `--coverage` (threshold 80 %).  
- Add `playwright.config.ts` with one smoke test (home 200).  
- CI matrix updated.

---

## 5 · Phase 5 — Comprehensive Tests (ongoing, 3 days)

| Layer | What to Cover | Goal |
|-------|---------------|------|
| Services | `authService`, `pdfGenerator`, `validationService`, `proposalService` | 90 % lines |
| Stores | All public actions, edge cases | 80 % |
| Components | Wizard steps, Proposal view | render + event tests |
| API | Stripe webhook, `/opportunities`, `/lead` | Supertest w/ mock Supabase |
| E2E | Registration, Wizard happy path, Admin nav | Playwright cloud run |

---

## 6 · Phase 6 — Performance & Accessibility Budgets (1 day)

| Tool | Budget | CI Action |
|------|--------|-----------|
| **Lighthouse-CI** | LCP < 2.5 s · JS ≤ 180 kB | Fails PR if over |
| **vitest-axe** | a11y violations = 0 critical | Fails unit test |
| **Bundle-Analyzer** | Warning if any route chunk > 100 kB | DangerJS comment |

Add `Budgets.json` to root; Lighthouse-CI uses it.

---

## 7 · Phase 7 — Error Telemetry (1 day)

### 7.1 Sentry Integration
- Install `@sentry/sveltekit` with DSN in environment variables
- Configure error tracking for both client and server-side
- Set up performance monitoring and release tracking
- Environment flag: `LOG_MODE=sentry` (hard-coded for SaaS deployment)

---

## 8 · Phase 8 — CI/CD & Governance Enhancements (½ day)

| Item | Implementation |
|------|----------------|
| **Conventional Commits** | commitlint + Husky pre-commit |
| **DangerJS rules** | TODO checker, missing tests, oversized file, ADR link |
| **Dependabot** | Security updates + Renovate (weekly grouped updates) |
| **Stale-branch bot** | Closes >30-day dormant PRs |
| **Monthly Tech-Debt** | GitHub projects automation |
| **CI Pipeline** | GitHub Actions: lint → test → Lighthouse-CI → deploy to Vercel + Supabase migrations |

---

## 9 · Phase 9 — Documentation & Seed Script (½ day)

- `docs/ADR-000-loc-limits.md` documents 200/300/400 caps & wizard pattern
- `db/seed.ts` seeds demo orgs, leads, brand kits
- README top-section "90-second run-locally" checklist
- C4 diagram (`docs/architecture.drawio` + PNG) committed
- **ADR-999**: Self-hosting deferred until on-prem hardware is purchased

---

## 10 · Phase 10 — Final Review & Continuous Ops (ongoing)

- Snyk nightly, severity > high fails main
- DORA board via GitHub Insights  
- Every quarter run `pnpm licenses:list` and record in ADR
- Monitoring relies on Sentry + Vercel/Supabase dashboards

---

## 🚦 Milestone Chart

| Phase | Days | Gate (CI or Manual) |
|-------|------|-------------------|
| 1 | 1 | Stripe test passes, no BACKUP files |
| 2 | 2 | Type imports fixed · Storybook builds |
| 3 | 3 | LOC caps green · lint passes |
| 4 | 0.5 | Coverage harness runs |
| 5 | 3 | 80 % coverage reached |
| 6 | 1 | Lighthouse-CI green |
| 7 | 1 | Sentry integration working |
| 8 | 0.5 | Danger rules trigger on test PR |
| 9 | 0.5 | Seed script loads demo data |
| **Total** | **12.5 dev-days** | **Project "A+" tag & v1.0.0 release** |

---

## ✅ Outcome

After these twelve focused days:

- PRs land only when tests, lint, perf, a11y and coverage stay green
- Stripe & auth paths hardened, errors captured to Sentry  
- Any new dev (or AI agent) sees boundaries, Storybook examples, typed schemas, and an ADR index—so velocity remains high without entropy
- SaaS-first architecture with clear path for future self-hosting when hardware arrives

---

## 🗂 ADR Stub Preview

**ADR-999: Future Self-Hosting Roadmap (Deferred)**

*Status: Proposed — implementation blocked by hardware availability.*

Once a dedicated server is acquired, TrueForm will:
1. Provision Docker Compose stack (SvelteKit, Postgres, Supabase Studio, MinIO, Traefik)
2. Mirror SaaS env vars via `.env.selfhost`  
3. Swap Cloudflare R2 → MinIO, Sentry → Loki-Grafana

No code changes required; compose file will live under `/infra/docker/`. 