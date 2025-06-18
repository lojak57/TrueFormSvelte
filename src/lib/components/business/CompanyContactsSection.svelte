<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  export let contacts: any[];
  export let onContactClick: (contactId: string) => void;
  export let onNewContact: () => void;
</script>

<BaseCard padding="lg">
  <div class="section-header">
    <h3 class="text-h3">Contacts ({contacts.length})</h3>
    <BaseButton variant="outline" size="sm" on:click={onNewContact}
      >Add Contact</BaseButton
    >
  </div>

  {#if contacts.length === 0}
    <div class="empty-state">
      <div class="empty-icon">👥</div>
      <h4>No contacts yet</h4>
      <p class="text-muted">
        Add contacts to start managing relationships with this company.
      </p>
      <BaseButton on:click={onNewContact}>Add First Contact</BaseButton>
    </div>
  {:else}
    <div class="contacts-grid">
      {#each contacts as contact}
        <div
          class="contact-card"
          on:click={() => onContactClick(contact.id)}
          on:keydown
        >
          <div class="contact-avatar">
            {contact.first_name.charAt(0)}{contact.last_name.charAt(0)}
          </div>
          <div class="contact-info">
            <h4 class="contact-name">
              {contact.first_name}
              {contact.last_name}
            </h4>
            {#if contact.title}
              <p class="contact-title">{contact.title}</p>
            {/if}
            <div class="contact-details">
              {#if contact.email}
                <a
                  href="mailto:{contact.email}"
                  class="contact-link"
                  on:click|stopPropagation
                >
                  {contact.email}
                </a>
              {/if}
              {#if contact.phone}
                <a
                  href="tel:{contact.phone}"
                  class="contact-link"
                  on:click|stopPropagation
                >
                  {contact.phone}
                </a>
              {/if}
            </div>
          </div>
          <div class="contact-status">
            <div class="status-dot {contact.status}" />
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

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  .contact-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .contact-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    background: white;
  }

  .contact-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .contact-info {
    flex: 1;
  }

  .contact-name {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .contact-title {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    color: var(--color-muted);
  }

  .contact-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-link {
    font-size: 0.75rem;
    color: var(--color-primary);
    text-decoration: none;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .contact-status {
    display: flex;
    align-items: center;
  }

  .status-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px var(--color-border);
  }

  .status-dot.active {
    background: var(--color-success);
  }

  .status-dot.inactive {
    background: var(--color-muted);
  }

  .status-dot.pending {
    background: var(--color-warning);
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
    .contacts-grid {
      grid-template-columns: 1fr;
    }

    .section-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }
</style>
