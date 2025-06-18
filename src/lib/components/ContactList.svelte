<script lang="ts">
  import { onMount } from "svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  interface Contact {
    id: string;
    company_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    title?: string;
    status: string;
    vertical_id: string;
    created_at: string;
  }

  let contacts: Contact[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/contacts");
      if (response.ok) {
        contacts = await response.json();
      } else {
        error = "Failed to load contacts";
      }
    } catch (err) {
      error = "Error loading contacts";
      console.error("Error fetching contacts:", err);
    } finally {
      loading = false;
    }
  });

  function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "text-success bg-success-100";
      case "inactive":
        return "text-error bg-error-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  }
</script>

<div class="contact-list">
  {#if loading}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each Array(6) as _}
        <BaseCard variant="compact" loading />
      {/each}
    </div>
  {:else if error}
    <BaseCard padding="lg">
      <div class="text-center">
        <div class="text-error text-h4 mb-4">⚠️</div>
        <h3 class="text-h4 mb-2">Error Loading Contacts</h3>
        <p class="text-muted">{error}</p>
        <BaseButton variant="primary" on:click={() => window.location.reload()}>
          Try Again
        </BaseButton>
      </div>
    </BaseCard>
  {:else if contacts.length === 0}
    <BaseCard padding="lg">
      <div class="text-center">
        <div class="text-6xl mb-4">👥</div>
        <h3 class="text-h4 mb-2">No Contacts Yet</h3>
        <p class="text-muted mb-4">
          Start building your contact database by adding your first contact.
        </p>
        <BaseButton variant="primary" href="/admin/contacts/create">
          Add First Contact
        </BaseButton>
      </div>
    </BaseCard>
  {:else}
    <div class="contacts-grid">
      {#each contacts as contact}
        <BaseCard variant="compact" padding="md" clickable elevated>
          <div class="contact-card-content">
            <!-- Contact Header -->
            <div class="flex items-start gap-3 mb-4">
              <div class="contact-avatar">
                {getInitials(contact.first_name, contact.last_name)}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="contact-name">
                  {contact.first_name}
                  {contact.last_name}
                </h3>
                {#if contact.title}
                  <p class="contact-title">{contact.title}</p>
                {/if}
                <div class="flex items-center gap-2 mt-1">
                  <span class="status-badge {getStatusColor(contact.status)}">
                    {contact.status}
                  </span>
                </div>
              </div>
            </div>

            <!-- Contact Details -->
            <div class="contact-details space-y-2">
              {#if contact.email}
                <div class="contact-detail">
                  <span class="detail-icon">📧</span>
                  <a href="mailto:{contact.email}" class="detail-value">
                    {contact.email}
                  </a>
                </div>
              {/if}

              {#if contact.phone}
                <div class="contact-detail">
                  <span class="detail-icon">📞</span>
                  <a href="tel:{contact.phone}" class="detail-value">
                    {contact.phone}
                  </a>
                </div>
              {/if}
            </div>

            <!-- Actions -->
            <div class="contact-actions">
              <BaseButton
                variant="outline"
                size="sm"
                href="/admin/contacts/{contact.id}"
              >
                View
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                on:click={() => console.log("Edit contact:", contact.id)}
              >
                Edit
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      {/each}
    </div>

    <!-- Summary -->
    <div class="contact-summary">
      <BaseCard variant="compact" padding="md">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-h6 mb-1">Total Contacts</h4>
            <p class="text-muted text-sm">
              {contacts.length} contact{contacts.length !== 1 ? "s" : ""} across
              all companies
            </p>
          </div>
          <div class="text-h3 font-bold text-primary">
            {contacts.length}
          </div>
        </div>
      </BaseCard>
    </div>
  {/if}
</div>

<style>
  .contact-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-6);
    align-items: start;
  }

  @media (max-width: 768px) {
    .contacts-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  @media (min-width: 1200px) {
    .contacts-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  .contact-card-content {
    height: 100%;
    min-height: 220px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .contact-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    background: linear-gradient(
      135deg,
      var(--color-primary),
      var(--color-accent)
    );
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }

  .contact-name {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0;
    line-height: var(--leading-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .contact-title {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .status-badge {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .contact-details {
    flex: 1;
    margin: var(--space-4) 0;
  }

  .contact-detail {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .detail-icon {
    font-size: var(--text-base);
    opacity: 0.7;
  }

  .detail-value {
    color: var(--color-text-muted);
    text-decoration: none;
    transition: var(--transition-colors);
  }

  .detail-value:hover {
    color: var(--color-primary);
  }

  .contact-actions {
    display: flex;
    gap: var(--space-2);
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-muted);
  }

  .contact-summary {
    margin-top: var(--space-4);
  }
</style>
