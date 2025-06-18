<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let selectedContext = "";

  const contextOptions = [
    {
      id: "quotes_received",
      title: "Yes, I have other quotes",
      description: "Comparing proposals from multiple providers",
      icon: "📊",
      urgency: "High",
      score: 20,
    },
    {
      id: "quotes_pending",
      title: "Waiting on other quotes",
      description: "You're one of several I'm talking to",
      icon: "⏰",
      urgency: "Medium",
      score: 15,
    },
    {
      id: "researching",
      title: "Still researching options",
      description: "Learning about different providers and approaches",
      icon: "🔍",
      urgency: "Low",
      score: 10,
    },
    {
      id: "referral",
      title: "You came recommended",
      description: "Someone referred me to you specifically",
      icon: "🌟",
      urgency: "Medium",
      score: 25,
    },
    {
      id: "first_choice",
      title: "You're my first choice",
      description: "I like what I see and want to work with you",
      icon: "🎯",
      urgency: "High",
      score: 30,
    },
  ];

  function selectContext(context: string) {
    selectedContext = context;
    setTimeout(() => {
      dispatch("complete", { value: context });
    }, 300);
  }

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case "High":
        return "#dc2626";
      case "Medium":
        return "#d97706";
      case "Low":
        return "#059669";
      default:
        return "#6b7280";
    }
  }
</script>

<div class="competitor-context-step" in:fade={{ duration: 300 }}>
  <div class="context-options">
    {#each contextOptions as option (option.id)}
      <button
        class="context-option"
        class:selected={selectedContext === option.id}
        on:click={() => selectContext(option.id)}
      >
        <div class="option-header">
          <div class="option-icon">{option.icon}</div>
          <span
            class="urgency-badge"
            style="background-color: {getUrgencyColor(
              option.urgency
            )}20; color: {getUrgencyColor(option.urgency)}"
          >
            {option.urgency} Priority
          </span>
        </div>

        <div class="option-content">
          <h3 class="option-title">{option.title}</h3>
          <p class="option-description">{option.description}</p>
        </div>

        <div class="option-check">
          {#if selectedContext === option.id}
            <div class="checkmark">✓</div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="help-text">
    <p>🤝 We respect your process and want to earn your business fairly</p>
  </div>

  <div class="skip-option">
    <button
      class="skip-button"
      on:click={() => dispatch("complete", { value: "skipped", skipped: true })}
    >
      Prefer not to share
    </button>
  </div>
</div>

<style>
  .competitor-context-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .context-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .context-option {
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

  .context-option:hover {
    border-color: #06b6d4;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.15);
  }

  .context-option.selected {
    border-color: #06b6d4;
    background: #ecfeff;
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.2);
  }

  .option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-icon {
    font-size: 1.5rem;
  }

  .urgency-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
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
    background: #06b6d4;
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

  .skip-option {
    text-align: center;
  }

  .skip-button {
    background: none;
    border: 1px solid #d1d5db;
    color: #6b7280;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .skip-button:hover {
    border-color: #9ca3af;
    color: #374151;
  }

  @media (max-width: 640px) {
    .context-option {
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
