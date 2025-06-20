<script lang="ts">
  import ProjectList from "$lib/components/ProjectList.svelte";
  import CRMHeader from "$lib/components/ui/CRMHeader.svelte";
  import { Rocket, Plus } from "lucide-svelte";
</script>

<div class="projects-page">
  <CRMHeader 
    title="Active Initiatives Portfolio" 
    subtitle="Monitor and orchestrate strategic client engagements with precision"
    icon={Rocket}
  >
    <div slot="actions" class="header-actions">
      <button class="action-button launch-btn">
        <Plus size={16} class="plus-icon" />
        Launch Initiative
      </button>
    </div>
  </CRMHeader>

  <div class="page-content">
    <ProjectList />
  </div>
</div>

<style>
  .projects-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: 0 4px 12px rgba(71, 85, 105, 0.1);
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .launch-btn {
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

  .launch-btn:hover {
    background: linear-gradient(135deg, #334155 0%, #475569 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(71, 85, 105, 0.3);
  }

  .plus-icon {
    transition: transform 0.2s ease;
  }
  
  .launch-btn:hover .plus-icon {
    transform: rotate(90deg);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .page-content {
      padding: 16px;
      margin: 16px;
    }

    .header-actions {
      width: 100%;
      justify-content: center;
    }

    .launch-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
