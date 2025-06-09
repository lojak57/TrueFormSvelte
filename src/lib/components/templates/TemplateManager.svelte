<!-- Template Manager Component -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { templateAPI, proposalAPI } from '$lib/api/proposals';
  import type { ProposalTemplate, LineItemData } from '$lib/types/proposals';

  // Template state
  let templates: ProposalTemplate[] = [];
  let filteredTemplates: ProposalTemplate[] = [];
  let selectedTemplate: ProposalTemplate | null = null;
  let isLoading = true;
  let error: string | null = null;

  // UI state
  let showCreateModal = false;
  let showEditModal = false;
  let searchQuery = '';
  let selectedCategory = 'all';
  let sortBy: 'name' | 'usageCount' | 'createdAt' = 'name';
  let sortOrder: 'asc' | 'desc' = 'asc';
  let viewMode: 'grid' | 'list' = 'grid';

  // Create/Edit form
  let templateForm = {
    name: '',
    description: '',
    category: 'website',
    lineItems: [] as LineItemData[],
    paymentTerms: '50% upfront, 50% on completion',
    projectTimeline: '4-6 weeks',
    defaultCurrency: 'USD' as const
  };

  // Categories
  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'website', label: 'Website Development' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'webapp', label: 'Web Applications' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'design', label: 'Design Services' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'custom', label: 'Custom' }
  ];

  onMount(() => {
    loadTemplates();
  });

  // Watch for filter changes
  $: if (templates.length > 0) {
    applyFilters();
  }

  async function loadTemplates() {
    isLoading = true;
    error = null;

    try {
      templates = await templateAPI.list();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load templates';
      console.error('Template loading error:', err);
    } finally {
      isLoading = false;
    }
  }

  function applyFilters() {
    let filtered = [...templates];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'usageCount':
          aVal = a.usageCount;
          bVal = b.usageCount;
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : 1;
      }
      return aVal < bVal ? -1 : 1;
    });

    filteredTemplates = filtered;
  }

  function openCreateModal() {
    templateForm = {
      name: '',
      description: '',
      category: 'website',
      lineItems: [],
      paymentTerms: '50% upfront, 50% on completion',
      projectTimeline: '4-6 weeks',
      defaultCurrency: 'USD'
    };
    showCreateModal = true;
  }

  function openEditModal(template: ProposalTemplate) {
    selectedTemplate = template;
    templateForm = {
      name: template.name,
      description: template.description,
      category: template.category,
      lineItems: [...template.templateData.lineItems],
      paymentTerms: template.templateData.paymentTerms || '50% upfront, 50% on completion',
      projectTimeline: template.templateData.projectTimeline || '4-6 weeks',
      defaultCurrency: template.templateData.defaultCurrency || 'USD'
    };
    showEditModal = true;
  }

  function closeModals() {
    showCreateModal = false;
    showEditModal = false;
    selectedTemplate = null;
  }

  async function saveTemplate() {
    try {
      const templateData = {
        name: templateForm.name,
        description: templateForm.description,
        category: templateForm.category,
        templateData: {
          lineItems: templateForm.lineItems,
          paymentTerms: templateForm.paymentTerms,
          projectTimeline: templateForm.projectTimeline,
          defaultCurrency: templateForm.defaultCurrency
        },
        organizationId: 'org-1', // Would come from auth context
        isActive: true,
        version: 1,
        usageCount: 0,
        createdBy: 'user-1' // Would come from auth context
      };

      if (selectedTemplate) {
        // Update existing template
        await templateAPI.update(selectedTemplate.id, templateData);
      } else {
        // Create new template
        await templateAPI.create(templateData);
      }

      await loadTemplates();
      closeModals();
    } catch (err) {
      console.error('Failed to save template:', err);
      error = 'Failed to save template';
    }
  }

  async function deleteTemplate(template: ProposalTemplate) {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return;
    }

    try {
      await templateAPI.delete(template.id);
      await loadTemplates();
    } catch (err) {
      console.error('Failed to delete template:', err);
      error = 'Failed to delete template';
    }
  }

  async function duplicateTemplate(template: ProposalTemplate) {
    try {
      const duplicatedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        usageCount: 0
      };
      
      await templateAPI.create(duplicatedTemplate);
      await loadTemplates();
    } catch (err) {
      console.error('Failed to duplicate template:', err);
      error = 'Failed to duplicate template';
    }
  }

  async function useTemplate(template: ProposalTemplate) {
    try {
      await templateAPI.recordUsage(template.id);
      // Navigate to proposal wizard with template applied
      window.location.href = `/proposals/new?template=${template.id}`;
    } catch (err) {
      console.error('Failed to use template:', err);
    }
  }

  function addLineItem() {
    templateForm.lineItems = [
      ...templateForm.lineItems,
      {
        id: `item-${Date.now()}`,
        itemType: 'development',
        title: '',
        description: '',
        quantity: 1,
        unitType: 'hours',
        unitPrice: 0,
        totalPrice: 0,
        estimatedHours: 0,
        complexityLevel: 'medium',
        sortOrder: templateForm.lineItems.length + 1
      }
    ];
  }

  function removeLineItem(index: number) {
    templateForm.lineItems = templateForm.lineItems.filter((_, i) => i !== index);
  }

  function updateLineItem(index: number, updates: Partial<LineItemData>) {
    templateForm.lineItems = templateForm.lineItems.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    );
  }

  function calculateTemplateValue(template: ProposalTemplate): number {
    return template.templateData.lineItems.reduce(
      (sum, item) => sum + (item.unitPrice * item.quantity), 
      0
    );
  }
</script>

<!-- Template Manager -->
<div class="template-manager">
  <!-- Header -->
  <div class="manager-header">
    <div>
      <h1 class="manager-title">Template Manager</h1>
      <p class="manager-subtitle">Create and manage proposal templates</p>
    </div>

    <button
      type="button"
      class="btn btn-primary"
      on:click={openCreateModal}
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      New Template
    </button>
  </div>

  <!-- Filters and Controls -->
  <div class="controls-section">
    <div class="filters">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search templates..."
          bind:value={searchQuery}
          class="search-input"
        />
      </div>

      <!-- Category Filter -->
      <select bind:value={selectedCategory} class="category-filter">
        {#each categories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>

      <!-- Sort Controls -->
      <select bind:value={sortBy} class="sort-select">
        <option value="name">Sort by Name</option>
        <option value="usageCount">Sort by Usage</option>
        <option value="createdAt">Sort by Date</option>
      </select>

      <button
        type="button"
        class="sort-order-btn"
        on:click={() => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'}
        title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if sortOrder === 'asc'}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          {/if}
        </svg>
      </button>
    </div>

    <!-- View Mode Toggle -->
    <div class="view-controls">
      <button
        type="button"
        class="view-btn"
        class:active={viewMode === 'grid'}
        on:click={() => viewMode = 'grid'}
        title="Grid View"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        type="button"
        class="view-btn"
        class:active={viewMode === 'list'}
        on:click={() => viewMode = 'list'}
        title="List View"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Content -->
  {#if isLoading}
    <!-- Loading State -->
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading templates...</p>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Failed to Load Templates</h3>
      <p>{error}</p>
      <button type="button" class="retry-btn" on:click={loadTemplates}>
        Try Again
      </button>
    </div>
  {:else if filteredTemplates.length === 0}
    <!-- Empty State -->
    <div class="empty-state">
      <div class="empty-icon">📄</div>
      <h3>No Templates Found</h3>
      {#if searchQuery || selectedCategory !== 'all'}
        <p>Try adjusting your filters or search terms.</p>
        <button
          type="button"
          class="clear-filters-btn"
          on:click={() => { searchQuery = ''; selectedCategory = 'all'; }}
        >
          Clear Filters
        </button>
      {:else}
        <p>Create your first template to get started.</p>
        <button
          type="button"
          class="btn btn-primary"
          on:click={openCreateModal}
        >
          Create Template
        </button>
      {/if}
    </div>
  {:else}
    <!-- Templates Display -->
    <div class="templates-container" class:grid-view={viewMode === 'grid'} class:list-view={viewMode === 'list'}>
      {#each filteredTemplates as template (template.id)}
        <div class="template-card">
          <div class="template-header">
            <div class="template-info">
              <h3 class="template-name">{template.name}</h3>
              <p class="template-description">{template.description}</p>
            </div>
            <div class="template-actions">
              <button
                type="button"
                class="action-btn"
                on:click={() => useTemplate(template)}
                title="Use Template"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button
                type="button"
                class="action-btn"
                on:click={() => openEditModal(template)}
                title="Edit Template"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                class="action-btn"
                on:click={() => duplicateTemplate(template)}
                title="Duplicate Template"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                type="button"
                class="action-btn delete-btn"
                on:click={() => deleteTemplate(template)}
                title="Delete Template"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div class="template-meta">
            <div class="meta-item">
              <span class="meta-label">Category:</span>
              <span class="meta-value">{template.category}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Line Items:</span>
              <span class="meta-value">{template.templateData.lineItems.length}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Used:</span>
              <span class="meta-value">{template.usageCount} times</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Value:</span>
              <span class="meta-value">${calculateTemplateValue(template).toLocaleString()}</span>
            </div>
          </div>

          <div class="template-preview">
            <h4>Line Items Preview:</h4>
            <div class="preview-items">
              {#each template.templateData.lineItems.slice(0, 3) as item}
                <div class="preview-item">
                  <span class="item-title">{item.title}</span>
                  <span class="item-price">${item.unitPrice.toLocaleString()}</span>
                </div>
              {/each}
              {#if template.templateData.lineItems.length > 3}
                <div class="preview-item more">
                  +{template.templateData.lineItems.length - 3} more items
                </div>
              {/if}
            </div>
          </div>

          <div class="template-footer">
            <span class="template-date">
              Created {new Date(template.createdAt).toLocaleDateString()}
            </span>
            <button
              type="button"
              class="use-template-btn"
              on:click={() => useTemplate(template)}
            >
              Use Template
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Create/Edit Template Modal -->
{#if showCreateModal || showEditModal}
  <div class="modal-backdrop" on:click|self={closeModals}>
    <div class="modal-content">
      <div class="modal-header">
        <h2>{showCreateModal ? 'Create New Template' : 'Edit Template'}</h2>
        <button type="button" class="close-btn" on:click={closeModals}>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Basic Info -->
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Template Name</label>
              <input
                type="text"
                bind:value={templateForm.name}
                class="form-input"
                placeholder="e.g., Basic Website Package"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Category</label>
              <select bind:value={templateForm.category} class="form-input">
                {#each categories.slice(1) as category}
                  <option value={category.value}>{category.label}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              bind:value={templateForm.description}
              class="form-input"
              rows="3"
              placeholder="Describe what this template includes..."
            ></textarea>
          </div>
        </div>

        <!-- Project Defaults -->
        <div class="form-section">
          <h3>Project Defaults</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Payment Terms</label>
              <input
                type="text"
                bind:value={templateForm.paymentTerms}
                class="form-input"
                placeholder="50% upfront, 50% on completion"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Project Timeline</label>
              <input
                type="text"
                bind:value={templateForm.projectTimeline}
                class="form-input"
                placeholder="4-6 weeks"
              />
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <div class="form-section">
          <div class="section-header">
            <h3>Line Items</h3>
            <button type="button" class="add-item-btn" on:click={addLineItem}>
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </button>
          </div>

          {#if templateForm.lineItems.length === 0}
            <div class="no-items">
              <p>No line items yet. Add your first service or deliverable.</p>
            </div>
          {:else}
            <div class="line-items-list">
              {#each templateForm.lineItems as item, index}
                <div class="line-item-form">
                  <div class="item-header">
                    <input
                      type="text"
                      bind:value={item.title}
                      class="item-title-input"
                      placeholder="Service title..."
                    />
                    <button
                      type="button"
                      class="remove-item-btn"
                      on:click={() => removeLineItem(index)}
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div class="item-details">
                    <div class="item-field">
                      <label>Description</label>
                      <textarea
                        bind:value={item.description}
                        rows="2"
                        placeholder="Detailed description..."
                      ></textarea>
                    </div>

                    <div class="item-grid">
                      <div class="item-field">
                        <label>Quantity</label>
                        <input
                          type="number"
                          bind:value={item.quantity}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div class="item-field">
                        <label>Unit Type</label>
                        <select bind:value={item.unitType}>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="each">Each</option>
                          <option value="project">Project</option>
                        </select>
                      </div>

                      <div class="item-field">
                        <label>Unit Price</label>
                        <input
                          type="number"
                          bind:value={item.unitPrice}
                          min="0"
                          step="0.01"
                          on:input={() => updateLineItem(index, {
                            totalPrice: item.unitPrice * item.quantity
                          })}
                        />
                      </div>

                      <div class="item-field">
                        <label>Estimated Hours</label>
                        <input
                          type="number"
                          bind:value={item.estimatedHours}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" on:click={closeModals}>
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          on:click={saveTemplate}
          disabled={!templateForm.name.trim()}
        >
          {showCreateModal ? 'Create Template' : 'Save Changes'}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .template-manager {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .manager-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  .manager-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .manager-subtitle {
    color: #6b7280;
    font-size: 16px;
  }

  .controls-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
  }

  .filters {
    display: flex;
    gap: 12px;
    flex: 1;
  }

  .search-box {
    position: relative;
    flex: 1;
    max-width: 400px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #6b7280;
  }

  .search-input {
    width: 100%;
    padding: 8px 12px 8px 40px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
  }

  .category-filter,
  .sort-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    font-size: 14px;
  }

  .sort-order-btn {
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .view-controls {
    display: flex;
    gap: 4px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    padding: 4px;
    background: white;
  }

  .view-btn {
    padding: 6px;
    border: none;
    background: transparent;
    border-radius: 4px;
    cursor: pointer;
    color: #6b7280;
  }

  .view-btn.active {
    background: #3b82f6;
    color: white;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .empty-icon,
  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .templates-container.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }

  .templates-container.list-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .template-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .template-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .template-name {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .template-description {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.4;
  }

  .template-actions {
    display: flex;
    gap: 4px;
  }

  .action-btn {
    padding: 6px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .action-btn.delete-btn:hover {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fecaca;
  }

  .template-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .meta-label {
    color: #6b7280;
  }

  .meta-value {
    font-weight: 500;
    color: #1f2937;
  }

  .template-preview {
    margin-bottom: 16px;
  }

  .template-preview h4 {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 8px;
  }

  .preview-items {
    space-y: 6px;
  }

  .preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 6px;
    font-size: 14px;
    margin-bottom: 6px;
  }

  .preview-item.more {
    color: #6b7280;
    font-style: italic;
    justify-content: center;
  }

  .item-title {
    color: #1f2937;
  }

  .item-price {
    font-weight: 500;
    color: #059669;
  }

  .template-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
  }

  .template-date {
    font-size: 12px;
    color: #6b7280;
  }

  .use-template-btn {
    padding: 6px 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }

  .use-template-btn:hover {
    background: #2563eb;
  }

  /* Modal Styles */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .close-btn {
    padding: 6px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: #6b7280;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .form-section {
    margin-bottom: 32px;
  }

  .form-section h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .add-item-btn {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
  }

  .form-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

  .form-input:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: #3b82f6;
  }

  .no-items {
    text-align: center;
    padding: 40px;
    color: #6b7280;
  }

  .line-items-list {
    space-y: 16px;
  }

  .line-item-form {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
  }

  .item-header {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }

  .item-title-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
  }

  .remove-item-btn {
    padding: 6px;
    border: 1px solid #dc2626;
    background: #fef2f2;
    color: #dc2626;
    border-radius: 6px;
    cursor: pointer;
  }

  .item-details {
    space-y: 12px;
  }

  .item-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .item-field label {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
  }

  .item-field input,
  .item-field select,
  .item-field textarea {
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 13px;
  }

  .item-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 24px;
    border-top: 1px solid #e5e7eb;
  }

  .btn {
    padding: 8px 16px;
    border: 1px solid;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: white;
    border-color: #d1d5db;
    color: #6b7280;
  }

  .btn-secondary:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .retry-btn,
  .clear-filters-btn {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 16px;
  }

  @media (max-width: 1024px) {
    .templates-container.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    
    .controls-section {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filters {
      flex-wrap: wrap;
    }
  }

  @media (max-width: 768px) {
    .manager-header {
      flex-direction: column;
      gap: 16px;
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .item-grid {
      grid-template-columns: 1fr 1fr;
    }
    
    .template-meta {
      grid-template-columns: 1fr;
    }
  }
</style> 