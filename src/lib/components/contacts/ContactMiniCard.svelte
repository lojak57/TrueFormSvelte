<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import ContactAvatar from "./ContactAvatar.svelte";
  import type { Contact } from "$lib/types.js";

  export let contact: Contact;
  export let loading: boolean = false;

  $: fullName = `${contact.first_name} ${contact.last_name}`.trim();

  function handleView() {
    window.location.href = `/admin/contacts/${contact.id}`;
  }
</script>

<BaseCard
  variant="mini"
  accent="var(--color-info)"
  {loading}
  clickable={true}
  on:click={handleView}
>
  <div class="mini-content">
    <div class="mini-header">
      <ContactAvatar
        firstName={contact.first_name}
        lastName={contact.last_name}
        size="small"
      />
      <div class="mini-info">
        <h4 class="contact-name">{fullName}</h4>
        {#if contact.title}
          <div class="contact-title">{contact.title}</div>
        {/if}
      </div>
    </div>
  </div>
</BaseCard>

<style>
  .mini-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mini-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .mini-info {
    flex: 1;
    min-width: 0;
  }

  .contact-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.125rem 0;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .contact-title {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
