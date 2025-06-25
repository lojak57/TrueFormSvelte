<script lang="ts">
  export let companiesCount: number;
  export let contactsCount: number;
  export let projectsCount: number;
  export let verticalsCount: number = 12;
</script>

<div class="stats-grid">
  <div class="stat-item">
    <div class="stat-number">{companiesCount}</div>
    <div class="stat-label">Companies</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{contactsCount}</div>
    <div class="stat-label">Contacts</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{projectsCount}</div>
    <div class="stat-label">Projects</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{verticalsCount}</div>
    <div class="stat-label">Verticals</div>
  </div>
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-6);
  }

  .stat-item {
    text-align: center;
    padding: var(--space-4);
    background: rgba(255, 255, 255, 0.5);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(var(--color-border-rgb), 0.1);
  }

  .stat-number {
    font-size: var(--text-3xl);
    font-weight: var(--font-bold);
    color: var(--color-primary-500);
    margin-bottom: var(--space-1);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    font-weight: var(--font-medium);
  }
</style>
