<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Check } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let formData: {
    userJourney: string;
    keyInteractions: string[];
    responsiveRequirements: string[];
    performanceRequirements: string[];
  };

  const keyInteractionOptions = [
    {
      name: "Contact Form Submissions",
      icon: "📧",
      description: "Lead capture and inquiries",
    },
    {
      name: "Product Purchases",
      icon: "🛒",
      description: "E-commerce transactions",
    },
    {
      name: "Service Bookings",
      icon: "📅",
      description: "Appointment scheduling",
    },
    {
      name: "Newsletter Signups",
      icon: "📮",
      description: "Email list building",
    },
    {
      name: "Content Downloads",
      icon: "📥",
      description: "Resource downloads",
    },
    { name: "User Registration", icon: "👤", description: "Account creation" },
    { name: "Social Sharing", icon: "📱", description: "Content sharing" },
    {
      name: "Live Chat Engagement",
      icon: "💬",
      description: "Real-time support",
    },
  ];

  const responsiveRequirements = [
    {
      name: "Mobile-first Design",
      icon: "📱",
      description: "Optimized for mobile devices",
    },
    {
      name: "Tablet Optimization",
      icon: "📱",
      description: "Perfect tablet experience",
    },
    {
      name: "Desktop Experience",
      icon: "💻",
      description: "Full desktop functionality",
    },
    {
      name: "Touch-friendly Interface",
      icon: "👆",
      description: "Easy touch interactions",
    },
    {
      name: "Fast Mobile Loading",
      icon: "⚡",
      description: "Quick mobile performance",
    },
    {
      name: "App-like Mobile Experience",
      icon: "📲",
      description: "Native app feel",
    },
  ];

  const performanceRequirements = [
    {
      name: "Lightning Fast Loading",
      icon: "⚡",
      description: "Sub-3 second load times",
    },
    {
      name: "SEO Optimization",
      icon: "🔍",
      description: "Search engine friendly",
    },
    {
      name: "Accessibility Compliance",
      icon: "♿",
      description: "WCAG accessibility standards",
    },
    {
      name: "Security Features",
      icon: "🔒",
      description: "Data protection and security",
    },
    {
      name: "Scalability Planning",
      icon: "📈",
      description: "Growth-ready architecture",
    },
    {
      name: "Browser Compatibility",
      icon: "🌐",
      description: "Works across all browsers",
    },
    {
      name: "Performance Monitoring",
      icon: "📊",
      description: "Real-time performance tracking",
    },
  ];

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter((item) => item !== option);
    } else {
      return [...array, option];
    }
  }

  // Validation
  $: isValid = !!formData.userJourney?.trim();

  // Emit validation state changes
  $: dispatch("validation", { isValid });
</script>

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
              interaction.name
            ))}
          class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
            {formData.keyInteractions.includes(interaction.name)
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <div
            class="w-5 h-5 border rounded mt-0.5
            {formData.keyInteractions.includes(interaction.name)
              ? 'bg-accent-600 border-accent-600'
              : 'border-gray-300'}"
          >
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
          on:click={() =>
            (formData.responsiveRequirements = toggleArrayOption(
              formData.responsiveRequirements,
              requirement.name
            ))}
          class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
            {formData.responsiveRequirements.includes(requirement.name)
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <div
            class="w-5 h-5 border rounded mt-0.5
            {formData.responsiveRequirements.includes(requirement.name)
              ? 'bg-accent-600 border-accent-600'
              : 'border-gray-300'}"
          >
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
          on:click={() =>
            (formData.performanceRequirements = toggleArrayOption(
              formData.performanceRequirements,
              requirement.name
            ))}
          class="p-3 border rounded-lg text-left transition-all flex items-start gap-3 hover:shadow-sm
            {formData.performanceRequirements.includes(requirement.name)
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <div
            class="w-5 h-5 border rounded mt-0.5
            {formData.performanceRequirements.includes(requirement.name)
              ? 'bg-accent-600 border-accent-600'
              : 'border-gray-300'}"
          >
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
