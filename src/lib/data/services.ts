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
    marketingContent: {
      title: "Professional Marketing Websites That Drive Results",
      description: "Every element is strategically designed to convert visitors into customers. No generic templates—just custom solutions that reflect your brand and drive business growth.",
      highlights: [
        "Custom design tailored to your brand and industry",
        "Conversion-optimized layout and user experience",
        "Mobile-first responsive design for all devices",
        "SEO-optimized structure for better search rankings",
        "Fast loading speeds (under 3 seconds)",
        "Professional copywriting and content strategy",
        "Contact forms and lead capture systems",
        "Analytics and tracking setup included"
      ],
      benefits: [
        "Increase online credibility and trust",
        "Generate more qualified leads 24/7",
        "Reduce bounce rates with engaging design",
        "Improve search engine visibility",
        "Streamline customer acquisition process",
        "Professional brand presence that stands out",
        "Better return on marketing investment",
        "Easy content updates with admin dashboard"
      ]
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
    marketingContent: {
      title: "Complete E-commerce Solutions That Sell",
      description: "From product showcase to checkout optimization, we build online stores that convert browsers into buyers. Professional e-commerce platforms with all the features you need to succeed online.",
      highlights: [
        "Complete product catalog with search and filtering",
        "Secure payment processing with Stripe integration",
        "Inventory management with low-stock alerts",
        "Mobile-optimized shopping experience",
        "Order management and customer notifications",
        "SEO-optimized product pages",
        "Analytics and sales reporting dashboard",
        "Customer account creation and order history"
      ],
      benefits: [
        "Expand your market reach beyond local customers",
        "Automate sales processes and reduce manual work",
        "Professional credibility builds customer trust",
        "24/7 sales capability increases revenue potential",
        "Detailed analytics help optimize performance",
        "Scalable platform grows with your business",
        "Reduced overhead compared to physical retail",
        "Easy product and inventory management"
      ]
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
    marketingContent: {
      title: "Professional Booking Systems That Work 24/7",
      description: "Automate appointment scheduling and reduce administrative overhead with intelligent booking systems. Customers can book appointments anytime while you focus on delivering great service.",
      highlights: [
        "Real-time availability and automated scheduling",
        "Service selection with duration and pricing",
        "Automated confirmation and reminder emails",
        "Payment processing and deposit collection",
        "Customer history and preference tracking",
        "Mobile-optimized booking experience",
        "Calendar integration with staff schedules",
        "Booking analytics and no-show tracking"
      ],
      benefits: [
        "Reduce phone calls and administrative time",
        "Accept bookings 24/7 without staff involvement",
        "Minimize no-shows with automated reminders",
        "Improve customer experience with easy booking",
        "Better staff scheduling and resource management",
        "Increase revenue with deposit collection",
        "Professional image builds customer trust",
        "Detailed booking analytics improve operations"
      ]
    },
    ctaTitle: "Automate Your Booking Process",
    ctaDescription: "Stop playing phone tag and let customers book online 24/7. Professional booking systems that integrate seamlessly with your workflow.",
    metaTitle: "Booking & Scheduling Systems | TrueForm",
    metaDescription: "Professional booking systems for appointments and services. Automated scheduling, payments, and customer management. Perfect for service businesses."
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
    marketingContent: {
      title: "Membership Platforms That Build Communities",
      description: "Create recurring revenue streams with professional membership sites that engage your audience and deliver exclusive value. Complete platforms for courses, communities, and premium content.",
      highlights: [
        "Secure member registration and access control",
        "Subscription billing with multiple membership tiers",
        "Protected content delivery and course management",
        "Community forums and member interaction tools",
        "Progress tracking and achievement systems",
        "Member directory and networking features",
        "Email automation and member communications",
        "Analytics and engagement reporting"
      ],
      benefits: [
        "Generate predictable monthly recurring revenue",
        "Build loyal community around your expertise",
        "Scale knowledge delivery beyond 1-on-1 time",
        "Create premium value proposition for customers",
        "Reduce customer acquisition costs through retention",
        "Automate content delivery and member management",
        "Establish thought leadership in your industry",
        "Higher lifetime customer value than one-time sales"
      ]
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
    marketingContent: {
      title: "Real Estate Platforms That Generate Leads",
      description: "Professional real estate websites with advanced search, property showcases, and lead capture systems. Built for agents, brokers, and property management companies to drive business growth.",
      highlights: [
        "Beautiful property listings with photo galleries",
        "Advanced search and filtering by criteria",
        "MLS integration for automatic updates",
        "Lead capture forms and inquiry management",
        "Agent profiles and team showcases",
        "Market reports and neighborhood analytics",
        "Mobile-optimized property browsing",
        "Contact management and follow-up systems"
      ],
      benefits: [
        "Generate more qualified property leads",
        "Professional credibility builds client trust",
        "24/7 property showcase without staff time",
        "Better client experience drives referrals",
        "Automated lead capture and management",
        "Competitive advantage with advanced features",
        "Improved agent productivity and efficiency",
        "Data insights help optimize marketing efforts"
      ]
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
    marketingContent: {
      title: "Educational Platforms That Enhance Learning",
      description: "Comprehensive learning management systems with course delivery, student tracking, and assessment tools. Perfect for schools, training companies, and online educators seeking to deliver quality education at scale.",
      highlights: [
        "Complete course management and content delivery",
        "Student portals with progress tracking",
        "Assessment tools with automated grading",
        "Interactive learning materials and multimedia",
        "Communication tools for student-teacher interaction",
        "Enrollment management and payment processing",
        "Certification and credential management",
        "Analytics and performance reporting"
      ],
      benefits: [
        "Scale education delivery beyond physical limits",
        "Improve student engagement and outcomes",
        "Reduce administrative overhead and costs",
        "Professional platform builds institutional credibility",
        "Data-driven insights improve course effectiveness",
        "Flexible learning accommodates diverse schedules",
        "Automated processes reduce manual work",
        "Revenue opportunities through online course sales"
      ]
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