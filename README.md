# TrueForm - Professional Website Development Platform

> Transform your business with enterprise-grade websites delivered in days, not months.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)](https://svelte.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/trueform-svelte.git
cd trueform-svelte

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your actual values

# Start development server
npm run dev

# Open your browser
open http://localhost:5173
```

## 🏗️ Architecture

### **Technology Stack**

- **Frontend**: SvelteKit with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Svelte
- **Charts**: Chart.js with Svelte wrapper
- **Payments**: Stripe integration
- **Deployment**: Vercel/Netlify ready

### **Project Structure**

```
src/
├── lib/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI elements (Button, Card, etc.)
│   │   ├── forms/          # Form components
│   │   ├── navigation/     # Navigation components
│   │   ├── sections/       # Page sections (Hero, Features, etc.)
│   │   └── admin/          # Admin-specific components
│   ├── data/               # Static data and content
│   ├── services/           # API services and business logic
│   ├── stores/             # Svelte stores for state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── database/           # Database schemas and migrations
├── routes/                 # SvelteKit routes (pages)
│   ├── admin/              # Admin dashboard routes
│   ├── api/                # API endpoints
│   └── ...                 # Public pages
└── app.html               # HTML template
```

## 🛠️ Development Setup

### **Prerequisites**

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### **Environment Variables**

Create a `.env.local` file based on `env.example`:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Application Configuration
PUBLIC_APP_URL=http://localhost:5173
```

### **Database Setup**

1. Create a new Supabase project
2. Run the migrations in `src/lib/database/`
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Run type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm test             # Run tests
```

## 📚 Key Features

### **Public Website**

- 🎨 Modern, responsive design
- ⚡ Optimized performance (Lighthouse 95+)
- 🔍 SEO optimized
- 📱 Mobile-first approach
- 🎭 Smooth animations and transitions

### **Admin Dashboard**

- 👥 User management with role-based access
- 💼 Lead and opportunity tracking
- 📊 Analytics and reporting
- 💰 Payment processing with Stripe
- 📝 Proposal generation system

### **Authentication & Security**

- 🔐 Supabase Auth integration
- 🛡️ Row Level Security (RLS)
- 🔑 JWT token management
- 👤 Social login support
- 🚫 CSRF protection

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run component tests
npm run test:components

# Run integration tests
npm run test:integration
```

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### **Netlify**

```bash
# Build command
npm run build

# Publish directory
build/

# Environment variables: Set in Netlify dashboard
```

### **Production Checklist**

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking setup
- [ ] Error monitoring configured

## 🤝 Contributing

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push to branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### **Code Standards**

- TypeScript for all new code
- Components should be under 200 lines
- Proper error handling and validation
- Comprehensive test coverage
- Clear, descriptive commit messages

### **Pull Request Guidelines**

- Include a clear description of changes
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Request review from maintainers

## 📖 Documentation

- [Component Documentation](./docs/components.md)
- [API Documentation](./docs/api.md)
- [Database Schema](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/your-org/trueform-svelte/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/your-org/trueform-svelte/discussions)
- **Documentation**: [Wiki](https://github.com/your-org/trueform-svelte/wiki)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Credits

Built with ❤️ by the TrueForm team.

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide](https://lucide.dev/)

---

**Excellence Refined.** 🎯
