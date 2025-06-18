<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let selectedBudget = "";

  const budgetOptions = [
    {
      id: "budget_approved",
      title: "Budget is approved",
      description: "We have funds allocated for this project",
      icon: "💰",
      range: "Ready to invest",
      score: 25,
    },
    {
      id: "budget_researching",
      title: "Researching investment levels",
      description: "Want to understand typical costs for this type of project",
      icon: "📊",
      range: "Learning phase",
      score: 15,
    },
    {
      id: "budget_flexible",
      title: "Flexible budget",
      description: "Budget depends on the value and features we need",
      icon: "🎯",
      range: "Value-driven",
      score: 20,
    },
    {
      id: "budget_constrained",
      title: "Working with constraints",
      description: "Have a specific budget range in mind",
      icon: "🎱",
      range: "Budget-conscious",
      score: 10,
    },
    {
      id: "budget_exploring",
      title: "Just exploring options",
      description: "Early stage - gathering information and quotes",
      icon: "🔍",
      range: "Discovery mode",
      score: 5,
    },
  ];

  function selectBudget(budget: string) {
    selectedBudget = budget;
    setTimeout(() => {
      dispatch("complete", { value: budget });
    }, 300);
  }
</script>

<div class="budget-context-step" in:fade={{ duration: 300 }}>
  <div class="budget-options">
    {#each budgetOptions as option (option.id)}
      <button
        class="budget-option"
        class:selected={selectedBudget === option.id}
        on:click={() => selectBudget(option.id)}
      >
        <div class="option-header">
          <div class="option-icon">{option.icon}</div>
          <div class="option-range">{option.range}</div>
        </div>
        <div class="option-content">
          <h3 class="option-title">{option.title}</h3>
          <p class="option-description">{option.description}</p>
        </div>
        <div class="option-check">
          {#if selectedBudget === option.id}
            <div class="checkmark">✓</div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="help-text">
    <p>
      💡 Don't worry - we work with all types of budgets and will provide
      transparent pricing
    </p>
  </div>
</div>

<style>
  .budget-context-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .budget-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .budget-option {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
  }

  .budget-option:hover {
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  }

  .budget-option.selected {
    border-color: #10b981;
    background: #ecfdf5;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  .option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-icon {
    font-size: 1.5rem;
  }

  .option-range {
    font-size: 0.75rem;
    font-weight: 600;
    color: #10b981;
    background: #d1fae5;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .option-content {
    flex: 1;
  }

  .option-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .option-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  .option-check {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .help-text {
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .help-text p {
    margin: 0;
  }

  @media (max-width: 640px) {
    .budget-option {
      padding: 1rem;
    }

    .option-title {
      font-size: 1rem;
    }

    .option-description {
      font-size: 0.85rem;
    }

    .option-check {
      top: 1rem;
      right: 1rem;
    }
  }
</style>
