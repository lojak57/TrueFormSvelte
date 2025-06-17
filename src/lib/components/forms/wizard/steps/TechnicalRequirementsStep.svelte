<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let formData: {
    hostingPreference: string;
    domainStatus: string;
    analyticsRequirements: string[];
    securityRequirements: string[];
  };

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

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter(item => item !== option);
    } else {
      return [...array, option];
    }
  }

  // Validation
  $: isValid = !!(formData.hostingPreference?.trim() && formData.domainStatus?.trim());

  // Emit validation state changes
  $: dispatch('validation', { isValid });
</script>

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