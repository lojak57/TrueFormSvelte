<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  export let interactions: any[];
  export let contactId: string;
  export let onInteractionAdded: () => void;

  let isFormVisible = false;
  let isSubmitting = false;
  let formData = {
    type: "email",
    subject: "",
    notes: "",
  };

  const interactionTypes = [
    { value: "email", label: "Email", icon: "📧" },
    { value: "call", label: "Phone Call", icon: "📞" },
    { value: "meeting", label: "Meeting", icon: "🤝" },
    { value: "demo", label: "Demo", icon: "🖥️" },
    { value: "proposal", label: "Proposal", icon: "📄" },
    { value: "note", label: "Note", icon: "📝" },
  ];

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getInteractionIcon(type: string): string {
    const typeObj = interactionTypes.find((t) => t.value === type);
    return typeObj?.icon || "📝";
  }

  function toggleForm() {
    isFormVisible = !isFormVisible;
    if (!isFormVisible) {
      formData = { type: "email", subject: "", notes: "" };
    }
  }

  async function handleSubmit() {
    if (!formData.subject.trim() || !formData.notes.trim()) {
      return;
    }

    try {
      isSubmitting = true;

      const response = await fetch(`/api/contacts/${contactId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interaction: {
            type: formData.type,
            subject: formData.subject,
            notes: formData.notes,
            created_at: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add interaction");
      }

      formData = { type: "email", subject: "", notes: "" };
      isFormVisible = false;
      onInteractionAdded();
    } catch (error) {
      console.error("Error adding interaction:", error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<BaseCard padding="lg">
  <div class="section-header">
    <h3 class="text-h3">Interaction History ({interactions.length})</h3>
    <BaseButton variant="outline" size="sm" on:click={toggleForm}>
      {isFormVisible ? "Cancel" : "Add Interaction"}
    </BaseButton>
  </div>

  {#if isFormVisible}
    <div class="interaction-form">
      <div class="form-row">
        <label>
          <span class="label">Type</span>
          <select bind:value={formData.type} class="select">
            {#each interactionTypes as type}
              <option value={type.value}>
                {type.icon}
                {type.label}
              </option>
            {/each}
          </select>
        </label>
      </div>
      <div class="form-row">
        <label>
          <span class="label">Subject</span>
          <input
            type="text"
            bind:value={formData.subject}
            placeholder="Brief description of the interaction"
            class="input"
          />
        </label>
      </div>
      <div class="form-row">
        <label>
          <span class="label">Notes</span>
          <textarea
            bind:value={formData.notes}
            placeholder="Detailed notes about the interaction..."
            rows="3"
            class="textarea"
          />
        </label>
      </div>
      <div class="form-actions">
        <BaseButton
          on:click={handleSubmit}
          disabled={isSubmitting ||
            !formData.subject.trim() ||
            !formData.notes.trim()}
        >
          {isSubmitting ? "Adding..." : "Add Interaction"}
        </BaseButton>
        <BaseButton variant="outline" on:click={toggleForm}>Cancel</BaseButton>
      </div>
    </div>
  {/if}

  {#if interactions.length === 0}
    <div class="empty-state">
      <div class="empty-icon">💬</div>
      <h4>No interactions yet</h4>
      <p class="text-muted">
        Start tracking your communication history with this contact.
      </p>
      <BaseButton on:click={toggleForm}>Add First Interaction</BaseButton>
    </div>
  {:else}
    <div class="timeline">
      {#each interactions as interaction}
        <div class="timeline-item">
          <div class="timeline-marker">
            <span class="interaction-icon"
              >{getInteractionIcon(interaction.type)}</span
            >
          </div>
          <div class="timeline-content">
            <div class="interaction-header">
              <h4 class="interaction-subject">{interaction.subject}</h4>
              <span class="interaction-date"
                >{formatDate(interaction.created_at)}</span
              >
            </div>
            <p class="interaction-notes">{interaction.notes}</p>
            <div class="interaction-type">
              {interactionTypes.find((t) => t.value === interaction.type)
                ?.label || interaction.type}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</BaseCard>

<style>
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .interaction-form {
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .form-row {
    margin-bottom: 1rem;
  }

  .form-row:last-child {
    margin-bottom: 0;
  }

  .label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .input,
  .select,
  .textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    background: white;
  }

  .input:focus,
  .select:focus,
  .textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-bg);
  }

  .textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .timeline {
    position: relative;
  }

  .timeline::before {
    content: "";
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--color-border);
  }

  .timeline-item {
    position: relative;
    display: flex;
    margin-bottom: 1.5rem;
  }

  .timeline-item:last-child {
    margin-bottom: 0;
  }

  .timeline-marker {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: white;
    border: 3px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
    z-index: 1;
  }

  .interaction-icon {
    font-size: 1rem;
  }

  .timeline-content {
    flex: 1;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1rem;
  }

  .interaction-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .interaction-subject {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .interaction-date {
    font-size: 0.75rem;
    color: var(--color-muted);
    flex-shrink: 0;
    margin-left: 1rem;
  }

  .interaction-notes {
    margin: 0 0 0.75rem 0;
    color: var(--color-text);
    line-height: 1.5;
  }

  .interaction-type {
    font-size: 0.75rem;
    color: var(--color-primary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-muted);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h4 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
  }

  @media (max-width: 768px) {
    .section-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .interaction-header {
      flex-direction: column;
      gap: 0.25rem;
    }

    .interaction-date {
      margin-left: 0;
    }

    .form-actions {
      flex-direction: column;
    }
  }
</style>
