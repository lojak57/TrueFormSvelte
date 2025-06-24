<script lang="ts">
  import LineItemCard from "../../shared/LineItemCard.svelte";
  import PricingSummary from "../../shared/PricingSummary.svelte";
  import type { LineItem } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let lineItems: LineItem[] = [];
  export let taxRate: number = 7.5;
  export let notes: string = "";

  const dispatch = createEventDispatcher<{
    updateLineItem: { id: string; updates: Partial<LineItem> };
    removeLineItem: string;
    updateTaxRate: number;
    updateNotes: string;
  }>();

  // Common tax rates for quick selection
  const commonTaxRates = [
    { rate: 0, label: "No Tax (0%)" },
    { rate: 6.25, label: "Massachusetts (6.25%)" },
    { rate: 7.25, label: "California (7.25%)" },
    { rate: 7.5, label: "Default (7.5%)" },
    { rate: 8.25, label: "Texas (8.25%)" },
    { rate: 10, label: "Custom (10%)" },
  ];

  // Payment term templates
  const paymentTerms = [
    {
      name: "Standard Terms",
      description: "50% deposit to start, 50% on completion",
      popular: true,
    },
    {
      name: "Net 30",
      description: "Full payment due within 30 days of project completion",
    },
    {
      name: "Milestone Based",
      description:
        "Payment split across project milestones (25% / 25% / 25% / 25%)",
    },
    {
      name: "Custom Terms",
      description: "Custom payment schedule as discussed",
    },
  ];

  let selectedPaymentTerms = "Standard Terms";

  // Calculations
  $: subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  $: tax = subtotal * (taxRate / 100);
  $: total = subtotal + tax;

  function handleLineItemUpdate(event: CustomEvent<Partial<LineItem>>) {
    const target = event.target as HTMLElement;
    const itemId = target
      .closest("[data-item-id]")
      ?.getAttribute("data-item-id");
    if (itemId) {
      dispatch("updateLineItem", { id: itemId, updates: event.detail });
    }
  }

  function handleLineItemRemove(itemId: string) {
    dispatch("removeLineItem", itemId);
  }

  function handleTaxRateChange(rate: number) {
    taxRate = rate;
    dispatch("updateTaxRate", rate);
  }

  function handleNotesChange() {
    dispatch("updateNotes", notes);
  }
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h3 class="tf-heading-3 mb-2">Review & Customize Pricing</h3>
    <p class="text-gray-900">
      Fine-tune your line items, set tax rates, and add terms
    </p>
  </div>

  <div class="tf-grid tf-grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Line Items (Left Side) -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Line Items Header -->
      <div class="tf-card">
        <div class="tf-card-header">
          <h4 class="tf-heading-4">Line Items ({lineItems.length})</h4>
          <p class="text-gray-900 text-sm">
            Review and edit your selected services
          </p>
        </div>
      </div>

      <!-- Line Items List -->
      {#if lineItems.length > 0}
        <div class="space-y-4">
          {#each lineItems as item (item.id)}
            <div data-item-id={item.id}>
              <LineItemCard
                {item}
                on:update={handleLineItemUpdate}
                on:remove={() => handleLineItemRemove(item.id)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <div class="tf-card">
          <div class="tf-card-body text-center py-8">
            <svg
              class="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V9a4 4 0 00-4-4H9a4 4 0 00-4 4v4h14V9z"
              />
            </svg>
            <h4 class="tf-heading-4 text-gray-500">No services selected</h4>
            <p class="text-gray-900">
              Go back to add services to your proposal
            </p>
          </div>
        </div>
      {/if}

      <!-- Tax Rate Settings -->
      <div class="tf-card">
        <div class="tf-card-header">
          <h4 class="tf-heading-4">Tax Settings</h4>
          <p class="text-gray-900 text-sm">
            Set the tax rate for this proposal
          </p>
        </div>
        <div class="tf-card-body space-y-4">
          <!-- Tax Rate Selector -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            {#each commonTaxRates as { rate, label }}
              <button
                class="p-3 rounded-lg border-2 text-left transition-all
                  {taxRate === rate
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'}"
                on:click={() => handleTaxRateChange(rate)}
              >
                <div class="font-medium text-sm">{rate}%</div>
                <div class="text-sm text-gray-900">{label.split("(")[0]}</div>
              </button>
            {/each}
          </div>

          <!-- Custom Tax Rate -->
          <div>
            <label class="tf-label">Custom Tax Rate (%)</label>
            <div class="flex items-center gap-3">
              <input
                type="number"
                class="tf-input"
                bind:value={taxRate}
                on:input={() => handleTaxRateChange(taxRate)}
                min="0"
                max="100"
                step="0.01"
                placeholder="0.00"
              />
              <span class="text-gray-900 text-sm">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Terms -->
      <div class="tf-card">
        <div class="tf-card-header">
          <h4 class="tf-heading-4">Payment Terms</h4>
          <p class="text-gray-900 text-sm">
            Choose payment terms for this proposal
          </p>
        </div>
        <div class="tf-card-body space-y-3">
          {#each paymentTerms as term}
            <label
              class="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
              {selectedPaymentTerms === term.name
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'}"
            >
              <input
                type="radio"
                bind:group={selectedPaymentTerms}
                value={term.name}
                class="mt-1"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{term.name}</span>
                  {#if term.popular}
                    <span
                      class="px-2 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full"
                    >
                      Popular
                    </span>
                  {/if}
                </div>
                <p class="text-sm text-gray-900 mt-1">{term.description}</p>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Additional Notes -->
      <div class="tf-card">
        <div class="tf-card-header">
          <h4 class="tf-heading-4">Additional Notes</h4>
          <p class="text-gray-900 text-sm">
            Add any special terms, conditions, or notes
          </p>
        </div>
        <div class="tf-card-body">
          <textarea
            class="tf-input tf-textarea"
            bind:value={notes}
            on:input={handleNotesChange}
            rows="4"
            placeholder="Add any special terms, project timeline, deliverables, or other important details..."
          />

          <!-- Quick Note Templates -->
          <div class="mt-4">
            <p class="text-sm text-gray-900 mb-2">Quick templates:</p>
            <div class="flex flex-wrap gap-2">
              {#each ["Project timeline: 4-6 weeks from deposit", "Includes 2 rounds of revisions", "Final payment due before project delivery", "Monthly maintenance available after launch"] as template}
                <button
                  class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  on:click={() =>
                    (notes = notes
                      ? `${notes}\n\n• ${template}`
                      : `• ${template}`)}
                >
                  {template}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Summary (Right Side) -->
    <div class="lg:col-span-1">
      <div class="sticky top-6">
        <PricingSummary
          {subtotal}
          {taxRate}
          {tax}
          {total}
          lineItemCount={lineItems.length}
        />

        <!-- Pricing Breakdown Charts -->
        <div class="tf-card mt-6">
          <div class="tf-card-header">
            <h4 class="tf-heading-4">Pricing Breakdown</h4>
          </div>
          <div class="tf-card-body">
            {#if lineItems.length > 0}
              <!-- Mobile-first chart design -->
              <div class="space-y-4 md:space-y-3">
                {#each lineItems as item}
                  {@const percentage =
                    total > 0 ? (item.total / total) * 100 : 0}
                  <div class="breakdown-item">
                    <div
                      class="flex justify-between items-center text-sm mb-2 md:mb-1"
                    >
                      <span class="truncate pr-2 font-medium text-gray-900"
                        >{item.name}</span
                      >
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-primary-600"
                          >${item.total.toLocaleString()}</span
                        >
                        <span
                          class="text-xs bg-gray-100 px-2 py-1 rounded-full font-medium"
                          >{percentage.toFixed(1)}%</span
                        >
                      </div>
                    </div>
                    <div
                      class="w-full bg-gray-200 rounded-full h-3 md:h-2 overflow-hidden"
                    >
                      <div
                        class="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-700 ease-out"
                        style="width: {percentage}%"
                      />
                    </div>
                  </div>
                {/each}
              </div>

              <!-- Mobile summary stats -->
              <div class="mt-6 pt-4 border-t border-gray-200 block md:hidden">
                <div class="grid grid-cols-2 gap-4 text-center">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="text-lg font-bold text-gray-900">
                      {lineItems.length}
                    </div>
                    <div class="text-xs text-gray-600 font-medium">
                      Services
                    </div>
                  </div>
                  <div class="bg-primary-50 rounded-lg p-3">
                    <div class="text-lg font-bold text-primary-600">
                      ${total.toLocaleString()}
                    </div>
                    <div class="text-xs text-primary-700 font-medium">
                      Total
                    </div>
                  </div>
                </div>
              </div>
            {:else}
              <div class="text-center py-8 md:py-4">
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p class="text-gray-600 text-sm font-medium">
                  Add services to see breakdown
                </p>
                <p class="text-gray-500 text-xs mt-1">
                  Visual chart will appear here
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
