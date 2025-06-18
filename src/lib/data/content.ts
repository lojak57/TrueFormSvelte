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
    id: 'boutique',
    icon: Palette,
    title: "Boutique Quality",
    description: "Hand-crafted by real designers who care about your brand. No cookie-cutter templates or offshore outsourcing.",
    category: 'quality',
    colorScheme: "text-blue-600 bg-blue-100"
  },
  {
    id: 'price',
    icon: Award,
    title: "Fixed-Price Clarity",
    description: "$999 all-in or 12 × $89 with Klarna. No hidden fees, no surprise invoices, no hourly billing nightmares.",
    category: 'value',
    colorScheme: "text-purple-600 bg-purple-100"
  },
  {
    id: 'support',
    icon: Users,
    title: "Human Support",
    description: "Real people answer in 24 hours. Not a chatbot, not a ticket system - actual humans who know your site.",
    category: 'service',
    colorScheme: "text-green-600 bg-green-100"
  },
  {
    id: 'speed',
    icon: Zap,
    title: "7-Day Delivery",
    description: "From idea to live website in one week. While others quote 6-12 weeks, we're already launching your site.",
    category: 'speed',
    colorScheme: "text-yellow-600 bg-yellow-100"
  },
  {
    id: 'hosting',
    icon: Shield,
    title: "Year 1 Included",
    description: "First year of hosting, SSL, backups, and support included. That's $600+ of value built into your $999.",
    category: 'value',
    colorScheme: "text-pink-600 bg-pink-100"
  },
  {
    id: 'growth',
    icon: Globe,
    title: "Built to Grow",
    description: "Start with $999, scale to millions. Add e-commerce, booking systems, or custom features whenever you're ready.",
    category: 'scalability',
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
    id: 'free-demo',
    name: 'Free Demo',
    price: '$0',
    description: 'See what we can build for you',
    features: [
      'Custom homepage mockup',
      '30-min strategy call',
      'No commitment required',
      'Get inspired by possibilities'
    ],
    buttonText: 'Get Free Demo',
    buttonHref: '/request',
    badge: 'Risk Free'
  },
  {
    id: 'professional',
    name: 'Professional Site',
    price: '$999',
    monthlyPrice: 'Or $89/mo for 12 months',
    description: 'Everything you need to succeed online',
    features: [
      'Custom design (no templates!)',
      'Mobile-optimized & lightning fast',
      'First year hosting included ($180 value)',
      '24/7 human support for 1 year',
      'DIY would take 40-50+ hours',
      'Ready in 7 days, not months'
    ],
    buttonText: 'Start Your Journey',
    buttonHref: '/request',
    isPopular: true,
    badge: 'Most Popular'
  },
  {
    id: 'enterprise',
    name: 'Custom Enterprise',
    price: "$10k+",
    description: 'Complex sites & applications',
    features: [
      'E-commerce platforms',
      'Booking & scheduling systems',
      'Multi-location businesses',
      'Custom integrations',
      'Dedicated project manager'
    ],
    buttonText: 'Let\'s Talk',
    buttonHref: '/contact'
  }
];

// Hero content
export const HERO_CONTENT = {
  badge: {
    text: 'Custom Sites. Fixed Price. Real Humans.',
    icon: Award
  },
  title: {
    main: 'Your Business\' Digital Soul,',
    highlight: 'In Its True Form'
  },
  description: 'Custom-built sites for less than a year of Wix. First year of hosting & white-glove support included. Ready in 7 days, not months.',
  buttons: {
    primary: {
      text: 'Start Your Journey',
      href: '/request',
      icon: Zap
    },
    secondary: {
      text: 'See How It Works',
      href: '#features'
    }
  },
  trustIndicators: [
    { icon: Shield, text: 'First Year Hosting Free' },
    { icon: Zap, text: '7-Day Delivery' },
    { icon: Award, text: '24hr Human Support' }
  ]
};

// Advanced features content
export const ADVANCED_FEATURES_CONTENT = {
  badge: {
    text: 'What Makes TrueForm Different',
    icon: Award
  },
  title: 'Built Right From Day One',
  description: 'We don\'t cut corners on the foundation. Every site is built with modern architecture, tested thoroughly, and designed to grow with your business.',
  features: [
    {
      title: 'Performance That Matters:',
      description: 'Fast-loading sites that keep visitors engaged and convert better.'
    },
    {
      title: 'Rock-Solid Security:',
      description: 'Enterprise-grade security standards protect your business and customers.'
    },
    {
      title: 'Mobile-First Design:',
      description: 'Looks perfect on every device because most of your traffic is mobile.'
    },
    {
      title: 'Built to Scale:',
      description: 'Start simple, grow complex. Add features when you need them, not before.'
    },
    {
      title: 'Quality Code Foundation:',
      description: 'Clean, maintainable code that won\'t break when you need changes.'
    },
    {
      title: 'Future-Proof Technology:',
      description: 'Modern tech stack that stays current and performs reliably.'
    }
  ],
  comparison: {
    competitors: [
      {
        name: 'DIY Builders',
        issues: [
          '50+ hours of your time',
          'Cookie-cutter templates',
          'Slow loading speeds',
          'Monthly fees forever'
        ]
      },
      {
        name: 'Traditional Developers',
        issues: [
          '$10-15k minimum cost',
          '6-12 week timelines',
          'Hourly billing surprises',
          'Hosting costs extra'
        ]
      }
    ],
    advantage: 'Professional quality, honest pricing, and everything included. The smart choice for serious businesses.'
  }
};

// CTA section content
export const CTA_CONTENT = {
  title: 'Ready to Skip 50 Hours of DIY Frustration?',
  description: 'Join hundreds of businesses who got professional sites without the headaches. First year hosting included, human support on tap, and live in just 7 days.',
  button: {
    text: 'Start Your $999 Journey →',
    href: '/request',
    icon: Zap
  }
}; 