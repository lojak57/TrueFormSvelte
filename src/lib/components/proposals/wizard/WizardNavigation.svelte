<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let currentStep: number;
  export let totalSteps: number;
  export let canProceed = true;
  export let isSubmitting = false;

  const dispatch = createEventDispatcher<{
    previous: void;
    next: void;
    submit: void;
  }>();

  $: isFirstStep = currentStep === 1;
  $: isLastStep = currentStep === totalSteps;
</script>

<div
  class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
>
  <!-- Previous Button -->
  <div>
    {#if !isFirstStep}
      <button
        class="tf-btn tf-btn-outline"
        on:click={() => dispatch("previous")}
        disabled={isSubmitting}
      >
        <svg
          class="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>
    {/if}
  </div>

  <!-- Step Indicator -->
  <div class="hidden sm:flex items-center gap-2">
    {#each Array(totalSteps) as _, index}
      <div
        class="w-2 h-2 rounded-full transition-colors
        {index + 1 <= currentStep ? 'bg-primary-600' : 'bg-gray-300'}"
      />
    {/each}
  </div>

  <!-- Next/Submit Button -->
  <div>
    {#if isLastStep}
      <button
        class="tf-btn tf-btn-success tf-btn-lg"
        on:click={() => dispatch("submit")}
        disabled={!canProceed || isSubmitting}
      >
        {#if isSubmitting}
          <svg
            class="w-4 h-4 mr-2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Creating Proposal...
        {:else}
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Create Proposal
        {/if}
      </button>
    {:else}
      <button
        class="tf-btn tf-btn-primary tf-btn-lg"
        on:click={() => dispatch("next")}
        disabled={!canProceed || isSubmitting}
      >
        Continue
        <svg
          class="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>
