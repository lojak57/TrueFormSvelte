<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import BaseCard from '$lib/components/base/BaseCard.svelte';
  import BaseButton from '$lib/components/base/BaseButton.svelte';
  import ContactHeader from '$lib/components/business/ContactHeader.svelte';
  import ContactInteractionHistory from '$lib/components/business/ContactInteractionHistory.svelte';

  let contact: any = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    await loadContact();
  });

  async function loadContact() {
    try {
      loading = true;
      const response = await fetch(`/api/contacts/${$page.params.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      contact = await response.json();
    } catch (err) {
      console.error('Failed to load contact:', err);
      error = err instanceof Error ? err.message : 'Failed to load contact';
    } finally {
      loading = false;
    }
  }

  function handleViewCompany() {
    if (contact?.company?.id) {
      goto(`/admin/companies/${contact.company.id}`);
    }
  }

  function handleEditContact() {
    // TODO: Open contact edit modal or navigate to edit page
    console.log('Edit contact:', contact.id);
  }

  function handleInteractionAdded() {
    // Reload contact data to get updated interactions
    loadContact();
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{contact ? `${contact.first_name} ${contact.last_name} - Contact Details` : 'Loading...'} | TrueForm Admin</title>
</svelte:head>

<div class="contact-detail">
  {#if loading}
    <BaseCard loading={true} padding="lg">
      <div class="loading-content">
        <h1 class="text-h1">Loading contact details...</h1>
      </div>
    </BaseCard>
  {:else if error}
    <BaseCard padding="lg" clickable={false}>
      <div class="error-content">
        <h1 class="text-h1">Error Loading Contact</h1>
        <p class="error-message">{error}</p>
        <BaseButton on:click={loadContact}>Try Again</BaseButton>
      </div>
    </BaseCard>
  {:else if contact}
    <!-- Contact Header -->
    <ContactHeader 
      {contact}
      onEditContact={handleEditContact}
      onViewCompany={handleViewCompany}
    />

    <!-- Contact Details Grid -->
    <div class="details-grid">
      <!-- Contact Information -->
      <BaseCard padding="lg">
        <h3 class="text-h3 mb-md">Contact Information</h3>
        <div class="info-grid">
          {#if contact.linkedin}
            <div class="info-item">
              <span class="label">LinkedIn</span>
              <a href={contact.linkedin} target="_blank" rel="noopener" class="link">
                View Profile
              </a>
            </div>
          {/if}
          {#if contact.timezone}
            <div class="info-item">
              <span class="label">Timezone</span>
              <span class="value">{contact.timezone}</span>
            </div>
          {/if}
          {#if contact.preferred_contact}
            <div class="info-item">
              <span class="label">Preferred Contact</span>
              <span class="value">{contact.preferred_contact}</span>
            </div>
          {/if}
          {#if contact.reports_to}
            <div class="info-item">
              <span class="label">Reports To</span>
              <span class="value">{contact.reports_to}</span>
            </div>
          {/if}
        </div>
      </BaseCard>

      <!-- Company Context -->
      {#if contact.company}
        <BaseCard padding="lg">
          <h3 class="text-h3 mb-md">Company Context</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Company</span>
              <button class="company-link" on:click={handleViewCompany}>
                {contact.company.name}
              </button>
            </div>
            {#if contact.company.industry}
              <div class="info-item">
                <span class="label">Industry</span>
                <span class="value">{contact.company.industry}</span>
              </div>
            {/if}
            {#if contact.company.size}
              <div class="info-item">
                <span class="label">Company Size</span>
                <span class="value">{contact.company.size}</span>
              </div>
            {/if}
            <div class="info-item">
              <span class="label">Contact Since</span>
              <span class="value">{formatDate(contact.created_at)}</span>
            </div>
          </div>
        </BaseCard>
      {/if}
    </div>

    <!-- Interaction History -->
    <ContactInteractionHistory 
      interactions={contact.interactions}
      contactId={contact.id}
      onInteractionAdded={handleInteractionAdded}
    />
  {/if}
</div>

<style>
  .contact-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .loading-content,
  .error-content {
    text-align: center;
    padding: 2rem 0;
  }

  .error-message {
    color: var(--color-danger);
    margin-bottom: 1rem;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .info-grid {
    display: grid;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .value {
    color: var(--color-text);
  }

  .link {
    color: var(--color-primary);
    text-decoration: none;
  }

  .link:hover {
    text-decoration: underline;
  }

  .company-link {
    color: var(--color-primary);
    background: var(--color-primary-bg);
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-md);
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .company-link:hover {
    background: var(--color-primary);
    color: white;
  }

  @media (max-width: 768px) {
    .details-grid {
      grid-template-columns: 1fr;
    }
  }
</style> 