<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Search, Filter } from "lucide-svelte";

  export let searchTerm = "";
  export let statusFilter = "all";
  export let projectTypeFilter = "all";

  const dispatch = createEventDispatcher();

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" },
    { value: "lead", label: "Leads" },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "website", label: "Website" },
    { value: "web_app", label: "Web App" },
    { value: "mobile_app", label: "Mobile App" },
    { value: "consultation", label: "Consultation" },
    { value: "other", label: "Other" },
  ];

  function handleSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    searchTerm = target.value;
    dispatch("filter", {
      searchTerm,
      statusFilter,
      projectTypeFilter,
    });
  }

  function handleStatusChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    statusFilter = target.value;
    dispatch("filter", {
      searchTerm,
      statusFilter,
      projectTypeFilter,
    });
  }

  function handleTypeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    projectTypeFilter = target.value;
    dispatch("filter", {
      searchTerm,
      statusFilter,
      projectTypeFilter,
    });
  }

  function clearFilters() {
    searchTerm = "";
    statusFilter = "all";
    projectTypeFilter = "all";
    dispatch("filter", {
      searchTerm,
      statusFilter,
      projectTypeFilter,
    });
  }
</script>

<div class="filters-container">
  <div class="filters-header">
    <div class="filters-title">
      <Filter size={20} />
      <h3>Filter Projects</h3>
    </div>
    <button class="clear-filters" on:click={clearFilters}> Clear All </button>
  </div>

  <div class="filters-content">
    <!-- Search -->
    <div class="filter-group">
      <label for="search" class="filter-label">Search</label>
      <div class="search-input-container">
        <Search size={16} class="search-icon" />
        <input
          id="search"
          type="text"
          bind:value={searchTerm}
          on:input={handleSearchChange}
          placeholder="Search projects, companies..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Status Filter -->
    <div class="filter-group">
      <label for="status" class="filter-label">Status</label>
      <select
        id="status"
        bind:value={statusFilter}
        on:change={handleStatusChange}
        class="filter-select"
      >
        {#each statusOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <!-- Type Filter -->
    <div class="filter-group">
      <label for="type" class="filter-label">Project Type</label>
      <select
        id="type"
        bind:value={projectTypeFilter}
        on:change={handleTypeChange}
        class="filter-select"
      >
        {#each typeOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
  </div>
</div>

<style>
  .filters-container {
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .filters-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #374151;
  }

  .filters-title h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .clear-filters {
    background: none;
    border: 1px solid #d1d5db;
    color: #6b7280;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-filters:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
  }

  .filters-content {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 1rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .search-input-container {
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  :global(.search-icon) {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }

  .filter-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    .filters-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .filters-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
  }
</style>
