<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { BasicInfoStep } from "$lib/types/wizard.types";

  export let data: BasicInfoStep;
  export let errors: Record<string, string> = {};

  const dispatch = createEventDispatcher();

  // Step 1 Options
  const industries = [
    "Technology/Software",
    "Healthcare",
    "Finance",
    "Real Estate",
    "E-commerce/Retail",
    "Education",
    "Non-Profit",
    "Professional Services",
    "Manufacturing",
    "Hospitality",
    "Creative/Media",
    "Fitness/Wellness",
    "Automotive",
    "Food & Beverage",
    "Other",
  ];

  const companySizes = [
    "Solo Entrepreneur",
    "2-10 employees",
    "11-50 employees",
    "51-200 employees",
    "200+ employees",
  ];

  function handleChange(field: keyof BasicInfoStep, value: string) {
    dispatch("change", { field, value });
  }

  function handleInput(field: keyof BasicInfoStep) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      handleChange(field, target.value);
    };
  }

  function handleSelectChange(field: keyof BasicInfoStep) {
    return (e: Event) => {
      const target = e.target as HTMLSelectElement;
      handleChange(field, target.value);
    };
  }

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string): boolean {
    return (
      phone.length === 0 ||
      /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""))
    );
  }

  // Reactive validation
  $: emailError =
    data.contactEmail && !validateEmail(data.contactEmail)
      ? "Please enter a valid email address"
      : "";
  $: phoneError =
    data.contactPhone && !validatePhone(data.contactPhone)
      ? "Please enter a valid phone number"
      : "";
</script>

<div class="step-content space-y-6">
  <div class="intro-text">
    <p class="text-gray-700 mb-6">
      Let's start with some basic information about your company and project.
      This helps us understand your needs better.
    </p>
  </div>

  <div class="form-grid">
    <!-- Company Name -->
    <div class="form-group">
      <label for="companyName" class="form-label required">
        Company/Organization Name
      </label>
      <input
        id="companyName"
        type="text"
        bind:value={data.companyName}
        on:input={handleInput("companyName")}
        class="form-input"
        class:error={errors.companyName}
        placeholder="Acme Corp"
        required
      />
      {#if errors.companyName}
        <span class="error-message">{errors.companyName}</span>
      {/if}
    </div>

    <!-- Industry -->
    <div class="form-group">
      <label for="industry" class="form-label required"> Industry </label>
      <select
        id="industry"
        bind:value={data.industry}
        on:change={handleSelectChange("industry")}
        class="form-input"
        class:error={errors.industry}
        required
      >
        <option value="">Select your industry...</option>
        {#each industries as industry}
          <option value={industry}>{industry}</option>
        {/each}
      </select>
      {#if errors.industry}
        <span class="error-message">{errors.industry}</span>
      {/if}
    </div>

    <!-- Contact Name -->
    <div class="form-group">
      <label for="contactName" class="form-label required"> Your Name </label>
      <input
        id="contactName"
        type="text"
        bind:value={data.contactName}
        on:input={handleInput("contactName")}
        class="form-input"
        class:error={errors.contactName}
        placeholder="John Smith"
        required
      />
      {#if errors.contactName}
        <span class="error-message">{errors.contactName}</span>
      {/if}
    </div>

    <!-- Company Size -->
    <div class="form-group">
      <label for="companySize" class="form-label"> Company Size </label>
      <select
        id="companySize"
        bind:value={data.companySize}
        on:change={handleSelectChange("companySize")}
        class="form-input"
      >
        <option value="">Select company size...</option>
        {#each companySizes as size}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </div>

    <!-- Email -->
    <div class="form-group">
      <label for="contactEmail" class="form-label required">
        Email Address
      </label>
      <input
        id="contactEmail"
        type="email"
        bind:value={data.contactEmail}
        on:input={handleInput("contactEmail")}
        class="form-input"
        class:error={errors.contactEmail || emailError}
        placeholder="john@acmecorp.com"
        required
      />
      {#if errors.contactEmail}
        <span class="error-message">{errors.contactEmail}</span>
      {:else if emailError}
        <span class="error-message">{emailError}</span>
      {/if}
    </div>

    <!-- Phone -->
    <div class="form-group">
      <label for="contactPhone" class="form-label"> Phone Number </label>
      <input
        id="contactPhone"
        type="tel"
        bind:value={data.contactPhone}
        on:input={handleInput("contactPhone")}
        class="form-input"
        class:error={phoneError}
        placeholder="(555) 123-4567"
      />
      {#if phoneError}
        <span class="error-message">{phoneError}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .step-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .intro-text {
    text-align: center;
    margin-bottom: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-weight: 500;
    color: rgb(55, 65, 81);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .form-label.required::after {
    content: " *";
    color: rgb(239, 68, 68);
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: rgb(34, 197, 94);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  .form-input.error {
    border-color: rgb(239, 68, 68);
  }

  .form-input.error:focus {
    border-color: rgb(239, 68, 68);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  .error-message {
    color: rgb(239, 68, 68);
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style>
