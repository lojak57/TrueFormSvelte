<script lang="ts">
  import type { LineItem } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let item: LineItem;
  export let editable = true;

  const dispatch = createEventDispatcher<{
    update: Partial<LineItem>;
    remove: void;
  }>();

  let editMode = false;
  let editData = { ...item };

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function toggleEdit() {
    if (editMode) {
      // Save changes
      dispatch("update", editData);
    } else {
      // Enter edit mode
      editData = { ...item };
    }
    editMode = !editMode;
  }

  function cancelEdit() {
    editData = { ...item };
    editMode = false;
  }

  function handleRemove() {
    dispatch("remove");
  }

  $: total = editData.quantity * editData.unitPrice;
</script>

<div class="tf-card">
  <div class="tf-card-body">
    {#if editMode}
      <!-- Edit Mode -->
      <div class="space-y-4">
        <div>
          <label class="tf-label">Service Name</label>
          <input
            type="text"
            class="tf-input"
            bind:value={editData.name}
            placeholder="Service name"
          />
        </div>

        <div>
          <label class="tf-label">Description (Optional)</label>
          <textarea
            class="tf-input tf-textarea"
            bind:value={editData.description}
            placeholder="Service description"
            rows="2"
          />
        </div>

        <div class="tf-grid tf-grid-cols-2 gap-4">
          <div>
            <label class="tf-label">Quantity</label>
            <input
              type="number"
              class="tf-input"
              bind:value={editData.quantity}
              min="1"
              step="1"
            />
          </div>

          <div>
            <label class="tf-label">Unit Price</label>
            <input
              type="number"
              class="tf-input"
              bind:value={editData.unitPrice}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div class="p-3 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-medium text-gray-700">Line Total</span>
            <span class="tf-heading-4 text-primary-600"
              >{formatCurrency(total)}</span
            >
          </div>
        </div>

        <!-- Edit Actions -->
        <div class="flex gap-3 pt-2">
          <button class="tf-btn tf-btn-primary tf-btn-sm" on:click={toggleEdit}>
            Save Changes
          </button>
          <button class="tf-btn tf-btn-outline tf-btn-sm" on:click={cancelEdit}>
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <!-- View Mode -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="tf-heading-4 mb-2">{item.name}</h4>
          {#if item.description}
            <p class="text-gray-900 text-sm mb-3">{item.description}</p>
          {/if}
          <div class="flex items-center gap-4 text-sm text-gray-900">
            <span>Qty: {item.quantity}</span>
            <span>×</span>
            <span>{formatCurrency(item.unitPrice)}</span>
          </div>
        </div>

        <div class="ml-6 text-right">
          <div class="tf-heading-3 text-gray-900 mb-2">
            {formatCurrency(item.total)}
          </div>

          {#if editable}
            <div class="flex gap-2">
              <button
                class="tf-btn tf-btn-ghost tf-btn-sm"
                on:click={toggleEdit}
                title="Edit item"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                class="tf-btn tf-btn-ghost tf-btn-sm text-red-600 hover:bg-red-50"
                on:click={handleRemove}
                title="Remove item"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
