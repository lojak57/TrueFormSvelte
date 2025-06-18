<script lang="ts">
  import { onMount } from "svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  interface Vertical {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }

  let verticals: Vertical[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch("/api/verticals");
      if (response.ok) {
        verticals = await response.json();
      } else {
        error = "Failed to load verticals";
      }
    } catch (err) {
      error = "Error loading verticals";
      console.error("Error fetching verticals:", err);
    } finally {
      loading = false;
    }
  });

  function handleEdit(vertical: Vertical) {
    console.log("Edit vertical:", vertical);
  }

  function handleDelete(vertical: Vertical) {
    if (
      !confirm(
        `Are you sure you want to delete the "${vertical.name}" vertical?`
      )
    )
      return;
    console.log("Delete vertical:", vertical);
  }
</script>

<div class="vertical-list">
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
        <h3 class="text-h4 mb-2">Error Loading Verticals</h3>
        <p class="text-muted">{error}</p>
        <BaseButton variant="primary" on:click={() => window.location.reload()}>
          Try Again
        </BaseButton>
      </div>
    </BaseCard>
  {:else if verticals.length === 0}
    <BaseCard padding="lg">
      <div class="text-center">
        <div class="text-6xl mb-4">🏢</div>
        <h3 class="text-h4 mb-2">No Verticals Yet</h3>
        <p class="text-muted mb-4">
          Start organizing your business by adding industry verticals.
        </p>
        <BaseButton variant="primary">Add First Vertical</BaseButton>
      </div>
    </BaseCard>
  {:else}
    <div class="verticals-grid">
      {#each verticals as vertical}
        <BaseCard variant="compact" padding="md" clickable elevated>
          <div class="vertical-card-content">
            <!-- Vertical Header -->
            <div class="flex items-start gap-3 mb-4">
              <div
                class="vertical-avatar"
                style="background-color: {vertical.color}"
              >
                {vertical.icon}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="vertical-name">
                  {vertical.name}
                </h3>
                <p class="vertical-description">
                  {vertical.description}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="vertical-actions">
              <BaseButton
                variant="outline"
                size="sm"
                on:click={() => handleEdit(vertical)}
              >
                Edit
              </BaseButton>
              <BaseButton
                variant="ghost"
                size="sm"
                href="/admin/companies?vertical={vertical.id}"
              >
                View Companies
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                on:click={() => handleDelete(vertical)}
              >
                Delete
              </BaseButton>
            </div>
          </div>
        </BaseCard>
      {/each}
    </div>

    <!-- Summary -->
    <div class="vertical-summary">
      <BaseCard variant="compact" padding="md">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-h6 mb-1">Total Verticals</h4>
            <p class="text-muted text-sm">
              {verticals.length} industr{verticals.length !== 1 ? "ies" : "y"} configured
              for your business
            </p>
          </div>
          <div class="text-h3 font-bold text-primary">
            {verticals.length}
          </div>
        </div>
      </BaseCard>
    </div>
  {/if}
</div>

<style>
  .vertical-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .verticals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--space-6);
    align-items: start;
  }

  @media (max-width: 768px) {
    .verticals-grid {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
  }

  @media (min-width: 1200px) {
    .verticals-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  .vertical-card-content {
    height: 100%;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .vertical-avatar {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .vertical-name {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-1) 0;
    line-height: var(--leading-tight);
  }

  .vertical-description {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin: 0;
    line-height: var(--leading-relaxed);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .vertical-actions {
    display: flex;
    gap: var(--space-2);
    margin-top: auto;
    padding-top: var(--space-3);
    border-top: 1px solid var(--color-border-muted);
  }

  .vertical-summary {
    margin-top: var(--space-4);
  }
</style>
