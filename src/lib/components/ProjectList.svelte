<script lang="ts">
  import { onMount } from 'svelte';
  import { ProjectService } from '$lib/services/ProjectService';
  
  export let companyId: string | undefined = undefined;
  
  let projects: any[] = [];
  let error: string | null = null;
  
  const projectService = new ProjectService();

  onMount(async () => {
    try {
      projects = await projectService.getProjects(companyId);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'An unknown error occurred';
    }
  });

  // Form functions will be added when ProjectForm component is created

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectService.deleteProject(id);
      projects = projects.filter(p => p.id !== id);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'An unknown error occurred';
    }
  }
</script>

<div class="project-list">
  <div class="header">
    <h2>Projects</h2>
    <!-- New Project button will be added when ProjectForm is created -->
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <!-- Project form will be added later -->

  <div class="list">
    {#each projects as project}
      <div class="project-card">
        <div class="info">
          <h3>{project.name}</h3>
          <p class="status">Status: {project.status}</p>
          {#if project.budget}
            <p class="budget">Budget: ${project.budget}</p>
          {/if}
          {#if project.start_date}
            <p class="date">Start: {new Date(project.start_date).toLocaleDateString()}</p>
          {/if}
        </div>
        <div class="actions">
          <!-- Edit button will be added when ProjectForm is created -->
          <button class="delete" on:click={() => handleDelete(project.id)}>Delete</button>
        </div>
      </div>
    {/each}
  </div>

  {#if projects.length === 0 && !error}
    <p class="empty">No projects found. Create your first project!</p>
  {/if}
</div>

<style>
  .project-list {
    padding: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .form-container {
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
  }

  .list {
    display: grid;
    gap: 1rem;
  }

  .project-card {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info h3 {
    margin: 0;
    font-size: 1.125rem;
    color: #7c3aed;
  }

  .info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .status {
    font-weight: 500;
    text-transform: capitalize;
  }

  .budget {
    color: #059669;
    font-weight: 500;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button:not(.delete) {
    background-color: #2563eb;
    color: white;
    border: none;
  }

  button:not(.delete):hover {
    background-color: #1d4ed8;
  }

  .delete {
    background-color: #ef4444;
    color: white;
    border: none;
  }

  .delete:hover {
    background-color: #dc2626;
  }

  .error {
    color: #dc2626;
    margin: 1rem 0;
  }

  .empty {
    text-align: center;
    color: #6b7280;
    margin: 2rem 0;
  }
</style> 