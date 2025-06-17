<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { BasicInfoData, StepValidationEvent } from '$lib/types/wizard.types';

  const dispatch = createEventDispatcher<{
    validation: StepValidationEvent;
  }>();

  export let formData: BasicInfoData;

  const industries = [
    'Technology/Software', 'Healthcare', 'Finance', 'Real Estate', 'E-commerce/Retail',
    'Education', 'Non-Profit', 'Professional Services', 'Manufacturing', 'Hospitality',
    'Creative/Media', 'Fitness/Wellness', 'Automotive', 'Food & Beverage', 'Other'
  ];

  const companySizes = [
    'Solo Entrepreneur', '2-10 employees', '11-50 employees', '51-200 employees', '200+ employees'
  ];

  // Validation
  $: isValid = !!(formData.companyName?.trim() && formData.contactName?.trim() && formData.contactEmail?.trim());

  // Emit validation state changes
  $: dispatch('validation', { isValid, errors: [] });
</script>

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