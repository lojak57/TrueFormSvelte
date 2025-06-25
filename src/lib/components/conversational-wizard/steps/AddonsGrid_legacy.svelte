<script lang="ts">
  import { fly } from "svelte/transition";
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

  export let selectedAddons: string[] = [];
  export let serviceParam: string | null = null;
  export let onToggleAddon: (addonId: string) => void;

  const addons = [
    {
      id: "crm",
      title: "CRM Integration",
      price: 200,
      description:
        "Custom-branded CRM with lead management ($49/month after launch)",
      icon: Database,
      imageBg: "from-blue-500 to-blue-700",
      iconColor: "text-white",
      benefits: [
        "Lead tracking",
        "Customer management",
        "Custom branding",
        "Monthly service: $49",
      ],
      popular: true,
    },
    {
      id: "ecommerce",
      title: "eCommerce (Lite)",
      price: 200,
      description: "Up to 50 products, Stripe integration, simple shop flow",
      icon: ShoppingCart,
      imageBg: "from-green-400 to-green-600",
      iconColor: "text-white",
      benefits: [
        "Product catalog",
        "Secure checkout",
        "Inventory tracking",
        "Order management",
      ],
    },
    {
      id: "booking",
      title: "Booking / Scheduling",
      price: 200,
      description: "Perfect for photographers, stylists, trainers",
      icon: Calendar,
      imageBg: "from-blue-400 to-blue-600",
      iconColor: "text-white",
      benefits: [
        "Calendar integration",
        "Automated reminders",
        "Payment collection",
        "Client management",
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio Builder",
      price: 150,
      description: "Grid, categories, filters, high-res images",
      icon: Camera,
      imageBg: "from-purple-400 to-purple-600",
      iconColor: "text-white",
      benefits: [
        "Image galleries",
        "Category filters",
        "Lightbox viewing",
        "Mobile optimized",
      ],
    },
    {
      id: "blog",
      title: "Blog Setup",
      price: 100,
      description: "Styled blog + SEO basics built-in",
      icon: Edit3,
      imageBg: "from-orange-400 to-orange-600",
      iconColor: "text-white",
      benefits: [
        "SEO optimized",
        "Easy publishing",
        "Comment system",
        "Social sharing",
      ],
    },
    {
      id: "forms",
      title: "Custom Forms / Intake",
      price: 100,
      description: "Contact, lead gen, quote request forms",
      icon: FileText,
      imageBg: "from-teal-400 to-teal-600",
      iconColor: "text-white",
      benefits: [
        "Custom fields",
        "Email notifications",
        "Data export",
        "Spam protection",
      ],
    },
    {
      id: "portal",
      title: "Client Portal",
      price: 300,
      description: "Login area + gated pages for contractors, artists",
      icon: Users,
      imageBg: "from-indigo-400 to-indigo-600",
      iconColor: "text-white",
      benefits: [
        "Secure login",
        "Document sharing",
        "Progress tracking",
        "Client dashboard",
      ],
    },
    {
      id: "service-pages",
      title: "Service Page Generator",
      price: 100,
      description: "Pre-scaffolded dynamic service pages for SEO",
      icon: Globe,
      imageBg: "from-pink-400 to-pink-600",
      iconColor: "text-white",
      benefits: [
        "SEO templates",
        "Dynamic content",
        "Local search",
        "Service listings",
      ],
    },
    {
      id: "animations",
      title: "Premium Animation",
      price: 150,
      description: "Parallax, transitions, hover effects",
      icon: Sparkles,
      imageBg: "from-yellow-400 to-yellow-600",
      iconColor: "text-white",
      benefits: [
        "Scroll animations",
        "Hover effects",
        "Loading transitions",
        "Interactive elements",
      ],
    },
    {
      id: "domain-email",
      title: "Domain + Email Setup",
      price: 100,
      description: "We set up your DNS, domain, and business email",
      icon: Mail,
      imageBg: "from-red-400 to-red-600",
      iconColor: "text-white",
      benefits: [
        "Professional email",
        "DNS configuration",
        "Domain setup",
        "Email forwarding",
      ],
    },
    {
      id: "copywriting",
      title: "Copywriting Polish",
      price: 200,
      description: "Human-written blurbs, taglines, CTAs",
      icon: PenTool,
      imageBg: "from-emerald-400 to-emerald-600",
      iconColor: "text-white",
      benefits: [
        "Professional copy",
        "Brand voice",
        "SEO content",
        "Call-to-actions",
      ],
    },
  ];

  // Service-specific required add-ons
  const serviceRequirements: Record<string, string[]> = {
    membership: ["crm"],
    realestate: ["crm"],
    education: ["crm"],
    ecommerce: ["ecommerce"],
    booking: ["booking"],
  };

  // Service-specific recommendations
  const serviceRecommendations: Record<string, string[]> = {
    marketing: ["crm", "copywriting"],
    ecommerce: ["crm", "seo"],
    booking: ["crm", "domain-email"],
    membership: ["social-media", "domain-email"],
    realestate: ["social-media", "seo", "domain-email"],
    education: ["social-media", "copywriting"],
  };

  function handleToggleAddon(addonId: string) {
    // Prevent deselecting required add-ons
    if (serviceParam && serviceRequirements[serviceParam]?.includes(addonId)) {
      return;
    }
    onToggleAddon(addonId);
  }
</script>

<div class="addons-section" in:fly={{ y: 30, duration: 500, delay: 1100 }}>
  <h3 class="addons-title" in:fly={{ y: 20, duration: 400, delay: 1200 }}>
    🧩 ADD-ONS (Optional, Flat-Rate)
  </h3>
  <p class="addons-subtitle" in:fly={{ y: 20, duration: 400, delay: 1300 }}>
    These are modules, not mystery line items. Pick like you're at a menu.
  </p>

  <div class="addons-grid">
    {#each addons as addon, i}
      {@const isRequired =
        serviceParam && serviceRequirements[serviceParam]?.includes(addon.id)}
      {@const isRecommended =
        serviceParam &&
        serviceRecommendations[serviceParam]?.includes(addon.id)}
      <div
        class="addon-card"
        class:selected={selectedAddons.includes(addon.id)}
        class:required={isRequired}
        class:recommended={isRecommended}
        in:fly={{ y: 30, duration: 400, delay: 1400 + i * 80 }}
      >
        <!-- Visual Header -->
        <div class="addon-visual bg-gradient-to-br {addon.imageBg}">
          <svelte:component
            this={addon.icon}
            size={32}
            class={addon.iconColor}
          />
          {#if isRequired}
            <div class="required-badge">REQUIRED</div>
          {:else if addon.popular || isRecommended}
            <div class="popular-badge">
              {isRecommended ? "RECOMMENDED" : "POPULAR"}
            </div>
          {/if}
        </div>

        <!-- Content -->
        <div class="addon-content">
          <div class="addon-header">
            <h4>{addon.title}</h4>
            <span class="addon-price">${addon.price}</span>
          </div>

          <p class="addon-description">{addon.description}</p>

          <ul class="addon-benefits">
            {#each addon.benefits as benefit}
              <li>{benefit}</li>
            {/each}
          </ul>

          <button
            class="addon-toggle"
            class:selected={selectedAddons.includes(addon.id)}
            class:disabled={isRequired}
            on:click={() => handleToggleAddon(addon.id)}
          >
            {#if isRequired}
              ✓ Required
            {:else if selectedAddons.includes(addon.id)}
              ✓ Added
            {:else}
              + Add This
            {/if}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .addons-section {
    margin-bottom: 3rem;
  }

  .addons-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .addons-subtitle {
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .addons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .addon-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .addon-card:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .addon-card.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .addon-visual {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .popular-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #1d4ed8;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .required-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.95);
    color: #dc2626;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .addon-card.required {
    border: 2px solid #ef4444;
    box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.1);
  }

  .addon-card.recommended {
    border: 2px solid #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
    }
    50% {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  }

  .addon-toggle.disabled {
    background: #6b7280;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .addon-toggle.disabled:hover {
    background: #6b7280;
    transform: none;
  }

  .addon-content {
    padding: 1.5rem;
  }

  .addon-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .addon-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .addon-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #3b82f6;
  }

  .addon-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .addon-benefits {
    list-style: none;
    padding: 0;
    margin: 0 0 1.5rem 0;
  }

  .addon-benefits li {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
    position: relative;
    padding-left: 1rem;
  }

  .addon-benefits li::before {
    content: "•";
    color: #3b82f6;
    position: absolute;
    left: 0;
  }

  .addon-toggle {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    color: #374151;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
  }

  .addon-toggle:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }

  .addon-toggle.selected {
    border-color: #3b82f6;
    background: #3b82f6;
    color: white;
  }

  @media (max-width: 640px) {
    .addons-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
