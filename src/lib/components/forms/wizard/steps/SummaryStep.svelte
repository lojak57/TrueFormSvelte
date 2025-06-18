<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { wizardStore } from "../stores/wizardStore";
  import { Check, Edit2, Send, Sparkles, CreditCard } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  // Get all answers
  $: answers = $wizardStore.answers;

  // Pricing configuration (same as in PricingMeter)
  const PRICING_MODEL = {
    base: 999,
    includedFeatures: 6,
    addOnCosts: {
      blog: 100, // Blog/News
      chat: 50, // Live Chat
      members: 250, // Customer Portal
      newsletter: 200, // Email Newsletter
      multilang: 200, // Multi-language Support
      mobile: 500, // Custom Application (will be enterprise)
      rushDelivery: 150, // Rush delivery for timeline
      brandGuide: 300,
      advancedAnalytics: 150,
      emailMarketing: 200,
      membershipSystem: 350,
      advancedSEO: 150,
    },
  };

  // Enterprise features that trigger custom quote
  const ENTERPRISE_FEATURES = [
    "mobile", // Custom Application - this should trigger enterprise immediately
    "multiUser",
    "advancedAnalytics",
    "apiIntegration",
    "customIntegrations",
    "enterpriseSecurity",
    "whiteLabelSolution",
  ];

  // Feature mapping
  const FEATURE_TO_ADDON: Record<string, string> = {
    members: "members",
    multilang: "multilang",
    blog: "blog",
    chat: "chat",
    mobile: "mobile", // This will be enterprise
    newsletter: "newsletter",
  };

  // Feature ID to display name mapping
  const FEATURE_DISPLAY_NAMES: Record<string, string> = {
    mobile: "Custom Application",
    members: "Customer Portal",
    multilang: "Multi-language Support",
    blog: "Blog/News",
    chat: "Live Chat",
    newsletter: "Email Newsletter",
    analytics: "Analytics Dashboard",
    booking: "Appointment Booking",
    payment: "Payment Processing",
    contact: "Contact Forms",
    gallery: "Photo Gallery",
    seo: "SEO Optimization",
    social: "Social Media Integration",
    search: "Search Functionality",
    rushDelivery: "Rush Delivery",
  };

  // Calculate pricing
  $: calculatePricing = () => {
    const features = answers.coreFeatures || [];
    const timeline = answers.timeline || "";

    // Check for enterprise features
    const hasEnterpriseFeatures = features.some((feature: string) =>
      ENTERPRISE_FEATURES.includes(feature)
    );

    if (hasEnterpriseFeatures) {
      return {
        isEnterprise: true,
        total: 0,
        addOns: [],
        monthlyPayment: 0,
        enterpriseFeatures: features.filter((f: string) =>
          ENTERPRISE_FEATURES.includes(f)
        ),
      };
    }

    let addOns: Array<{ name: string; price: number }> = [];
    let total = PRICING_MODEL.base;

    // Count base features (first 6 are included)
    const baseFeatures = features.filter(
      (f: string) => !PRICING_MODEL.addOnCosts[f]
    );
    const premiumFeatures = features.filter(
      (f: string) => PRICING_MODEL.addOnCosts[f]
    );

    // Add premium feature costs
    premiumFeatures.forEach((feature: string) => {
      if (PRICING_MODEL.addOnCosts[feature]) {
        const price = PRICING_MODEL.addOnCosts[feature];
        addOns.push({ name: feature, price });
        total += price;
      }
    });

    // Check for rush delivery
    if (timeline === "asap") {
      addOns.push({
        name: "rushDelivery",
        price: PRICING_MODEL.addOnCosts.rushDelivery,
      });
      total += PRICING_MODEL.addOnCosts.rushDelivery;
    }

    return {
      isEnterprise: false,
      total,
      addOns,
      monthlyPayment: Math.ceil(total / 12),
    };
  };

  $: pricing = calculatePricing();

  // Format display values
  function formatValue(key: string, value: any): string {
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // Special formatting for specific fields
    switch (key) {
      case "timeline":
        const timelineMap: Record<string, string> = {
          asap: "ASAP",
          "1month": "Within 1 month",
          "2-3months": "2-3 months",
          "3-6months": "3-6 months",
          flexible: "Flexible timeline",
        };
        return timelineMap[value] || value;

      case "typography":
        const typographyMap: Record<string, string> = {
          "sans-serif": "Clean & Modern Sans-serif",
          serif: "Professional Serif",
          display: "Creative Display Fonts",
          mono: "Tech/Code-inspired",
          script: "Handwritten/Script",
          bold: "Bold & Impactful",
          custom: "Let You Choose",
        };
        return typographyMap[value] || value;

      case "brandingAssets":
        if (typeof value === "object" && value.hasBrandAssets) {
          if (value.hasBrandAssets === "yes") {
            const fileCount = value.files?.length || 0;
            return `Yes - ${fileCount} file${
              fileCount !== 1 ? "s" : ""
            } uploaded`;
          } else {
            return "No - Need help creating brand materials";
          }
        }
        return "Not specified";

      default:
        return value || "Not specified";
    }
  }

  function handleSubmit() {
    dispatch("complete");
  }

  function editStep(stepIndex: number) {
    wizardStore.goToStep(stepIndex);
  }

  const sections = [
    {
      title: "Contact Information",
      fields: [
        { key: "companyName", label: "Company", stepIndex: 1 },
        { key: "contactName", label: "Contact Name", stepIndex: 2 },
        { key: "contactEmail", label: "Email", stepIndex: 3 },
      ],
    },
    {
      title: "Project Details",
      fields: [
        { key: "industry", label: "Industry", stepIndex: 4 },
        { key: "projectDescription", label: "Description", stepIndex: 5 },
        { key: "primaryGoals", label: "Primary Goal", stepIndex: 6 },
        { key: "targetAudience", label: "Target Audience", stepIndex: 7 },
      ],
    },
    {
      title: "Website Specifications",
      fields: [
        { key: "websiteType", label: "Website Type", stepIndex: 8 },
        { key: "coreFeatures", label: "Features", stepIndex: 9 },
      ],
    },
    {
      title: "Design Preferences",
      fields: [
        { key: "designMood", label: "Design Mood", stepIndex: 10 },
        { key: "typography", label: "Typography", stepIndex: 11 },
        { key: "colorPalette", label: "Colors", stepIndex: 12 },
        { key: "brandingAssets", label: "Brand Materials", stepIndex: 13 },
      ],
    },
    {
      title: "Planning",
      fields: [
        { key: "timeline", label: "Timeline", stepIndex: 14 },
        { key: "additionalInfo", label: "Additional Info", stepIndex: 15 },
      ],
    },
  ];
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <div
      class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
    >
      <Check size={32} class="text-green-600" />
    </div>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">
      Great! Let's review your project
    </h2>
    <p class="text-gray-600">
      Take a moment to review your information. You can edit any section before
      submitting.
    </p>
  </div>

  <!-- Summary Sections -->
  <div class="space-y-6">
    {#each sections as section}
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="font-semibold text-gray-900 mb-4">{section.title}</h3>
        <div class="space-y-3">
          {#each section.fields as field}
            {#if answers[field.key] !== undefined && answers[field.key] !== ""}
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="text-sm text-gray-600">{field.label}</p>
                  <p class="text-gray-900 mt-1">
                    {formatValue(field.key, answers[field.key])}
                  </p>
                </div>
                <button
                  on:click={() => editStep(field.stepIndex)}
                  class="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                  aria-label="Edit {field.label}"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <!-- Pricing Summary -->
  <div
    class="bg-gradient-to-r from-accent-50 to-orange-50 rounded-xl p-6 border border-accent-200"
  >
    <div class="flex items-center gap-2 mb-4">
      <Sparkles size={20} class="text-accent-600" />
      <h3 class="font-semibold text-gray-900">Your Investment</h3>
    </div>

    {#if pricing.isEnterprise}
      <!-- Enterprise Custom Quote -->
      <div class="space-y-4">
        <div class="text-center py-6">
          <div class="text-3xl font-bold text-purple-600 mb-2">
            Custom Quote
          </div>
          <p class="text-gray-600 mb-4">
            Enterprise features require tailored pricing
          </p>

          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-medium text-purple-800 mb-2">
              Enterprise Features Selected:
            </p>
            <div class="flex flex-wrap gap-2">
              {#each pricing.enterpriseFeatures as feature}
                <span
                  class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                >
                  {FEATURE_DISPLAY_NAMES[feature] || feature}
                </span>
              {/each}
            </div>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <CreditCard size={16} class="text-blue-600 mt-0.5" />
            <div class="text-sm text-blue-800">
              <p class="font-medium">Custom Proposal Process</p>
              <p>
                We'll analyze your requirements and provide a detailed proposal
                within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- Standard Pricing -->
      <div class="space-y-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-900">TrueForm Website Package</p>
            <p class="text-sm text-gray-600">
              Includes up to 6 features, 10 pages, and more
            </p>
          </div>
          <p class="font-semibold text-gray-900">${PRICING_MODEL.base}</p>
        </div>

        <!-- Add-ons if any -->
        {#if pricing.addOns.length > 0}
          <div class="border-t pt-3 space-y-2">
            <p class="text-sm font-medium text-gray-700">Premium Add-ons:</p>
            {#each pricing.addOns as addon}
              <div class="flex justify-between items-center pl-4">
                <p class="text-sm text-gray-600">
                  {FEATURE_DISPLAY_NAMES[addon.name] || addon.name}
                </p>
                <p class="text-sm font-medium text-gray-700">+${addon.price}</p>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Total -->
        <div class="border-t pt-3">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold text-lg text-gray-900">Total Investment</p>
              <p class="text-sm text-gray-600">
                or ${pricing.monthlyPayment}/month with Klarna
              </p>
            </div>
            <p class="text-2xl font-bold text-accent-600">${pricing.total}</p>
          </div>
        </div>
      </div>

      <!-- Payment Note -->
      <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start gap-2">
          <CreditCard size={16} class="text-blue-600 mt-0.5" />
          <div class="text-sm text-blue-800">
            <p class="font-medium">No payment today!</p>
            <p>You'll only be charged after you approve the final design.</p>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Submit Button -->
  <div class="pt-6 border-t">
    <button
      on:click={handleSubmit}
      disabled={$wizardStore.isSubmitting}
      class="w-full flex items-center justify-center gap-3 px-8 py-4 bg-accent-600 text-white text-lg rounded-xl hover:bg-accent-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
    >
      {#if $wizardStore.isSubmitting}
        <div
          class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
        />
        Submitting...
      {:else if $wizardStore.isSuccess}
        <Check size={24} />
        Submitted Successfully!
      {:else}
        <Send size={24} />
        Submit Your Project Request
      {/if}
    </button>

    <p class="text-sm text-gray-500 text-center mt-4">
      {#if $wizardStore.isSubmitting}
        Please wait while we process your request...
      {:else if $wizardStore.isSuccess}
        Thank you! We'll be in touch within 24 hours.
      {:else}
        By submitting, you agree to our terms and privacy policy. We'll contact
        you within 24 hours.
      {/if}
    </p>
  </div>
</div>
