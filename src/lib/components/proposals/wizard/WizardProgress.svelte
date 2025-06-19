<script lang="ts">
  export let currentStep: number;
  export let totalSteps: number;
  export let stepTitles: string[];

  function getStepStatus(stepNumber: number) {
    if (stepNumber < currentStep) return "completed";
    if (stepNumber === currentStep) return "current";
    return "upcoming";
  }
</script>

<div class="mb-8">
  <!-- Progress Bar -->
  <div class="relative">
    <div class="flex items-center justify-between">
      {#each Array(totalSteps) as _, index}
        {@const stepNumber = index + 1}
        {@const status = getStepStatus(stepNumber)}

        <div class="flex flex-col items-center relative z-10">
          <!-- Step Circle -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
            {status === 'completed'
              ? 'bg-primary-600 text-white'
              : status === 'current'
              ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-200'
              : 'bg-gray-200 text-gray-500'}"
          >
            {#if status === "completed"}
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            {:else}
              {stepNumber}
            {/if}
          </div>

          <!-- Step Title -->
          <div class="mt-3 text-center">
            <div
              class="text-sm font-medium
              {status === 'current'
                ? 'text-primary-600'
                : status === 'completed'
                ? 'text-gray-900'
                : 'text-gray-500'}"
            >
              {stepTitles[index] || `Step ${stepNumber}`}
            </div>
          </div>
        </div>

        <!-- Connection Line -->
        {#if index < totalSteps - 1}
          <div
            class="flex-1 h-1 mx-4 rounded-full
            {stepNumber < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
            transition-colors duration-300"
          />
        {/if}
      {/each}
    </div>
  </div>

  <!-- Current Step Info -->
  <div class="mt-6 text-center">
    <h2 class="tf-heading-2">{stepTitles[currentStep - 1]}</h2>
    <p class="text-gray-900 mt-2">Step {currentStep} of {totalSteps}</p>
  </div>
</div>
