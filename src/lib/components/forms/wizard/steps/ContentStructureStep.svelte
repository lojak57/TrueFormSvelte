<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let formData: {
    pageStructure: string[];
    contentSections: string[];
    copywriting: string;
    mediaRequirements: string[];
  };

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

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter(item => item !== option);
    } else {
      return [...array, option];
    }
  }

  // Validation
  $: isValid = !!(formData.pageStructure.length > 0);

  // Emit validation state changes
  $: dispatch('validation', { isValid });
</script>

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