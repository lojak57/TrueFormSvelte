<script lang="ts">
  import { wizardStore, WIZARD_STEPS } from "../stores/wizardStore";
  import { onMount, onDestroy } from "svelte";

  let estimatedTimeRemaining = 0;
  let startTime = 0;
  let interval: any;

  $: quotePath = $wizardStore.answers.quotePath;
  $: currentIndex = $wizardStore.currentStepIndex;
  $: totalSteps = WIZARD_STEPS.length;

  // Calculate steps remaining based on path
  function getStepsRemaining(): number {
    if (quotePath === "express_quote") {
      // Express path streamlined steps
      const expressStepIds = [
        "quotePath",
        "companyName",
        "contactName",
        "contactEmail",
        "contactPhone",
        "industry",
        "websiteType",
        "coreFeatures",
        "timeline",
        "summary",
      ];

      const currentStepId = WIZARD_STEPS[currentIndex]?.id;
      const currentExpressIndex = expressStepIds.findIndex(
        (s) => s === currentStepId
      );

      if (currentExpressIndex >= 0) {
        return expressStepIds.length - currentExpressIndex - 1;
      }
      return 0;
    } else if (quotePath === "custom_solution") {
      // Custom solution uses most steps but skips some
      const skipStepsForCustom = ["contactPhone"]; // Steps we skip for custom
      const remainingSteps = WIZARD_STEPS.slice(currentIndex + 1);
      const relevantSteps = remainingSteps.filter(
        (step) => !skipStepsForCustom.includes(step.id)
      );
      return relevantSteps.length;
    } else {
      // Before path selection or unknown path
      return Math.max(1, totalSteps - currentIndex - 1);
    }
  }

  // Estimate time per step (in seconds) - more realistic timing
  function getTimePerStep(): number {
    if (quotePath === "express_quote") {
      return 6; // 6 seconds per step for express (quicker decisions)
    } else if (quotePath === "custom_solution") {
      return 15; // 15 seconds per step for custom (more thoughtful responses)
    } else {
      return 10; // Default before path selection
    }
  }

  function updateTimeEstimate() {
    const stepsRemaining = getStepsRemaining();
    const timePerStep = getTimePerStep();
    estimatedTimeRemaining = stepsRemaining * timePerStep;
  }

  function formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.max(10, seconds)} seconds`;
    } else {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  }

  onMount(() => {
    startTime = $wizardStore.startTime || Date.now();
    updateTimeEstimate();

    // Update estimate every 5 seconds
    interval = setInterval(() => {
      updateTimeEstimate();
    }, 5000);
  });

  onDestroy(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

  $: {
    // Recalculate when step changes
    currentIndex;
    updateTimeEstimate();
  }
</script>

<div class="progress-estimator">
  <div class="time-estimate">
    <span class="time-icon">⏱️</span>
    <span class="time-text">
      {#if estimatedTimeRemaining > 0}
        About {formatTime(estimatedTimeRemaining)} remaining
      {:else}
        Almost done!
      {/if}
    </span>
  </div>

  <div class="path-indicator">
    {#if quotePath === "express_quote"}
      <span class="path-badge express">⚡ Express Quote</span>
    {:else if quotePath === "custom_solution"}
      <span class="path-badge custom">🎯 Custom Solution</span>
    {:else}
      <span class="path-badge">Getting Started</span>
    {/if}
  </div>
</div>

<style>
  .progress-estimator {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  .time-estimate {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .time-icon {
    font-size: 1rem;
  }

  .time-text {
    font-weight: 500;
  }

  .path-indicator {
    flex-shrink: 0;
  }

  .path-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .path-badge.express {
    background: #d1fae5;
    color: #065f46;
  }

  .path-badge.custom {
    background: #dbeafe;
    color: #1e40af;
  }

  .path-badge:not(.express):not(.custom) {
    background: #f3f4f6;
    color: #374151;
  }

  @media (max-width: 640px) {
    .progress-estimator {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .time-estimate {
      justify-content: center;
    }
  }
</style>
