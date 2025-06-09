# TrueForm AI Development Guidelines

## Project Overview
TrueForm is a professional website platform built with SvelteKit, focusing on providing a modern, user-friendly experience for creating and managing websites. The platform includes a Conversational Wizard for user engagement and data capture, a comprehensive CRM system with Kanban boards, and a proposal generation system for business development.

## 🏗️ Architecture & Design Principles

### System Architecture
1. **Multi-Vertical Platform**: Support for TrueForm (websites) and Baseform (e-commerce) with shared core infrastructure
2. **Microservices Approach**: Modular components that can be developed and deployed independently
3. **API-First Design**: RESTful APIs that support both internal components and external integrations
4. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features
5. **Mobile-First Responsive Design**: Optimized for all device sizes with touch-friendly interfaces

### Database Design Principles
1. **Hierarchical Organization Structure**: Use ltree for efficient organizational queries
2. **Row Level Security (RLS)**: Implement organization-based data isolation
3. **Audit Trails**: Track all changes with created_at, updated_at, and created_by fields
4. **Soft Deletes**: Use status fields instead of hard deletes for important data
5. **JSONB for Flexible Data**: Use JSONB for settings, metadata, and dynamic content
6. **Proper Indexing**: Create indexes for all frequently queried columns
7. **Foreign Key Constraints**: Maintain referential integrity across all tables

## 💻 Code Style & Technical Standards

### General Principles
1. Follow SvelteKit best practices and conventions
2. Maintain consistent code formatting using Prettier
3. Use TypeScript for type safety across all components
4. Implement proper error handling and loading states
5. Follow component-based architecture principles
6. Write self-documenting code with clear variable and function names
7. Use semantic HTML elements for accessibility
8. Implement proper form validation on both client and server sides

### TypeScript Guidelines
1. **Strict Type Checking**: Enable strict mode in tsconfig.json
2. **Interface Definitions**: Create interfaces for all data structures
3. **Generic Types**: Use generics for reusable components and functions
4. **Utility Types**: Leverage TypeScript utility types (Partial, Pick, Omit, etc.)
5. **Enum Usage**: Use enums for fixed sets of values
6. **Type Guards**: Implement type guards for runtime type checking
7. **JSDoc Comments**: Document complex types and their usage

### Component Structure & Patterns
1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition over Inheritance**: Use composition patterns for complex components
3. **Props Interface**: Define clear interfaces for all component props
4. **Event Handling**: Use custom events for parent-child communication
5. **Reactive Statements**: Use $: for computed values and side effects
6. **Store Subscriptions**: Properly handle store subscriptions and cleanup
7. **Component Lifecycle**: Understand and properly use onMount, onDestroy, beforeUpdate, afterUpdate

### File Organization & Naming Conventions
1. **Directory Structure**:
   - `/src/lib/components/` for reusable components
   - `/src/routes/` for page components and API routes
   - `/src/lib/stores/` for Svelte stores
   - `/src/lib/utils/` for utility functions
   - `/src/lib/api/` for API interaction functions
   - `/src/lib/types/` for TypeScript type definitions
2. **Naming Conventions**:
   - PascalCase for components: `ProposalWizard.svelte`
   - camelCase for functions and variables: `getUserData()`
   - kebab-case for file names: `proposal-wizard.ts`
   - UPPER_SNAKE_CASE for constants: `MAX_FILE_SIZE`
3. **File Structure**:
   - Group related components in subdirectories
   - Keep component files under 300 lines when possible
   - Split large components into smaller, focused components

## 🗄️ Database & API Design

### Supabase Integration
1. **RLS Policies**: Implement comprehensive Row Level Security
2. **Database Functions**: Use PostgreSQL functions for complex business logic
3. **Real-time Subscriptions**: Implement real-time updates for collaborative features
4. **Storage Management**: Use Supabase Storage for file uploads with proper access controls
5. **Edge Functions**: Utilize Supabase Edge Functions for serverless operations

### API Design Standards
1. **RESTful Conventions**: Follow REST principles for resource management
2. **Consistent Response Format**:
   ```typescript
   interface APIResponse<T> {
     data?: T;
     error?: string;
     message?: string;
     status: number;
   }
   ```
3. **Error Handling**: Implement standardized error responses
4. **Input Validation**: Validate all inputs on both client and server
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Pagination**: Use consistent pagination for list endpoints
7. **Versioning**: Plan for API versioning from the start

### Data Validation & Sanitization
1. **Schema Validation**: Use libraries like Zod for runtime type checking
2. **Input Sanitization**: Sanitize all user inputs to prevent XSS
3. **SQL Injection Prevention**: Use parameterized queries exclusively
4. **File Upload Validation**: Validate file types, sizes, and content
5. **Email Validation**: Use proper email validation patterns
6. **Phone Number Formatting**: Implement consistent phone number formatting

## 🎨 UI/UX Guidelines & Design System

### Design System Implementation
1. **Color Palette**: Consistent use of TrueForm brand colors
   - Primary Gold: `#D4AF37`, `#B8860B`, `#DAA520`
   - Neutral Grays: `#1e293b`, `#64748b`, `#f8fafc`
   - Semantic Colors: Success, Warning, Error, Info
2. **Typography Scale**: 
   - Headings: Georgia serif font family
   - Body: System font stack for readability
   - Code: Monospace font for technical content
3. **Spacing System**: Use Tailwind's spacing scale consistently
4. **Border Radius**: Consistent border radius values (4px, 8px, 12px)
5. **Shadows**: Layered shadow system for depth perception

### Component Library Standards
1. **Reusable Components**: Build a comprehensive component library
2. **Props Interface**: Standardized props for similar components
3. **Variant System**: Support multiple variants (primary, secondary, outline, etc.)
4. **Size System**: Consistent sizing (sm, md, lg, xl)
5. **State Management**: Visual states (loading, disabled, error, success)
6. **Icon System**: Consistent icon usage with Lucide Svelte
7. **Animation Guidelines**: Subtle, purposeful animations under 300ms

### Accessibility (a11y) Requirements
1. **Semantic HTML**: Use proper HTML elements for their intended purpose
2. **ARIA Labels**: Implement ARIA labels where necessary
3. **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
4. **Focus Management**: Visible focus indicators and logical tab order
5. **Color Contrast**: WCAG AA compliant color contrast ratios
6. **Screen Reader Support**: Test with screen readers
7. **Alternative Text**: Provide alt text for all images
8. **Form Labels**: Proper labels for all form inputs

### Responsive Design Standards
1. **Mobile First**: Design for mobile devices first, then enhance for larger screens
2. **Breakpoint System**: Use Tailwind's breakpoint system consistently
3. **Touch Targets**: Minimum 44px touch target size
4. **Content Priority**: Prioritize content for smaller screens
5. **Performance**: Optimize for mobile network conditions
6. **Testing**: Test on actual devices, not just browser dev tools

## 🔐 Security & Privacy

### Authentication & Authorization
1. **Supabase Auth**: Use Supabase authentication system
2. **JWT Handling**: Secure JWT token storage and rotation
3. **Session Management**: Proper session lifecycle management
4. **Role-Based Access**: Implement role-based permissions
5. **Organization Isolation**: Ensure data isolation between organizations
6. **Password Policies**: Enforce strong password requirements
7. **Two-Factor Authentication**: Support 2FA for enhanced security

### Data Protection & Privacy
1. **Data Encryption**: Encrypt sensitive data at rest and in transit
2. **PII Handling**: Proper handling of personally identifiable information
3. **GDPR Compliance**: Implement GDPR requirements for EU users
4. **Data Retention**: Clear data retention and deletion policies
5. **Audit Logging**: Log all access to sensitive data
6. **Backup Security**: Secure backup procedures and access controls

### Input Validation & Sanitization
1. **Server-Side Validation**: Never trust client-side validation alone
2. **XSS Prevention**: Sanitize all user inputs to prevent cross-site scripting
3. **CSRF Protection**: Implement CSRF tokens for state-changing operations
4. **File Upload Security**: Validate and scan uploaded files
5. **SQL Injection Prevention**: Use parameterized queries exclusively
6. **Rate Limiting**: Implement rate limiting to prevent abuse

## ⚡ Performance Optimization

### Frontend Performance
1. **Code Splitting**: Implement route-based code splitting
2. **Lazy Loading**: Lazy load components and images
3. **Bundle Analysis**: Regular bundle size analysis and optimization
4. **Image Optimization**: Use WebP format and responsive images
5. **Caching Strategy**: Implement proper caching headers
6. **Critical CSS**: Inline critical CSS for above-the-fold content
7. **Service Workers**: Implement service workers for offline functionality

### Database Performance
1. **Query Optimization**: Optimize database queries and use EXPLAIN ANALYZE
2. **Index Management**: Create and maintain appropriate indexes
3. **Connection Pooling**: Use connection pooling for database connections
4. **Query Caching**: Implement query result caching where appropriate
5. **Pagination**: Use efficient pagination for large datasets
6. **Bulk Operations**: Use bulk operations for multiple database changes

### Monitoring & Analytics
1. **Performance Metrics**: Track Core Web Vitals and custom metrics
2. **Error Tracking**: Implement comprehensive error tracking
3. **User Analytics**: Track user interactions for UX insights
4. **Database Monitoring**: Monitor database performance and slow queries
5. **Real User Monitoring**: Track real user performance data
6. **Alerting**: Set up alerts for performance degradation

## 🧪 Testing Strategy

### Testing Pyramid
1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions and API endpoints
3. **End-to-End Tests**: Test complete user workflows
4. **Visual Regression Tests**: Test UI consistency across changes
5. **Performance Tests**: Test performance under load
6. **Accessibility Tests**: Automated accessibility testing

### Testing Tools & Frameworks
1. **Vitest**: For unit and integration testing
2. **Testing Library**: For component testing
3. **Playwright**: For end-to-end testing
4. **MSW**: For API mocking in tests
5. **Storybook**: For component development and testing
6. **Axe**: For accessibility testing

### Test Quality Standards
1. **Coverage Requirements**: Maintain >80% code coverage
2. **Test Naming**: Clear, descriptive test names
3. **Test Organization**: Organize tests to mirror source structure
4. **Test Data**: Use factories for generating test data
5. **Mocking Strategy**: Mock external dependencies appropriately
6. **Continuous Testing**: Run tests on every commit and pull request

## 📈 Development Workflow

### Version Control & Git
1. **Branch Strategy**: Use feature branches with descriptive names
2. **Commit Messages**: Follow conventional commit format
3. **Pull Requests**: Require code review for all changes
4. **Git Hooks**: Use pre-commit hooks for linting and testing
5. **Branch Protection**: Protect main branch with required checks
6. **Release Tagging**: Use semantic versioning for releases

### Code Review Process
1. **Review Requirements**: At least one approval required
2. **Review Checklist**: Follow standardized review checklist
3. **Automated Checks**: Run linting, testing, and type checking
4. **Security Review**: Review for security implications
5. **Performance Impact**: Consider performance implications
6. **Documentation Updates**: Ensure documentation stays current

### Deployment & CI/CD
1. **Automated Testing**: Run full test suite on every push
2. **Build Validation**: Ensure builds succeed before deployment
3. **Environment Parity**: Keep development and production environments similar
4. **Database Migrations**: Implement safe database migration strategies
5. **Rollback Strategy**: Plan for quick rollbacks if issues arise
6. **Feature Flags**: Use feature flags for gradual rollouts

## 📚 Documentation Standards

### Code Documentation
1. **JSDoc Comments**: Document all public functions and complex logic
2. **README Files**: Comprehensive README for each major component
3. **API Documentation**: Auto-generated API documentation
4. **Component Documentation**: Document component props and usage
5. **Architecture Decision Records**: Document significant architectural decisions
6. **Inline Comments**: Explain complex business logic and algorithms

### User Documentation
1. **User Guides**: Step-by-step guides for all major features
2. **API Documentation**: Complete API reference with examples
3. **Troubleshooting**: Common issues and solutions
4. **FAQ**: Frequently asked questions
5. **Video Tutorials**: Screen recordings for complex workflows
6. **Release Notes**: Document changes in each release

## 🚀 Current Development Priorities

### Immediate Focus Areas
1. **Proposal Generator Implementation**
   - Phase 1: Core functionality with PDF generation
   - Database schema implementation
   - Wizard-based user interface
   - TrueForm branding integration
   - Client information management

2. **CRM Integration Enhancement**
   - Improved Kanban board functionality
   - Activity tracking and logging
   - Contact management system
   - Opportunity pipeline optimization
   - Reporting and analytics foundation

3. **Multi-Vertical Platform Support**
   - TrueForm and Baseform separation
   - Shared component library
   - Organization-based data isolation
   - Vertical-specific workflows

### Technical Debt Management
1. **Code Quality Improvements**
   - Increase test coverage to >80%
   - Implement comprehensive error handling
   - Optimize database queries
   - Improve TypeScript strict mode compliance

2. **Performance Optimization**
   - Implement code splitting
   - Optimize bundle size
   - Improve database indexing
   - Add performance monitoring

3. **Security Enhancements**
   - Complete RLS policy implementation
   - Add comprehensive input validation
   - Implement audit logging
   - Security testing and penetration testing

## 🔧 Development Environment

### Required Tools
1. **Node.js**: Latest LTS version
2. **pnpm**: Preferred package manager
3. **Supabase CLI**: For local development and migrations
4. **PostgreSQL**: Local database for development
5. **VS Code**: Recommended editor with Svelte extension
6. **Git**: Version control

### Development Setup
1. **Environment Variables**: Use .env.local for local configuration
2. **Database Setup**: Use Supabase local development
3. **Code Formatting**: Prettier with project configuration
4. **Linting**: ESLint with TypeScript and Svelte rules
5. **Type Checking**: TypeScript strict mode enabled
6. **Hot Reload**: Vite dev server for fast development

### Quality Assurance
1. **Pre-commit Hooks**: Lint, format, and type check
2. **Automated Testing**: Run tests on file changes
3. **Build Validation**: Ensure production builds succeed
4. **Dependency Auditing**: Regular security audits of dependencies
5. **Code Complexity**: Monitor and reduce code complexity
6. **Performance Budgets**: Set and monitor performance budgets

This comprehensive guide serves as the foundation for all TrueForm development work, ensuring consistency, quality, and maintainability across the entire platform. 