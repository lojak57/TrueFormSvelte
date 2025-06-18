# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrueForm is a professional website development platform built with SvelteKit and TypeScript. It's designed for rapid delivery of enterprise-grade websites and includes a comprehensive admin dashboard for business operations including proposal generation, customer management, and project tracking.

The platform serves a **$999-1500 productized service model** with streamlined client onboarding, professional proposal generation, and efficient internal operations designed to scale to 1000+ clients.

## Development Commands

### Essential Commands

```bash
npm run dev           # Start development server (localhost:5173)
npm run build         # Build for production
npm run preview       # Preview production build locally
npm run check         # Type checking with svelte-check
npm run lint          # ESLint + Prettier check
npm run format        # Auto-format with Prettier
```

### Testing Commands

```bash
npm test              # Run Vitest unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate test coverage report
npm run test:e2e      # Run Playwright E2E tests
npm run test:e2e:ui   # Run E2E tests with UI
npm run test:all      # Run all tests (unit + E2E)
```

### Running Single Tests

```bash
# Run a single test file with Vitest
npm test src/lib/utils/validation.test.ts

# Run tests matching a pattern
npm test -- --grep "auth"

# Run E2E test for specific browser
npx playwright test --project=chromium tests/e2e/auth.e2e.ts

# Debug a single E2E test
npx playwright test --debug tests/e2e/auth.e2e.ts
```

## Architecture Overview

### Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **PDF Generation**: Puppeteer + pdf-lib for professional proposals
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Icons**: Lucide Svelte
- **Charts**: Chart.js with Svelte wrapper

### Database Schema (key tables with tf\_ prefix)

- `tf_verticals` - Industry/sector classifications
- `tf_companies` - Client companies with billing info
- `tf_contacts` - Individual contacts within companies
- `tf_company_projects` - Project tracking
- `tf_contact_interactions` - Communication history
- `tf_proposals` - Proposal management with line items
- `tf_proposal_line_items` - Individual line items for proposals

### Core Architecture Patterns

#### 1. Environment Configuration

- Uses `src/lib/utils/env.ts` for validated environment variables
- Server-side throws errors, client-side warns for missing env vars
- All environment variables are typed and validated on module load

#### 2. State Management

- Svelte stores for application state
- Complex stores like `proposalStore.ts` use derived stores for calculations
- Separation of data, UI state, and actions within stores
- Autosave state tracking for dirty data detection

#### 3. Service Layer Architecture

- Services in `src/lib/services/` handle all business logic
- `authService.ts` - Authentication with validation and error handling
- `CompanyService.ts`, `ProjectService.ts` - CRUD operations
- Each service returns typed responses with error handling
- All services follow `{ data, error }` return pattern for consistency
- Service methods handle Supabase errors and transform them appropriately

#### 4. Component Organization

```
src/lib/components/
├── ui/              # Basic UI components (buttons, cards, inputs)
├── base/            # Foundation components
├── business/        # Business logic components
├── layout/          # Layout and navigation
├── forms/           # Form components
├── admin/           # Admin-specific components
├── proposals/       # Proposal system components
└── sections/        # Landing page sections
```

#### 5. Type Safety

- Comprehensive TypeScript types in `src/lib/types.ts`
- Separate DTO interfaces for create/update operations
- Database types mirror SQL schema with proper relationships

#### 6. Error Handling

- Centralized error handling in `src/lib/utils/errors.ts`
- Custom `AuthError` class for authentication
- Service layer catches and transforms errors consistently

### Database Setup Process

1. Run `database-setup.sql` in Supabase SQL Editor
2. All tables use UUID primary keys and RLS policies
3. Tables are prefixed with `tf_` for organization
4. Includes sample data for verticals and companies

### Authentication Flow

- Supabase Auth with email/password
- Password validation (8+ chars, mixed case, numbers)
- Session management through `UserSession` interface
- Role-based access through user metadata

### Proposal System Architecture

The proposal system is a complex multi-step wizard with:

- 5-step wizard (Company/Title → Contact → Line Items → Terms → Review)
- Real-time calculations derived from line items and tax rates
- Validation at each step with comprehensive error reporting
- Autosave functionality with dirty state tracking
- Smart line item deduplication (non-custom items merge quantities)
- Professional PDF generation with QR codes for payment/acceptance
- Service template system with 20+ predefined offerings across 6 categories

### Site Request Wizard Architecture

The main client-facing wizard (`SiteRequestWizard.svelte`) is a comprehensive 12-step consultation flow:

- **Discovery Phase**: Contact info, project vision, brand personality
- **Design Phase**: Visual preferences, website type, design elements, inspiration
- **Planning Phase**: Timeline, decision process, current challenges, success vision
- **Review Phase**: Summary and next steps
- Uses `wizardStore.ts` for state management with progress tracking
- Designed for high-value client consultation and lead qualification

### PDF Generation System

The PDF generation system creates professional proposals:

- **Template Processing**: HTML templates with dynamic data injection
- **Service Enhancement**: Automatic enhancement of line items with detailed descriptions
- **Professional Styling**: Custom CSS with consistent branding
- **QR Code Generation**: Payment and acceptance links for client convenience
- **Multi-format Support**: A4/Letter formats with responsive layouts
- **File Structure**: Modular system in `src/lib/services/pdf/`
  - `pdfGenerator.ts` - Main generation logic
  - `templateProcessor.ts` - HTML template processing
  - `serviceEnhancer.ts` - Line item enhancement
  - `types.ts` - TypeScript interfaces

## Development Guidelines

### File Patterns

- Route files use SvelteKit conventions (`+page.svelte`, `+server.ts`)
- Components should be under 200 lines when possible
- Services return `{ data, error }` pattern consistently
- All database operations use parameterized queries

### Testing Requirements

- Write unit tests for utilities and services
- E2E tests for critical user flows
- Always run tests before committing changes
- Component tests using Testing Library patterns
- Test coverage thresholds set at 70% (branches, functions, lines, statements)

### Code Style Enforcement

- Prettier for formatting (use `npm run format`)
- ESLint with TypeScript and Svelte rules
- Security-focused linting rules included
- Organize imports automatically

### Environment Setup

1. Copy `env.example` to `.env.local`
2. Configure Supabase URL and keys
3. Set up Stripe keys for payment processing
4. Run database migrations via SQL Editor

### Key Architectural Decisions

- **Deployment**: Vercel adapter with serverless functions
- **State Management**: Simple Svelte stores, no complex state libraries
- **Error Boundaries**: Custom error classes with proper error transformation
- **Type Safety**: Strict TypeScript mode with comprehensive typing
- **Testing Strategy**: Vitest for unit tests, Playwright for E2E with multi-browser support
- **Security**: RLS policies on all tables, authenticated API routes
- **Component Size**: Components should be under 200 lines (current largest: `SiteRequestWizard.svelte` at 2,125 lines - consider refactoring)
- **Monolithic Components**: Some large components exist for complex workflows but should be decomposed when possible

### Code Architecture Patterns

- **Service Layer**: All business logic in `src/lib/services/` with consistent `{ data, error }` return pattern
- **Validation**: Zod schemas for runtime validation with TypeScript interfaces
- **Environment**: Validated environment variables through `src/lib/utils/env.ts`
- **Database**: All tables prefixed with `tf_` and use UUID primary keys with RLS
- **API Routes**: RESTful endpoints following SvelteKit conventions with proper error handling

When working with this codebase, prioritize type safety, comprehensive error handling, and maintaining the established patterns for state management and service organization. The architecture supports the business model of rapid, professional website delivery with comprehensive client management.
