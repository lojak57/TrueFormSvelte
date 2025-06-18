<script lang="ts">
  import { onMount } from "svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  interface Company {
    id: string;
    name: string;
    website?: string;
    status: string;
    billing_city?: string;
    billing_state?: string;
    vertical_id?: string;
    created_at: string;
  }

  let companies: Company[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/companies");
      if (response.ok) {
        companies = await response.json();
      } else {
        error = "Failed to load companies";
      }
    } catch (err) {
      error = "Error loading companies";
      console.error("Error fetching companies:", err);
    } finally {
      loading = false;
    }
  });

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "active":
        return "text-success bg-success-100";
      case "inactive":
        return "text-error bg-error-100";
      case "pending":
        return "text-warn bg-warn-100";
      default:
        return "text-neutral-600 bg-neutral-100";
    }
  }

  function formatWebsite(website?: string): string {
    if (!website) return "";
    return website.replace(/^https?:\/\//, "");
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        companies = companies.filter((c) => c.id !== id);
      } else {
        error = "Failed to delete company";
      }
    } catch (err) {
      error = "Error deleting company";
      console.error("Error deleting company:", err);
    }
  }
</script>

<div class="company-list">
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
        <h3 class="text-h4 mb-2">Error Loading Companies</h3>
        <p class="text-muted">{error}</p>
        <BaseButton variant="primary" on:click={() => window.location.reload()}>
          Try Again
        </BaseButton>
      </div>
    </BaseCard>
  {:else if companies.length === 0}
    <BaseCard padding="lg">
      <div class="text-center">
        <div class="text-6xl mb-4">🏢</div>
        <h3 class="text-h4 mb-2">No Companies Yet</h3>
        <p class="text-muted mb-4">
          Start building your client portfolio by adding your first company.
        </p>
        <BaseButton variant="primary" href="/admin/companies/create">
          Add First Company
        </BaseButton>
      </div>
    </BaseCard>
  {:else}
    <div class="companies-grid">
      {#each companies as company}
        <BaseCard variant="compact" padding="md" clickable elevated>
          <div class="company-card-content">
            <!-- Company Header -->
            <div class="flex items-start gap-3 mb-4">
              <div class="company-avatar">
                {getInitials(company.name)}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="company-name">
                  {company.name}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="status-badge {getStatusColor(company.status)}">
                    {company.status}
                  </span>
                </div>
              </div>
            </div>

            <!-- Company Details -->
            <div class="company-details space-y-2">
              {#if company.website}
                <div class="company-detail">
                  <span class="detail-icon">🌐</span>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="detail-value"
                  >
                    {formatWebsite(company.website)}
                  </a>
                </div>
              {/if}

              {#if company.billing_city && company.billing_state}
                <div class="company-detail">
                  <span class="detail-icon">📍</span>
                  <span class="detail-value">
                    {company.billing_city}, {company.billing_state}
                  </span>
                </div>
              {/if}
            </div>

            <!-- Actions -->
            <div class="company-actions">
              <BaseButton
                variant="outline"
                size="sm"
                href="/admin/companies/{company.id}"
              >
                View
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                href="/admin/companies/{company.id}/edit"
              >
                Edit
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                on:click={() => handleDelete(company.id, company.name)}
              >
                Delete
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      {/each}
    </div>

    <!-- Summary -->
    <div class="company-summary">
      <BaseCard variant="compact" padding="md">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-h6 mb-1">Total Companies</h4>
            <p class="text-muted text-sm">
              {companies.length} compan{companies.length !== 1 ? "ies" : "y"} across
              all verticals
            </p>
          </div>
          <div class="text-h3 font-bold text-primary">
            {companies.length}
          </div>
        </div>
      </BaseCard>
    </div>
  {/if}
</div>

<style>
  .company-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .companies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-6);
    align-items: start;
  }

  @media (max-width: 768px) {
    .companies-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  @media (min-width: 1200px) {
    .companies-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  .company-card-content {
    height: 100%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .company-avatar {
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

  .company-name {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0;
    line-height: var(--leading-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-badge {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-md);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .company-details {
    flex: 1;
    margin: var(--space-4) 0;
  }

  .company-detail {
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

  .company-actions {
    display: flex;
    gap: var(--space-2);
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-muted);
  }

  .company-summary {
    margin-top: var(--space-4);
  }
</style>
