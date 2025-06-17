<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { Building2, User, Mail, Phone } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let value: any = {
    companyName: '',
    contactName: '', 
    contactEmail: '',
    contactPhone: ''
  };
  
  let errors: Record<string, string> = {};
  let touched: Record<string, boolean> = {};
  
  function validateField(fieldName: string) {
    // Only show errors for fields that have been touched
    if (!touched[fieldName]) return;
    
    switch (fieldName) {
      case 'companyName':
        if (!value.companyName?.trim()) {
          errors.companyName = 'Company name is required';
        } else {
          delete errors.companyName;
        }
        break;
      case 'contactName':
        if (!value.contactName?.trim()) {
          errors.contactName = 'Your name is required';
        } else {
          delete errors.contactName;
        }
        break;
      case 'contactEmail':
        if (!value.contactEmail?.trim()) {
          errors.contactEmail = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contactEmail)) {
          errors.contactEmail = 'Please enter a valid email';
        } else {
          delete errors.contactEmail;
        }
        break;
    }
    errors = { ...errors }; // Trigger reactivity
  }
  
  function validateForm() {
    // Mark all fields as touched for submit validation
    touched = { companyName: true, contactName: true, contactEmail: true };
    
    validateField('companyName');
    validateField('contactName');
    validateField('contactEmail');
    
    return Object.keys(errors).length === 0;
  }
  
  function handleBlur(fieldName: string) {
    touched[fieldName] = true;
    validateField(fieldName);
  }
  
  function handleSubmit() {
    if (validateForm()) {
      dispatch('complete', { value });
    }
  }
  
  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter' && isFormValid) {
      handleSubmit();
    }
  }
  
  // Reactive statement to check if form is valid
  $: isFormValid = value.companyName?.trim() && 
                   value.contactName?.trim() && 
                   value.contactEmail?.trim() && 
                   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.contactEmail);
</script>

<div class="space-y-6" in:fade={{ duration: 300 }}>
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
      <User size={32} class="text-accent-600" />
    </div>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Company Name -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        <Building2 size={16} class="inline mr-2" />
        Company Name
      </label>
      <input
        type="text"
        bind:value={value.companyName}
        on:input={() => validateField('companyName')}
        on:blur={() => handleBlur('companyName')}
        on:keypress={handleKeyPress}
        placeholder="e.g., Acme Corp, Smith & Associates, TechStart Inc."
        autocomplete="organization"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors
               {errors.companyName ? 'border-red-500' : ''}"
      />
      {#if errors.companyName}
        <p class="text-sm text-red-600">{errors.companyName}</p>
      {/if}
    </div>

    <!-- Contact Name -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        <User size={16} class="inline mr-2" />
        Your Name
      </label>
      <input
        type="text"
        bind:value={value.contactName}
        on:input={() => validateField('contactName')}
        on:blur={() => handleBlur('contactName')}
        on:keypress={handleKeyPress}
        placeholder="e.g., John Smith"
        autocomplete="name"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors
               {errors.contactName ? 'border-red-500' : ''}"
      />
      {#if errors.contactName}
        <p class="text-sm text-red-600">{errors.contactName}</p>
      {/if}
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        <Mail size={16} class="inline mr-2" />
        Email Address
      </label>
      <input
        type="email"
        bind:value={value.contactEmail}
        on:input={() => validateField('contactEmail')}
        on:blur={() => handleBlur('contactEmail')}
        on:keypress={handleKeyPress}
        placeholder="you@company.com"
        autocomplete="email"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors
               {errors.contactEmail ? 'border-red-500' : ''}"
      />
      {#if errors.contactEmail}
        <p class="text-sm text-red-600">{errors.contactEmail}</p>
      {/if}
    </div>

    <!-- Phone (Optional) -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-500">
        <Phone size={16} class="inline mr-2" />
        Phone Number <span class="text-xs">(optional)</span>
      </label>
      <input
        type="tel"
        bind:value={value.contactPhone}
        on:keypress={handleKeyPress}
        placeholder="(555) 123-4567"
        autocomplete="tel"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
      />
      <p class="text-xs text-gray-500">For quick questions and project coordination</p>
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <button
        type="submit"
        disabled={!isFormValid}
        class="w-full px-6 py-3 bg-accent-600 text-white rounded-lg font-medium 
               hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed
               focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
               transition-colors duration-200"
      >
        Continue
      </button>
    </div>
  </form>
  
  <div class="text-center">
    <p class="text-sm text-gray-500">
      Press <kbd class="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Enter</kbd> to continue
    </p>
  </div>
</div>