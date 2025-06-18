<script lang="ts">
  import { Check } from "lucide-svelte";

  export let steps: string[];
  export let currentStep: number;
  export let stepDescriptions: string[] = [];
</script>

<div class="mb-8">
  <div class="flex items-center justify-between mb-4 overflow-x-auto">
    {#each steps as step, index}
      <div class="flex items-center flex-shrink-0">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full border-2
          {index < currentStep
            ? 'bg-accent-600 border-accent-600 text-white'
            : index === currentStep
            ? 'border-accent-600 text-accent-600'
            : 'border-gray-300 text-gray-400'}"
        >
          {#if index < currentStep}
            <Check size={16} />
          {:else}
            {index + 1}
          {/if}
        </div>
        {#if index < steps.length - 1}
          <div
            class="w-12 h-0.5 mx-2
            {index < currentStep ? 'bg-accent-600' : 'bg-gray-300'}"
          />
        {/if}
      </div>
    {/each}
  </div>
  <h2 class="text-2xl font-semibold text-gray-900">
    Step {currentStep + 1}: {steps[currentStep]}
  </h2>
  {#if stepDescriptions[currentStep]}
    <p class="text-gray-600 mt-2">
      {stepDescriptions[currentStep]}
    </p>
  {/if}
</div>
