<script lang="ts">
  import CompanyList from "$lib/components/CompanyList.svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import { Building2, Upload, Plus } from "lucide-svelte";
</script>

<div class="container space-y-8">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-h2 mb-2 flex items-center gap-3">
          <Building2 size={28} class="text-slate-600" />
          Client Organizations Registry
        </h2>
        <p class="text-muted">
          Curate and oversee your distinguished client portfolio across all market verticals
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" href="/admin/companies/import">
          <Upload size={16} class="mr-2" />
          Import Registry
        </BaseButton>
        <BaseButton variant="primary" href="/admin/companies/create">
          <Plus size={16} class="mr-2" />
          Onboard Organization
        </BaseButton>
      </div>
    </div>
  </BaseCard>

  <!-- Company List -->
  <CompanyList />
</div>
