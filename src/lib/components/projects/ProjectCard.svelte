<script lang="ts">
  import { Globe, Clock, ArrowRight } from "lucide-svelte";
  import type { Project, Company } from "$lib/types";

  export let project: Project;
  export let company: Company | undefined;
  export let isWizardSubmission = false;
  export let onClick: () => void;
  export let onConvert: (() => void) | undefined = undefined;

  function getStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "#10b981";
      case "completed":
        return "#3b82f6";
      case "on_hold":
        return "#f59e0b";
      case "lead":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  }

  function parseWizardData(description: string) {
    try {
      const lines = description.split("\n");
      const data: Record<string, string> = {};

      lines.forEach((line) => {
        if (line.includes(":")) {
          const [key, value] = line.split(":").map((s) => s.trim());
          data[key] = value;
        }
      });

      return data;
    } catch {
      return {};
    }
  }

  $: wizardData = isWizardSubmission
    ? parseWizardData(project.description || "")
    : {};
</script>

{#if isWizardSubmission}
  <div
    class="lead-card"
    on:click={onClick}
    on:keydown
    role="button"
    tabindex="0"
  >
    <div class="card-header">
      <div class="lead-badge">
        <span class="badge-icon">🎯</span>
        New Lead
      </div>
      <div
        class="status-indicator"
        style="background-color: {getStatusColor(project.status)}"
      >
        {project.status}
      </div>
    </div>

    <div class="card-content">
      <h4 class="project-title">{project.name}</h4>
      <div class="company-name">{company?.name || "Unknown Company"}</div>

      {#if wizardData["Contact Name"] || wizardData["Email"] || wizardData["Phone"]}
        <div class="contact-info">
          {#if wizardData["Contact Name"]}
            <div class="contact-item">
              <span class="contact-label">Contact:</span>
              {wizardData["Contact Name"]}
            </div>
          {/if}
          {#if wizardData["Email"]}
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              {wizardData["Email"]}
            </div>
          {/if}
          {#if wizardData["Phone"]}
            <div class="contact-item">
              <span class="contact-label">Phone:</span>
              {wizardData["Phone"]}
            </div>
          {/if}
        </div>
      {/if}

      <div class="project-meta">
        {#if wizardData["Website Type"]}
          <div class="meta-item">
            <Globe size={16} />
            {wizardData["Website Type"]}
          </div>
        {/if}
        <div class="meta-item">
          <Clock size={16} />
          {new Date(project.created_at).toLocaleDateString()}
        </div>
      </div>

      {#if wizardData["Budget Range"]}
        <div class="budget-info">
          <strong>Budget:</strong>
          {wizardData["Budget Range"]}
        </div>
      {/if}
    </div>

    <div class="card-actions">
      <button class="view-details-btn">
        View Details
        <ArrowRight size={16} />
      </button>
      {#if onConvert}
        <button class="convert-btn" on:click|stopPropagation={onConvert}>
          Convert to Opportunity
        </button>
      {/if}
    </div>
  </div>
{:else}
  <div
    class="project-card"
    on:click={onClick}
    on:keydown
    role="button"
    tabindex="0"
  >
    <div class="card-header">
      <div
        class="status-indicator"
        style="background-color: {getStatusColor(project.status)}"
      >
        {project.status}
      </div>
    </div>

    <div class="card-content">
      <h4 class="project-title">{project.name}</h4>
      <div class="company-name">{company?.name || "Unknown Company"}</div>

      {#if project.description}
        <p class="project-description">{project.description}</p>
      {/if}

      <div class="project-meta">
        <div class="meta-item">
          <Clock size={16} />
          {new Date(project.created_at).toLocaleDateString()}
        </div>
        {#if project.budget}
          <div class="meta-item budget">
            ${project.budget.toLocaleString()}
          </div>
        {/if}
      </div>
    </div>

    <div class="card-actions">
      <button class="view-details-btn">
        View Details
        <ArrowRight size={16} />
      </button>
    </div>
  </div>
{/if}

<style>
  .lead-card,
  .project-card {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .lead-card:hover,
  .project-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lead-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  .badge-icon {
    font-size: 1rem;
  }

  .status-indicator {
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .project-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .company-name {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .project-description {
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .contact-info {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border-left: 3px solid #8b5cf6;
  }

  .contact-item {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }

  .contact-item:last-child {
    margin-bottom: 0;
  }

  .contact-label {
    font-weight: 600;
    color: #374151;
  }

  .project-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .meta-item.budget {
    font-weight: 600;
    color: #059669;
  }

  .budget-info {
    font-size: 0.875rem;
    color: #059669;
    background: #d1fae5;
    padding: 0.5rem;
    border-radius: 0.375rem;
  }

  .card-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
  }

  .view-details-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f3f4f6;
    color: #374151;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
  }

  .view-details-btn:hover {
    background: #e5e7eb;
    color: #1f2937;
  }

  .convert-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .convert-btn:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
</style>
