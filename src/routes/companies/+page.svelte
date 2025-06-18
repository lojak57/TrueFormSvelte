<script lang="ts">
  import CompanyList from "$lib/components/CompanyList.svelte";
</script>

<div class="companies-page">
  <h1>Companies</h1>
  <CompanyList />
</div>

<style>
  .companies-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }
</style>
