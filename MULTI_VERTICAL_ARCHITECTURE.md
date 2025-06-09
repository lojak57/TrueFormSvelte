# 🚀 TrueForm Multi-Vertical Architecture

## Overview

TrueForm is built as a **multi-vertical SaaS platform** designed to scale across different business verticals while maintaining separate workflows, data, and analytics for each vertical.

## 🏗️ Architecture Hierarchy

```
Pillar Apps (Platform)
├── TrueForm (Vertical) - Website Development
│   ├── TrueForm Opportunities
│   ├── TrueForm Kanban
│   └── TrueForm Analytics
└── Baseform (Branch) - E-commerce Solutions
    ├── Baseform Opportunities  
    ├── Baseform Kanban
    └── Baseform Analytics
```

## 📊 Database Structure

### Core Tables

#### Organizations (Hierarchical Structure)
- **Platform**: `Pillar Apps` - Main organization
- **Vertical**: `TrueForm` - Website development vertical
- **Branch**: `Baseform` - E-commerce solutions branch
- **Customer**: Individual client organizations

#### Opportunity Tables
- **`opportunities`** - TrueForm website development leads
- **`baseform_opportunities`** - Baseform e-commerce leads

### Supporting Tables
- `users`, `profiles`, `memberships` - User management
- `brand_kits`, `proposals`, `invoices` - Business operations
- `activities`, `documents`, `tags` - CRM functionality
- `products`, `fabrics`, `categories` - Product management

## 🎯 Vertical Separation

### TrueForm (Website Development)
- **Pipeline**: Custom website projects
- **Workflow**: Discovery → Design → Development → Launch
- **Data**: Website requirements, design preferences, technical specs
- **Pricing**: Project-based pricing models

### Baseform (E-commerce Solutions)
- **Pipeline**: E-commerce store development
- **Workflow**: Store Setup → Product Import → Design → Launch
- **Data**: Product catalogs, inventory, payment processing
- **Pricing**: Subscription-based pricing tiers

## 🔄 Shared Admin Dashboard

### Unified View
- **Combined Analytics**: Total revenue, leads, conversion rates
- **Cross-Vertical Insights**: Performance comparison between verticals
- **Resource Management**: Team allocation across verticals

### Vertical-Specific Views
- **TrueForm Dashboard**: Website project pipeline, design workflows
- **Baseform Dashboard**: E-commerce store pipeline, product management
- **Individual KPIs**: Separate metrics for each vertical

## 📈 Scalability Design

### Adding New Verticals
1. Create new organization entry with `org_type: "vertical"`
2. Add vertical-specific opportunity table (e.g., `mobileform_opportunities`)
3. Implement vertical-specific workflows and UI components
4. Configure analytics and reporting for the new vertical

### Multi-Tenant Architecture
- **Organization Hierarchy**: Uses ltree for efficient hierarchical queries
- **Data Isolation**: Each vertical maintains separate data pipelines
- **Shared Resources**: Common components (users, billing, analytics)

## 🛠️ Technical Implementation

### Frontend (SvelteKit)
```
src/
├── routes/
│   ├── admin/
│   │   ├── dashboard/          # Unified dashboard
│   │   ├── trueform/          # TrueForm-specific admin
│   │   └── baseform/          # Baseform-specific admin
│   ├── trueform/              # TrueForm marketing & forms
│   └── baseform/              # Baseform marketing & forms
├── lib/
│   ├── components/
│   │   ├── trueform/          # TrueForm components
│   │   └── baseform/          # Baseform components
│   └── api/
│       ├── trueform.ts        # TrueForm API calls
│       └── baseform.ts        # Baseform API calls
```

### Backend (Supabase)
- **Row Level Security**: Org-based data access control
- **Real-time Subscriptions**: Live updates for each vertical
- **Custom Functions**: Vertical-specific business logic

## 📋 Current Status

### ✅ Completed
- [x] Database schema with multi-vertical support
- [x] Organizational hierarchy (Platform → Vertical → Branch)
- [x] Separate opportunity tables for TrueForm and Baseform
- [x] Basic admin dashboard structure
- [x] Supabase integration with real credentials

### 🚧 In Progress
- [ ] Vertical-specific Kanban boards
- [ ] Cross-vertical analytics dashboard
- [ ] Baseform-specific UI components
- [ ] Advanced workflow automation

### 🎯 Next Steps
1. **Implement Baseform Frontend**: Create Baseform-specific pages and components
2. **Enhanced Analytics**: Build cross-vertical reporting dashboard
3. **Workflow Automation**: Implement vertical-specific business logic
4. **Third Vertical**: Plan and implement next business vertical

## 🔧 Development Workflow

### Adding a New Vertical
1. **Database**: Create `{vertical}_opportunities` table
2. **API**: Add vertical-specific API endpoints
3. **Frontend**: Create vertical-specific routes and components
4. **Admin**: Add vertical section to admin dashboard
5. **Analytics**: Integrate vertical metrics into reporting

### Data Flow
```
Lead Capture → Vertical Router → Specific Pipeline → Unified Analytics
```

## 🎨 UI/UX Strategy

### Brand Consistency
- **Shared Design System**: Common components and styling
- **Vertical Branding**: Subtle color/icon differences per vertical
- **Unified Navigation**: Seamless switching between verticals

### User Experience
- **Role-Based Access**: Users see relevant verticals only
- **Context Switching**: Easy navigation between vertical dashboards
- **Unified Search**: Cross-vertical search and filtering

## 📊 Analytics & Reporting

### Vertical-Specific Metrics
- **TrueForm**: Project completion rates, design approval times
- **Baseform**: Store launch times, product import success rates

### Cross-Vertical Insights
- **Revenue Comparison**: Performance across verticals
- **Resource Allocation**: Team efficiency per vertical
- **Market Opportunities**: Growth potential analysis

## 🚀 Go-to-Market Strategy

### TrueForm (Primary)
- **Target**: Small to medium businesses needing websites
- **Positioning**: Professional, fast, conversion-optimized websites
- **Pricing**: Project-based with clear packages

### Baseform (Secondary)
- **Target**: Businesses needing e-commerce solutions
- **Positioning**: Quick store setup with professional design
- **Pricing**: Subscription tiers based on features

This architecture positions TrueForm as a scalable platform ready for rapid growth and expansion into new business verticals while maintaining operational efficiency and data integrity. 