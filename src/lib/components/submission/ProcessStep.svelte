<script lang="ts">
  import { fly } from "svelte/transition";

  export let step: {
    id: number;
    icon: any;
    title: string;
    description: string;
    timing: string;
    iconClass: string;
    animationDelay: number;
  };
</script>

<div
  class="process-step"
  in:fly={{ x: -30, duration: 400, delay: step.animationDelay }}
>
  <div class="step-icon {step.iconClass}">
    <svelte:component this={step.icon} size={24} />
  </div>
  <div class="step-content">
    <h4>{step.id}. {step.title}</h4>
    <p>{step.description}</p>
    <span class="step-timing">{step.timing}</span>
  </div>
</div>

<style>
  .process-step {
    display: flex;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    border: 1px solid #f0f0f0;
    transition: all 0.3s ease;
  }

  .process-step:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  .step-icon {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
  }

  .step-icon :global(.step-1) {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  }

  .step-icon :global(.step-2) {
    background: linear-gradient(135deg, #10b981, #047857);
  }

  .step-icon :global(.step-3) {
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }

  .step-icon :global(.step-4) {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  }

  .step-content {
    flex: 1;
  }

  .step-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }

  .step-content p {
    margin: 0 0 0.75rem 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .step-timing {
    font-size: 0.875rem;
    color: #059669;
    font-weight: 500;
    background: #d1fae5;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    display: inline-block;
  }
</style>
