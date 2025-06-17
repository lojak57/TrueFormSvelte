<script lang="ts">
  import ProjectList from '$lib/components/ProjectList.svelte';
</script>

<div class="admin-projects">
  <div class="page-header">
    <div class="header-content">
      <div>
        <h2>Manage Projects</h2>
        <p>Track and organize your client projects</p>
      </div>
      <div class="quick-actions">
        <button class="new-project-btn">
          <span>+</span>
          New Project
        </button>
      </div>
    </div>
  </div>

  <div class="page-content">
    <ProjectList />
  </div>
</div>

<style>
  .admin-projects {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
  }

  .header-content p {
    margin: 0;
    color: #64748b;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
  }

  .new-project-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #8b5cf6;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .new-project-btn:hover {
    background-color: #7c3aed;
  }

  .new-project-btn span {
    font-size: 1.25rem;
  }

  .page-content {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
</style> 