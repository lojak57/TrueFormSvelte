<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check, Globe, ShoppingCart, Cloud, Image, FileText, Calendar, GraduationCap, Users, Home, UtensilsCrossed, HeartPulse, Ticket } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let formData: {
    websiteType: string;
    platformType: string;
    coreFeatures: string[];
    advancedFeatures: string[];
    integrations: string[];
  };

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

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter(item => item !== option);
    } else {
      return [...array, option];
    }
  }

  // Validation
  $: isValid = !!(formData.websiteType?.trim() && formData.platformType?.trim());

  // Emit validation state changes
  $: dispatch('validation', { isValid });
</script>

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