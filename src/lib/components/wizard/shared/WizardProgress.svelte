<script lang="ts">
  import { Check } from "lucide-svelte";
  import type { WizardStep } from "$lib/types";

  export let steps: WizardStep[];
  export let currentStep: number;
  export let onStepClick: ((step: number) => void) | null = null;

  function handleStepClick(stepId: number) {
    if (onStepClick && isStepAccessible(stepId)) {
      onStepClick(stepId);
    }
  }

  function isStepAccessible(stepId: number): boolean {
    // Can click on current step or any completed step
    return stepId <= currentStep || steps[stepId - 1]?.isComplete;
  }

  function getStepStatus(step: WizardStep): "complete" | "current" | "pending" {
    if (step.isComplete) return "complete";
    if (step.id === currentStep) return "current";
    return "pending";
  }
</script>

<div class="wizard-progress">
  <div class="flex items-center justify-between mb-4 overflow-x-auto">
    {#each steps as step, index}
      <div class="flex items-center flex-shrink-0">
        <button
          class="step-indicator {getStepStatus(step)}"
          class:clickable={onStepClick && isStepAccessible(step.id)}
          on:click={() => handleStepClick(step.id)}
          disabled={!isStepAccessible(step.id)}
        >
          {#if step.isComplete}
            <Check size={16} />
          {:else}
            {step.id}
          {/if}
        </button>

        {#if index < steps.length - 1}
          <div
            class="step-connector {step.isComplete ? 'complete' : 'pending'}"
          />
        {/if}
      </div>
    {/each}
  </div>

  <div class="step-info">
    <h2 class="text-2xl font-semibold text-gray-900">
      Step {currentStep}: {steps.find((s) => s.id === currentStep)?.title ||
        "Unknown"}
    </h2>
    <p class="text-gray-600 mt-2">
      {steps.find((s) => s.id === currentStep)?.description || ""}
    </p>
  </div>
</div>

<style>
  .wizard-progress {
    margin-bottom: 2rem;
  }

  .step-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: white;
  }

  .step-indicator.complete {
    background-color: rgb(34, 197, 94);
    border-color: rgb(34, 197, 94);
    color: white;
  }

  .step-indicator.current {
    border-color: rgb(34, 197, 94);
    color: rgb(34, 197, 94);
    background: white;
  }

  .step-indicator.pending {
    border-color: rgb(209, 213, 219);
    color: rgb(156, 163, 175);
    background: white;
  }

  .step-indicator.clickable:hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  .step-indicator:disabled {
    cursor: not-allowed;
  }

  .step-connector {
    width: 3rem;
    height: 2px;
    margin: 0 0.5rem;
    transition: background-color 0.2s ease;
  }

  .step-connector.complete {
    background-color: rgb(34, 197, 94);
  }

  .step-connector.pending {
    background-color: rgb(209, 213, 219);
  }

  .step-info h2 {
    margin: 0;
  }

  .step-info p {
    margin: 0.5rem 0 0 0;
  }
</style>
