<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Button from '../ui/Button.svelte';
  import Card from '../ui/Card.svelte';
  import { ChevronLeft, ChevronRight, Check, Loader2, Upload, Eye, Palette, Type, Zap, Target, Users, Globe, Heart, Lightbulb, Briefcase, ShoppingCart, Cloud, Image, FileText, Calendar, GraduationCap, Home, UtensilsCrossed, HeartPulse, Ticket } from 'lucide-svelte';
  import { createTrueFormOpportunity, type TrueFormLead } from '$lib/api/trueform';

  const dispatch = createEventDispatcher();

  let currentStep = 0;
  const totalSteps = 8;
  let isSubmitting = false;
  let submitError = '';

  // File upload refs
  let logoUpload: HTMLInputElement;
  let brandAssetsUpload: HTMLInputElement;
  let inspirationUpload: HTMLInputElement;

  // Form data
  let formData = {
    // Step 1: Basic Information
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    industry: '',
    companySize: '',
    
    // Step 2: Project Vision & Goals
    projectDescription: '',
    primaryGoals: [] as string[],
    targetAudience: '',
    successMetrics: [] as string[],
    competitorExamples: '',
    
    // Step 3: Website Type & Features
    websiteType: '',
    platformType: '',
    coreFeatures: [] as string[],
    advancedFeatures: [] as string[],
    integrations: [] as string[],
    
    // Step 4: Design & Branding
    designMood: [] as string[],
    colorPalette: '',
    typography: '',
    visualStyle: '',
    hasLogo: false,
    hasBrandGuidelines: false,
    logoFile: null as File | null,
    brandFiles: [] as File[],
    
    // Step 5: Content & Structure
    pageStructure: [] as string[],
    contentSections: [] as string[],
    copywriting: '',
    mediaRequirements: [] as string[],
    
    // Step 6: Functionality & User Experience
    userJourney: '',
    keyInteractions: [] as string[],
    responsiveRequirements: [] as string[],
    performanceRequirements: [] as string[],
    
    // Step 7: Technical Requirements
    hostingPreference: '',
    domainStatus: '',
    analyticsRequirements: [] as string[],
    securityRequirements: [] as string[],
    
    // Step 8: Timeline & Additional Info
    timeline: '',
    budgetRange: '',
    launchDate: '',
    additionalRequirements: '',
    inspirationFiles: [] as File[]
  };

  const steps = [
    'Basic Information',
    'Project Vision',
    'Type & Features',
    'Design & Branding',
    'Content & Structure',
    'User Experience', 
    'Technical Details',
    'Timeline & Wrap-up'
  ];

  // Step 1 Options
  const industries = [
    'Technology/Software', 'Healthcare', 'Finance', 'Real Estate', 'E-commerce/Retail',
    'Education', 'Non-Profit', 'Professional Services', 'Manufacturing', 'Hospitality',
    'Creative/Media', 'Fitness/Wellness', 'Automotive', 'Food & Beverage', 'Other'
  ];

  const companySizes = [
    'Solo Entrepreneur', '2-10 employees', '11-50 employees', '51-200 employees', '200+ employees'
  ];

  // Step 2 Options
  const primaryGoalOptions = [
    {
      name: 'Generate Leads',
      icon: '🎯',
      description: 'Capture potential customers and grow your pipeline'
    },
    {
      name: 'Increase Sales',
      icon: '💰',
      description: 'Drive revenue and boost conversions'
    },
    {
      name: 'Build Brand Awareness',
      icon: '📢',
      description: 'Expand your reach and recognition'
    },
    {
      name: 'Improve Customer Service',
      icon: '🤝',
      description: 'Enhance support and customer satisfaction'
    },
    {
      name: 'Streamline Operations',
      icon: '⚙️',
      description: 'Automate processes and increase efficiency'
    },
    {
      name: 'Showcase Portfolio',
      icon: '🎨',
      description: 'Display your work and attract clients'
    },
    {
      name: 'Educate Audience',
      icon: '📚',
      description: 'Share knowledge and build authority'
    },
    {
      name: 'Build Community',
      icon: '👥',
      description: 'Create connections and engagement'
    }
  ];

  const successMetricOptions = [
    {
      name: 'Website Traffic',
      icon: '📈',
      description: 'Visitors and page views'
    },
    {
      name: 'Lead Generation',
      icon: '🎯',
      description: 'Contact forms and inquiries'
    },
    {
      name: 'Online Sales',
      icon: '💳',
      description: 'Revenue and transactions'
    },
    {
      name: 'User Engagement',
      icon: '❤️',
      description: 'Time on site and interactions'
    },
    {
      name: 'Conversion Rate',
      icon: '🔄',
      description: 'Visitors to customers ratio'
    },
    {
      name: 'Brand Recognition',
      icon: '🏆',
      description: 'Awareness and recall'
    },
    {
      name: 'Customer Satisfaction',
      icon: '😊',
      description: 'Reviews and feedback scores'
    },
    {
      name: 'Time on Site',
      icon: '⏱️',
      description: 'User engagement duration'
    }
  ];

  // Step 3 Options
  const websiteTypes = [
    {
      name: 'Marketing/Business Website',
      icon: Globe,
      description: 'Showcase your brand and services',
      color: 'blue'
    },
    {
      name: 'E-commerce Store',
      icon: ShoppingCart,
      description: 'Sell products online',
      color: 'green'
    },
    {
      name: 'SaaS Platform',
      icon: Cloud,
      description: 'Software as a service',
      color: 'purple'
    },
    {
      name: 'Portfolio/Gallery',
      icon: Image,
      description: 'Display your work',
      color: 'pink'
    },
    {
      name: 'Blog/News Site',
      icon: FileText,
      description: 'Share content and stories',
      color: 'orange'
    },
    {
      name: 'Booking/Scheduling Site',
      icon: Calendar,
      description: 'Manage appointments',
      color: 'teal'
    },
    {
      name: 'Educational Platform',
      icon: GraduationCap,
      description: 'Online learning',
      color: 'indigo'
    },
    {
      name: 'Community/Membership Site',
      icon: Users,
      description: 'Build a community',
      color: 'yellow'
    },
    {
      name: 'Real Estate Platform',
      icon: Home,
      description: 'Property listings',
      color: 'red'
    },
    {
      name: 'Restaurant/Food Service',
      icon: UtensilsCrossed,
      description: 'Menu and ordering',
      color: 'amber'
    },
    {
      name: 'Healthcare Portal',
      icon: HeartPulse,
      description: 'Patient services',
      color: 'rose'
    },
    {
      name: 'Event Platform',
      icon: Ticket,
      description: 'Event management',
      color: 'cyan'
    }
  ];

  const platformTypes = [
    {
      name: 'Simple Website',
      icon: '🌐',
      description: 'Basic informational site with pages and content',
      complexity: 'Low',
      timeframe: '1-2 weeks'
    },
    {
      name: 'Web Application',
      icon: '⚡',
      description: 'Interactive app with user accounts and dynamic features',
      complexity: 'Medium',
      timeframe: '3-6 weeks'
    },
    {
      name: 'E-commerce Platform',
      icon: '🛒',
      description: 'Online store with products, cart, and payment processing',
      complexity: 'Medium-High',
      timeframe: '4-8 weeks'
    },
    {
      name: 'SaaS Solution',
      icon: '☁️',
      description: 'Software platform with subscriptions and user management',
      complexity: 'High',
      timeframe: '8-12 weeks'
    },
    {
      name: 'Membership Portal',
      icon: '👥',
      description: 'Gated content with member login and exclusive areas',
      complexity: 'Medium',
      timeframe: '3-6 weeks'
    },
    {
      name: 'Booking System',
      icon: '📅',
      description: 'Appointment scheduling with calendar integration',
      complexity: 'Medium',
      timeframe: '4-6 weeks'
    },
    {
      name: 'Learning Management System',
      icon: '🎓',
      description: 'Online courses with progress tracking and assessments',
      complexity: 'High',
      timeframe: '6-10 weeks'
    },
    {
      name: 'Custom Platform',
      icon: '🔧',
      description: 'Unique solution tailored to your specific needs',
      complexity: 'Variable',
      timeframe: 'Depends on scope'
    }
  ];

  const coreFeatureOptions = [
    {
      name: 'Contact Forms',
      icon: '📧',
      description: 'Let visitors reach out easily'
    },
    {
      name: 'Email Newsletter',
      icon: '📮',
      description: 'Build and engage your audience'
    },
    {
      name: 'Social Media Integration',
      icon: '📱',
      description: 'Connect all your social platforms'
    },
    {
      name: 'Search Functionality',
      icon: '🔍',
      description: 'Help users find what they need'
    },
    {
      name: 'User Registration',
      icon: '👤',
      description: 'Allow users to create accounts'
    },
    {
      name: 'Content Management',
      icon: '📝',
      description: 'Easy content updates and editing'
    },
    {
      name: 'Mobile App',
      icon: '📲',
      description: 'Native mobile application'
    },
    {
      name: 'Multi-language Support',
      icon: '🌍',
      description: 'Reach global audiences'
    }
  ];

  const advancedFeatureOptions = [
    {
      name: 'E-commerce/Shopping Cart',
      icon: '🛍️',
      description: 'Full online store functionality',
      premium: true
    },
    {
      name: 'Online Booking/Scheduling',
      icon: '⏰',
      description: 'Automated appointment system',
      premium: true
    },
    {
      name: 'User Dashboards',
      icon: '📊',
      description: 'Personalized user interfaces',
      premium: true
    },
    {
      name: 'Payment Processing',
      icon: '💳',
      description: 'Secure online transactions',
      premium: true
    },
    {
      name: 'Live Chat/Support',
      icon: '💬',
      description: 'Real-time customer support',
      premium: false
    },
    {
      name: 'Advanced Analytics',
      icon: '📈',
      description: 'Deep insights and reporting',
      premium: true
    },
    {
      name: 'API Integrations',
      icon: '🔗',
      description: 'Connect with external services',
      premium: true
    },
    {
      name: 'Custom Workflows',
      icon: '⚙️',
      description: 'Automated business processes',
      premium: true
    },
    {
      name: 'Real-time Notifications',
      icon: '🔔',
      description: 'Instant updates and alerts',
      premium: true
    },
    {
      name: 'File Upload/Management',
      icon: '📁',
      description: 'Document and media handling',
      premium: false
    },
    {
      name: 'Advanced Search/Filtering',
      icon: '🎯',
      description: 'Powerful search capabilities',
      premium: true
    },
    {
      name: 'Custom Reporting',
      icon: '📋',
      description: 'Tailored business reports',
      premium: true
    }
  ];

  const integrationOptions = [
    {
      name: 'CRM (Salesforce, HubSpot)',
      icon: '🤝',
      description: 'Customer relationship management',
      category: 'Sales & Marketing'
    },
    {
      name: 'Email Marketing (Mailchimp, Constant Contact)',
      icon: '📧',
      description: 'Automated email campaigns',
      category: 'Marketing'
    },
    {
      name: 'Payment (Stripe, PayPal)',
      icon: '💰',
      description: 'Secure payment processing',
      category: 'E-commerce'
    },
    {
      name: 'Analytics (Google Analytics, Mixpanel)',
      icon: '📊',
      description: 'Track user behavior and performance',
      category: 'Analytics'
    },
    {
      name: 'Social Media APIs',
      icon: '📱',
      description: 'Social platform connections',
      category: 'Social'
    },
    {
      name: 'Accounting Software',
      icon: '💼',
      description: 'Financial management integration',
      category: 'Business'
    },
    {
      name: 'Inventory Management',
      icon: '📦',
      description: 'Stock and product tracking',
      category: 'E-commerce'
    },
    {
      name: 'Custom APIs',
      icon: '🔧',
      description: 'Bespoke integrations',
      category: 'Custom'
    }
  ];

  // Step 4 Options
  const designMoodOptions = [
    { 
      label: 'Professional & Corporate', 
      icon: Briefcase, 
      desc: 'Clean, trustworthy, established',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
    },
    { 
      label: 'Modern & Minimal', 
      icon: Eye, 
      desc: 'Simple, clean, contemporary',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'
    },
    { 
      label: 'Creative & Artistic', 
      icon: Palette, 
      desc: 'Unique, expressive, bold',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    },
    { 
      label: 'Warm & Friendly', 
      icon: Heart, 
      desc: 'Approachable, welcoming, personal',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
    },
    { 
      label: 'Tech & Innovation', 
      icon: Zap, 
      desc: 'Cutting-edge, dynamic, forward-thinking',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    },
    { 
      label: 'Elegant & Luxury', 
      icon: Target, 
      desc: 'Premium, sophisticated, refined',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    }
  ];

  const colorPaletteOptions = [
    {
      name: 'Blues & Whites (Trust, Professional)',
      colors: ['#1e40af', '#3b82f6', '#60a5fa', '#ffffff'],
      description: 'Trust, Professional'
    },
    {
      name: 'Greens & Earth Tones (Growth, Natural)',
      colors: ['#166534', '#16a34a', '#86efac', '#fef3c7'],
      description: 'Growth, Natural'
    },
    {
      name: 'Bold & Vibrant (Energy, Creative)',
      colors: ['#dc2626', '#f59e0b', '#8b5cf6', '#ec4899'],
      description: 'Energy, Creative'
    },
    {
      name: 'Black & White (Classic, Minimal)',
      colors: ['#000000', '#374151', '#9ca3af', '#ffffff'],
      description: 'Classic, Minimal'
    },
    {
      name: 'Warm Tones (Friendly, Welcoming)',
      colors: ['#ea580c', '#f97316', '#fbbf24', '#fef3c7'],
      description: 'Friendly, Welcoming'
    },
    {
      name: 'I have specific brand colors',
      custom: true,
      description: 'Use your brand colors'
    },
    {
      name: 'Need help choosing',
      help: true,
      description: 'We\'ll help you decide'
    }
  ];

  const typographyOptions = [
    {
      name: 'Clean & Modern Sans-serif',
      example: 'Aa',
      font: 'font-sans',
      description: 'Clean, readable, contemporary',
      sample: 'The quick brown fox jumps over the lazy dog'
    },
    {
      name: 'Professional Serif',
      example: 'Aa',
      font: 'font-serif',
      description: 'Traditional, trustworthy, elegant',
      sample: 'The quick brown fox jumps over the lazy dog'
    },
    {
      name: 'Creative Display Fonts',
      example: 'Aa',
      font: 'font-bold',
      description: 'Unique, expressive, memorable',
      sample: 'THE QUICK BROWN FOX'
    },
    {
      name: 'Tech/Code-inspired',
      example: 'Aa',
      font: 'font-mono',
      description: 'Technical, precise, modern',
      sample: 'console.log("Hello World");'
    },
    {
      name: 'Handwritten/Script',
      example: 'Aa',
      font: 'italic',
      description: 'Personal, warm, creative',
      sample: 'Welcome to our story...'
    },
    {
      name: 'Bold & Impactful',
      example: 'Aa',
      font: 'font-black',
      description: 'Strong, confident, attention-grabbing',
      sample: 'MAKE AN IMPACT'
    },
    {
      name: 'Let you choose',
      example: '?',
      font: 'font-medium',
      description: 'We\'ll recommend the perfect typography',
      sample: 'Trust our design expertise'
    }
  ];

  const visualStyleOptions = [
    {
      name: 'Photo-heavy/Visual storytelling',
      icon: '📸',
      description: 'High-quality images tell your story',
      example: 'Large hero images, photo galleries, visual narratives'
    },
    {
      name: 'Illustration-based',
      icon: '🎨',
      description: 'Custom illustrations and graphics',
      example: 'Unique artwork, custom icons, branded illustrations'
    },
    {
      name: 'Icon & graphic-focused',
      icon: '⚡',
      description: 'Clean icons and infographics',
      example: 'Minimalist icons, data visualizations, clean graphics'
    },
    {
      name: 'Video & animation',
      icon: '🎬',
      description: 'Dynamic motion and video content',
      example: 'Background videos, animations, interactive elements'
    },
    {
      name: 'Text & typography-focused',
      icon: '📝',
      description: 'Beautiful typography as the hero',
      example: 'Elegant text layouts, minimal visuals, content-first'
    },
    {
      name: 'Mixed media approach',
      icon: '🎭',
      description: 'Combination of all visual elements',
      example: 'Photos + illustrations + icons + video'
    }
  ];

  // Step 5 Options
  const pageStructureOptions = [
    { name: 'Homepage', icon: '🏠', description: 'Your main landing page' },
    { name: 'About Us', icon: '👋', description: 'Company story and team' },
    { name: 'Services/Products', icon: '🛍️', description: 'What you offer' },
    { name: 'Portfolio/Case Studies', icon: '📁', description: 'Showcase your work' },
    { name: 'Blog/News', icon: '📰', description: 'Content and updates' },
    { name: 'Contact', icon: '📞', description: 'Get in touch page' },
    { name: 'Pricing', icon: '💰', description: 'Plans and costs' },
    { name: 'FAQ', icon: '❓', description: 'Common questions' },
    { name: 'Team', icon: '👥', description: 'Meet the team' },
    { name: 'Testimonials', icon: '⭐', description: 'Customer reviews' },
    { name: 'Privacy Policy', icon: '🔒', description: 'Legal compliance' },
    { name: 'Terms of Service', icon: '📋', description: 'Usage terms' }
  ];

  const contentSectionOptions = [
    { name: 'Hero/Banner Section', icon: '🎯', description: 'Eye-catching main section' },
    { name: 'Features Overview', icon: '⚡', description: 'Key benefits and features' },
    { name: 'Testimonials/Reviews', icon: '💬', description: 'Social proof and trust' },
    { name: 'Call-to-Action Sections', icon: '📢', description: 'Drive user actions' },
    { name: 'Product/Service Galleries', icon: '🖼️', description: 'Visual showcases' },
    { name: 'Team Bios', icon: '👤', description: 'Staff introductions' },
    { name: 'Company Timeline', icon: '📅', description: 'History and milestones' },
    { name: 'Process/How It Works', icon: '🔄', description: 'Step-by-step guides' },
    { name: 'Statistics/Metrics', icon: '📊', description: 'Numbers and achievements' },
    { name: 'FAQ Section', icon: '❓', description: 'Common questions' },
    { name: 'Contact Information', icon: '📍', description: 'Location and details' },
    { name: 'Social Proof', icon: '🏆', description: 'Awards and recognition' }
  ];

  const mediaRequirementOptions = [
    { name: 'Professional Photography', icon: '📸', description: 'High-quality custom photos' },
    { name: 'Stock Photos', icon: '🖼️', description: 'Licensed stock imagery' },
    { name: 'Custom Graphics/Illustrations', icon: '🎨', description: 'Unique visual elements' },
    { name: 'Video Content', icon: '🎬', description: 'Motion graphics and videos' },
    { name: 'Infographics', icon: '📊', description: 'Data visualizations' },
    { name: 'Icons & Logos', icon: '🔷', description: 'Brand symbols and icons' },
    { name: 'Interactive Elements', icon: '🎮', description: 'Engaging user interactions' }
  ];

  const copywritingOptions = [
    'I have all content ready', 'I have some content, need help organizing',
    'I need help writing everything', 'I have ideas but need professional copywriting'
  ];

  // Step 6 Options
  const keyInteractionOptions = [
    { name: 'Contact Form Submissions', icon: '📧', description: 'Lead capture and inquiries' },
    { name: 'Product Purchases', icon: '🛒', description: 'E-commerce transactions' },
    { name: 'Service Bookings', icon: '📅', description: 'Appointment scheduling' },
    { name: 'Newsletter Signups', icon: '📮', description: 'Email list building' },
    { name: 'Content Downloads', icon: '📥', description: 'Resource downloads' },
    { name: 'User Registration', icon: '👤', description: 'Account creation' },
    { name: 'Social Sharing', icon: '📱', description: 'Content sharing' },
    { name: 'Live Chat Engagement', icon: '💬', description: 'Real-time support' }
  ];

  const responsiveRequirements = [
    { name: 'Mobile-first Design', icon: '📱', description: 'Optimized for mobile devices' },
    { name: 'Tablet Optimization', icon: '📱', description: 'Perfect tablet experience' },
    { name: 'Desktop Experience', icon: '💻', description: 'Full desktop functionality' },
    { name: 'Touch-friendly Interface', icon: '👆', description: 'Easy touch interactions' },
    { name: 'Fast Mobile Loading', icon: '⚡', description: 'Quick mobile performance' },
    { name: 'App-like Mobile Experience', icon: '📲', description: 'Native app feel' }
  ];

  const performanceRequirements = [
    { name: 'Lightning Fast Loading', icon: '⚡', description: 'Sub-3 second load times' },
    { name: 'SEO Optimization', icon: '🔍', description: 'Search engine friendly' },
    { name: 'Accessibility Compliance', icon: '♿', description: 'WCAG accessibility standards' },
    { name: 'Security Features', icon: '🔒', description: 'Data protection and security' },
    { name: 'Scalability Planning', icon: '📈', description: 'Growth-ready architecture' },
    { name: 'Browser Compatibility', icon: '🌐', description: 'Works across all browsers' },
    { name: 'Performance Monitoring', icon: '📊', description: 'Real-time performance tracking' }
  ];

  // Step 7 Options
  const hostingOptions = [
    { name: 'You handle hosting (recommended)', icon: '🏆', description: 'We manage everything for you' },
    { name: 'I have existing hosting', icon: '🏠', description: 'Use your current hosting provider' },
    { name: 'Need hosting recommendations', icon: '💡', description: 'Help me choose the best option' },
    { name: 'Premium managed hosting', icon: '⭐', description: 'High-performance managed solution' },
    { name: 'Cloud hosting solution', icon: '☁️', description: 'Scalable cloud infrastructure' }
  ];

  const domainOptions = [
    { name: 'I own my domain', icon: '✅', description: 'Already have a domain name' },
    { name: 'Need help purchasing domain', icon: '🛒', description: 'Help me buy a new domain' },
    { name: 'Need domain transfer', icon: '🔄', description: 'Move existing domain' },
    { name: 'Multiple domains needed', icon: '🌐', description: 'Need several domain names' }
  ];

  const analyticsOptions = [
    { name: 'Google Analytics', icon: '📊', description: 'Standard web analytics' },
    { name: 'Advanced User Tracking', icon: '👥', description: 'Detailed user behavior' },
    { name: 'Conversion Tracking', icon: '🎯', description: 'Track goals and conversions' },
    { name: 'Heat Maps', icon: '🔥', description: 'Visual user interaction maps' },
    { name: 'A/B Testing', icon: '🧪', description: 'Test different versions' },
    { name: 'Custom Reporting', icon: '📋', description: 'Tailored analytics reports' },
    { name: 'Real-time Analytics', icon: '⚡', description: 'Live data monitoring' }
  ];

  const securityOptions = [
    { name: 'SSL Certificate', icon: '🔒', description: 'Secure HTTPS encryption' },
    { name: 'Regular Backups', icon: '💾', description: 'Automated data backups' },
    { name: 'Security Monitoring', icon: '👁️', description: '24/7 threat monitoring' },
    { name: 'User Authentication', icon: '🔐', description: 'Secure user login system' },
    { name: 'Data Encryption', icon: '🛡️', description: 'Advanced data protection' },
    { name: 'GDPR Compliance', icon: '🇪🇺', description: 'European privacy compliance' },
    { name: 'PCI Compliance', icon: '💳', description: 'Payment security standards' }
  ];

  // Step 8 Options
  const timelineOptions = [
    'ASAP (Rush - 1 week)', '2 weeks', '1 month', '2-3 months', 'Flexible timeline'
  ];

  const budgetOptions = [
    'Free Demo Only', '$999 - Professional', '$2,000 - $5,000', '$5,000 - $10,000', 
    '$10,000+ Custom Enterprise', 'Need consultation on budget'
  ];

  function nextStep() {
    if (currentStep < totalSteps - 1) {
      currentStep++;
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
    }
  }

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter(item => item !== option);
    } else {
      return [...array, option];
    }
  }

  function handleFileUpload(event: Event, fileType: 'logo' | 'brand' | 'inspiration') {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      switch (fileType) {
        case 'logo':
          formData.logoFile = target.files[0];
          formData.hasLogo = true;
          break;
        case 'brand':
          formData.brandFiles = Array.from(target.files);
          formData.hasBrandGuidelines = true;
          break;
        case 'inspiration':
          formData.inspirationFiles = Array.from(target.files);
          break;
      }
    }
  }

  async function submitForm() {
    if (isSubmitting) return;
    
    try {
      isSubmitting = true;
      submitError = '';

      // Create the TrueForm opportunity with enhanced data
      const result = await createTrueFormOpportunity(formData as any);
      
      if (result.success) {
        dispatch('submit', {
          formData,
          opportunity: result.opportunity,
          contact: result.contact
        });
        
        await goto(`/request/success?id=${result.opportunity.id}`);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      submitError = error instanceof Error ? error.message : 'Failed to submit request. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }

  function isStepValid(step: number): boolean {
    switch (step) {
      case 0: // Basic Info
        const companyValid = !!(formData.companyName?.trim());
        const nameValid = !!(formData.contactName?.trim());
        const emailValid = !!(formData.contactEmail?.trim());
        const step0Result = companyValid && nameValid && emailValid;
        
        console.log('Step 0 Validation Details:', {
          companyName: formData.companyName,
          companyValid,
          contactName: formData.contactName,
          nameValid,
          contactEmail: formData.contactEmail,
          emailValid,
          finalResult: step0Result
        });
        
        return step0Result;
      case 1: // Vision
        return !!(
          formData.projectDescription?.trim() && 
          formData.primaryGoals.length > 0
        );
      case 2: // Type & Features
        return !!(
          formData.websiteType?.trim() && 
          formData.platformType?.trim()
        );
      case 3: // Design
        return !!(
          formData.designMood.length > 0 && 
          formData.colorPalette?.trim()
        );
      case 4: // Content
        return !!(formData.pageStructure.length > 0);
      case 5: // UX
        return !!(formData.userJourney?.trim());
      case 6: // Technical
        return !!(
          formData.hostingPreference?.trim() && 
          formData.domainStatus?.trim()
        );
      case 7: // Timeline
        return !!(
          formData.timeline?.trim() && 
          formData.budgetRange?.trim()
        );
      default:
        return false;
    }
  }

  // Reactive validation - this will update when formData changes
  $: currentStepValid = isStepValid(currentStep);
  
  // Force button state update
  $: buttonEnabled = currentStepValid && !isSubmitting;
  
  // Simple direct validation for step 0
  $: step0DirectValid = formData.companyName && formData.contactName && formData.contactEmail;
  
  // Direct validation for all steps
  $: step1DirectValid = formData.projectDescription && formData.primaryGoals.length > 0;
  $: step2DirectValid = formData.websiteType && formData.platformType;
  $: step3DirectValid = formData.designMood.length > 0 && formData.colorPalette;
  $: step4DirectValid = formData.pageStructure.length > 0;
  $: step5DirectValid = formData.userJourney;
  $: step6DirectValid = formData.hostingPreference && formData.domainStatus;
  $: step7DirectValid = formData.timeline && formData.budgetRange;
  
  // Combined direct validation
  $: directStepValid = (() => {
    switch (currentStep) {
      case 0: return step0DirectValid;
      case 1: return step1DirectValid;
      case 2: return step2DirectValid;
      case 3: return step3DirectValid;
      case 4: return step4DirectValid;
      case 5: return step5DirectValid;
      case 6: return step6DirectValid;
      case 7: return step7DirectValid;
      default: return false;
    }
  })();
  
  // Debug logging for all steps
  $: console.log('Step', currentStep, 'Valid:', currentStepValid, 'Direct Valid:', directStepValid, 'Button Enabled:', buttonEnabled);
  $: console.log('Direct Step 0 Valid:', step0DirectValid);
  $: if (currentStep === 0) {
    console.log('Step 0 Data:', {
      companyName: formData.companyName,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail
    });
  }
  $: if (currentStep === 1) {
    console.log('Step 1 Data:', {
      projectDescription: formData.projectDescription,
      primaryGoals: formData.primaryGoals,
      primaryGoalsLength: formData.primaryGoals.length,
      step1DirectValid,
      descriptionValid: !!formData.projectDescription,
      goalsValid: formData.primaryGoals.length > 0
    });
  }
  $: if (currentStep === 2) {
    console.log('Step 2 Data:', {
      websiteType: formData.websiteType,
      platformType: formData.platformType
    });
  }
</script>

<Card class="max-w-5xl mx-auto">
  <!-- Progress Steps -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4 overflow-x-auto">
      {#each steps as step, index}
        <div class="flex items-center flex-shrink-0">
          <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 
            {index < currentStep ? 'bg-accent-600 border-accent-600 text-white' : 
             index === currentStep ? 'border-accent-600 text-accent-600' : 
             'border-gray-300 text-gray-400'}">
            {#if index < currentStep}
              <Check size={16} />
            {:else}
              {index + 1}
            {/if}
          </div>
          {#if index < steps.length - 1}
            <div class="w-12 h-0.5 mx-2 
              {index < currentStep ? 'bg-accent-600' : 'bg-gray-300'}">
            </div>
          {/if}
        </div>
      {/each}
    </div>
    <h2 class="text-2xl font-semibold text-gray-900">
      Step {currentStep + 1}: {steps[currentStep]}
    </h2>
    <p class="text-gray-600 mt-2">
      {#if currentStep === 0}Tell us about your company and project basics{/if}
      {#if currentStep === 1}Help us understand your vision and goals{/if}
      {#if currentStep === 2}What type of platform do you need?{/if}
      {#if currentStep === 3}Let's define your visual identity{/if}
      {#if currentStep === 4}What content and pages do you need?{/if}
      {#if currentStep === 5}How should users interact with your site?{/if}
      {#if currentStep === 6}Technical requirements and hosting{/if}
      {#if currentStep === 7}Timeline, budget, and final details{/if}
    </p>
  </div>

  <!-- Error Message -->
  {#if submitError}
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" in:fade>
      <p class="text-red-700 text-sm">{submitError}</p>
    </div>
  {/if}

  <!-- Form Steps -->
  <div class="min-h-96">
    <!-- Step 1: Basic Information -->
    {#if currentStep === 0}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">
                Company/Organization Name *
              </label>
              <input
                id="companyName"
                type="text"
                bind:value={formData.companyName}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                bind:value={formData.industry}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                required
              >
                <option value="">Select your industry...</option>
                {#each industries as industry}
                  <option value={industry}>{industry}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label for="contactName" class="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                id="contactName"
                type="text"
                bind:value={formData.contactName}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="John Smith"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                bind:value={formData.companySize}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Select company size...</option>
                {#each companySizes as size}
                  <option value={size}>{size}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="contactEmail"
                type="email"
                bind:value={formData.contactEmail}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="john@acmecorp.com"
                required
              />
            </div>
            <div>
              <label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="contactPhone"
                type="tel"
                bind:value={formData.contactPhone}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 2: Project Vision & Goals -->
    {#if currentStep === 1}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label for="projectDescription" class="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              id="projectDescription"
              bind:value={formData.projectDescription}
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe your project vision, what problem you're solving, and what you want to achieve..."
              required
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Primary Goals * (Select all that apply)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each primaryGoalOptions as goal}
                <button
                  type="button"
                  on:click={() => formData.primaryGoals = toggleArrayOption(formData.primaryGoals, goal.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.primaryGoals.includes(goal.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded 
                    {formData.primaryGoals.includes(goal.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.primaryGoals.includes(goal.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{goal.icon}</span>
                      <span class="text-sm font-medium">{goal.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{goal.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label for="targetAudience" class="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              bind:value={formData.targetAudience}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Who are your ideal customers? Demographics, interests, pain points..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Success Metrics (How will you measure success?)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each successMetricOptions as metric}
                <button
                  type="button"
                  on:click={() => formData.successMetrics = toggleArrayOption(formData.successMetrics, metric.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.successMetrics.includes(metric.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded 
                    {formData.successMetrics.includes(metric.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.successMetrics.includes(metric.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{metric.icon}</span>
                      <span class="text-sm font-medium">{metric.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{metric.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label for="competitorExamples" class="block text-sm font-medium text-gray-700 mb-2">
              Competitor Examples or Inspiration Sites
            </label>
            <textarea
              id="competitorExamples"
              bind:value={formData.competitorExamples}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="List websites you admire or compete with. What do you like/dislike about them?"
            ></textarea>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 3: Website Type & Features -->
    {#if currentStep === 2}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Website Type * (What best describes your project?)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each websiteTypes as type}
                <button
                  type="button"
                  on:click={() => formData.websiteType = type.name}
                  class="p-4 border rounded-lg text-left transition-all hover:shadow-md relative overflow-hidden
                    {formData.websiteType === type.name ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-gray-100">
                      <svelte:component this={type.icon} size={24} class="text-accent-600" />
                    </div>
                    <div class="flex-1">
                      <span class="font-medium text-sm block">{type.name}</span>
                      <p class="text-xs text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                  {#if formData.websiteType === type.name}
                    <div class="absolute top-2 right-2">
                      <div class="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                        <Check size={14} class="text-white" />
                      </div>
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Platform Complexity *
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              {#each platformTypes as platform}
                <button
                  type="button"
                  on:click={() => formData.platformType = platform.name}
                  class="relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md
                    {formData.platformType === platform.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  {#if formData.platformType === platform.name}
                    <div class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                        <Check size={14} class="text-white" />
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Platform Icon -->
                  <div class="mb-3">
                    <div class="text-3xl mb-2">{platform.icon}</div>
                  </div>
                  
                  <!-- Platform Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 text-sm mb-1">{platform.name}</h4>
                    <p class="text-xs text-gray-600 mb-2">{platform.description}</p>
                    <div class="flex gap-2 text-xs">
                      <span class="px-2 py-1 bg-gray-100 rounded text-gray-700">
                        {platform.complexity} complexity
                      </span>
                      <span class="px-2 py-1 bg-blue-100 rounded text-blue-700">
                        {platform.timeframe}
                      </span>
                    </div>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Core Features (Basic functionality you need)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each coreFeatureOptions as feature}
                <button
                  type="button"
                  on:click={() => formData.coreFeatures = toggleArrayOption(formData.coreFeatures, feature.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.coreFeatures.includes(feature.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.coreFeatures.includes(feature.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.coreFeatures.includes(feature.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{feature.icon}</span>
                      <span class="text-sm font-medium">{feature.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Advanced Features (Premium functionality that sets you apart)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each advancedFeatureOptions as feature}
                <button
                  type="button"
                  on:click={() => formData.advancedFeatures = toggleArrayOption(formData.advancedFeatures, feature.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm relative
                    {formData.advancedFeatures.includes(feature.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.advancedFeatures.includes(feature.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.advancedFeatures.includes(feature.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{feature.icon}</span>
                      <span class="text-sm font-medium">{feature.name}</span>
                      {#if feature.premium}
                        <span class="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded font-medium">
                          PRO
                        </span>
                      {/if}
                    </div>
                    <p class="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Third-Party Integrations
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each integrationOptions as integration}
                <button
                  type="button"
                  on:click={() => formData.integrations = toggleArrayOption(formData.integrations, integration.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.integrations.includes(integration.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.integrations.includes(integration.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.integrations.includes(integration.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{integration.icon}</span>
                      <span class="text-sm font-medium">{integration.name}</span>
                    </div>
                    <p class="text-xs text-gray-600 mb-1">{integration.description}</p>
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                      {integration.category}
                    </span>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 4: Design & Branding -->
    {#if currentStep === 3}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Design Mood * (What feeling should your website convey?)
            </label>
            <div class="grid md:grid-cols-3 gap-4">
              {#each designMoodOptions as mood}
                <button
                  type="button"
                  on:click={() => formData.designMood = toggleArrayOption(formData.designMood, mood.label)}
                  class="border rounded-lg overflow-hidden transition-all hover:shadow-lg
                    {formData.designMood.includes(mood.label) ? 'border-accent-600 ring-2 ring-accent-600' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="relative h-32 overflow-hidden">
                    <img 
                      src={mood.image} 
                      alt={mood.label}
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div class="absolute bottom-2 left-2 right-2 text-white">
                      <div class="flex items-center gap-2 mb-1">
                        <svelte:component this={mood.icon} size={16} />
                        <span class="font-medium text-sm">{mood.label}</span>
                      </div>
                      <p class="text-xs opacity-90">{mood.desc}</p>
                    </div>
                  </div>
                  {#if formData.designMood.includes(mood.label)}
                    <div class="bg-accent-600 text-white p-2 text-center">
                      <Check size={16} class="inline" />
                      <span class="text-xs ml-1">Selected</span>
                    </div>
                  {:else}
                    <div class="bg-gray-50 p-2 text-center">
                      <span class="text-xs text-gray-600">Click to select</span>
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Color Palette Preference *
            </label>
            <div class="space-y-2">
              {#each colorPaletteOptions as palette}
                <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all
                  {formData.colorPalette === palette.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200'}">
                  <input
                    type="radio"
                    bind:group={formData.colorPalette}
                    value={palette.name}
                    class="text-accent-600 focus:ring-accent-500"
                  />
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      {#if palette.colors}
                        <div class="flex gap-1">
                          {#each palette.colors as color}
                            <div 
                              class="w-8 h-8 rounded border border-gray-200" 
                              style="background-color: {color}"
                            ></div>
                          {/each}
                        </div>
                      {:else if palette.custom}
                        <div class="p-2 rounded bg-gray-100">
                          <Palette size={20} class="text-gray-600" />
                        </div>
                      {:else if palette.help}
                        <div class="p-2 rounded bg-gray-100">
                          <Lightbulb size={20} class="text-gray-600" />
                        </div>
                      {/if}
                      <div>
                        <span class="text-sm font-medium block">{palette.name}</span>
                        {#if palette.description}
                          <span class="text-xs text-gray-500">{palette.description}</span>
                        {/if}
                      </div>
                    </div>
                  </div>
                </label>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Typography Style
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              {#each typographyOptions as typo}
                <label class="relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                  {formData.typography === typo.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}">
                  <input
                    type="radio"
                    bind:group={formData.typography}
                    value={typo.name}
                    class="absolute top-3 right-3 text-accent-600 focus:ring-accent-500"
                  />
                  
                  <!-- Typography Preview -->
                  <div class="mb-3">
                    <div class="text-3xl {typo.font} text-gray-800 mb-1">
                      {typo.example}
                    </div>
                    <div class="text-sm {typo.font} text-gray-600 truncate">
                      {typo.sample}
                    </div>
                  </div>
                  
                  <!-- Typography Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 text-sm mb-1">{typo.name}</h4>
                    <p class="text-xs text-gray-600">{typo.description}</p>
                  </div>
                </label>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Visual Style Direction
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              {#each visualStyleOptions as style}
                <label class="relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                  {formData.visualStyle === style.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}">
                  <input
                    type="radio"
                    bind:group={formData.visualStyle}
                    value={style.name}
                    class="absolute top-3 right-3 text-accent-600 focus:ring-accent-500"
                  />
                  
                  <!-- Visual Style Icon -->
                  <div class="mb-3">
                    <div class="text-3xl mb-2">{style.icon}</div>
                  </div>
                  
                  <!-- Visual Style Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 text-sm mb-1">{style.name}</h4>
                    <p class="text-xs text-gray-600 mb-2">{style.description}</p>
                    <p class="text-xs text-gray-500 italic">{style.example}</p>
                  </div>
                </label>
              {/each}
            </div>
          </div>

          <!-- File Upload Section -->
          <div class="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 class="font-medium text-gray-900">Upload Brand Assets</h3>
            
            <!-- Logo Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Logo Files
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  on:change={(e) => handleFileUpload(e, 'logo')}
                  class="hidden"
                  bind:this={logoUpload}
                />
                <button
                  type="button"
                  on:click={() => logoUpload?.click()}
                  class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
                >
                  <Upload size={24} />
                  <span class="text-sm">Click to upload logo</span>
                  <span class="text-xs text-gray-500">PNG, JPG, SVG up to 10MB</span>
                </button>
                {#if formData.logoFile}
                  <p class="text-sm text-green-600 mt-2">✓ {formData.logoFile.name}</p>
                {/if}
              </div>
            </div>

            <!-- Brand Guidelines Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Brand Guidelines / Reference Materials
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  on:change={(e) => handleFileUpload(e, 'brand')}
                  class="hidden"
                  bind:this={brandAssetsUpload}
                />
                <button
                  type="button"
                  on:click={() => brandAssetsUpload?.click()}
                  class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
                >
                  <Upload size={24} />
                  <span class="text-sm">Upload brand guidelines</span>
                  <span class="text-xs text-gray-500">PDF, DOC, Images up to 10MB each</span>
                </button>
                {#if formData.brandFiles.length > 0}
                  <div class="text-sm text-green-600 mt-2">
                    ✓ {formData.brandFiles.length} file(s) uploaded
                  </div>
                {/if}
              </div>
            </div>

            <!-- Inspiration Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Inspiration Images / Screenshots
              </label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  on:change={(e) => handleFileUpload(e, 'inspiration')}
                  class="hidden"
                  bind:this={inspirationUpload}
                />
                <button
                  type="button"
                  on:click={() => inspirationUpload?.click()}
                  class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
                >
                  <Upload size={24} />
                  <span class="text-sm">Upload inspiration images</span>
                  <span class="text-xs text-gray-500">Screenshots of sites you like</span>
                </button>
                {#if formData.inspirationFiles.length > 0}
                  <div class="text-sm text-green-600 mt-2">
                    ✓ {formData.inspirationFiles.length} file(s) uploaded
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 5: Content & Structure -->
    {#if currentStep === 4}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Page Structure * (Select all pages you need)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each pageStructureOptions as structure}
                <button
                  type="button"
                  on:click={() => formData.pageStructure = toggleArrayOption(formData.pageStructure, structure.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.pageStructure.includes(structure.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.pageStructure.includes(structure.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.pageStructure.includes(structure.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{structure.icon}</span>
                      <span class="text-sm font-medium">{structure.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{structure.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Content Sections * (Select all sections you need)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each contentSectionOptions as section}
                <button
                  type="button"
                  on:click={() => formData.contentSections = toggleArrayOption(formData.contentSections, section.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.contentSections.includes(section.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.contentSections.includes(section.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.contentSections.includes(section.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{section.icon}</span>
                      <span class="text-sm font-medium">{section.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{section.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label for="copywriting" class="block text-sm font-medium text-gray-700 mb-2">
              Copywriting
            </label>
            <textarea
              id="copywriting"
              bind:value={formData.copywriting}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe your preferred copywriting style..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Media Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each mediaRequirementOptions as requirement}
                <button
                  type="button"
                  on:click={() => formData.mediaRequirements = toggleArrayOption(formData.mediaRequirements, requirement.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.mediaRequirements.includes(requirement.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.mediaRequirements.includes(requirement.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.mediaRequirements.includes(requirement.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{requirement.icon}</span>
                      <span class="text-sm font-medium">{requirement.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{requirement.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 6: Functionality & User Experience -->
    {#if currentStep === 5}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              User Journey *
            </label>
            <textarea
              id="userJourney"
              bind:value={formData.userJourney}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe the typical user journey on your site..."
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Key Interactions *
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each keyInteractionOptions as interaction}
                <button
                  type="button"
                  on:click={() => formData.keyInteractions = toggleArrayOption(formData.keyInteractions, interaction.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.keyInteractions.includes(interaction.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.keyInteractions.includes(interaction.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.keyInteractions.includes(interaction.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{interaction.icon}</span>
                      <span class="text-sm font-medium">{interaction.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{interaction.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Responsive Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each responsiveRequirements as requirement}
                <button
                  type="button"
                  on:click={() => formData.responsiveRequirements = toggleArrayOption(formData.responsiveRequirements, requirement.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.responsiveRequirements.includes(requirement.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.responsiveRequirements.includes(requirement.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.responsiveRequirements.includes(requirement.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{requirement.icon}</span>
                      <span class="text-sm font-medium">{requirement.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{requirement.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Performance Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each performanceRequirements as requirement}
                <button
                  type="button"
                  on:click={() => formData.performanceRequirements = toggleArrayOption(formData.performanceRequirements, requirement.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.performanceRequirements.includes(requirement.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.performanceRequirements.includes(requirement.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.performanceRequirements.includes(requirement.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{requirement.icon}</span>
                      <span class="text-sm font-medium">{requirement.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{requirement.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 7: Technical Requirements -->
    {#if currentStep === 6}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Hosting Preference *
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              {#each hostingOptions as option}
                <button
                  type="button"
                  on:click={() => formData.hostingPreference = option.name}
                  class="relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md
                    {formData.hostingPreference === option.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  {#if formData.hostingPreference === option.name}
                    <div class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                        <Check size={14} class="text-white" />
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Hosting Icon -->
                  <div class="mb-3">
                    <div class="text-3xl mb-2">{option.icon}</div>
                  </div>
                  
                  <!-- Hosting Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 text-sm mb-1">{option.name}</h4>
                    <p class="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Domain Status *
            </label>
            <div class="grid md:grid-cols-2 gap-4">
              {#each domainOptions as option}
                <button
                  type="button"
                  on:click={() => formData.domainStatus = option.name}
                  class="relative p-4 border-2 rounded-lg text-left transition-all hover:shadow-md
                    {formData.domainStatus === option.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}"
                >
                  {#if formData.domainStatus === option.name}
                    <div class="absolute top-3 right-3">
                      <div class="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center">
                        <Check size={14} class="text-white" />
                      </div>
                    </div>
                  {/if}
                  
                  <!-- Domain Icon -->
                  <div class="mb-3">
                    <div class="text-3xl mb-2">{option.icon}</div>
                  </div>
                  
                  <!-- Domain Info -->
                  <div>
                    <h4 class="font-medium text-gray-900 text-sm mb-1">{option.name}</h4>
                    <p class="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Analytics Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each analyticsOptions as option}
                <button
                  type="button"
                  on:click={() => formData.analyticsRequirements = toggleArrayOption(formData.analyticsRequirements, option.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.analyticsRequirements.includes(option.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.analyticsRequirements.includes(option.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.analyticsRequirements.includes(option.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{option.icon}</span>
                      <span class="text-sm font-medium">{option.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Security Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each securityOptions as option}
                <button
                  type="button"
                  on:click={() => formData.securityRequirements = toggleArrayOption(formData.securityRequirements, option.name)}
                  class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
                    {formData.securityRequirements.includes(option.name) ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="w-5 h-5 border rounded mt-0.5
                    {formData.securityRequirements.includes(option.name) ? 'bg-accent-600 border-accent-600' : 'border-gray-300'}">
                    {#if formData.securityRequirements.includes(option.name)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-lg">{option.icon}</span>
                      <span class="text-sm font-medium">{option.name}</span>
                    </div>
                    <p class="text-xs text-gray-600">{option.description}</p>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step 8: Timeline & Additional Info -->
    {#if currentStep === 7}
      <div in:fade={{ duration: 300 }}>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Timeline *
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each timelineOptions as timeline}
                <button
                  type="button"
                  on:click={() => formData.timeline = timeline}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.timeline === timeline ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{timeline}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Budget Range *
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each budgetOptions as budget}
                <button
                  type="button"
                  on:click={() => formData.budgetRange = budget}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.budgetRange === budget ? 'border-accent-600 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{budget}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label for="launchDate" class="block text-sm font-medium text-gray-700 mb-2">
              Launch Date
            </label>
            <input
              id="launchDate"
              type="date"
              bind:value={formData.launchDate}
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            />
          </div>

          <div>
            <label for="additionalRequirements" class="block text-sm font-medium text-gray-700 mb-2">
              Additional Requirements
            </label>
            <textarea
              id="additionalRequirements"
              bind:value={formData.additionalRequirements}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Any additional requirements or notes..."
            ></textarea>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
    <div>
      {#if currentStep > 0}
        <Button variant="outline" on:click={prevStep} class="flex items-center gap-2" disabled={isSubmitting}>
          <ChevronLeft size={20} />
          Back
        </Button>
      {/if}
    </div>

    <div class="flex gap-3">
      <span class="text-sm text-gray-500 self-center">
        {currentStep + 1} of {totalSteps}
      </span>
      {#if currentStep < totalSteps - 1}
        <Button 
          variant="accent" 
          on:click={nextStep}
          disabled={!directStepValid}
          class="flex items-center gap-2"
        >
          Next Step
          <ChevronRight size={20} />
        </Button>
      {:else}
        <Button 
          variant="accent" 
          on:click={submitForm}
          disabled={!directStepValid}
          class="px-8 flex items-center gap-2"
        >
          {#if isSubmitting}
            <Loader2 size={20} class="animate-spin" />
            Creating Your Request...
          {:else}
            Submit Request
          {/if}
        </Button>
      {/if}
    </div>
  </div>
</Card> 