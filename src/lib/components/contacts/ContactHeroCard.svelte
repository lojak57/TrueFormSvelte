<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import ContactAvatar from "./ContactAvatar.svelte";
  import ContactMethod from "./ContactMethod.svelte";
  import type { Contact } from "$lib/types.js";

  export let contact: Contact;
  export let showActions: boolean = true;
  export let loading: boolean = false;

  $: fullName = `${contact.first_name} ${contact.last_name}`.trim();

  function handleEdit() {
    const event = new CustomEvent("edit", { detail: contact });
    document.dispatchEvent(event);
  }

  function handleView() {
    window.location.href = `/admin/contacts/${contact.id}`;
  }

  function handleCall() {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`);
    }
  }

  function handleEmail() {
    if (contact.email) {
      window.open(`mailto:${contact.email}`);
    }
  }
</script>

<BaseCard variant="hero" accent="var(--color-info)" {loading}>
  <div class="hero-content">
    <div class="hero-header">
      <div class="contact-info">
        <div class="contact-main">
          <ContactAvatar
            firstName={contact.first_name}
            lastName={contact.last_name}
            size="large"
          />
          <div class="contact-details">
            <h2 class="contact-name">{fullName}</h2>
            {#if contact.title}
              <div class="contact-title">{contact.title}</div>
            {/if}
          </div>
        </div>
      </div>
      {#if showActions}
        <div class="hero-actions">
          <BaseButton size="sm" on:click={handleEdit}>Edit</BaseButton>
          <BaseButton variant="outline" size="sm" on:click={handleView}>
            View Details
          </BaseButton>
        </div>
      {/if}
    </div>

    <div class="contact-methods">
      {#if contact.email}
        <ContactMethod
          type="email"
          value={contact.email}
          label="Email"
          actionLabel="Send"
          onAction={handleEmail}
        />
      {/if}

      {#if contact.phone}
        <ContactMethod
          type="phone"
          value={contact.phone}
          label="Phone"
          actionLabel="Call"
          onAction={handleCall}
        />
      {/if}
    </div>

    {#if contact.notes}
      <div class="notes-section">
        <h4 class="section-title">Notes</h4>
        <p class="notes">{contact.notes}</p>
      </div>
    {/if}
  </div>
</BaseCard>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .hero-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .contact-main {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .contact-details {
    flex: 1;
    min-width: 0;
  }

  .contact-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.25rem 0;
    line-height: 1.2;
  }

  .contact-title {
    font-size: 1rem;
    color: #6b7280;
    font-weight: 500;
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
    flex-shrink: 0;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .notes-section {
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .notes {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.5;
    margin: 0;
    white-space: pre-wrap;
  }

  @media (max-width: 640px) {
    .hero-header {
      flex-direction: column;
      align-items: stretch;
    }

    .hero-actions {
      align-self: flex-start;
    }

    .contact-name {
      font-size: 1.25rem;
    }
  }
</style>
