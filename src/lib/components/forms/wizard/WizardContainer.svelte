<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import Button from "../ui/Button.svelte";
  import Card from "../ui/Card.svelte";
  import {
    ChevronLeft,
    ChevronRight,
    Check,
    Loader2,
    Upload,
    Eye,
    Palette,
    Type,
    Zap,
    Target,
    Users,
    Globe,
    Heart,
    Lightbulb,
    Briefcase,
    ShoppingCart,
    Cloud,
    Image,
    FileText,
    Calendar,
    GraduationCap,
    Home,
    UtensilsCrossed,
    HeartPulse,
    Ticket,
  } from "lucide-svelte";
  import {
    createTrueFormOpportunity,
    type TrueFormLead,
  } from "$lib/api/trueform";

  const dispatch = createEventDispatcher();

  let currentStep = 0;
  const totalSteps = 8;
  let isSubmitting = false;
  let submitError = "";

  // File upload refs
  let logoUpload: HTMLInputElement;
  let brandAssetsUpload: HTMLInputElement;
  let inspirationUpload: HTMLInputElement;

  // Form data
  let formData = {
    // Step 1: Basic Information
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    industry: "",
    companySize: "",

    // Step 2: Project Vision & Goals
    projectDescription: "",
    primaryGoals: [] as string[],
    targetAudience: "",
    successMetrics: [] as string[],
    competitorExamples: "",

    // Step 3: Website Type & Features
    websiteType: "",
    platformType: "",
    coreFeatures: [] as string[],
    advancedFeatures: [] as string[],
    integrations: [] as string[],

    // Step 4: Design & Branding
    designMood: [] as string[],
    colorPalette: "",
    typography: "",
    visualStyle: "",
    hasLogo: false,
    hasBrandGuidelines: false,
    logoFile: null as File | null,
    brandFiles: [] as File[],

    // Step 5: Content & Structure
    pageStructure: [] as string[],
    contentSections: [] as string[],
    copywriting: "",
    mediaRequirements: [] as string[],

    // Step 6: Functionality & User Experience
    userJourney: "",
    keyInteractions: [] as string[],
    responsiveRequirements: [] as string[],
    performanceRequirements: [] as string[],

    // Step 7: Technical Requirements
    hostingPreference: "",
    domainStatus: "",
    analyticsRequirements: [] as string[],
    securityRequirements: [] as string[],

    // Step 8: Timeline & Additional Info
    timeline: "",
    budgetRange: "",
    launchDate: "",
    additionalRequirements: "",
    inspirationFiles: [] as File[],
  };

  const steps = [
    "Basic Information",
    "Project Vision",
    "Type & Features",
    "Design & Branding",
    "Content & Structure",
    "User Experience",
    "Technical Details",
    "Timeline & Wrap-up",
  ];

  // Step 1 Options
  const industries = [
    "Technology/Software",
    "Healthcare",
    "Finance",
    "Real Estate",
    "E-commerce/Retail",
    "Education",
    "Non-Profit",
    "Professional Services",
    "Manufacturing",
    "Hospitality",
    "Creative/Media",
    "Fitness/Wellness",
    "Automotive",
    "Food & Beverage",
    "Other",
  ];

  const companySizes = [
    "Solo Entrepreneur",
    "2-10 employees",
    "11-50 employees",
    "51-200 employees",
    "200+ employees",
  ];

  // Step 2 Options
  const primaryGoalOptions = [
    "Generate Leads",
    "Increase Sales",
    "Build Brand Awareness",
    "Improve Customer Service",
    "Streamline Operations",
    "Showcase Portfolio",
    "Educate Audience",
    "Build Community",
  ];

  const successMetricOptions = [
    "Website Traffic",
    "Lead Generation",
    "Online Sales",
    "User Engagement",
    "Conversion Rate",
    "Brand Recognition",
    "Customer Satisfaction",
    "Time on Site",
  ];

  // Step 3 Options
  const websiteTypes = [
    {
      name: "Marketing/Business Website",
      icon: Globe,
      description: "Showcase your brand and services",
      color: "blue",
    },
    {
      name: "E-commerce Store",
      icon: ShoppingCart,
      description: "Sell products online",
      color: "green",
    },
    {
      name: "SaaS Platform",
      icon: Cloud,
      description: "Software as a service",
      color: "purple",
    },
    {
      name: "Portfolio/Gallery",
      icon: Image,
      description: "Display your work",
      color: "pink",
    },
    {
      name: "Blog/News Site",
      icon: FileText,
      description: "Share content and stories",
      color: "orange",
    },
    {
      name: "Booking/Scheduling Site",
      icon: Calendar,
      description: "Manage appointments",
      color: "teal",
    },
    {
      name: "Educational Platform",
      icon: GraduationCap,
      description: "Online learning",
      color: "indigo",
    },
    {
      name: "Community/Membership Site",
      icon: Users,
      description: "Build a community",
      color: "yellow",
    },
    {
      name: "Real Estate Platform",
      icon: Home,
      description: "Property listings",
      color: "red",
    },
    {
      name: "Restaurant/Food Service",
      icon: UtensilsCrossed,
      description: "Menu and ordering",
      color: "amber",
    },
    {
      name: "Healthcare Portal",
      icon: HeartPulse,
      description: "Patient services",
      color: "rose",
    },
    {
      name: "Event Platform",
      icon: Ticket,
      description: "Event management",
      color: "cyan",
    },
  ];

  const platformTypes = [
    "Simple Website",
    "Web Application",
    "E-commerce Platform",
    "SaaS Solution",
    "Membership Portal",
    "Booking System",
    "Learning Management System",
    "Custom Platform",
  ];

  const coreFeatureOptions = [
    "Contact Forms",
    "Email Newsletter",
    "Social Media Integration",
    "Search Functionality",
    "User Registration",
    "Content Management",
    "Mobile App",
    "Multi-language Support",
  ];

  const advancedFeatureOptions = [
    "E-commerce/Shopping Cart",
    "Online Booking/Scheduling",
    "User Dashboards",
    "Payment Processing",
    "Live Chat/Support",
    "Advanced Analytics",
    "API Integrations",
    "Custom Workflows",
    "Real-time Notifications",
    "File Upload/Management",
    "Advanced Search/Filtering",
    "Custom Reporting",
  ];

  const integrationOptions = [
    "CRM (Salesforce, HubSpot)",
    "Email Marketing (Mailchimp, Constant Contact)",
    "Payment (Stripe, PayPal)",
    "Analytics (Google Analytics, Mixpanel)",
    "Social Media APIs",
    "Accounting Software",
    "Inventory Management",
    "Custom APIs",
  ];

  // Step 4 Options
  const designMoodOptions = [
    {
      label: "Professional & Corporate",
      icon: Briefcase,
      desc: "Clean, trustworthy, established",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    },
    {
      label: "Modern & Minimal",
      icon: Eye,
      desc: "Simple, clean, contemporary",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    },
    {
      label: "Creative & Artistic",
      icon: Palette,
      desc: "Unique, expressive, bold",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      label: "Warm & Friendly",
      icon: Heart,
      desc: "Approachable, welcoming, personal",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    },
    {
      label: "Tech & Innovation",
      icon: Zap,
      desc: "Cutting-edge, dynamic, forward-thinking",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    },
    {
      label: "Elegant & Luxury",
      icon: Target,
      desc: "Premium, sophisticated, refined",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    },
  ];

  const colorPaletteOptions = [
    {
      name: "Blues & Whites (Trust, Professional)",
      colors: ["#1e40af", "#3b82f6", "#60a5fa", "#ffffff"],
      description: "Trust, Professional",
    },
    {
      name: "Greens & Earth Tones (Growth, Natural)",
      colors: ["#166534", "#16a34a", "#86efac", "#fef3c7"],
      description: "Growth, Natural",
    },
    {
      name: "Bold & Vibrant (Energy, Creative)",
      colors: ["#dc2626", "#f59e0b", "#8b5cf6", "#ec4899"],
      description: "Energy, Creative",
    },
    {
      name: "Black & White (Classic, Minimal)",
      colors: ["#000000", "#374151", "#9ca3af", "#ffffff"],
      description: "Classic, Minimal",
    },
    {
      name: "Warm Tones (Friendly, Welcoming)",
      colors: ["#ea580c", "#f97316", "#fbbf24", "#fef3c7"],
      description: "Friendly, Welcoming",
    },
    {
      name: "I have specific brand colors",
      custom: true,
      description: "Use your brand colors",
    },
    {
      name: "Need help choosing",
      help: true,
      description: "We'll help you decide",
    },
  ];

  const typographyOptions = [
    "Clean & Modern Sans-serif",
    "Professional Serif",
    "Creative Display Fonts",
    "Tech/Code-inspired",
    "Handwritten/Script",
    "Bold & Impactful",
    "Let you choose",
  ];

  const visualStyleOptions = [
    "Photo-heavy/Visual storytelling",
    "Illustration-based",
    "Icon & graphic-focused",
    "Video & animation",
    "Text & typography-focused",
    "Mixed media approach",
  ];

  // Step 5 Options
  const pageStructureOptions = [
    "Homepage",
    "About Us",
    "Services/Products",
    "Portfolio/Case Studies",
    "Blog/News",
    "Contact",
    "Pricing",
    "FAQ",
    "Team",
    "Testimonials",
    "Privacy Policy",
    "Terms of Service",
  ];

  const contentSectionOptions = [
    "Hero/Banner Section",
    "Features Overview",
    "Testimonials/Reviews",
    "Call-to-Action Sections",
    "Product/Service Galleries",
    "Team Bios",
    "Company Timeline",
    "Process/How It Works",
    "Statistics/Metrics",
    "FAQ Section",
    "Contact Information",
    "Social Proof",
  ];

  const copywritingOptions = [
    "I have all content ready",
    "I have some content, need help organizing",
    "I need help writing everything",
    "I have ideas but need professional copywriting",
  ];

  const mediaRequirementOptions = [
    "Professional Photography",
    "Stock Photos",
    "Custom Graphics/Illustrations",
    "Video Content",
    "Infographics",
    "Icons & Logos",
    "Interactive Elements",
  ];

  // Step 6 Options
  const keyInteractionOptions = [
    "Contact Form Submissions",
    "Product Purchases",
    "Service Bookings",
    "Newsletter Signups",
    "Content Downloads",
    "User Registration",
    "Social Sharing",
    "Live Chat Engagement",
  ];

  const responsiveRequirements = [
    "Mobile-first Design",
    "Tablet Optimization",
    "Desktop Experience",
    "Touch-friendly Interface",
    "Fast Mobile Loading",
    "App-like Mobile Experience",
  ];

  const performanceRequirements = [
    "Lightning Fast Loading",
    "SEO Optimization",
    "Accessibility Compliance",
    "Security Features",
    "Scalability Planning",
    "Browser Compatibility",
    "Performance Monitoring",
  ];

  // Step 7 Options
  const hostingOptions = [
    "You handle hosting (recommended)",
    "I have existing hosting",
    "Need hosting recommendations",
    "Premium managed hosting",
    "Cloud hosting solution",
  ];

  const domainOptions = [
    "I own my domain",
    "Need help purchasing domain",
    "Need domain transfer",
    "Multiple domains needed",
  ];

  const analyticsOptions = [
    "Google Analytics",
    "Advanced User Tracking",
    "Conversion Tracking",
    "Heat Maps",
    "A/B Testing",
    "Custom Reporting",
    "Real-time Analytics",
  ];

  const securityOptions = [
    "SSL Certificate",
    "Regular Backups",
    "Security Monitoring",
    "User Authentication",
    "Data Encryption",
    "GDPR Compliance",
    "PCI Compliance",
  ];

  // Step 8 Options
  const timelineOptions = [
    "ASAP (Rush - 1 week)",
    "2 weeks",
    "1 month",
    "2-3 months",
    "Flexible timeline",
  ];

  const budgetOptions = [
    "Free Demo Only",
    "$999 - Professional",
    "$2,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000+ Custom Enterprise",
    "Need consultation on budget",
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
      return array.filter((item) => item !== option);
    } else {
      return [...array, option];
    }
  }

  function handleFileUpload(
    event: Event,
    fileType: "logo" | "brand" | "inspiration"
  ) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      switch (fileType) {
        case "logo":
          formData.logoFile = target.files[0];
          formData.hasLogo = true;
          break;
        case "brand":
          formData.brandFiles = Array.from(target.files);
          formData.hasBrandGuidelines = true;
          break;
        case "inspiration":
          formData.inspirationFiles = Array.from(target.files);
          break;
      }
    }
  }

  async function submitForm() {
    if (isSubmitting) return;

    try {
      isSubmitting = true;
      submitError = "";

      // Create the TrueForm opportunity with enhanced data
      const result = await createTrueFormOpportunity(formData as any);

      if (result.success) {
        dispatch("submit", {
          formData,
          opportunity: result.opportunity,
          contact: result.contact,
        });

        await goto(`/request/success?id=${result.opportunity.id}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      submitError =
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  function isStepValid(step: number): boolean {
    switch (step) {
      case 0: // Basic Info
        const companyValid = !!formData.companyName?.trim();
        const nameValid = !!formData.contactName?.trim();
        const emailValid = !!formData.contactEmail?.trim();
        const step0Result = companyValid && nameValid && emailValid;

        console.log("Step 0 Validation Details:", {
          companyName: formData.companyName,
          companyValid,
          contactName: formData.contactName,
          nameValid,
          contactEmail: formData.contactEmail,
          emailValid,
          finalResult: step0Result,
        });

        return step0Result;
      case 1: // Vision
        return !!(
          formData.projectDescription?.trim() &&
          formData.primaryGoals.length > 0
        );
      case 2: // Type & Features
        return !!(
          formData.websiteType?.trim() && formData.platformType?.trim()
        );
      case 3: // Design
        return !!(
          formData.designMood.length > 0 && formData.colorPalette?.trim()
        );
      case 4: // Content
        return !!(formData.pageStructure.length > 0);
      case 5: // UX
        return !!formData.userJourney?.trim();
      case 6: // Technical
        return !!(
          formData.hostingPreference?.trim() && formData.domainStatus?.trim()
        );
      case 7: // Timeline
        return !!(formData.timeline?.trim() && formData.budgetRange?.trim());
      default:
        return false;
    }
  }

  // Reactive validation - this will update when formData changes
  $: currentStepValid = isStepValid(currentStep);

  // Force button state update
  $: buttonEnabled = currentStepValid && !isSubmitting;

  // Simple direct validation for step 0
  $: step0DirectValid =
    formData.companyName && formData.contactName && formData.contactEmail;

  // Direct validation for all steps
  $: step1DirectValid =
    formData.projectDescription && formData.primaryGoals.length > 0;
  $: step2DirectValid = formData.websiteType && formData.platformType;
  $: step3DirectValid = formData.designMood.length > 0 && formData.colorPalette;
  $: step4DirectValid = formData.pageStructure.length > 0;
  $: step5DirectValid = formData.userJourney;
  $: step6DirectValid = formData.hostingPreference && formData.domainStatus;
  $: step7DirectValid = formData.timeline && formData.budgetRange;

  // Combined direct validation
  $: directStepValid = (() => {
    switch (currentStep) {
      case 0:
        return step0DirectValid;
      case 1:
        return step1DirectValid;
      case 2:
        return step2DirectValid;
      case 3:
        return step3DirectValid;
      case 4:
        return step4DirectValid;
      case 5:
        return step5DirectValid;
      case 6:
        return step6DirectValid;
      case 7:
        return step7DirectValid;
      default:
        return false;
    }
  })();

  // Debug logging for all steps
  $: console.log(
    "Step",
    currentStep,
    "Valid:",
    currentStepValid,
    "Direct Valid:",
    directStepValid,
    "Button Enabled:",
    buttonEnabled
  );
  $: console.log("Direct Step 0 Valid:", step0DirectValid);
  $: if (currentStep === 0) {
    console.log("Step 0 Data:", {
      companyName: formData.companyName,
      contactName: formData.contactName,
      contactEmail: formData.contactEmail,
    });
  }
  $: if (currentStep === 1) {
    console.log("Step 1 Data:", {
      projectDescription: formData.projectDescription,
      primaryGoals: formData.primaryGoals,
      primaryGoalsLength: formData.primaryGoals.length,
      step1DirectValid,
      descriptionValid: !!formData.projectDescription,
      goalsValid: formData.primaryGoals.length > 0,
    });
  }
  $: if (currentStep === 2) {
    console.log("Step 2 Data:", {
      websiteType: formData.websiteType,
      platformType: formData.platformType,
    });
  }
</script>

<Card class="max-w-5xl mx-auto">
  <!-- Progress Steps -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-4 overflow-x-auto">
      {#each steps as step, index}
        <div class="flex items-center flex-shrink-0">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2
            {index < currentStep
              ? 'bg-accent-600 border-accent-600 text-white'
              : index === currentStep
              ? 'border-accent-600 text-accent-600'
              : 'border-gray-300 text-gray-400'}"
          >
            {#if index < currentStep}
              <Check size={16} />
            {:else}
              {index + 1}
            {/if}
          </div>
          {#if index < steps.length - 1}
            <div
              class="w-12 h-0.5 mx-2
              {index < currentStep ? 'bg-accent-600' : 'bg-gray-300'}"
            />
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
              <label
                for="companyName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                for="contactName"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                for="contactEmail"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
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
              <label
                for="contactPhone"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
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
            <label
              for="projectDescription"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Description *
            </label>
            <textarea
              id="projectDescription"
              bind:value={formData.projectDescription}
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe your project vision, what problem you're solving, and what you want to achieve..."
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Primary Goals * (Select all that apply)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each primaryGoalOptions as goal}
                <button
                  type="button"
                  on:click={() =>
                    (formData.primaryGoals = toggleArrayOption(
                      formData.primaryGoals,
                      goal
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.primaryGoals.includes(goal)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.primaryGoals.includes(goal)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.primaryGoals.includes(goal)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{goal}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label
              for="targetAudience"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Target Audience
            </label>
            <textarea
              id="targetAudience"
              bind:value={formData.targetAudience}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Who are your ideal customers? Demographics, interests, pain points..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Success Metrics (How will you measure success?)
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each successMetricOptions as metric}
                <button
                  type="button"
                  on:click={() =>
                    (formData.successMetrics = toggleArrayOption(
                      formData.successMetrics,
                      metric
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.successMetrics.includes(metric)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.successMetrics.includes(metric)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.successMetrics.includes(metric)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{metric}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label
              for="competitorExamples"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Competitor Examples or Inspiration Sites
            </label>
            <textarea
              id="competitorExamples"
              bind:value={formData.competitorExamples}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="List websites you admire or compete with. What do you like/dislike about them?"
            />
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
                  on:click={() => (formData.websiteType = type.name)}
                  class="p-4 border rounded-lg text-left transition-all hover:shadow-md relative overflow-hidden
                    {formData.websiteType === type.name
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-gray-100">
                      <svelte:component
                        this={type.icon}
                        size={24}
                        class="text-accent-600"
                      />
                    </div>
                    <div class="flex-1">
                      <span class="font-medium text-sm block">{type.name}</span>
                      <p class="text-xs text-gray-600 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  {#if formData.websiteType === type.name}
                    <div class="absolute top-2 right-2">
                      <div
                        class="w-6 h-6 bg-accent-600 rounded-full flex items-center justify-center"
                      >
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
            <div class="grid md:grid-cols-2 gap-3">
              {#each platformTypes as platform}
                <button
                  type="button"
                  on:click={() => (formData.platformType = platform)}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.platformType === platform
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{platform}</span>
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
                  on:click={() =>
                    (formData.coreFeatures = toggleArrayOption(
                      formData.coreFeatures,
                      feature
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.coreFeatures.includes(feature)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.coreFeatures.includes(feature)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.coreFeatures.includes(feature)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{feature}</span>
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
                  on:click={() =>
                    (formData.advancedFeatures = toggleArrayOption(
                      formData.advancedFeatures,
                      feature
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.advancedFeatures.includes(feature)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.advancedFeatures.includes(feature)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.advancedFeatures.includes(feature)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{feature}</span>
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
                  on:click={() =>
                    (formData.integrations = toggleArrayOption(
                      formData.integrations,
                      integration
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.integrations.includes(integration)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.integrations.includes(integration)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.integrations.includes(integration)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{integration}</span>
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
                  on:click={() =>
                    (formData.designMood = toggleArrayOption(
                      formData.designMood,
                      mood.label
                    ))}
                  class="border rounded-lg overflow-hidden transition-all hover:shadow-lg
                    {formData.designMood.includes(mood.label)
                    ? 'border-accent-600 ring-2 ring-accent-600'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div class="relative h-32 overflow-hidden">
                    <img
                      src={mood.image}
                      alt={mood.label}
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                    />
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
                <label
                  class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all
                  {formData.colorPalette === palette.name
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-200'}"
                >
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
                            />
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
                        <span class="text-sm font-medium block"
                          >{palette.name}</span
                        >
                        {#if palette.description}
                          <span class="text-xs text-gray-500"
                            >{palette.description}</span
                          >
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
            <div class="space-y-2">
              {#each typographyOptions as typo}
                <label
                  class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50
                  {formData.typography === typo
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-200'}"
                >
                  <input
                    type="radio"
                    bind:group={formData.typography}
                    value={typo}
                    class="text-accent-600 focus:ring-accent-500"
                  />
                  <span class="text-sm">{typo}</span>
                </label>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Visual Style Direction
            </label>
            <div class="space-y-2">
              {#each visualStyleOptions as style}
                <label
                  class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50
                  {formData.visualStyle === style
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-200'}"
                >
                  <input
                    type="radio"
                    bind:group={formData.visualStyle}
                    value={style}
                    class="text-accent-600 focus:ring-accent-500"
                  />
                  <span class="text-sm">{style}</span>
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
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors"
              >
                <input
                  type="file"
                  accept="image/*"
                  on:change={(e) => handleFileUpload(e, "logo")}
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
                  <span class="text-xs text-gray-500"
                    >PNG, JPG, SVG up to 10MB</span
                  >
                </button>
                {#if formData.logoFile}
                  <p class="text-sm text-green-600 mt-2">
                    ✓ {formData.logoFile.name}
                  </p>
                {/if}
              </div>
            </div>

            <!-- Brand Guidelines Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Brand Guidelines / Reference Materials
              </label>
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors"
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  on:change={(e) => handleFileUpload(e, "brand")}
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
                  <span class="text-xs text-gray-500"
                    >PDF, DOC, Images up to 10MB each</span
                  >
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
              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  on:change={(e) => handleFileUpload(e, "inspiration")}
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
                  <span class="text-xs text-gray-500"
                    >Screenshots of sites you like</span
                  >
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
                  on:click={() =>
                    (formData.pageStructure = toggleArrayOption(
                      formData.pageStructure,
                      structure
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.pageStructure.includes(structure)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.pageStructure.includes(structure)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.pageStructure.includes(structure)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{structure}</span>
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
                  on:click={() =>
                    (formData.contentSections = toggleArrayOption(
                      formData.contentSections,
                      section
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.contentSections.includes(section)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.contentSections.includes(section)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.contentSections.includes(section)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{section}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label
              for="copywriting"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Copywriting
            </label>
            <textarea
              id="copywriting"
              bind:value={formData.copywriting}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Describe your preferred copywriting style..."
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Media Requirements
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each mediaRequirementOptions as requirement}
                <button
                  type="button"
                  on:click={() =>
                    (formData.mediaRequirements = toggleArrayOption(
                      formData.mediaRequirements,
                      requirement
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.mediaRequirements.includes(requirement)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.mediaRequirements.includes(requirement)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.mediaRequirements.includes(requirement)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{requirement}</span>
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
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Key Interactions *
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each keyInteractionOptions as interaction}
                <button
                  type="button"
                  on:click={() =>
                    (formData.keyInteractions = toggleArrayOption(
                      formData.keyInteractions,
                      interaction
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.keyInteractions.includes(interaction)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.keyInteractions.includes(interaction)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.keyInteractions.includes(interaction)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{interaction}</span>
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
                  on:click={() =>
                    (formData.responsiveRequirements = toggleArrayOption(
                      formData.responsiveRequirements,
                      requirement
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.responsiveRequirements.includes(requirement)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.responsiveRequirements.includes(requirement)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.responsiveRequirements.includes(requirement)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{requirement}</span>
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
                  on:click={() =>
                    (formData.performanceRequirements = toggleArrayOption(
                      formData.performanceRequirements,
                      requirement
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.performanceRequirements.includes(requirement)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.performanceRequirements.includes(requirement)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.performanceRequirements.includes(requirement)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{requirement}</span>
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
            <div class="grid md:grid-cols-2 gap-3">
              {#each hostingOptions as option}
                <button
                  type="button"
                  on:click={() => (formData.hostingPreference = option)}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.hostingPreference === option
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{option}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Domain Status *
            </label>
            <div class="grid md:grid-cols-2 gap-3">
              {#each domainOptions as option}
                <button
                  type="button"
                  on:click={() => (formData.domainStatus = option)}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.domainStatus === option
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{option}</span>
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
                  on:click={() =>
                    (formData.analyticsRequirements = toggleArrayOption(
                      formData.analyticsRequirements,
                      option
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.analyticsRequirements.includes(option)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.analyticsRequirements.includes(option)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.analyticsRequirements.includes(option)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{option}</span>
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
                  on:click={() =>
                    (formData.securityRequirements = toggleArrayOption(
                      formData.securityRequirements,
                      option
                    ))}
                  class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
                    {formData.securityRequirements.includes(option)
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <div
                    class="w-5 h-5 border rounded
                    {formData.securityRequirements.includes(option)
                      ? 'bg-accent-600 border-accent-600'
                      : 'border-gray-300'}"
                  >
                    {#if formData.securityRequirements.includes(option)}
                      <Check size={14} class="text-white" />
                    {/if}
                  </div>
                  <span class="text-sm">{option}</span>
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
                  on:click={() => (formData.timeline = timeline)}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.timeline === timeline
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
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
                  on:click={() => (formData.budgetRange = budget)}
                  class="p-4 border rounded-lg text-left transition-all
                    {formData.budgetRange === budget
                    ? 'border-accent-600 bg-accent-50'
                    : 'border-gray-300 hover:border-gray-400'}"
                >
                  <span class="font-medium">{budget}</span>
                </button>
              {/each}
            </div>
          </div>

          <div>
            <label
              for="launchDate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
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
            <label
              for="additionalRequirements"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Additional Requirements
            </label>
            <textarea
              id="additionalRequirements"
              bind:value={formData.additionalRequirements}
              rows="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              placeholder="Any additional requirements or notes..."
            />
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <div
    class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
  >
    <div>
      {#if currentStep > 0}
        <Button
          variant="outline"
          on:click={prevStep}
          class="flex items-center gap-2"
          disabled={isSubmitting}
        >
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
