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
    id: 'marketing',
    icon: Globe,
    title: "Marketing Websites",
    description: "Convert visitors into customers with stunning marketing sites. Landing pages, corporate sites, and brand showcases that drive results.",
    category: 'marketing',
    colorScheme: "text-blue-600 bg-blue-100"
  },
  {
    id: 'ecommerce',
    icon: Award,
    title: "E-commerce Stores",
    description: "Like our flagship vcsews.com - full webshops with custom design tools, product management, and user-friendly admin panels.",
    category: 'ecommerce',
    colorScheme: "text-purple-600 bg-purple-100"
  },
  {
    id: 'booking',
    icon: Users,
    title: "Booking & Scheduling",
    description: "Service-based businesses love our booking systems. Appointments, reservations, calendar integration, and automated confirmations.",
    category: 'services',
    colorScheme: "text-green-600 bg-green-100"
  },
  {
    id: 'saas',
    icon: Zap,
    title: "SaaS Platforms",
    description: "Multi-tenant applications with user dashboards, subscription management, and custom feature sets for your unique business model.",
    category: 'software',
    colorScheme: "text-yellow-600 bg-yellow-100"
  },
  {
    id: 'portfolio',
    icon: Palette,
    title: "Portfolio & Creative",
    description: "Artists, photographers, designers - showcase your work with galleries, client proofing, booking systems, and stunning visual layouts.",
    category: 'creative',
    colorScheme: "text-pink-600 bg-pink-100"
  },
  {
    id: 'membership',
    icon: Shield,
    title: "Membership Communities",
    description: "Private communities with member portals, content libraries, forums, and subscription-based access control systems.",
    category: 'community',
    colorScheme: "text-indigo-600 bg-indigo-100"
  },
  {
    id: 'realestate',
    icon: Globe,
    title: "Real Estate Platforms",
    description: "Property listings, agent profiles, search filters, virtual tours, and lead capture systems that convert browsers into buyers.",
    category: 'realestate',
    colorScheme: "text-teal-600 bg-teal-100"
  },
  {
    id: 'education',
    icon: Users,
    title: "Educational Platforms",
    description: "Online courses, learning management systems, student portals, progress tracking, and certification management.",
    category: 'education',
    colorScheme: "text-orange-600 bg-orange-100"
  },
  {
    id: 'restaurant',
    icon: Award,
    title: "Restaurant & Food",
    description: "Online ordering, menu management, reservation systems, delivery integration, and customer loyalty programs.",
    category: 'food',
    colorScheme: "text-red-600 bg-red-100"
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
    id: 'free-demo',
    name: 'Free Demo',
    price: '$0',
    description: 'See what we can do for you',
    features: [
      'Custom mockup of your site',
      'No commitment required',
      'See your vision come to life',
      'Professional consultation'
    ],
    buttonText: 'Get Free Demo',
    buttonHref: '/request',
    badge: 'Risk Free'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$999',
    monthlyPrice: 'Or $83/month for 12 months',
    description: 'Complete professional website',
    features: [
      'Fully custom design & development',
      'Mobile responsive & SEO optimized',
      'Content management system',
      '30 days free support',
      'BNPL option available'
    ],
    buttonText: 'Start Your Project',
    buttonHref: '/request',
    isPopular: true,
    badge: 'Most Popular'
  },
  {
    id: 'enterprise',
    name: 'Custom Enterprise',
    price: "Let's Talk",
    description: 'Tailored solutions for complex needs',
    features: [
      'E-commerce platforms',
      'Custom web applications',
      'Multi-site management',
      'Ongoing development partnership'
    ],
    buttonText: 'Contact Us',
    buttonHref: '/contact'
  }
];

// Hero content
export const HERO_CONTENT = {
  badge: {
    text: 'Excellence Refined - Premium Website Development',
    icon: Award
  },
  title: {
    main: 'Transform Your Business with',
    highlight: 'Professional Websites'
  },
  description: 'Get a stunning, conversion-optimized website that perfectly represents your brand. From concept to completion in just days, not months.',
  buttons: {
    primary: {
      text: 'Start Your Project',
      href: '/request',
      icon: Zap
    },
    secondary: {
      text: 'See How It Works',
      href: '#features'
    }
  },
  trustIndicators: [
    { icon: Shield, text: 'Enterprise Security' },
    { icon: Zap, text: 'Days, Not Months' },
    { icon: Award, text: '5-Star Reviews' }
  ]
};

// Advanced features content
export const ADVANCED_FEATURES_CONTENT = {
  badge: {
    text: 'Beyond Basic Builders & Expensive Custom Development',
    icon: Award
  },
  title: 'Enterprise Features at a Fraction of the Cost',
  description: 'Why settle for Squarespace limitations or pay $5k+ for basic custom development? TrueForm delivers advanced features that even expensive developers don\'t typically include - all for just $999.',
  features: [
    {
      title: 'Advanced User Dashboards:',
      description: 'Custom admin panels with role-based permissions and real-time analytics'
    },
    {
      title: 'Dynamic Content Systems:',
      description: 'User-generated content, automated workflows, and smart data management'
    },
    {
      title: 'Multi-Tenant Architecture:',
      description: 'SaaS-ready platforms with user isolation and scalable infrastructure'
    },
    {
      title: 'Advanced Integrations:',
      description: 'Payment processors, CRMs, email marketing, and custom API connections'
    },
    {
      title: 'Real-Time Features:',
      description: 'Live chat, notifications, collaborative tools, and instant updates'
    },
    {
      title: 'Custom Business Logic:',
      description: 'Automated processes, smart recommendations, and industry-specific workflows'
    }
  ],
  comparison: {
    competitors: [
      {
        name: 'Squarespace/Wix',
        issues: [
          'Template limitations',
          'No custom functionality',
          'Basic integrations only',
          'Monthly fees forever'
        ]
      },
      {
        name: '$5k+ Custom Dev',
        issues: [
          'Basic features only',
          'No ongoing support',
          'Long development time',
          'Extra costs for everything'
        ]
      }
    ],
    advantage: 'Enterprise-grade features, rapid delivery, ongoing support, and advanced capabilities that most $10k+ projects don\'t even include.'
  }
};

// CTA section content
export const CTA_CONTENT = {
  title: 'Ready to Transform Your Business?',
  description: 'Join hundreds of businesses that have grown with TrueForm websites. Get started today and see results in days, not months.',
  button: {
    text: 'Start Your Project Today',
    href: '/request',
    icon: Zap
  }
}; 