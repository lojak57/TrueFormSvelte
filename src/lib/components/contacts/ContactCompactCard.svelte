<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import ContactAvatar from "./ContactAvatar.svelte";
  import type { Contact } from "$lib/types.js";

  export let contact: Contact;
  export let showActions: boolean = true;
  export let loading: boolean = false;

  $: fullName = `${contact.first_name} ${contact.last_name}`.trim();

  function handleEdit(event: Event) {
    event.stopPropagation();
    const editEvent = new CustomEvent("edit", { detail: contact });
    document.dispatchEvent(editEvent);
  }

  function handleView() {
    window.location.href = `/admin/contacts/${contact.id}`;
  }
</script>

<BaseCard
  variant="compact"
  accent="var(--color-info)"
  {loading}
  clickable={true}
  on:click={handleView}
>
  <div class="compact-content">
    <div class="compact-header">
      <div class="contact-basic">
        <ContactAvatar
          firstName={contact.first_name}
          lastName={contact.last_name}
          size="medium"
        />
        <div class="contact-info">
          <h3 class="contact-name">{fullName}</h3>
          {#if contact.title}
            <div class="contact-title">{contact.title}</div>
          {/if}
        </div>
      </div>
      {#if showActions}
        <div class="compact-actions">
          <BaseButton size="sm" variant="ghost" on:click={handleEdit}>
            Edit
          </BaseButton>
        </div>
      {/if}
    </div>

    <div class="contact-quick-info">
      {#if contact.email}
        <div class="quick-info-item">
          <span class="info-label">Email:</span>
          <a
            href="mailto:{contact.email}"
            class="info-value"
            on:click|stopPropagation
          >
            {contact.email}
          </a>
        </div>
      {/if}
      {#if contact.phone}
        <div class="quick-info-item">
          <span class="info-label">Phone:</span>
          <a
            href="tel:{contact.phone}"
            class="info-value"
            on:click|stopPropagation
          >
            {contact.phone}
          </a>
        </div>
      {/if}
    </div>
  </div>
</BaseCard>

<style>
  .compact-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .compact-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .contact-basic {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .contact-info {
    flex: 1;
    min-width: 0;
  }

  .contact-name {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.125rem 0;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .contact-title {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-actions {
    flex-shrink: 0;
  }

  .contact-quick-info {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    padding-top: 0.75rem;
    border-top: 1px solid #f3f4f6;
  }

  .quick-info-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .info-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    min-width: 3rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .info-value {
    font-size: 0.875rem;
    color: #374151;
    text-decoration: none;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .info-value:hover {
    color: #3b82f6;
  }

  @media (max-width: 640px) {
    .compact-header {
      flex-direction: column;
      align-items: stretch;
    }

    .compact-actions {
      align-self: flex-start;
    }

    .quick-info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .info-label {
      min-width: auto;
    }
  }
</style>
