# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TrueForm is a professional website development platform built with SvelteKit and TypeScript. It's designed for rapid delivery of enterprise-grade websites and includes a comprehensive admin dashboard for business operations including proposal generation, customer management, and project tracking.

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

## Architecture Overview

### Technology Stack
- **Frontend**: SvelteKit with TypeScript
- **Database**: Supabase (PostgreSQL with RLS)
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Payments**: Stripe integration
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Icons**: Lucide Svelte
- **Charts**: Chart.js with Svelte wrapper

### Database Schema (key tables with tf_ prefix)
- `tf_verticals` - Industry/sector classifications
- `tf_companies` - Client companies with billing info
- `tf_contacts` - Individual contacts within companies
- `tf_company_projects` - Project tracking
- `tf_contact_interactions` - Communication history

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

#### 4. Component Organization
```
src/lib/components/
├── ui/              # Basic UI components (buttons, cards, inputs)
├── base/            # Foundation components
├── business/        # Business logic components
├── layout/          # Layout and navigation
├── forms/           # Form components
└── admin/           # Admin-specific components
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

When working with this codebase, prioritize type safety, comprehensive error handling, and maintaining the established patterns for state management and service organization.