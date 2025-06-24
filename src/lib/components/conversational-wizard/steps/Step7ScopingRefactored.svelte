<script lang="ts">
  import { conversationalWizard } from "../conversationalWizardStore";
  import InlineReassurance from "../reassurance/InlineReassurance.svelte";
  import AddonCard from "../components/AddonCard.svelte";
  import PriceCalculator from "../components/PriceCalculator.svelte";
  import BasePackageDisplay from "../components/BasePackageDisplay.svelte";
  import { fade, fly } from "svelte/transition";
  import {
    ShoppingCart,
    Calendar,
    Camera,
    Edit3,
    FileText,
    Users,
    Globe,
    Sparkles,
    Mail,
    PenTool,
    Database,
  } from "lucide-svelte";
  import { 
    calculateTotalPrice, 
    toggleAddonSelection, 
    isAddonSelected,
    validateAddonSelection,
    type Addon 
  } from "$lib/utils/addonCalculations";

  export let serviceParam: string | null = null;

  const basePrice = 999;
  let selectedAddons: Addon[] = [];
  let estimatedTotal = basePrice;

  // Initialize from store
  if ($conversationalWizard.data?.selectedAddons) {
    selectedAddons = [...$conversationalWizard.data.selectedAddons];
  }
  if ($conversationalWizard.data?.estimatedTotal) {
    estimatedTotal = $conversationalWizard.data.estimatedTotal;
  }

  // Addon definitions
  const addons: Addon[] = [
    {
      id: "crm",
      title: "CRM Integration",
      price: 200,
      description: "Custom-branded CRM with lead management ($49/month after launch)",
      icon: Database,
      imageBg: "from-blue-500 to-blue-700",
      iconColor: "text-white",
      benefits: ["Lead tracking", "Customer management", "Custom branding", "Monthly service: $49"],
      popular: true,
    },
    {
      id: "ecommerce",
      title: "E-commerce Store",
      price: 400,
      description: "Full online store with payment processing and inventory management",
      icon: ShoppingCart,
      imageBg: "from-green-500 to-green-700",
      iconColor: "text-white",
      benefits: ["Payment processing", "Inventory management", "Order tracking", "Customer accounts"],
    },
    {
      id: "booking",
      title: "Appointment Booking",
      price: 250,
      description: "Online booking system with calendar integration and automated reminders",
      icon: Calendar,
      imageBg: "from-purple-500 to-purple-700",
      iconColor: "text-white",
      benefits: ["Calendar integration", "Automated reminders", "Payment processing", "Customer portal"],
    },
    {
      id: "photography",
      title: "Professional Photography",
      price: 300,
      description: "On-site photography session for authentic business imagery",
      icon: Camera,
      imageBg: "from-pink-500 to-pink-700",
      iconColor: "text-white",
      benefits: ["On-site session", "20+ edited photos", "High-resolution files", "Commercial license"],
    },
    {
      id: "copywriting",
      title: "Professional Copywriting",
      price: 150,
      description: "Expert-written content for all pages, optimized for conversions",
      icon: Edit3,
      imageBg: "from-indigo-500 to-indigo-700",
      iconColor: "text-white",
      benefits: ["SEO-optimized content", "Conversion-focused", "Professional tone", "Unlimited revisions"],
    },
    {
      id: "blog",
      title: "Blog & Content System",
      price: 100,
      description: "Content management system with blog functionality and SEO tools",
      icon: FileText,
      imageBg: "from-orange-500 to-orange-700",
      iconColor: "text-white",
      benefits: ["Content management", "SEO optimization", "Social sharing", "Analytics integration"],
    },
    {
      id: "team",
      title: "Team Profiles",
      price: 75,
      description: "Dedicated team/staff pages with individual profiles and bios",
      icon: Users,
      imageBg: "from-teal-500 to-teal-700",
      iconColor: "text-white",
      benefits: ["Individual profiles", "Photo galleries", "Contact information", "Role descriptions"],
    },
    {
      id: "multilingual",
      title: "Multi-language Support",
      price: 200,
      description: "Complete website translation and language switching functionality",
      icon: Globe,
      imageBg: "from-red-500 to-red-700",
      iconColor: "text-white",
      benefits: ["Multiple languages", "Language switcher", "Cultural adaptation", "SEO for each language"],
    },
    {
      id: "premium_design",
      title: "Premium Design Package",
      price: 300,
      description: "Advanced animations, custom graphics, and premium visual elements",
      icon: Sparkles,
      imageBg: "from-yellow-500 to-yellow-700",
      iconColor: "text-white",
      benefits: ["Custom animations", "Premium graphics", "Advanced layouts", "Unique visual elements"],
    },
    {
      id: "email",
      title: "Email Marketing Setup",
      price: 125,
      description: "Professional email marketing system with automated sequences",
      icon: Mail,
      imageBg: "from-cyan-500 to-cyan-700",
      iconColor: "text-white",
      benefits: ["Email automation", "Subscriber management", "Campaign analytics", "Template design"],
    },
  ];

  // Handle addon toggle
  function handleAddonToggle(event: CustomEvent) {
    const addon = event.detail;
    selectedAddons = toggleAddonSelection(selectedAddons, addon);
    
    // Update store
    conversationalWizard.updateData({ 
      selectedAddons,
      estimatedTotal: calculateTotalPrice(basePrice, selectedAddons).estimatedTotal
    });
  }

  // Handle price calculator updates
  function handleTotalUpdate(event: CustomEvent) {
    const { estimatedTotal: newTotal, selectedAddons: newAddons } = event.detail;
    estimatedTotal = newTotal;
    
    // Update store
    conversationalWizard.updateData({ 
      selectedAddons: newAddons,
      estimatedTotal: newTotal
    });
  }

  // Pre-select addon based on service parameter
  if (serviceParam && !selectedAddons.length) {
    const serviceAddonMap: Record<string, string> = {
      "ecommerce": "ecommerce",
      "booking": "booking", 
      "portfolio": "photography",
      "blog": "blog"
    };
    
    const addonId = serviceAddonMap[serviceParam];
    if (addonId) {
      const addon = addons.find(a => a.id === addonId);
      if (addon) {
        selectedAddons = [addon];
        conversationalWizard.updateData({ selectedAddons });
      }
    }
  }

  // Get validation info
  $: validationResult = validateAddonSelection(selectedAddons);
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
  <!-- Header Section -->
  <div class="text-center mb-8" in:fade={{ duration: 600 }}>
    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Customize Your Website Package
    </h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
      Choose the features that will help your business succeed online. 
      Each addon is professionally integrated into your website.
    </p>
  </div>

  <div class="grid lg:grid-cols-3 gap-8">
    <!-- Addons Grid (Left Column) -->
    <div class="lg:col-span-2">
      <!-- Base Package Display -->
      <BasePackageDisplay {basePrice} />

      <!-- Validation Messages -->
      {#if validationResult.warnings.length > 0}
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-yellow-800 mb-2">Compatibility Notes:</h4>
          {#each validationResult.warnings as warning}
            <p class="text-sm text-yellow-700">{warning}</p>
          {/each}
        </div>
      {/if}

      {#if validationResult.recommendations.length > 0}
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-blue-800 mb-2">Recommendations:</h4>
          {#each validationResult.recommendations as recommendation}
            <p class="text-sm text-blue-700">{recommendation}</p>
          {/each}
        </div>
      {/if}

      <!-- Addons Grid -->
      <div class="space-y-4 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Available Add-ons</h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          {#each addons as addon, index}
            <div in:fly={{ duration: 400, delay: index * 50, y: 20 }}>
              <AddonCard 
                {addon}
                isSelected={isAddonSelected(selectedAddons, addon.id)}
                on:toggle={handleAddonToggle}
              />
            </div>
          {/each}
        </div>
      </div>

      <!-- Reassurance -->
      <div class="mt-8">
        <InlineReassurance />
      </div>
    </div>

    <!-- Price Calculator (Right Column) -->
    <div class="lg:col-span-1">
      <PriceCalculator 
        {basePrice}
        {selectedAddons}
        {estimatedTotal}
        on:totalUpdate={handleTotalUpdate}
      />
    </div>
  </div>
</div>