<script lang="ts">
  import { onMount } from "svelte";
  import { ProjectService } from "$lib/services/ProjectService";
  import { CompanyService } from "$lib/services/CompanyService";
  import ProjectCard from "./projects/ProjectCard.svelte";
  import ProjectModal from "./projects/ProjectModal.svelte";
  import ProjectFilters from "./projects/ProjectFilters.svelte";
  import type { Project, Company } from "$lib/types";

  export let companyId: string | undefined = undefined;

  let projects: Project[] = [];
  let companies: Company[] = [];
  let filteredProjects: Project[] = [];
  let error: string | null = null;
  let selectedProject: Project | null = null;

  // Filter state
  let searchTerm = "";
  let statusFilter = "all";
  let projectTypeFilter = "all";

  const projectService = new ProjectService();
  const companyService = new CompanyService();

  onMount(async () => {
    try {
      [projects, companies] = await Promise.all([
        projectService.getProjects(companyId),
        companyService.getCompanies(),
      ]);
      applyFilters();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    }
  });

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await projectService.deleteProject(id);
      projects = projects.filter((p) => p.id !== id);
      applyFilters();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : "An unknown error occurred";
    }
  }

  function getCompanyForProject(project: Project): Company | undefined {
    return companies.find((c) => c.id === project.company_id);
  }

  function isWizardSubmission(project: Project): boolean {
    return (
      project.description?.includes("Conversational Wizard") ||
      (project.project_type === "website" && project.status === "lead")
    );
  }

  function isWeKnowCoLead(project: Project): boolean {
    return (
      project.description?.includes("WeKnowCo Marketing Platform") ||
      project.project_type === "marketing" ||
      project.name?.includes("Marketing Lead")
    );
  }

  function applyFilters() {
    let filtered = projects;

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(search) ||
          project.description?.toLowerCase().includes(search) ||
          getCompanyForProject(project)?.name.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    // Apply type filter
    if (projectTypeFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.project_type === projectTypeFilter
      );
    }

    filteredProjects = filtered;
  }

  function handleFilterChange(event: CustomEvent) {
    const {
      searchTerm: newSearch,
      statusFilter: newStatus,
      projectTypeFilter: newType,
    } = event.detail;
    searchTerm = newSearch;
    statusFilter = newStatus;
    projectTypeFilter = newType;
    applyFilters();
  }

  function showProjectDetails(project: Project) {
    selectedProject = project;
  }

  function closeModal() {
    selectedProject = null;
  }

  function convertToOpportunity(project: Project) {
    // Implementation coming soon - redirect to opportunities page
    closeModal();
    // Could redirect to: `/admin/opportunities/create?project=${project.id}`
  }

  // Separate projects into different types
  $: trueFormLeads = filteredProjects.filter(
    (p) => isWizardSubmission(p) && !isWeKnowCoLead(p)
  );
  $: weKnowCoLeads = filteredProjects.filter((p) => isWeKnowCoLead(p));
  $: regularProjects = filteredProjects.filter(
    (p) => !isWizardSubmission(p) && !isWeKnowCoLead(p)
  );
</script>

<div class="project-list">
  {#if error}
    <div class="error-banner">
      <p class="error-message">⚠️ {error}</p>
    </div>
  {/if}

  <!-- Filters -->
  <ProjectFilters on:filter={handleFilterChange} />

  <!-- TrueForm Website Leads Section -->
  {#if trueFormLeads.length > 0}
    <section class="leads-section">
      <div class="section-header">
        <h2 class="section-title">🎯 TrueForm Website Leads</h2>
        <span class="lead-count">{trueFormLeads.length}</span>
      </div>
      <div class="project-grid">
        {#each trueFormLeads as project}
          <ProjectCard
            {project}
            company={getCompanyForProject(project)}
            isWizardSubmission={true}
            onClick={() => showProjectDetails(project)}
            onConvert={() => convertToOpportunity(project)}
          />
        {/each}
      </div>
    </section>
  {/if}

  <!-- WeKnowCo Marketing Leads Section -->
  {#if weKnowCoLeads.length > 0}
    <section class="weknowco-leads-section">
      <div class="section-header">
        <h2 class="section-title">🚀 WeKnowCo Marketing Leads</h2>
        <span class="weknowco-count">{weKnowCoLeads.length}</span>
      </div>
      <div class="project-grid">
        {#each weKnowCoLeads as project}
          <ProjectCard
            {project}
            company={getCompanyForProject(project)}
            isWizardSubmission={false}
            onClick={() => showProjectDetails(project)}
            onConvert={() => convertToOpportunity(project)}
          />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Regular Projects Section -->
  {#if regularProjects.length > 0}
    <section class="projects-section">
      <div class="section-header">
        <h2 class="section-title">📋 Projects</h2>
        <span class="project-count">{regularProjects.length}</span>
      </div>
      <div class="project-grid">
        {#each regularProjects as project}
          <ProjectCard
            {project}
            company={getCompanyForProject(project)}
            isWizardSubmission={false}
            onClick={() => showProjectDetails(project)}
          />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Empty State -->
  {#if filteredProjects.length === 0 && !error}
    <div class="empty-state">
      <h3>No projects found</h3>
      <p>Try adjusting your filters or create a new project.</p>
    </div>
  {/if}
</div>

<!-- Project Detail Modal -->
<ProjectModal
  project={selectedProject}
  company={selectedProject ? getCompanyForProject(selectedProject) : undefined}
  isWizardSubmission={selectedProject
    ? isWizardSubmission(selectedProject)
    : false}
  on:close={closeModal}
  on:convert={(event) => convertToOpportunity(event.detail)}
/>

<style>
  .project-list {
    width: 100%;
    padding: 1rem;
  }

  .error-banner {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .error-message {
    color: #dc2626;
    margin: 0;
    font-weight: 500;
  }

  .leads-section,
  .weknowco-leads-section,
  .projects-section {
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .lead-count,
  .weknowco-count,
  .project-count {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .weknowco-count {
    background: #10b981;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #6b7280;
  }

  .empty-state h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #374151;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .project-list {
      padding: 0.5rem;
    }

    .project-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .section-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
</style>
