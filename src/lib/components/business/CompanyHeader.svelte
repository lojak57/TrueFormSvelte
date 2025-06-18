<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  export let company: any;
  export let onEditCompany: () => void;
  export let onNewProject: () => void;
  export let onNewContact: () => void;

  function getCompanyInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  }

  function getStatusVariant(status: string): string {
    switch (status) {
      case "active":
        return "success";
      case "prospect":
        return "warning";
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  }
</script>

<BaseCard variant="hero" padding="lg">
  <div class="company-header">
    <div class="company-avatar">
      {getCompanyInitials(company.name)}
    </div>
    <div class="company-info">
      <div class="company-title">
        <h1 class="text-h1">{company.name}</h1>
        <div class="status-badge {getStatusVariant(company.status)}">
          {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
        </div>
      </div>
      <div class="company-meta">
        {#if company.industry}
          <span class="meta-item">{company.industry}</span>
        {/if}
        {#if company.size}
          <span class="meta-item">{company.size}</span>
        {/if}
        {#if company.annual_revenue}
          <span class="meta-item">{company.annual_revenue}</span>
        {/if}
      </div>
      <div class="company-actions">
        <BaseButton on:click={onEditCompany}>Edit Company</BaseButton>
        <BaseButton variant="outline" on:click={onNewProject}
          >New Project</BaseButton
        >
        <BaseButton variant="outline" on:click={onNewContact}
          >Add Contact</BaseButton
        >
      </div>
    </div>
  </div>
</BaseCard>

<style>
  .company-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .company-avatar {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .company-info {
    flex: 1;
  }

  .company-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .company-title h1 {
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

  .company-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    font-size: 0.875rem;
    color: var(--color-muted);
    padding: 0.25rem 0.5rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .company-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .company-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .company-title {
      flex-direction: column;
      gap: 0.5rem;
    }

    .company-actions {
      justify-content: center;
    }
  }
</style>
