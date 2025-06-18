<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let selectedUrgency = "";

  const urgencyOptions = [
    {
      id: "urgent_deadline",
      title: "Urgent - We have a deadline",
      description: "Specific date or event driving timeline",
      icon: "🚨",
      timeline: "ASAP",
      priority: "HIGH",
      score: 25,
    },
    {
      id: "high_priority",
      title: "High priority",
      description: "Important for business goals this quarter",
      icon: "⚡",
      timeline: "1-2 months",
      priority: "HIGH",
      score: 20,
    },
    {
      id: "planned_project",
      title: "Planned project",
      description: "Scheduled initiative with some flexibility",
      icon: "📅",
      timeline: "2-3 months",
      priority: "MEDIUM",
      score: 15,
    },
    {
      id: "when_ready",
      title: "When it's ready",
      description: "Quality over speed - no rushing needed",
      icon: "🎯",
      timeline: "3+ months",
      priority: "MEDIUM",
      score: 10,
    },
    {
      id: "exploring",
      title: "Just exploring",
      description: "Gathering information and comparing options",
      icon: "🔍",
      timeline: "TBD",
      priority: "LOW",
      score: 5,
    },
  ];

  function selectUrgency(urgency: string) {
    selectedUrgency = urgency;
    setTimeout(() => {
      dispatch("complete", { value: urgency });
    }, 300);
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "HIGH":
        return "#ef4444";
      case "MEDIUM":
        return "#f59e0b";
      case "LOW":
        return "#10b981";
      default:
        return "#6b7280";
    }
  }
</script>

<div class="project-urgency-step" in:fade={{ duration: 300 }}>
  <div class="urgency-options">
    {#each urgencyOptions as option (option.id)}
      <button
        class="urgency-option"
        class:selected={selectedUrgency === option.id}
        on:click={() => selectUrgency(option.id)}
      >
        <div class="option-header">
          <div class="option-icon">{option.icon}</div>
          <div class="option-badges">
            <span
              class="priority-badge"
              style="background-color: {getPriorityColor(
                option.priority
              )}20; color: {getPriorityColor(option.priority)}"
            >
              {option.priority}
            </span>
            <span class="timeline-badge">{option.timeline}</span>
          </div>
        </div>

        <div class="option-content">
          <h3 class="option-title">{option.title}</h3>
          <p class="option-description">{option.description}</p>
        </div>

        <div class="option-check">
          {#if selectedUrgency === option.id}
            <div class="checkmark">✓</div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <div class="help-text">
    <p>
      ⏰ This helps us allocate the right resources and timeline for your
      project
    </p>
  </div>
</div>

<style>
  .project-urgency-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .urgency-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .urgency-option {
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

  .urgency-option:hover {
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);
  }

  .urgency-option.selected {
    border-color: #f59e0b;
    background: #fffbeb;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
  }

  .option-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-icon {
    font-size: 1.5rem;
  }

  .option-badges {
    display: flex;
    gap: 0.5rem;
  }

  .priority-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .timeline-badge {
    font-size: 0.7rem;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
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
    background: #f59e0b;
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
    .urgency-option {
      padding: 1rem;
    }

    .option-badges {
      flex-direction: column;
      gap: 0.25rem;
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
