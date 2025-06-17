import type { ComponentType } from 'svelte';
import { Globe, Award, Users, Zap, Palette, Shield } from 'lucide-svelte';

// Type definitions for content structure
export interface Feature {
  id: string;
  icon: ComponentType;
  title: string;
  description: string;
  category: string;
  colorScheme: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface Stat {
  id: string;
  number: string;
  label: string;
  icon: ComponentType;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isPopular?: boolean;
  badge?: string;
  monthlyPrice?: string;
}

// Features data
export const FEATURES_DATA: Feature[] = [
  {
    id: 'architecture',
    icon: Shield,
    title: "Enterprise Architecture",
    description: "PostgreSQL with RLS security, TypeScript strictness, and SvelteKit performance. The same tech stack that powers billion-dollar companies.",
    category: 'technical',
    colorScheme: "text-blue-600 bg-blue-100"
  },
  {
    id: 'components',
    icon: Zap,
    title: "74 Custom Components",
    description: "Pre-built UI library with base, business, and layout components. No dependencies on external libraries that break or charge fees.",
    category: 'development',
    colorScheme: "text-purple-600 bg-purple-100"
  },
  {
    id: 'testing',
    icon: Award,
    title: "136 E2E Tests Passing",
    description: "Full Playwright test suite with cross-browser validation. Every feature tested before deployment - zero surprises.",
    category: 'quality',
    colorScheme: "text-green-600 bg-green-100"
  },
  {
    id: 'workflow',
    icon: Users,
    title: "Production Workflow",
    description: "Danger.js code review, ESLint security scanning, and automated deployment. The same standards as FAANG companies.",
    category: 'process',
    colorScheme: "text-yellow-600 bg-yellow-100"
  },
  {
    id: 'scalability',
    icon: Globe,
    title: "Built to Scale",
    description: "Multi-tenant ready, API-first design, and modular architecture. Your $999 site can grow into a million-dollar platform.",
    category: 'growth',
    colorScheme: "text-pink-600 bg-pink-100"
  },
  {
    id: 'performance',
    icon: Palette,
    title: "Lighthouse Perfect",
    description: "Optimized bundle splitting, lazy loading, and edge caching. Sub-second load times that convert visitors into customers.",
    category: 'speed',
    colorScheme: "text-indigo-600 bg-indigo-100"
  }
];

// Testimonials data
export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'sarah-johnson',
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    role: "CEO",
    content: "TrueForm transformed our online presence completely. The website they built generated 50% more leads in the first month alone.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b14ac5ad?w=64&h=64&fit=crop&crop=face"
  },
  {
    id: 'michael-chen',
    name: "Michael Chen",
    company: "GreenCo Solutions", 
    role: "Marketing Director",
    content: "The attention to detail and professional approach exceeded our expectations. Our conversion rate doubled after launch.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
  },
  {
    id: 'emily-rodriguez',
    name: "Emily Rodriguez",
    company: "BuildIt Construction",
    role: "Owner",
    content: "Finally, a website that actually represents our quality of work. The design is stunning and perfectly captures our brand.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
  }
];

// Stats data
export const STATS_DATA: Stat[] = [
  { 
    id: 'websites-delivered',
    number: "200+", 
    label: "Websites Delivered", 
    icon: Globe 
  },
  { 
    id: 'client-satisfaction',
    number: "98%", 
    label: "Client Satisfaction", 
    icon: Award 
  },
  { 
    id: 'conversion-increase',
    number: "40%", 
    label: "Avg. Conversion Increase", 
    icon: Zap 
  },
  { 
    id: 'expert-support',
    number: "24/7", 
    label: "Expert Support", 
    icon: Users 
  }
];

// Pricing data
export const PRICING_DATA: PricingTier[] = [
  {
    id: 'architecture-demo',
    name: 'See The Foundation',
    price: '$0',
    description: 'Experience enterprise-grade architecture',
    features: [
      'Live demo of our tech stack',
      'Code architecture walkthrough',
      'Performance benchmarks',
      'Security audit overview'
    ],
    buttonText: 'Explore The Code',
    buttonHref: '/request',
    badge: 'Technical Deep Dive'
  },
  {
    id: 'production-ready',
    name: 'Production Platform',
    price: '$999',
    monthlyPrice: 'Worth $50k+ in dev time',
    description: 'Enterprise foundation, startup speed',
    features: [
      '74 pre-built components included',
      'PostgreSQL + RLS security setup',
      '136 E2E tests for reliability',
      'TypeScript strict mode enabled',
      'Scalable multi-tenant architecture',
      'Production deployment ready'
    ],
    buttonText: 'Build My Platform',
    buttonHref: '/request',
    isPopular: true,
    badge: 'Best Value'
  },
  {
    id: 'custom-platform',
    name: 'Custom Architecture',
    price: "Let's Build",
    description: 'When you need something truly unique',
    features: [
      'Custom component libraries',
      'Advanced integrations & APIs',
      'Multi-platform deployments',
      'Ongoing technical partnership'
    ],
    buttonText: 'Discuss Project',
    buttonHref: '/contact'
  }
];

// Hero content
export const HERO_CONTENT = {
  badge: {
    text: 'Enterprise Architecture. Startup Speed. Fixed Price.',
    icon: Shield
  },
  title: {
    main: 'We Build Real Software Companies',
    highlight: 'Not Just Websites'
  },
  description: 'While others sell templates, we deliver production-ready platforms with 150+ custom components, enterprise security, and scalable architecture. The same foundation that powers million-dollar SaaS products, for just $999.',
  buttons: {
    primary: {
      text: 'See The Difference',
      href: '/request',
      icon: Zap
    },
    secondary: {
      text: 'View Architecture',
      href: '#features'
    }
  },
  trustIndicators: [
    { icon: Shield, text: '202 SQL Tables Ready' },
    { icon: Zap, text: '136 E2E Tests Passing' },
    { icon: Award, text: 'TypeScript + RLS Security' }
  ]
};

// Advanced features content
export const ADVANCED_FEATURES_CONTENT = {
  badge: {
    text: 'Beyond Templates & Junior Developers',
    icon: Shield
  },
  title: 'The Technical Foundation That Others Can\'t Deliver',
  description: 'Most "custom" developers give you basic features on WordPress. Template builders limit you to their constraints. TrueForm delivers enterprise-grade architecture that scales from startup to IPO.',
  features: [
    {
      title: '202-Line Database Schema:',
      description: 'Production-ready PostgreSQL with proper relationships, RLS security, and performance optimization'
    },
    {
      title: '74 Custom Components:',
      description: 'No external dependencies that break or charge fees. Complete UI library built for extensibility'
    },
    {
      title: 'TypeScript Strict Mode:',
      description: 'Type safety across 150+ files prevents runtime errors and enables confident refactoring'
    },
    {
      title: '136 E2E Tests Passing:',
      description: 'Full Playwright test suite ensures every feature works across browsers and devices'
    },
    {
      title: 'Enterprise Authentication:',
      description: 'Supabase Auth with JWT tokens, role-based access, and security middleware'
    },
    {
      title: 'Production Infrastructure:',
      description: 'Code review automation, security scanning, and deployment pipelines from day one'
    }
  ],
  comparison: {
    competitors: [
      {
        name: 'Template Builders',
        issues: [
          'Locked into their ecosystem',
          'Monthly fees forever',
          'No real customization',
          'Performance bottlenecks'
        ]
      },
      {
        name: 'Basic Custom Dev',
        issues: [
          'WordPress vulnerabilities',
          'No testing infrastructure',
          'Junior-level architecture',
          'Technical debt from day one'
        ]
      }
    ],
    advantage: 'Production-ready codebase with enterprise patterns, comprehensive testing, and scalable architecture that grows with your business.'
  }
};

// CTA section content
export const CTA_CONTENT = {
  title: 'Stop Buying Websites. Start Building Platforms.',
  description: 'While your competitors use templates, you\'ll have enterprise-grade software. The same technical foundation that powers billion-dollar companies, delivered in days for $999.',
  button: {
    text: 'Build My Platform',
    href: '/request',
    icon: Shield
  }
}; 