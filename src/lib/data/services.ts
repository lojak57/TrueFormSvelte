import { 
  Zap, 
  ShoppingCart, 
  Calendar, 
  Code, 
  Palette, 
  Users, 
  Home, 
  GraduationCap,
  Smartphone,
  Globe,
  Search,
  Shield,
  Clock,
  Award,
  Target,
  TrendingUp,
  CreditCard,
  Mail,
  Database,
  Settings
} from "lucide-svelte";
import type { ServiceData } from "$lib/types/service.types";

export const servicesData: Record<string, ServiceData> = {
  marketing: {
    slug: "marketing",
    title: "Marketing Websites",
    subtitle: "That Actually Convert",
    description: "Professional marketing websites designed to turn visitors into customers. Every element is crafted to guide users toward taking action—whether that's making a purchase, booking a call, or signing up for your service.",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Most Popular Choice",
    features: [
      {
        icon: Target,
        title: "Conversion-Focused Design",
        description: "Every element is strategically placed to guide visitors toward taking action, increasing your conversion rates."
      },
      {
        icon: Smartphone,
        title: "Mobile-First Approach",
        description: "Designed for mobile devices first, ensuring perfect performance where most of your traffic comes from."
      },
      {
        icon: Search,
        title: "SEO-Optimized Structure",
        description: "Built with search engines in mind, helping you rank higher and attract more organic traffic."
      },
      {
        icon: TrendingUp,
        title: "Analytics Integration",
        description: "Track every visitor, conversion, and interaction to understand what's working and optimize accordingly."
      },
      {
        icon: Zap,
        title: "Lightning Fast Performance",
        description: "Optimized for speed with lazy loading, compressed images, and clean code for instant page loads."
      },
      {
        icon: Mail,
        title: "Lead Capture System",
        description: "Built-in contact forms, newsletter signups, and lead magnets to grow your customer list."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Modern marketing website hero section",
        title: "Hero Sections That Convert",
        description: "Clear messaging, compelling CTAs, and stunning visuals that capture attention instantly."
      },
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Services showcase section",
        title: "Service Showcases",
        description: "Present your offerings with clarity and visual appeal that builds trust."
      },
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Customer testimonials section",
        title: "Social Proof That Works",
        description: "Testimonials, reviews, and case studies that build credibility and trust."
      }
    ],
    testimonial: {
      quote: "Our new website increased our leads by 340% in the first month. The design is beautiful and the performance is incredible.",
      author: "Sarah Martinez",
      company: "Growth Marketing Agency",
      role: "Founder & CEO"
    },
    ctaTitle: "Ready to Transform Your Marketing?",
    ctaDescription: "Join hundreds of businesses that have increased their conversions with a TrueForm marketing website. Professional design, proven conversion tactics, and ongoing support.",
    metaTitle: "Marketing Websites That Convert | TrueForm",
    metaDescription: "Professional marketing websites designed to convert visitors into customers. Mobile-first, SEO-optimized, and built for results. Starting at $999."
  },

  ecommerce: {
    slug: "ecommerce",
    title: "E-commerce Stores",
    subtitle: "Built for Sales",
    description: "Complete online stores with inventory management, secure payments, and shipping integration. From product catalogs to checkout optimization, every feature is designed to maximize your sales.",
    heroImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Full Featured",
    features: [
      {
        icon: ShoppingCart,
        title: "Complete Shopping Experience",
        description: "Product catalogs, shopping cart, checkout, and order management—everything you need to sell online."
      },
      {
        icon: CreditCard,
        title: "Secure Payment Processing",
        description: "Integrated with Stripe for secure credit card processing, Apple Pay, Google Pay, and more."
      },
      {
        icon: Database,
        title: "Inventory Management",
        description: "Track stock levels, manage variants, set up automated reorder alerts, and handle bulk updates."
      },
      {
        icon: TrendingUp,
        title: "Sales Analytics",
        description: "Detailed reporting on sales, popular products, customer behavior, and revenue trends."
      },
      {
        icon: Mail,
        title: "Customer Communication",
        description: "Automated order confirmations, shipping notifications, and customer service integration."
      },
      {
        icon: Shield,
        title: "Security & Compliance",
        description: "SSL certificates, PCI compliance, and secure customer data handling built-in."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "E-commerce product showcase",
        title: "Beautiful Product Displays",
        description: "High-quality product galleries with zoom, multiple views, and detailed descriptions."
      },
      {
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Shopping cart and checkout",
        title: "Streamlined Checkout",
        description: "Optimized checkout process that reduces cart abandonment and increases sales."
      },
      {
        src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Admin dashboard",
        title: "Powerful Admin Dashboard",
        description: "Manage products, orders, customers, and analytics from one beautiful interface."
      }
    ],
    testimonial: {
      quote: "Sales increased 280% after launching our new TrueForm store. The checkout process is so smooth, and managing inventory is a breeze.",
      author: "Michael Chen",
      company: "Artisan Leather Co.",
      role: "Owner"
    },
    ctaTitle: "Ready to Launch Your Online Store?",
    ctaDescription: "Start selling online with a professional e-commerce store that's built for conversions. Complete with payment processing, inventory management, and mobile optimization.",
    metaTitle: "Professional E-commerce Stores | TrueForm",
    metaDescription: "Complete online stores with secure payments, inventory management, and conversion optimization. Mobile-first design that drives sales. Starting at $999."
  },

  booking: {
    slug: "booking",
    title: "Booking Systems",
    subtitle: "Automate Your Appointments",
    description: "Professional booking and scheduling systems that work 24/7. Let customers book appointments, services, or consultations directly from your website while you focus on your business.",
    heroImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Service Based",
    features: [
      {
        icon: Calendar,
        title: "Smart Scheduling",
        description: "Automated appointment booking with real-time availability, time zones, and buffer time management."
      },
      {
        icon: Mail,
        title: "Automated Notifications",
        description: "Confirmation emails, reminders, and follow-ups sent automatically to reduce no-shows."
      },
      {
        icon: CreditCard,
        title: "Payment Integration",
        description: "Collect deposits, full payments, or setup recurring billing for ongoing services."
      },
      {
        icon: Users,
        title: "Customer Management",
        description: "Track client history, preferences, notes, and booking patterns in one place."
      },
      {
        icon: Settings,
        title: "Flexible Configuration",
        description: "Set service durations, pricing, availability, staff schedules, and booking rules."
      },
      {
        icon: Smartphone,
        title: "Mobile Booking",
        description: "Customers can book from any device with a mobile-optimized booking experience."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Booking calendar interface",
        title: "Intuitive Booking Calendar",
        description: "Clean, easy-to-use calendar interface that customers love to use."
      },
      {
        src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Service selection screen",
        title: "Service Selection",
        description: "Let customers choose services, duration, and pricing before booking."
      },
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Admin booking management",
        title: "Admin Management",
        description: "Manage bookings, view schedules, and handle customer communications effortlessly."
      }
    ],
    testimonial: {
      quote: "The booking system has been a game-changer. We've reduced phone calls by 80% and bookings increased 150% since launching.",
      author: "Lisa Thompson",
      company: "Serenity Spa & Wellness",
      role: "Business Owner"
    },
    ctaTitle: "Automate Your Booking Process",
    ctaDescription: "Stop playing phone tag and let customers book online 24/7. Professional booking systems that integrate seamlessly with your workflow.",
    metaTitle: "Booking & Scheduling Systems | TrueForm",
    metaDescription: "Professional booking systems for appointments and services. Automated scheduling, payments, and customer management. Perfect for service businesses."
  },

  saas: {
    slug: "saas",
    title: "SaaS Platforms",
    subtitle: "Scale Your Software",
    description: "Multi-tenant SaaS applications with user management, billing, and advanced features. From MVP to enterprise-grade platforms that can handle thousands of users.",
    heroImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Enterprise Ready",
    features: [
      {
        icon: Users,
        title: "Multi-Tenant Architecture",
        description: "Secure, scalable platform that serves multiple customers with complete data isolation."
      },
      {
        icon: CreditCard,
        title: "Subscription Billing",
        description: "Automated recurring billing, plan management, upgrades, downgrades, and payment processing."
      },
      {
        icon: Shield,
        title: "Enterprise Security",
        description: "Role-based access control, SSO integration, audit logging, and compliance features."
      },
      {
        icon: TrendingUp,
        title: "Analytics & Reporting",
        description: "Comprehensive dashboards, usage analytics, and custom reporting for data-driven decisions."
      },
      {
        icon: Code,
        title: "API & Integrations",
        description: "RESTful APIs, webhooks, and third-party integrations for seamless workflow automation."
      },
      {
        icon: Database,
        title: "Scalable Infrastructure",
        description: "Built to handle growth from hundreds to millions of users with automatic scaling."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "SaaS dashboard interface",
        title: "Beautiful Dashboard",
        description: "Intuitive admin dashboards with real-time data and actionable insights."
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "User management system",
        title: "User Management",
        description: "Complete user lifecycle management with roles, permissions, and billing integration."
      },
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Analytics dashboard",
        title: "Advanced Analytics",
        description: "Detailed analytics and reporting to track usage, performance, and business metrics."
      }
    ],
    testimonial: {
      quote: "TrueForm built our SaaS platform from the ground up. We now serve 10,000+ users across 40 countries with zero downtime.",
      author: "David Park",
      company: "CloudFlow Solutions",
      role: "CTO & Co-founder"
    },
    ctaTitle: "Build Your SaaS Platform",
    ctaDescription: "Transform your idea into a scalable SaaS business. From MVP to enterprise-grade platforms with all the features you need to succeed.",
    metaTitle: "SaaS Platform Development | TrueForm",
    metaDescription: "Multi-tenant SaaS platforms with subscription billing, user management, and enterprise features. Scalable architecture for growing businesses."
  },

  portfolio: {
    slug: "portfolio",
    title: "Portfolio Sites",
    subtitle: "Showcase Your Work",
    description: "Stunning portfolio websites that showcase your work in the best light. Perfect for creatives, agencies, consultants, and professionals who need to impress potential clients.",
    heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Creative Focus",
    features: [
      {
        icon: Palette,
        title: "Visual Excellence",
        description: "Beautiful layouts that let your work shine with high-quality image galleries and smooth animations."
      },
      {
        icon: Globe,
        title: "Project Showcases",
        description: "Detailed project pages with case studies, process documentation, and results."
      },
      {
        icon: Mail,
        title: "Client Inquiry System",
        description: "Professional contact forms and project inquiry systems to capture potential clients."
      },
      {
        icon: Search,
        title: "SEO for Visibility",
        description: "Optimized for search engines to help potential clients find your work online."
      },
      {
        icon: Smartphone,
        title: "Mobile Portfolio",
        description: "Perfect presentation on all devices, especially important for on-the-go client meetings."
      },
      {
        icon: TrendingUp,
        title: "Performance Tracking",
        description: "Analytics to track which projects get the most attention and drive inquiries."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Creative portfolio homepage",
        title: "Striking Homepage Design",
        description: "Make a powerful first impression with bold, creative homepage designs."
      },
      {
        src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Project gallery layout",
        title: "Project Galleries",
        description: "Beautiful grid and masonry layouts that showcase your work professionally."
      },
      {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Project detail page",
        title: "Detailed Case Studies",
        description: "Tell the story behind each project with rich media and compelling narratives."
      }
    ],
    testimonial: {
      quote: "My portfolio site has generated over $100k in new business this year. The design perfectly represents my brand and converts visitors into clients.",
      author: "Emma Rodriguez",
      company: "Rodriguez Design Studio",
      role: "Creative Director"
    },
    ctaTitle: "Showcase Your Best Work",
    ctaDescription: "Create a portfolio that wins clients and showcases your expertise. Professional design that reflects your creative abilities and drives business results.",
    metaTitle: "Portfolio Websites | TrueForm",
    metaDescription: "Stunning portfolio websites for creatives and professionals. Showcase your work with beautiful galleries, case studies, and client inquiry systems."
  },

  membership: {
    slug: "membership",
    title: "Membership Sites",
    subtitle: "Build Your Community",
    description: "Private membership platforms with gated content, user management, and community features. Perfect for online courses, exclusive communities, and subscription-based content.",
    heroImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Community Driven",
    features: [
      {
        icon: Users,
        title: "Member Management",
        description: "Complete user registration, profiles, membership levels, and access control systems."
      },
      {
        icon: Shield,
        title: "Content Protection",
        description: "Secure, gated content that's only accessible to paying members with advanced access controls."
      },
      {
        icon: CreditCard,
        title: "Subscription Billing",
        description: "Automated recurring payments, trial periods, and membership tier management."
      },
      {
        icon: Mail,
        title: "Community Features",
        description: "Discussion forums, member directories, private messaging, and engagement tools."
      },
      {
        icon: TrendingUp,
        title: "Engagement Analytics",
        description: "Track member activity, content consumption, and engagement to improve retention."
      },
      {
        icon: Database,
        title: "Content Management",
        description: "Easy-to-use system for uploading courses, videos, documents, and organizing content."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Membership dashboard",
        title: "Member Dashboard",
        description: "Personalized dashboards showing progress, achievements, and available content."
      },
      {
        src: "https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Course content interface",
        title: "Course Content",
        description: "Structured learning paths with videos, documents, and progress tracking."
      },
      {
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Community forum",
        title: "Community Forums",
        description: "Engage members with discussion forums, Q&A sections, and peer interaction."
      }
    ],
    testimonial: {
      quote: "Our membership site has grown to 2,500+ active members generating $50k monthly recurring revenue. The platform handles everything seamlessly.",
      author: "James Wilson",
      company: "Digital Marketing Mastery",
      role: "Founder"
    },
    ctaTitle: "Launch Your Membership Community",
    ctaDescription: "Build recurring revenue with a professional membership platform. Engage your audience, deliver value, and create a thriving community around your expertise.",
    metaTitle: "Membership Site Development | TrueForm",
    metaDescription: "Professional membership platforms with gated content, community features, and subscription billing. Perfect for online courses and exclusive communities."
  },

  realestate: {
    slug: "realestate",
    title: "Real Estate Platforms",
    subtitle: "Property Excellence",
    description: "Comprehensive real estate websites with property listings, search filters, virtual tours, and lead generation. Perfect for agents, brokers, and property management companies.",
    heroImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Property Focused",
    features: [
      {
        icon: Home,
        title: "Property Listings",
        description: "Beautiful property galleries with virtual tours, floor plans, and detailed specifications."
      },
      {
        icon: Search,
        title: "Advanced Search",
        description: "Powerful search and filter system by price, location, size, amenities, and more."
      },
      {
        icon: Database,
        title: "MLS Integration",
        description: "Seamless integration with MLS systems for automatic property updates and synchronization."
      },
      {
        icon: Mail,
        title: "Lead Generation",
        description: "Capture and manage leads with property inquiries, showing requests, and market updates."
      },
      {
        icon: TrendingUp,
        title: "Market Analytics",
        description: "Market reports, price trends, and neighborhood statistics to assist buyers and sellers."
      },
      {
        icon: Smartphone,
        title: "Mobile Optimized",
        description: "Perfect mobile experience for clients browsing properties on-the-go."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Property listing page",
        title: "Stunning Property Pages",
        description: "Showcase properties with high-quality photos, virtual tours, and detailed information."
      },
      {
        src: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Property search interface",
        title: "Advanced Search",
        description: "Intuitive search and filtering system that helps clients find their perfect property."
      },
      {
        src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Agent profile pages",
        title: "Agent Profiles",
        description: "Professional agent pages with listings, testimonials, and contact information."
      }
    ],
    testimonial: {
      quote: "Our new real estate platform has increased our lead generation by 400%. The property search is incredibly intuitive and clients love the virtual tours.",
      author: "Robert Taylor",
      company: "Premier Properties Group",
      role: "Managing Broker"
    },
    ctaTitle: "Elevate Your Real Estate Business",
    ctaDescription: "Showcase properties professionally and generate more leads with a custom real estate platform. MLS integration, virtual tours, and powerful search features included.",
    metaTitle: "Real Estate Website Development | TrueForm",
    metaDescription: "Professional real estate websites with property listings, MLS integration, and lead generation. Perfect for agents, brokers, and property management companies."
  },

  education: {
    slug: "education",
    title: "Educational Platforms",
    subtitle: "Empower Learning",
    description: "Complete learning management systems with course delivery, student tracking, and assessment tools. Perfect for schools, training companies, and online educators.",
    heroImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80",
    badge: "Learning Focused",
    features: [
      {
        icon: GraduationCap,
        title: "Course Management",
        description: "Create structured courses with lessons, modules, assignments, and progress tracking."
      },
      {
        icon: Users,
        title: "Student Portals",
        description: "Personalized student dashboards with course progress, grades, and upcoming assignments."
      },
      {
        icon: Award,
        title: "Assessment Tools",
        description: "Quizzes, exams, assignments with automated grading and detailed feedback systems."
      },
      {
        icon: TrendingUp,
        title: "Progress Analytics",
        description: "Track student performance, course completion rates, and learning outcomes."
      },
      {
        icon: Mail,
        title: "Communication Hub",
        description: "Messaging systems, announcements, and collaboration tools for student-teacher interaction."
      },
      {
        icon: CreditCard,
        title: "Payment Integration",
        description: "Handle course payments, installments, and scholarship management seamlessly."
      }
    ],
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Learning dashboard",
        title: "Student Dashboard",
        description: "Intuitive dashboards that help students track their learning progress and achievements."
      },
      {
        src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Course content interface",
        title: "Course Content",
        description: "Rich course content with videos, documents, interactive elements, and assessments."
      },
      {
        src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
        alt: "Assessment system",
        title: "Assessment Tools",
        description: "Comprehensive testing and grading systems with automated feedback and analytics."
      }
    ],
    testimonial: {
      quote: "Our online learning platform has enabled us to reach 5,000+ students globally. The system handles everything from enrollment to certification seamlessly.",
      author: "Dr. Amanda Foster",
      company: "Digital Skills Institute",
      role: "Academic Director"
    },
    ctaTitle: "Transform Education Delivery",
    ctaDescription: "Create engaging learning experiences with a professional educational platform. Course management, student tracking, and assessment tools all included.",
    metaTitle: "Educational Platform Development | TrueForm",
    metaDescription: "Learning management systems with course delivery, student tracking, and assessment tools. Perfect for schools, training companies, and online educators."
  }
};

export function getServiceBySlug(slug: string): ServiceData | null {
  return servicesData[slug] || null;
}