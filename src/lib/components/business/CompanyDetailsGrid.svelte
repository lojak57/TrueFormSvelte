<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";

  export let company: any;

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatAddress(company: any): string {
    const parts = [
      company.billing_street,
      company.billing_city,
      company.billing_state,
      company.billing_zip,
    ].filter(Boolean);
    return parts.join(", ");
  }
</script>

<div class="details-grid">
  <!-- Contact Information -->
  <BaseCard padding="lg">
    <h3 class="text-h3 mb-md">Contact Information</h3>
    <div class="info-grid">
      {#if company.website}
        <div class="info-item">
          <span class="label">Website</span>
          <a href={company.website} target="_blank" rel="noopener" class="link">
            {company.website.replace(/^https?:\/\//, "")}
          </a>
        </div>
      {/if}
      {#if company.phone}
        <div class="info-item">
          <span class="label">Phone</span>
          <a href="tel:{company.phone}" class="link">{company.phone}</a>
        </div>
      {/if}
      {#if formatAddress(company)}
        <div class="info-item">
          <span class="label">Address</span>
          <span class="value">{formatAddress(company)}</span>
        </div>
      {/if}
    </div>
  </BaseCard>

  <!-- Notes & Details -->
  <BaseCard padding="lg">
    <h3 class="text-h3 mb-md">Notes & Details</h3>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">Created</span>
        <span class="value">{formatDate(company.created_at)}</span>
      </div>
      <div class="info-item">
        <span class="label">Last Updated</span>
        <span class="value">{formatDate(company.updated_at)}</span>
      </div>
      {#if company.notes}
        <div class="info-item full-width">
          <span class="label">Notes</span>
          <p class="notes">{company.notes}</p>
        </div>
      {/if}
    </div>
  </BaseCard>
</div>

<style>
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

  .info-item.full-width {
    grid-column: 1 / -1;
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

  .notes {
    color: var(--color-text);
    line-height: 1.5;
    margin: 0;
  }

  @media (max-width: 768px) {
    .details-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
