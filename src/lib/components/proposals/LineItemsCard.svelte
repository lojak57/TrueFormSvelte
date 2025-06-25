<script lang="ts">
  import type { Proposal } from "$lib/types";
  import { formatCurrency } from "$lib/utils/proposalHelpers";

  export let proposal: Proposal;

  $: lineItems = proposal.line_items || [];
  $: subtotal = lineItems.reduce(
    (sum, item) => sum + (item.total_amount || 0),
    0
  );
  $: tax = proposal.tax_amount || 0;
  $: total = proposal.total_amount || subtotal + tax;
</script>

<div class="tf-card">
  <div class="tf-card-header">
    <h3 class="tf-card-title">Line Items</h3>
  </div>
  <div class="tf-card-body">
    {#if lineItems.length > 0}
      <div class="space-y-4">
        <!-- Line Items -->
        <div class="space-y-3">
          {#each lineItems as item}
            <div
              class="flex justify-between items-start py-3 border-b border-gray-100"
            >
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{item.description}</h4>
                {#if item.notes}
                  <p class="text-sm text-gray-600 mt-1">{item.notes}</p>
                {/if}
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  <span>Rate: {formatCurrency(item.unit_price)}</span>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">
                  {formatCurrency(item.total_amount || 0)}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 pt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal</span>
            <span class="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {#if tax > 0}
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="text-gray-900">{formatCurrency(tax)}</span>
            </div>
          {/if}
          <div
            class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2"
          >
            <span class="text-gray-900">Total</span>
            <span class="text-gray-900">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    {:else}
      <p class="text-gray-500 italic">No line items added yet</p>
    {/if}
  </div>
</div>
