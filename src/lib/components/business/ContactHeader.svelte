<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  export let contact: any;
  export let onEditContact: () => void;
  export let onViewCompany: () => void;

  function getContactInitials(first: string, last: string): string {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  function getStatusVariant(status: string): string {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "pending":
        return "warning";
      default:
        return "secondary";
    }
  }

  function formatPhoneNumber(phone: string): string {
    // Simple phone formatting - could be more sophisticated
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    }
    return phone;
  }
</script>

<BaseCard variant="hero" padding="lg">
  <div class="contact-header">
    <div class="contact-avatar">
      {getContactInitials(contact.first_name, contact.last_name)}
    </div>
    <div class="contact-info">
      <div class="contact-title">
        <h1 class="text-h1">{contact.first_name} {contact.last_name}</h1>
        <div class="status-badge {getStatusVariant(contact.status)}">
          {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
        </div>
      </div>
      <div class="contact-meta">
        {#if contact.title}
          <span class="meta-item">{contact.title}</span>
        {/if}
        {#if contact.department}
          <span class="meta-item">{contact.department}</span>
        {/if}
        {#if contact.company?.name}
          <button class="company-link" on:click={onViewCompany}>
            {contact.company.name}
          </button>
        {/if}
      </div>
      <div class="contact-details">
        {#if contact.email}
          <a href="mailto:{contact.email}" class="contact-link">
            📧 {contact.email}
          </a>
        {/if}
        {#if contact.phone}
          <a href="tel:{contact.phone}" class="contact-link">
            📞 {formatPhoneNumber(contact.phone)}
          </a>
        {/if}
      </div>
      <div class="contact-actions">
        <BaseButton on:click={onEditContact}>Edit Contact</BaseButton>
        <BaseButton variant="outline" on:click={onViewCompany}
          >View Company</BaseButton
        >
      </div>
    </div>
  </div>
</BaseCard>

<style>
  .contact-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .contact-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .contact-info {
    flex: 1;
  }

  .contact-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .contact-title h1 {
    margin: 0;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-badge.success {
    background: var(--color-success-bg);
    color: var(--color-success-text);
    border: 1px solid var(--color-success-border);
  }

  .status-badge.warning {
    background: var(--color-warning-bg);
    color: var(--color-warning-text);
    border: 1px solid var(--color-warning-border);
  }

  .status-badge.secondary {
    background: var(--color-bg-secondary);
    color: var(--color-muted);
    border: 1px solid var(--color-border);
  }

  .contact-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 0.875rem;
    color: var(--color-muted);
    padding: 0.25rem 0.5rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .company-link {
    font-size: 0.875rem;
    color: var(--color-primary);
    padding: 0.25rem 0.5rem;
    background: var(--color-primary-bg);
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-decoration: none;
  }

  .company-link:hover {
    background: var(--color-primary);
    color: white;
  }

  .contact-details {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .contact-link {
    font-size: 0.875rem;
    color: var(--color-text);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .contact-link:hover {
    color: var(--color-primary);
  }

  .contact-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .contact-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .contact-title {
      flex-direction: column;
      gap: 0.5rem;
    }

    .contact-actions {
      justify-content: center;
    }
  }
</style>
