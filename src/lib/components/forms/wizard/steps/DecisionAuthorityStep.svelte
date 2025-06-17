<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  let selectedAuthority = '';

  const authorityOptions = [
    {
      id: 'decision_maker',
      title: 'I make the final decision',
      description: 'I have the authority to approve and move forward',
      icon: '👑',
      score: 25 // High value lead
    },
    {
      id: 'influencer',
      title: 'I influence the decision',
      description: 'I recommend solutions but need approval from others',
      icon: '🎯',
      score: 15
    },
    {
      id: 'researcher',
      title: 'I\'m gathering information',
      description: 'Researching options for someone else to decide',
      icon: '🔍',
      score: 5
    },
    {
      id: 'team_decision',
      title: 'It\'s a team decision',
      description: 'Multiple people are involved in the final choice',
      icon: '👥',
      score: 10
    }
  ];

  function selectAuthority(authority: string) {
    selectedAuthority = authority;
    // Add a small delay for UX, then proceed
    setTimeout(() => {
      dispatch('complete', { value: authority });
    }, 300);
  }
</script>

<div class="decision-authority-step" in:fade={{ duration: 300 }}>
  <div class="authority-options">
    {#each authorityOptions as option (option.id)}
      <button 
        class="authority-option"
        class:selected={selectedAuthority === option.id}
        on:click={() => selectAuthority(option.id)}
      >
        <div class="option-icon">{option.icon}</div>
        <div class="option-content">
          <h3 class="option-title">{option.title}</h3>
          <p class="option-description">{option.description}</p>
        </div>
        <div class="option-check">
          {#if selectedAuthority === option.id}
            <div class="checkmark">✓</div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="help-text">
    <p>💡 This helps us understand how to best communicate with your team</p>
  </div>
</div>

<style>
  .decision-authority-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .authority-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .authority-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .authority-option:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }

  .authority-option.selected {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  .option-icon {
    font-size: 2rem;
    flex-shrink: 0;
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
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    background: #3b82f6;
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
    .authority-option {
      padding: 1rem;
      gap: 0.75rem;
    }

    .option-icon {
      font-size: 1.5rem;
    }

    .option-title {
      font-size: 1rem;
    }

    .option-description {
      font-size: 0.85rem;
    }
  }
</style>