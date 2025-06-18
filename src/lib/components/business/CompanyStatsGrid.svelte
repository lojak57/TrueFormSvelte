<script lang="ts">
  export let stats: {
    total_contacts: number;
    active_contacts: number;
    total_projects: number;
    active_projects: number;
    completed_projects: number;
    total_project_value: number;
  };

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
</script>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon contacts">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{stats.total_contacts}</h3>
      <p class="stat-label">Total Contacts</p>
      <p class="stat-detail">{stats.active_contacts} active</p>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-icon projects">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 12l2 2 4-4" />
        <path
          d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"
        />
        <path
          d="M21 16H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-6c0-.552-.448-1-1-1z"
        />
      </svg>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{stats.total_projects}</h3>
      <p class="stat-label">Total Projects</p>
      <p class="stat-detail">
        {stats.active_projects} active, {stats.completed_projects} completed
      </p>
    </div>
  </div>

  <div class="stat-card">
    <div class="stat-icon revenue">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path
          d="M17 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"
        />
      </svg>
    </div>
    <div class="stat-content">
      <h3 class="stat-number">{formatCurrency(stats.total_project_value)}</h3>
      <p class="stat-label">Project Value</p>
      <p class="stat-detail">Total contract value</p>
    </div>
  </div>
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    color: white;
  }

  .stat-icon.contacts {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .stat-icon.projects {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .stat-icon.revenue {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  .stat-content {
    flex: 1;
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-neutral-900);
    margin: 0 0 0.25rem 0;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-neutral-900);
    margin: 0 0 0.25rem 0;
  }

  .stat-detail {
    font-size: 0.75rem;
    color: #111827;
    font-weight: 600;
    margin: 0;
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      padding: 1rem;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
    }

    .stat-number {
      font-size: 1.25rem;
    }
  }
</style>
