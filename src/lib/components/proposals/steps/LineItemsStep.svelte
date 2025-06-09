<!-- Line Items Step -->
<script lang="ts">
  import { proposalActions, currentProposal, proposalTotals } from '$lib/stores/proposalStore';
  import type { LineItemData, LineItemType, ComplexityLevel, UnitType } from '$lib/types/proposals';
  import { formatCurrencyInput, validateMoneyInput } from '$lib/utils/money';

  // Line items
  let lineItems: LineItemData[] = [];
  let showAddForm = false;
  let editingItemId: string | null = null;

  // New line item form
  let newItem: Partial<LineItemData> = resetNewItem();

  // Form validation
  let errors: Record<string, string> = {};

  // Initialize from current proposal
  $: if ($currentProposal?.lineItems) {
    lineItems = [...$currentProposal.lineItems];
  }

  function resetNewItem(): Partial<LineItemData> {
    return {
      itemType: 'development',
      title: '',
      description: '',
      quantity: 1,
      unitType: 'hours',
      unitPrice: 0,
      totalPrice: 0,
      estimatedHours: undefined,
      complexityLevel: 'medium',
      sortOrder: 0
    };
  }

  function addLineItem() {
    showAddForm = true;
    newItem = resetNewItem();
    errors = {};
  }

  function saveLineItem() {
    if (!validateNewItem()) return;

    const itemToAdd: LineItemData = {
      ...newItem,
      id: `item-${Date.now()}`,
      totalPrice: (newItem.unitPrice || 0) * (newItem.quantity || 1),
      sortOrder: lineItems.length + 1
    } as LineItemData;

    if (editingItemId) {
      // Update existing item
      proposalActions.updateLineItem(editingItemId, itemToAdd);
      editingItemId = null;
    } else {
      // Add new item
      proposalActions.addLineItem(itemToAdd);
    }

    cancelEdit();
    updateStepCompletion();
  }

  function editLineItem(item: LineItemData) {
    newItem = { ...item };
    editingItemId = item.id || null;
    showAddForm = true;
    errors = {};
  }

  function deleteLineItem(id: string) {
    proposalActions.removeLineItem(id);
    updateStepCompletion();
  }

  function cancelEdit() {
    showAddForm = false;
    editingItemId = null;
    newItem = resetNewItem();
    errors = {};
  }

  function validateNewItem(): boolean {
    const newErrors: Record<string, string> = {};

    if (!newItem.title?.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!newItem.unitPrice || newItem.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    if (!newItem.quantity || newItem.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  function updateStepCompletion() {
    const hasItems = lineItems.length > 0;
    proposalActions.markStepComplete(4, hasItems);
  }

  function handleUnitPriceChange(value: string) {
    const formatted = formatCurrencyInput(value);
    const validation = validateMoneyInput(formatted);
    
    if (validation.isValid && validation.amount !== undefined) {
      newItem.unitPrice = validation.amount;
      newItem.totalPrice = validation.amount * (newItem.quantity || 1);
    }
  }

  function handleQuantityChange(value: string) {
    const quantity = parseFloat(value) || 1;
    newItem.quantity = quantity;
    newItem.totalPrice = (newItem.unitPrice || 0) * quantity;
  }

  // Item type options
  const itemTypes: { value: LineItemType; label: string; icon: string }[] = [
    { value: 'development', label: 'Development', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'consultation', label: 'Consultation', icon: '💡' },
    { value: 'hosting', label: 'Hosting', icon: '🌐' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { value: 'other', label: 'Other', icon: '📋' }
  ];

  const unitTypes: { value: UnitType; label: string }[] = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'each', label: 'Each' },
    { value: 'project', label: 'Project' }
  ];

  const complexityLevels: { value: ComplexityLevel; label: string; color: string }[] = [
    { value: 'simple', label: 'Simple', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'complex', label: 'Complex', color: 'bg-red-100 text-red-800' }
  ];

  // Watch for line items changes
  $: updateStepCompletion();
</script>

<!-- Line Items Step -->
<div class="line-items-step space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-medium text-slate-900">Service Breakdown</h3>
      <p class="text-slate-600 mt-1">Build your detailed line-by-line proposal</p>
    </div>
    
    <button
      type="button"
      class="btn btn-primary"
      on:click={addLineItem}
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add Line Item
    </button>
  </div>

  <!-- Existing Line Items -->
  {#if lineItems.length > 0}
    <div class="space-y-4">
      {#each lineItems as item, index (item.id)}
        <div class="line-item-card bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div class="flex items-start justify-between">
            <!-- Item Content -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="item-type-icon">
                  {itemTypes.find(t => t.value === item.itemType)?.icon || '📋'}
                </div>
                <div>
                  <h4 class="font-semibold text-slate-900">{item.title}</h4>
                  <div class="flex items-center space-x-2 text-sm text-slate-500">
                    <span class="capitalize">{item.itemType}</span>
                    {#if item.complexityLevel}
                      <span>•</span>
                      <span class="px-2 py-1 rounded-full text-xs {complexityLevels.find(c => c.value === item.complexityLevel)?.color || ''}">
                        {item.complexityLevel}
                      </span>
                    {/if}
                  </div>
                </div>
              </div>
              
              {#if item.description}
                <p class="text-slate-600 mb-3">{item.description}</p>
              {/if}
              
              <div class="flex items-center space-x-6 text-sm">
                <div>
                  <span class="text-slate-500">Quantity:</span>
                  <span class="font-medium">{item.quantity} {item.unitType}</span>
                </div>
                <div>
                  <span class="text-slate-500">Unit Price:</span>
                  <span class="font-medium">${item.unitPrice.toLocaleString()}</span>
                </div>
                {#if item.estimatedHours}
                  <div>
                    <span class="text-slate-500">Est. Hours:</span>
                    <span class="font-medium">{item.estimatedHours}h</span>
                  </div>
                {/if}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-2">
              <div class="text-right">
                <div class="text-lg font-semibold text-slate-900">
                  ${item.totalPrice.toLocaleString()}
                </div>
                <div class="text-sm text-slate-500">Total</div>
              </div>
              
              <div class="flex items-center space-x-1 ml-4">
                <button
                  type="button"
                  class="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  on:click={() => editLineItem(item)}
                  title="Edit item"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  class="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  on:click={() => deleteLineItem(item.id || '')}
                  title="Delete item"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Empty State -->
    <div class="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
      <div class="text-slate-400 text-4xl mb-4">📋</div>
      <h4 class="text-lg font-medium text-slate-900 mb-2">No line items yet</h4>
      <p class="text-slate-600 mb-6">Add your first service or deliverable to get started</p>
      <button
        type="button"
        class="btn btn-primary"
        on:click={addLineItem}
      >
        Add Line Item
      </button>
    </div>
  {/if}

  <!-- Add/Edit Form -->
  {#if showAddForm}
    <div class="add-form bg-white border-2 border-primary-200 rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-lg font-medium text-slate-900">
          {editingItemId ? 'Edit Line Item' : 'Add Line Item'}
        </h4>
        <button
          type="button"
          class="text-slate-400 hover:text-slate-600"
          on:click={cancelEdit}
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column -->
        <div class="space-y-4">
          <!-- Item Type -->
          <div class="form-group">
            <label class="form-label">Service Type</label>
            <div class="grid grid-cols-2 gap-2">
              {#each itemTypes as type}
                <button
                  type="button"
                  class="type-option p-3 border rounded-lg text-left hover:border-slate-400 transition-colors"
                  class:selected={newItem.itemType === type.value}
                  on:click={() => newItem.itemType = type.value}
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-lg">{type.icon}</span>
                    <span class="font-medium">{type.label}</span>
                  </div>
                </button>
              {/each}
            </div>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label">Title *</label>
            <input
              type="text"
              class="form-input"
              class:error={errors.title}
              bind:value={newItem.title}
              placeholder="e.g., Frontend Development"
            />
            {#if errors.title}
              <p class="form-error">{errors.title}</p>
            {/if}
          </div>

          <!-- Description -->
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              rows="3"
              class="form-input"
              bind:value={newItem.description}
              placeholder="Detailed description of the work..."
            ></textarea>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-4">
          <!-- Pricing -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Quantity *</label>
              <input
                type="number"
                class="form-input"
                class:error={errors.quantity}
                bind:value={newItem.quantity}
                on:input={(e) => handleQuantityChange(e.currentTarget.value)}
                min="0.01"
                step="0.01"
              />
              {#if errors.quantity}
                <p class="form-error">{errors.quantity}</p>
              {/if}
            </div>

            <div class="form-group">
              <label class="form-label">Unit Type</label>
              <select class="form-input" bind:value={newItem.unitType}>
                {#each unitTypes as unit}
                  <option value={unit.value}>{unit.label}</option>
                {/each}
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Unit Price *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="text"
                class="form-input pl-8"
                class:error={errors.unitPrice}
                value={newItem.unitPrice?.toString() || ''}
                on:input={(e) => handleUnitPriceChange(e.currentTarget.value)}
                placeholder="0.00"
              />
            </div>
            {#if errors.unitPrice}
              <p class="form-error">{errors.unitPrice}</p>
            {/if}
          </div>

          <!-- Optional Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">Estimated Hours</label>
              <input
                type="number"
                class="form-input"
                bind:value={newItem.estimatedHours}
                min="0"
                step="0.5"
                placeholder="0"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Complexity</label>
              <select class="form-input" bind:value={newItem.complexityLevel}>
                {#each complexityLevels as level}
                  <option value={level.value}>{level.label}</option>
                {/each}
              </select>
            </div>
          </div>

          <!-- Total Preview -->
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="text-slate-600">Total:</span>
              <span class="text-xl font-semibold text-slate-900">
                ${((newItem.unitPrice || 0) * (newItem.quantity || 1)).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
        <button
          type="button"
          class="btn btn-secondary"
          on:click={cancelEdit}
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          on:click={saveLineItem}
        >
          {editingItemId ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </div>
  {/if}

  <!-- Totals Summary -->
  {#if $proposalTotals && lineItems.length > 0}
    <div class="totals-summary bg-slate-50 border border-slate-200 rounded-lg p-6">
      <h4 class="text-lg font-medium text-slate-900 mb-4">Proposal Summary</h4>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-slate-600">Subtotal:</span>
          <span class="font-medium">{$proposalTotals.subtotal.format()}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-600">Tax:</span>
          <span class="font-medium">{$proposalTotals.taxAmount.format()}</span>
        </div>
        <div class="flex justify-between text-lg font-semibold border-t border-slate-300 pt-2">
          <span>Total:</span>
          <span>{$proposalTotals.total.format()}</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .line-item.selected {
    border-color: rgb(59, 130, 246);
    background-color: rgb(239, 246, 255);
    color: rgb(29, 78, 216);
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }

  .btn:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-primary {
    background-color: rgb(37, 99, 235);
    color: white;
  }

  .btn-primary:hover {
    background-color: rgb(29, 78, 216);
  }

  .btn-secondary {
    background-color: white;
    color: rgb(55, 65, 81);
    border: 1px solid rgb(209, 213, 219);
  }

  .btn-secondary:hover {
    background-color: rgb(249, 250, 251);
  }

  .form-group {
    margin-bottom: 0.25rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(55, 65, 81);
  }

  .form-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: rgb(17, 24, 39);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input::placeholder {
    color: rgb(156, 163, 175);
  }

  .form-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    border-color: rgb(59, 130, 246);
  }

  .form-input.error {
    border-color: rgb(252, 165, 165);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
    border-color: rgb(239, 68, 68);
  }

  .form-error {
    font-size: 0.875rem;
    color: rgb(220, 38, 38);
    margin-top: 0.25rem;
  }
</style> 