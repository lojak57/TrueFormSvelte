<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import BaseCard from '$lib/components/base/BaseCard.svelte';
  import BaseButton from '$lib/components/base/BaseButton.svelte';
  import CompanyHeader from '$lib/components/business/CompanyHeader.svelte';
  import CompanyDetailsGrid from '$lib/components/business/CompanyDetailsGrid.svelte';
  import CompanyStatsGrid from '$lib/components/business/CompanyStatsGrid.svelte';
  import CompanyProjectList from '$lib/components/business/CompanyProjectList.svelte';
  import CompanyContactsSection from '$lib/components/business/CompanyContactsSection.svelte';

  let company: any = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    await loadCompany();
  });

  async function loadCompany() {
    try {
      loading = true;
      const response = await fetch(`/api/companies/${$page.params.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      company = await response.json();
    } catch (err) {
      console.error('Failed to load company:', err);
      error = err instanceof Error ? err.message : 'Failed to load company';
    } finally {
      loading = false;
    }
  }



  function handleContactClick(contactId: string) {
    goto(`/admin/contacts/${contactId}`);
  }

  function handleEditCompany() {
    // TODO: Open company edit modal or navigate to edit page
    console.log('Edit company:', company.id);
  }

  function handleNewProject() {
    // TODO: Open new project modal
    console.log('New project for company:', company.id);
  }

  function handleNewContact() {
    // TODO: Open new contact modal with company pre-selected
    console.log('New contact for company:', company.id);
  }
</script>

<svelte:head>
  <title>{company ? `${company.name} - Company Details` : 'Loading...'} | TrueForm Admin</title>
</svelte:head>

<div class="company-detail">
  {#if loading}
    <BaseCard loading={true} padding="lg">
      <div class="loading-content">
        <h1 class="text-h1">Loading company details...</h1>
      </div>
    </BaseCard>
  {:else if error}
    <BaseCard padding="lg" clickable={false}>
      <div class="error-content">
        <h1 class="text-h1">Error Loading Company</h1>
        <p class="error-message">{error}</p>
        <BaseButton on:click={loadCompany}>Try Again</BaseButton>
      </div>
    </BaseCard>
  {:else if company}
    <!-- Company Header -->
    <CompanyHeader 
      {company}
      onEditCompany={handleEditCompany}
      onNewProject={handleNewProject}
      onNewContact={handleNewContact}
    />

    <!-- Stats Overview -->
    <CompanyStatsGrid stats={company.stats} />

    <!-- Company Details Grid -->
    <CompanyDetailsGrid {company} />

    <!-- Contacts Section -->
    <CompanyContactsSection 
      contacts={company.contacts}
      onContactClick={handleContactClick}
      onNewContact={handleNewContact}
    />

    <!-- Projects Section -->
    <CompanyProjectList projects={company.projects} />
  {/if}
</div>

<style>
  .company-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .loading-content,
  .error-content {
    text-align: center;
    padding: 2rem 0;
  }

  .error-message {
    color: var(--color-danger);
    margin-bottom: 1rem;
  }
</style> 