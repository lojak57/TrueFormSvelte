<script lang="ts">
  import CompanyList from "$lib/components/CompanyList.svelte";
  import CRMHeader from "$lib/components/ui/CRMHeader.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import { Building2, Upload, Plus } from "lucide-svelte";
</script>

<div class="companies-page">
  <CRMHeader
    title="Client Organizations Registry"
    subtitle="Curate and oversee your distinguished client portfolio across all market verticals"
    icon={Building2}
  >
    <div slot="actions" class="header-actions">
      <BaseButton
        variant="outline"
        href="/admin/companies/import"
        class="action-button"
      >
        <Upload size={16} class="mr-2" />
        Import Registry
      </BaseButton>
      <BaseButton
        variant="primary"
        href="/admin/companies/create"
        class="action-button"
      >
        <Plus size={16} class="mr-2" />
        Onboard Organization
      </BaseButton>
    </div>
  </CRMHeader>

  <div class="page-content">
    <CompanyList />
  </div>
</div>

<style>
  .companies-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  :global(.action-button) {
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  :global(.action-button:hover) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(71, 85, 105, 0.15);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .page-content {
      padding: 16px;
    }

    .header-actions {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    :global(.action-button) {
      width: 100%;
      justify-content: center;
    }
  }
</style>
