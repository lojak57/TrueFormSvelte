<script lang="ts">
  export let projects: Array<{
    id: string;
    name: string;
    description?: string;
    status: string;
    project_type?: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    created_at: string;
  }>;

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format date
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Get status variant
  function getStatusVariant(status: string): string {
    switch (status) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "proposal":
        return "warning";
      case "on_hold":
        return "secondary";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  }

  // Get status label
  function getStatusLabel(status: string): string {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "on_hold":
        return "On Hold";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  // Get project type icon
  function getProjectTypeIcon(type?: string): string {
    switch (type) {
      case "website":
        return "🌐";
      case "web_app":
        return "💻";
      case "booking_system":
        return "📅";
      case "ecommerce":
        return "🛒";
      default:
        return "📋";
    }
  }
</script>

<div class="project-list">
  <div class="list-header">
    <h3 class="text-h3">Projects ({projects.length})</h3>
  </div>

  {#if projects.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📋</div>
      <h4>No projects yet</h4>
      <p class="text-muted">
        Projects will appear here once they're created for this company.
      </p>
    </div>
  {:else}
    <div class="project-grid">
      {#each projects as project}
        <div class="project-card">
          <div class="project-header">
            <div class="project-icon">
              {getProjectTypeIcon(project.project_type)}
            </div>
            <div class="project-title">
              <h4>{project.name}</h4>
              <div class="project-meta">
                <div class="status-badge {getStatusVariant(project.status)}">
                  {getStatusLabel(project.status)}
                </div>
                {#if project.budget}
                  <span class="budget">{formatCurrency(project.budget)}</span>
                {/if}
              </div>
            </div>
          </div>

          {#if project.description}
            <p class="project-description">{project.description}</p>
          {/if}

          <div class="project-details">
            {#if project.start_date}
              <div class="detail-item">
                <span class="label">Start:</span>
                <span class="value">{formatDate(project.start_date)}</span>
              </div>
            {/if}
            {#if project.end_date}
              <div class="detail-item">
                <span class="label">End:</span>
                <span class="value">{formatDate(project.end_date)}</span>
              </div>
            {/if}
            <div class="detail-item">
              <span class="label">Created:</span>
              <span class="value">{formatDate(project.created_at)}</span>
            </div>
          </div>

          <div class="project-actions">
            <button class="btn-ghost btn-sm">View Details</button>
            <button class="btn-outline btn-sm">Edit</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .project-list {
    margin-bottom: 2rem;
  }

  .list-header {
    margin-bottom: 1rem;
  }

  .project-grid {
    display: grid;
    gap: 1rem;
  }

  .project-card {
    padding: 1.5rem;
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
  }

  .project-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .project-icon {
    font-size: 1.5rem;
    padding: 0.5rem;
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .project-title {
    flex: 1;
  }

  .project-title h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 800;
    color: #111827;
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
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

  .status-badge.primary {
    background: var(--color-primary-bg);
    color: var(--color-primary-text);
    border: 1px solid var(--color-primary-border);
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

  .status-badge.danger {
    background: var(--color-danger-bg);
    color: var(--color-danger-text);
    border: 1px solid var(--color-danger-border);
  }

  .budget {
    font-size: 0.875rem;
    font-weight: 700;
    color: #059669;
  }

  .project-description {
    color: #111827;
    font-weight: 600;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .project-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .detail-item .label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .detail-item .value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 600;
  }

  .project-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--color-muted);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h4 {
    margin: 0 0 0.5rem 0;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0;
  }

  @media (max-width: 640px) {
    .project-header {
      flex-direction: column;
      gap: 0.75rem;
    }

    .project-actions {
      justify-content: stretch;
    }

    .project-actions button {
      flex: 1;
    }

    .project-details {
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-item {
      justify-content: space-between;
    }
  }
</style>
