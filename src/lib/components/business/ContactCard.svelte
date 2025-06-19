<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import type { Contact } from "$lib/types.js";

  export let contact: Contact;
  export let variant: "hero" | "compact" | "mini" = "compact";
  export let showActions: boolean = true;
  export let loading: boolean = false;

  // Computed full name
  $: fullName = `${contact.first_name} ${contact.last_name}`.trim();

  function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  function handleEdit() {
    const event = new CustomEvent("edit", { detail: contact });
    document.dispatchEvent(event);
  }

  function handleEditClick(event: Event) {
    event.stopPropagation();
    handleEdit();
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

<BaseCard
  {variant}
  accent="var(--color-info)"
  {loading}
  clickable={variant !== "hero"}
  on:click={variant !== "hero" ? handleView : undefined}
>
  {#if variant === "hero"}
    <!-- Hero variant - large detailed view -->
    <div class="hero-content">
      <div class="hero-header">
        <div class="contact-info">
          <div class="contact-main">
            <div class="avatar-large">
              {getInitials(contact.first_name, contact.last_name)}
            </div>
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
            <BaseButton variant="outline" size="sm" on:click={handleView}
              >View Details</BaseButton
            >
          </div>
        {/if}
      </div>

      <div class="contact-methods">
        {#if contact.email}
          <div class="contact-method">
            <div class="method-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
            </div>
            <div class="method-details">
              <div class="method-label">Email</div>
              <a href="mailto:{contact.email}" class="method-value"
                >{contact.email}</a
              >
            </div>
            <BaseButton size="sm" variant="ghost" on:click={handleEmail}
              >Send</BaseButton
            >
          </div>
        {/if}

        {#if contact.phone}
          <div class="contact-method">
            <div class="method-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
                />
              </svg>
            </div>
            <div class="method-details">
              <div class="method-label">Phone</div>
              <a href="tel:{contact.phone}" class="method-value"
                >{contact.phone}</a
              >
            </div>
            <BaseButton size="sm" variant="ghost" on:click={handleCall}
              >Call</BaseButton
            >
          </div>
        {/if}
      </div>

      {#if contact.notes}
        <div class="notes-section">
          <h4 class="section-title">Notes</h4>
          <p class="notes">{contact.notes}</p>
        </div>
      {/if}
    </div>
  {:else if variant === "compact"}
    <!-- Compact variant - medium card for grids -->
    <div class="compact-content">
      <div class="compact-header">
        <div class="contact-basic">
          <div class="avatar-medium">
            {getInitials(contact.first_name, contact.last_name)}
          </div>
          <div class="contact-info">
            <h3 class="contact-name">{fullName}</h3>
            {#if contact.title}
              <div class="contact-title">{contact.title}</div>
            {/if}
          </div>
        </div>
      </div>

      <div class="compact-methods">
        {#if contact.email}
          <div class="method-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
            <span class="method-text">{contact.email}</span>
          </div>
        {/if}
        {#if contact.phone}
          <div class="method-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              />
            </svg>
            <span class="method-text">{contact.phone}</span>
          </div>
        {/if}
      </div>

      {#if showActions}
        <div class="compact-actions">
          <BaseButton size="sm" variant="ghost" on:click={handleEditClick}
            >Edit</BaseButton
          >
        </div>
      {/if}
    </div>
  {:else}
    <!-- Mini variant - small card for lists -->
    <div class="mini-content">
      <div class="mini-header">
        <div class="avatar-small">
          {getInitials(contact.first_name, contact.last_name)}
        </div>
        <div class="mini-info">
          <h4 class="contact-name">{fullName}</h4>
        </div>
      </div>
    </div>
  {/if}
</BaseCard>

<style>
  /* Hero Variant Styles */
  .hero-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    height: 100%;
  }

  .hero-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .contact-main {
    display: flex;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .avatar-large {
    width: 64px;
    height: 64px;
    border-radius: var(--radius-full);
    background: linear-gradient(
      135deg,
      var(--color-info),
      var(--color-info-600)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: var(--font-semibold);
    font-size: var(--text-xl);
    flex-shrink: 0;
  }

  .contact-details {
    flex: 1;
  }

  .hero-content .contact-name {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-1) 0;
  }

  .contact-title {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    margin-bottom: var(--space-1);
  }

  .hero-actions {
    display: flex;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .contact-methods {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .contact-method {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background-color: var(--color-neutral-50);
    border-radius: var(--radius-md);
  }

  .method-icon {
    color: var(--color-info);
    flex-shrink: 0;
  }

  .method-details {
    flex: 1;
  }

  .method-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--color-text-muted);
    margin-bottom: var(--space-1);
  }

  .method-value {
    color: var(--color-text);
    text-decoration: none;
    font-size: var(--text-base);
  }

  .method-value:hover {
    color: var(--color-info);
    text-decoration: underline;
  }

  /* Compact Variant Styles */
  .compact-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    height: 100%;
    min-height: 160px;
    justify-content: space-between;
  }

  .compact-header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    flex: 1;
  }

  .contact-basic {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    flex: 1;
  }

  .avatar-medium {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-full);
    background: linear-gradient(
      135deg,
      var(--color-info),
      var(--color-info-600)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: var(--font-semibold);
    font-size: var(--text-base);
    flex-shrink: 0;
  }

  .compact-content .contact-name {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-1) 0;
    line-height: var(--leading-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-content .contact-title {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-bottom: var(--space-1);
  }

  .compact-methods {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .method-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .method-item svg {
    color: var(--color-info);
    flex-shrink: 0;
  }

  .method-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .compact-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }

  /* Mini Variant Styles */
  .mini-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .mini-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .avatar-small {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    background: linear-gradient(
      135deg,
      var(--color-info),
      var(--color-info-600)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }

  .mini-info {
    flex: 1;
    min-width: 0;
  }

  .mini-content .contact-name {
    font-family: var(--font-heading);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    color: var(--color-text);
    margin: 0;
    line-height: var(--leading-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Shared Styles */
  .section-title {
    font-family: var(--font-heading);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: var(--space-2);
  }

  .notes {
    color: var(--color-text-muted);
    line-height: var(--leading-relaxed);
    margin: 0;
  }

  /* Dark mode adjustments */
  :global(.dark) .contact-method {
    background-color: var(--color-neutral-800);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .hero-header {
      flex-direction: column;
      align-items: stretch;
    }

    .hero-actions {
      justify-content: flex-start;
    }

    .contact-main {
      flex-direction: column;
      text-align: center;
    }

    .contact-method {
      flex-direction: column;
      text-align: center;
      gap: var(--space-2);
    }

    .method-details {
      text-align: center;
    }
  }
</style>
