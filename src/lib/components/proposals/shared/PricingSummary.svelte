<script lang="ts">
  export let subtotal: number;
  export let taxRate: number;
  export let tax: number;
  export let total: number;
  export let lineItemCount: number;
  export let compact = false;

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
</script>

<div class="tf-card">
  <div class="tf-card-header">
    <h3 class="tf-heading-4">Pricing Summary</h3>
    <p class="text-gray-900 text-sm">
      {lineItemCount}
      {lineItemCount === 1 ? "item" : "items"}
    </p>
  </div>

  <div class="tf-card-body space-y-4">
    <!-- Breakdown -->
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-gray-900">Subtotal</span>
        <span class="font-medium">{formatCurrency(subtotal)}</span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-gray-900">Tax ({taxRate}%)</span>
        <span class="font-medium">{formatCurrency(tax)}</span>
      </div>

      <hr class="border-gray-200" />

      <div class="flex justify-between items-center text-lg">
        <span class="tf-heading-4">Total</span>
        <span class="tf-heading-3 text-primary-600"
          >{formatCurrency(total)}</span
        >
      </div>
    </div>

    {#if !compact}
      <!-- Payment Note -->
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <div class="flex items-start gap-3">
          <svg
            class="w-5 h-5 text-blue-600 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <div>
            <p class="text-sm font-medium text-blue-900">Payment Terms</p>
            <p class="text-sm text-blue-700 mt-1">
              50% deposit required to begin work. Final payment due upon project
              completion.
            </p>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
