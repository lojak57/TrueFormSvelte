<script lang="ts">
  import type { Company, Contact, LineItem } from "$lib/types";
  import PricingSummary from "../../shared/PricingSummary.svelte";

  export let company: Company | undefined;
  export let contact: Contact | undefined;
  export let proposalTitle: string;
  export let lineItems: LineItem[];
  export let subtotal: number;
  export let taxRate: number;
  export let tax: number;
  export let total: number;
  export let notes: string;

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  $: proposalNumber = `PROP-${Date.now().toString().slice(-6)}`;
  $: today = new Date();
  $: validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
</script>

<div class="space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h3 class="tf-heading-3 mb-2">Review Your Proposal</h3>
    <p class="text-gray-900">Take a final look before creating your proposal</p>
  </div>

  <div class="tf-grid tf-grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Main Content (Left Side) -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Proposal Overview -->
      <div class="tf-card tf-card-elevated">
        <div
          class="tf-card-header bg-gradient-to-r from-primary-600 to-primary-700 text-white"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-xl font-bold">{proposalTitle}</h4>
              <p class="text-primary-100 text-sm mt-1">
                Proposal #{proposalNumber}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold">{formatCurrency(total)}</div>
              <div class="text-primary-200 text-sm">Total Amount</div>
            </div>
          </div>
        </div>

        <div class="tf-card-body">
          <!-- Company & Contact Info -->
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h5 class="font-semibold text-gray-900 mb-3">Proposal For</h5>
              {#if company}
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        class="w-5 h-5 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fill-rule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium">{company.name}</div>
                      {#if company.website}
                        <div class="text-sm text-gray-600">
                          {company.website}
                        </div>
                      {/if}
                    </div>
                  </div>

                  {#if contact}
                    <div class="flex items-center gap-3 mt-4">
                      <div
                        class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                      >
                        <svg
                          class="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div class="font-medium text-sm">
                          {contact.first_name}
                          {contact.last_name}
                        </div>
                        {#if contact.title}
                          <div class="text-sm text-gray-600">
                            {contact.title}
                          </div>
                        {/if}
                        {#if contact.email}
                          <div class="text-sm text-gray-600">
                            {contact.email}
                          </div>
                        {/if}
                      </div>
                    </div>
                  {/if}
                </div>
              {:else}
                <div class="text-gray-500">No company selected</div>
              {/if}
            </div>

            <div>
              <h5 class="font-semibold text-gray-900 mb-3">Proposal Details</h5>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Created:</span>
                  <span class="font-medium">{formatDate(today)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Valid Until:</span>
                  <span class="font-medium">{formatDate(validUntil)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Services:</span>
                  <span class="font-medium">{lineItems.length} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Services Summary -->
      <div class="tf-card">
        <div class="tf-card-header">
          <h4 class="tf-heading-4">Services Included</h4>
          <p class="text-gray-900 text-sm">
            {lineItems.length} services • {formatCurrency(subtotal)} subtotal
          </p>
        </div>
        <div class="tf-card-body">
          {#if lineItems.length > 0}
            <div class="space-y-4">
              {#each lineItems as item, index}
                <div
                  class="flex items-start justify-between py-3 {index <
                  lineItems.length - 1
                    ? 'border-b border-gray-100'
                    : ''}"
                >
                  <div class="flex-1">
                    <h5 class="font-medium text-gray-900">{item.name}</h5>
                    {#if item.description}
                      <p class="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    {/if}
                    <div
                      class="flex items-center gap-4 mt-2 text-sm text-gray-500"
                    >
                      <span>Quantity: {item.quantity}</span>
                      <span>•</span>
                      <span>Unit Price: {formatCurrency(item.unitPrice)}</span>
                    </div>
                  </div>
                  <div class="ml-6 text-right">
                    <div class="font-semibold text-lg">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="text-center py-8 text-gray-500">
              <svg
                class="w-12 h-12 mx-auto mb-4 text-gray-400"
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
              <h4 class="font-medium">No services selected</h4>
              <p class="text-sm">Go back to add services to your proposal</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Notes & Terms -->
      {#if notes}
        <div class="tf-card">
          <div class="tf-card-header">
            <h4 class="tf-heading-4">Additional Notes & Terms</h4>
          </div>
          <div class="tf-card-body">
            <div class="prose prose-sm max-w-none">
              <p class="whitespace-pre-wrap text-gray-700">{notes}</p>
            </div>
          </div>
        </div>
      {/if}

      <!-- Next Steps -->
      <div
        class="tf-card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
      >
        <div class="tf-card-body">
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg
                class="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-green-900 mb-2">
                Ready to Create Your Proposal?
              </h4>
              <p class="text-green-800 text-sm mb-4">
                Once created, you'll be able to download a PDF, send it to your
                client, and track its status. You can always edit the proposal
                later if needed.
              </p>
              <div class="flex flex-wrap gap-2 text-sm">
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md"
                  >✓ PDF Generation</span
                >
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md"
                  >✓ Email Integration</span
                >
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md"
                  >✓ Status Tracking</span
                >
                <span class="px-2 py-1 bg-green-100 text-green-700 rounded-md"
                  >✓ Easy Editing</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Sidebar (Right Side) -->
    <div class="lg:col-span-1">
      <div class="sticky top-6 space-y-6">
        <PricingSummary
          {subtotal}
          {taxRate}
          {tax}
          {total}
          lineItemCount={lineItems.length}
        />

        <!-- Quick Stats -->
        <div class="tf-card">
          <div class="tf-card-header">
            <h4 class="tf-heading-4">Proposal Stats</h4>
          </div>
          <div class="tf-card-body space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-900">Services</span>
              <span class="font-semibold">{lineItems.length}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-900">Tax Rate</span>
              <span class="font-semibold">{taxRate}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-900">Valid For</span>
              <span class="font-semibold">30 days</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between items-center text-lg">
              <span class="font-semibold">Total Value</span>
              <span class="font-bold text-primary-600"
                >{formatCurrency(total)}</span
              >
            </div>
          </div>
        </div>

        <!-- Proposal Preview Note -->
        <div class="tf-card bg-blue-50 border-blue-200">
          <div class="tf-card-body">
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
                <h5 class="font-medium text-blue-900 text-sm">Preview Note</h5>
                <p class="text-blue-800 text-sm mt-1">
                  This is how your proposal will appear to clients. You can
                  customize the design and branding in settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
