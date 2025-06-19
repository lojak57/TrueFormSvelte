<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  import { ShoppingCart, Calendar, Camera, Edit3, FileText, Users, Globe, Sparkles, Mail, PenTool, Database } from 'lucide-svelte';
  
  let selectedAddons = [];
  const basePrice = 999;
  let estimatedTotal = basePrice;
  
  // Initialize from store only once
  if ($conversationalWizard.data?.selectedAddons) {
    selectedAddons = [...$conversationalWizard.data.selectedAddons];
  }
  if ($conversationalWizard.data?.estimatedTotal) {
    estimatedTotal = $conversationalWizard.data.estimatedTotal;
  }
  
  const addons = [
    {
      id: 'crm',
      title: 'CRM Integration',
      price: 200,
      description: 'Custom-branded CRM with lead management ($49/month after launch)',
      icon: Database,
      imageBg: 'from-blue-500 to-blue-700',
      iconColor: 'text-white',
      benefits: ['Lead tracking', 'Customer management', 'Custom branding', 'Monthly service: $49'],
      popular: true
    },
    {
      id: 'ecommerce',
      title: 'eCommerce (Lite)',
      price: 200,
      description: 'Up to 50 products, Stripe integration, simple shop flow',
      icon: ShoppingCart,
      imageBg: 'from-green-400 to-green-600',
      iconColor: 'text-white',
      benefits: ['Product catalog', 'Secure checkout', 'Inventory tracking', 'Order management']
    },
    {
      id: 'booking',
      title: 'Booking / Scheduling',
      price: 200,
      description: 'Perfect for photographers, stylists, trainers',
      icon: Calendar,
      imageBg: 'from-blue-400 to-blue-600',
      iconColor: 'text-white',
      benefits: ['Calendar integration', 'Automated reminders', 'Payment collection', 'Client management']
    },
    {
      id: 'portfolio',
      title: 'Portfolio Builder',
      price: 150,
      description: 'Grid, categories, filters, high-res images',
      icon: Camera,
      imageBg: 'from-purple-400 to-purple-600',
      iconColor: 'text-white',
      benefits: ['Image galleries', 'Category filters', 'Lightbox viewing', 'Mobile optimized']
    },
    {
      id: 'blog',
      title: 'Blog Setup',
      price: 100,
      description: 'Styled blog + SEO basics built-in',
      icon: Edit3,
      imageBg: 'from-orange-400 to-orange-600',
      iconColor: 'text-white',
      benefits: ['SEO optimized', 'Easy publishing', 'Comment system', 'Social sharing']
    },
    {
      id: 'forms',
      title: 'Custom Forms / Intake',
      price: 100,
      description: 'Contact, lead gen, quote request forms',
      icon: FileText,
      imageBg: 'from-teal-400 to-teal-600',
      iconColor: 'text-white',
      benefits: ['Custom fields', 'Email notifications', 'Data export', 'Spam protection']
    },
    {
      id: 'portal',
      title: 'Client Portal',
      price: 300,
      description: 'Login area + gated pages for contractors, artists',
      icon: Users,
      imageBg: 'from-indigo-400 to-indigo-600',
      iconColor: 'text-white',
      benefits: ['Secure login', 'Document sharing', 'Progress tracking', 'Client dashboard']
    },
    {
      id: 'service-pages',
      title: 'Service Page Generator',
      price: 100,
      description: 'Pre-scaffolded dynamic service pages for SEO',
      icon: Globe,
      imageBg: 'from-pink-400 to-pink-600',
      iconColor: 'text-white',
      benefits: ['SEO templates', 'Dynamic content', 'Local search', 'Service listings']
    },
    {
      id: 'animations',
      title: 'Premium Animation',
      price: 150,
      description: 'Parallax, transitions, hover effects',
      icon: Sparkles,
      imageBg: 'from-yellow-400 to-yellow-600',
      iconColor: 'text-white',
      benefits: ['Scroll animations', 'Hover effects', 'Loading transitions', 'Interactive elements']
    },
    {
      id: 'domain-email',
      title: 'Domain + Email Setup',
      price: 100,
      description: 'We set up your DNS, domain, and business email',
      icon: Mail,
      imageBg: 'from-red-400 to-red-600',
      iconColor: 'text-white',
      benefits: ['Professional email', 'DNS configuration', 'Domain setup', 'Email forwarding']
    },
    {
      id: 'copywriting',
      title: 'Copywriting Polish',
      price: 200,
      description: 'Human-written blurbs, taglines, CTAs',
      icon: PenTool,
      imageBg: 'from-emerald-400 to-emerald-600',
      iconColor: 'text-white',
      benefits: ['Professional copy', 'Brand voice', 'SEO content', 'Call-to-actions']
    }
  ];
  
  function toggleAddon(addonId: string) {
    if (selectedAddons.includes(addonId)) {
      selectedAddons = selectedAddons.filter(id => id !== addonId);
    } else {
      selectedAddons = [...selectedAddons, addonId];
    }
    
    // Calculate new total
    const addonTotal = selectedAddons.reduce((total, id) => {
      const addon = addons.find(a => a.id === id);
      return total + (addon ? addon.price : 0);
    }, 0);
    
    estimatedTotal = basePrice + addonTotal;
    
    // Update store immediately but prevent re-rendering
    conversationalWizard.updateData({ 
      selectedAddons, 
      estimatedTotal 
    });
  }
  
  function continueToReview() {
    conversationalWizard.nextStep();
  }
  
  function goBack() {
    conversationalWizard.prevStep();
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  <div in:fly={{ y: 30, duration: 500 }}>
    <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
      Let's scope your project & add-ons
    </h2>
    
    <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
      Start with our base package, then pick what makes sense for your business.
    </p>
    
    <!-- Base Package -->
    <div class="base-package" in:fly={{ y: 30, duration: 500, delay: 400 }}>
      <div class="base-header" in:fade={{ duration: 400, delay: 500 }}>
        <h3>BASE PACKAGE — $999</h3>
        <p>Everything you need to launch strong.</p>
      </div>
      
      <div class="base-features" in:fade={{ duration: 500, delay: 600 }}>
        <div class="feature-grid">
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 700 }}>✅ Design Discovery Wizard</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 750 }}>✅ Custom Homepage</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 800 }}>✅ 2–3 Supporting Pages</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 850 }}>✅ Mobile Responsive</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 900 }}>✅ Visual CMS</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 950 }}>✅ One-on-One Revision</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 1000 }}>✅ Hosting + SSL (1 year)</div>
          <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 1050 }}>✅ Designer Support (24hr)</div>
        </div>
      </div>
    </div>
    
    <!-- Add-ons Grid -->
    <div class="addons-section" in:fly={{ y: 30, duration: 500, delay: 1100 }}>
      <h3 class="addons-title" in:fade={{ duration: 400, delay: 1200 }}>🧩 ADD-ONS (Optional, Flat-Rate)</h3>
      <p class="addons-subtitle" in:fade={{ duration: 400, delay: 1300 }}>
        These are modules, not mystery line items. Pick like you're at a menu.
      </p>
      
      <div class="addons-grid">
        {#each addons as addon, i}
          <div 
            class="addon-card"
            class:selected={selectedAddons.includes(addon.id)}
            in:fly={{ y: 30, duration: 400, delay: 1400 + (i * 80) }}
          >
            <!-- Visual Header -->
            <div class="addon-visual bg-gradient-to-br {addon.imageBg}">
              <svelte:component this={addon.icon} size={32} class={addon.iconColor} />
              {#if addon.popular}
                <div class="popular-badge">POPULAR</div>
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
                on:click={() => toggleAddon(addon.id)}
              >
                {selectedAddons.includes(addon.id) ? '✓ Added' : '+ Add This'}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Pricing Summary -->
    <div class="pricing-summary" in:fly={{ y: 30, duration: 500, delay: 2200 }}>
      <div class="pricing-content" in:fade={{ duration: 400, delay: 2400 }}>
        <div class="pricing-breakdown">
          <div class="pricing-line" in:fly={{ x: -20, duration: 300, delay: 2500 }}>
            <span>Base Package</span>
            <span>${basePrice}</span>
          </div>
          {#each selectedAddons as addonId}
            {@const addon = addons.find(a => a.id === addonId)}
            {#if addon}
              <div class="pricing-line addon-line" in:fly={{ x: -20, duration: 300, delay: 2600 }}>
                <span>{addon.title}</span>
                <span>+${addon.price}</span>
              </div>
            {/if}
          {/each}
          <div class="pricing-total" in:fly={{ x: -20, duration: 400, delay: 2700 }}>
            <span>Estimated Project Total</span>
            <span>${estimatedTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <p class="pricing-note" in:fade={{ duration: 400, delay: 2800 }}>
          Nothing is final—you'll review everything with a designer.
        </p>
        
        <p class="pricing-anchor" in:fade={{ duration: 400, delay: 2900 }}>
          <strong>Most clients add CRM Integration and land between $1,200 and $1,500.</strong><br>
          <span class="text-sm text-gray-500">
            Compare to dev firms: $5,000+ • DIY builders: $684/yr + your time • CRM monthly: $49
          </span>
        </p>
      </div>
    </div>
    
    <InlineReassurance 
      text="Don't worry about getting it perfect—we can adjust everything during our design call."
      delay={3000}
    />
    
    <!-- Navigation -->
    <div class="step-navigation" in:fade={{ duration: 400, delay: 3200 }}>
      <button on:click={goBack} class="back-button">
        ← Back
      </button>
      
      <button on:click={continueToReview} class="continue-button">
        Continue to Review →
      </button>
    </div>
  </div>
</div>

<style>
  .step-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    height: auto;
    min-height: auto;
  }
  
  .step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .step-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  /* Base Package */
  .base-package {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 3rem;
  }
  
  .base-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .base-header p {
    opacity: 0.9;
    margin-bottom: 1.5rem;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }
  
  .feature-item {
    font-size: 0.875rem;
    opacity: 0.95;
  }
  
  /* Add-ons Section */
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
  
  /* Pricing Summary */
  .pricing-summary {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .pricing-breakdown {
    margin-bottom: 1rem;
  }
  
  .pricing-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .addon-line {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .pricing-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0 0.5rem 0;
    border-top: 2px solid #3b82f6;
    margin-top: 1rem;
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }
  
  .pricing-note {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .pricing-anchor {
    text-align: center;
    font-size: 0.875rem;
    color: #111827;
  }
  
  /* Navigation */
  .step-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
  }
  
  .back-button {
    color: #6b7280;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .back-button:hover {
    color: #374151;
    background-color: #f3f4f6;
  }
  
  .continue-button {
    background: #3b82f6;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .continue-button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
  
  @media (max-width: 640px) {
    .step-container {
      padding: 1rem;
    }
    
    .step-title {
      font-size: 1.5rem;
    }
    
    .addons-grid {
      grid-template-columns: 1fr;
    }
    
    .base-package {
      padding: 1.5rem;
    }
    
    .feature-grid {
      grid-template-columns: 1fr;
    }
    
    .step-navigation {
      flex-direction: column;
      gap: 1rem;
    }
    
    .continue-button {
      width: 100%;
    }
  }
</style>