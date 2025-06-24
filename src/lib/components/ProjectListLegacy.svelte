<script lang="ts">
  import { onMount } from "svelte";
  import { ProjectService } from "$lib/services/ProjectService";
  import { CompanyService } from "$lib/services/CompanyService";
  import { User, Mail, Phone, Globe, Clock, ArrowRight } from "lucide-svelte";

  export let companyId: string | undefined = undefined;

  let projects: any[] = [];
  let companies: any[] = [];
  let error: string | null = null;
  let selectedProject: any = null;

  const projectService = new ProjectService();
  const companyService = new CompanyService();

  onMount(async () => {
    try {
      [projects, companies] = await Promise.all([
        projectService.getProjects(companyId),
        companyService.getCompanies(),
      ]);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    }
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectService.deleteProject(id);
      projects = projects.filter((p) => p.id !== id);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    }
  }

  function getCompanyName(companyId: string): string {
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "Unknown Company";
  }

  function isWizardSubmission(project: any): boolean {
    return (
      project.description?.includes("Conversational Wizard") ||
      project.project_type === "website" ||
      project.status === "lead"
    );
  }

  function parseWizardData(description: string) {
    const sections = description.split("\n\n");
    const data: any = {};

    sections.forEach((section) => {
      if (section.includes("Contact Information:")) {
        const lines = section.split("\n").slice(1);
        lines.forEach((line) => {
          if (line.includes("Email:"))
            data.email = line.split("Email:")[1]?.trim();
          if (line.includes("Phone:"))
            data.phone = line.split("Phone:")[1]?.trim();
          if (line.includes("Name:"))
            data.name = line.split("Name:")[1]?.trim();
        });
      }
      if (section.includes("Project Need:")) {
        data.projectNeed = section.split("Project Need:")[1]?.trim();
      }
      if (section.includes("Success Vision:")) {
        data.successVision = section.split("Success Vision:")[1]?.trim();
      }
      if (section.includes("Design Preferences:")) {
        data.designPrefs = section.split("Design Preferences:")[1]?.trim();
      }
      if (section.includes("Working Preferences:")) {
        data.workingStyle = section.split("Working Preferences:")[1]?.trim();
      }
      if (section.includes("Submitted:")) {
        const match = section.match(/Submitted: (.+)/);
        if (match) data.submittedAt = match[1];
      }
    });

    return data;
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "lead":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function showProjectDetails(project: any) {
    selectedProject = project;
  }

  function closeModal() {
    selectedProject = null;
  }

  function convertToOpportunity(project: any) {
    alert(`Converting "${project.name}" to opportunity in kanban board...`);
    // TODO: Implement opportunity conversion
  }

  // Separate lead projects from regular projects
  $: leadProjects = projects.filter((p) => isWizardSubmission(p));
  $: regularProjects = projects.filter((p) => !isWizardSubmission(p));
</script>

<div class="project-list">
  {#if error}
    <div class="error-banner">
      <p>{error}</p>
    </div>
  {/if}

  <!-- Lead Submissions Section -->
  {#if leadProjects.length > 0}
    <section class="leads-section">
      <div class="section-header">
        <h3>🎯 New Project Requests</h3>
        <p>Submissions from the conversational wizard</p>
      </div>

      <div class="project-grid">
        {#each leadProjects as project}
          {@const wizardData = parseWizardData(project.description || "")}
          <div class="lead-card" on:click={() => showProjectDetails(project)}>
            <div class="card-header">
              <div class="lead-badge">
                <span class="status-badge {getStatusColor(project.status)}">
                  {project.status}
                </span>
                <span class="time-badge">
                  <Clock size={14} />
                  {wizardData.submittedAt ||
                    new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div class="card-content">
              <h4>{project.name}</h4>
              <div class="company-name">
                {getCompanyName(project.company_id)}
              </div>

              {#if wizardData.name || wizardData.email}
                <div class="contact-info">
                  {#if wizardData.name}
                    <span class="contact-item">
                      <User size={14} />
                      {wizardData.name}
                    </span>
                  {/if}
                  {#if wizardData.email}
                    <span class="contact-item">
                      <Mail size={14} />
                      {wizardData.email}
                    </span>
                  {/if}
                </div>
              {/if}

              {#if wizardData.projectNeed}
                <div class="project-preview">
                  "{wizardData.projectNeed.substring(0, 100)}..."
                </div>
              {/if}

              {#if project.budget}
                <div class="budget-hint">
                  Budget estimate: ${project.budget.toLocaleString()}
                </div>
              {/if}
            </div>

            <div class="card-actions">
              <button
                class="action-btn view-btn"
                on:click|stopPropagation={() => showProjectDetails(project)}
              >
                View Details
                <ArrowRight size={14} />
              </button>
              <button
                class="action-btn convert-btn"
                on:click|stopPropagation={() => convertToOpportunity(project)}
              >
                Convert to Opportunity
              </button>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Regular Projects Section -->
  {#if regularProjects.length > 0}
    <section class="regular-projects">
      <div class="section-header">
        <h3>📁 Active Projects</h3>
        <p>Standard project management</p>
      </div>

      <div class="simple-project-list">
        {#each regularProjects as project}
          <div class="project-row">
            <div class="project-info">
              <h4>{project.name}</h4>
              <span class="status-badge {getStatusColor(project.status)}">
                {project.status}
              </span>
              {#if project.budget}
                <span class="budget">${project.budget.toLocaleString()}</span>
              {/if}
            </div>
            <div class="project-actions">
              <button
                class="edit-btn"
                on:click={() => showProjectDetails(project)}
              >
                View
              </button>
              <button
                class="delete-btn"
                on:click={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  {#if projects.length === 0 && !error}
    <div class="empty-state">
      <h3>No projects yet</h3>
      <p>
        Project submissions from your conversational wizard will appear here as
        beautiful cards.
      </p>
    </div>
  {/if}
</div>

<!-- Project Detail Modal -->
{#if selectedProject}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{selectedProject.name}</h2>
        <button class="close-btn" on:click={closeModal}>×</button>
      </div>

      <div class="modal-body">
        {#if isWizardSubmission(selectedProject)}
          {@const wizardData = parseWizardData(
            selectedProject.description || ""
          )}
          <div class="wizard-details">
            <div class="detail-section">
              <h4>Contact Information</h4>
              <div class="contact-grid">
                {#if wizardData.name}
                  <div class="contact-detail">
                    <User size={16} />
                    <span>{wizardData.name}</span>
                  </div>
                {/if}
                {#if wizardData.email}
                  <div class="contact-detail">
                    <Mail size={16} />
                    <span>{wizardData.email}</span>
                  </div>
                {/if}
                {#if wizardData.phone && wizardData.phone !== "Not provided"}
                  <div class="contact-detail">
                    <Phone size={16} />
                    <span>{wizardData.phone}</span>
                  </div>
                {/if}
              </div>
            </div>

            <div class="detail-section">
              <h4>Full Submission Details</h4>
              <div class="submission-content">
                {selectedProject.description}
              </div>
            </div>
          </div>
        {:else}
          <div class="regular-details">
            <p>
              <strong>Description:</strong>
              {selectedProject.description || "No description"}
            </p>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            {#if selectedProject.budget}
              <p>
                <strong>Budget:</strong>
                ${selectedProject.budget.toLocaleString()}
              </p>
            {/if}
            <p>
              <strong>Created:</strong>
              {new Date(selectedProject.created_at).toLocaleDateString()}
            </p>
          </div>
        {/if}
      </div>

      <div class="modal-actions">
        {#if isWizardSubmission(selectedProject)}
          <button
            class="primary-btn"
            on:click={() => convertToOpportunity(selectedProject)}
          >
            Convert to Opportunity
          </button>
        {/if}
        <button
          class="danger-btn"
          on:click={() => handleDelete(selectedProject.id)}
        >
          Delete Project
        </button>
        <button class="secondary-btn" on:click={closeModal}> Close </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    color: #dc2626;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .section-header p {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .lead-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .lead-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .lead-badge {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .bg-blue-100 {
    background: #dbeafe;
  }
  .text-blue-800 {
    color: #1e40af;
  }
  .bg-green-100 {
    background: #dcfce7;
  }
  .text-green-800 {
    color: #166534;
  }
  .bg-gray-100 {
    background: #f3f4f6;
  }
  .text-gray-800 {
    color: #1f2937;
  }
  .bg-yellow-100 {
    background: #fef3c7;
  }
  .text-yellow-800 {
    color: #92400e;
  }

  .time-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
  }

  .card-content h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .company-name {
    color: #3b82f6;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .project-preview {
    background: #f8fafc;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-style: italic;
    color: #475569;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .budget-hint {
    color: #059669;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .card-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .view-btn {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .view-btn:hover {
    background: #e5e7eb;
  }

  .convert-btn {
    background: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;
  }

  .convert-btn:hover {
    background: #2563eb;
  }

  .simple-project-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .project-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .project-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .project-info h4 {
    margin: 0;
    color: #111827;
  }

  .budget {
    color: #059669;
    font-weight: 500;
  }

  .project-actions {
    display: flex;
    gap: 0.5rem;
  }

  .edit-btn,
  .delete-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .edit-btn {
    background: #3b82f6;
    color: white;
    border: none;
  }

  .delete-btn {
    background: #ef4444;
    color: white;
    border: none;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }

  .empty-state h3 {
    margin-bottom: 0.5rem;
    color: #374151;
  }

  /* Modal styles */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 2xl;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .detail-section {
    margin-bottom: 2rem;
  }

  .detail-section h4 {
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .contact-detail {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #374151;
  }

  .submission-content {
    background: #f8fafc;
    padding: 1rem;
    border-radius: 0.5rem;
    white-space: pre-line;
    line-height: 1.6;
    color: #374151;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    justify-content: flex-end;
  }

  .primary-btn,
  .secondary-btn,
  .danger-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
  }

  .primary-btn {
    background: #3b82f6;
    color: white;
  }

  .secondary-btn {
    background: #f3f4f6;
    color: #374151;
  }

  .danger-btn {
    background: #ef4444;
    color: white;
  }

  @media (max-width: 768px) {
    .project-grid {
      grid-template-columns: 1fr;
    }

    .card-actions {
      flex-direction: column;
    }

    .modal-content {
      width: 95%;
      margin: 1rem;
    }
  }
</style>
