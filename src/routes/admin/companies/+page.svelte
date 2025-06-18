<script lang="ts">
  import CompanyList from "$lib/components/CompanyList.svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
</script>

<div class="container space-y-8">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-h2 mb-2">Manage Companies</h2>
        <p class="text-muted">
          Create and manage your client companies across all industries
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" href="/admin/companies/import">
          Import Companies
        </BaseButton>
        <BaseButton variant="primary" href="/admin/companies/create">
          <span class="text-xl">+</span>
          New Company
        </BaseButton>
      </div>
    </div>
  </BaseCard>

  <!-- Company List -->
  <CompanyList />
</div>
