<script lang="ts">
  import ProjectList from "$lib/components/ProjectList.svelte";
  import { Rocket, Plus } from "lucide-svelte";
</script>

<div class="admin-projects">
  <div class="page-header">
    <div class="header-content">
      <div>
        <h2 class="header-title">
          <Rocket size={28} class="header-icon" />
          Active Initiatives Portfolio
        </h2>
        <p>Monitor and orchestrate strategic client engagements with precision</p>
      </div>
      <div class="quick-actions">
        <button class="new-project-btn">
          <Plus size={16} class="plus-icon" />
          Launch Initiative
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
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    padding: 2rem;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: 0 4px 12px rgba(71, 85, 105, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    letter-spacing: -0.01em;
  }
  
  .header-icon {
    color: #475569;
  }

  .header-content p {
    margin: 0;
    color: #475569;
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
  }

  .new-project-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #475569 0%, #64748b 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 8px rgba(71, 85, 105, 0.2);
  }

  .new-project-btn:hover {
    background: linear-gradient(135deg, #334155 0%, #475569 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(71, 85, 105, 0.3);
  }

  .plus-icon {
    transition: transform 0.2s ease;
  }
  
  .new-project-btn:hover .plus-icon {
    transform: rotate(90deg);
  }

  .page-content {
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    padding: 2rem;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: 0 4px 12px rgba(71, 85, 105, 0.1);
  }
</style>
