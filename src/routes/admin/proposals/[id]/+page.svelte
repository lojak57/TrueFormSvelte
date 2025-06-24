<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import type { Proposal, Company, Contact } from "$lib/types";

  let proposal: Proposal | null = null;
  let company: Company | null = null;
  let contact: Contact | null = null;
  let loading = true;
  let error = "";

  $: proposalId = $page.params.id;

  onMount(async () => {
    await loadProposal();
  });

  async function loadProposal() {
    try {
      loading = true;

      // Load proposal
      const proposalResponse = await fetch(`/api/proposals/${proposalId}`);
      if (!proposalResponse.ok) {
        throw new Error("Proposal not found");
      }
      proposal = await proposalResponse.json();

      // Load company details
      if (proposal?.company_id) {
        const companyResponse = await fetch(
          `/api/companies/${proposal.company_id}`
        );
        if (companyResponse.ok) {
          company = await companyResponse.json();
        }
      }

      // Load contact details if exists
      if (proposal?.contact_id) {
        const contactResponse = await fetch(
          `/api/contacts/${proposal.contact_id}`
        );
        if (contactResponse.ok) {
          contact = await contactResponse.json();
        }
      }
    } catch (err) {
      console.error("Error loading proposal:", err);
      error = err instanceof Error ? err.message : "Failed to load proposal";
    } finally {
      loading = false;
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  async function downloadPDF(event: Event) {
    event.preventDefault();

    if (!proposal) return;

    try {
      // Show loading state
      const button = event.target as HTMLButtonElement;
      const originalText = button.innerHTML;
      button.innerHTML = `
        <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Generating PDF...
      `;
      button.disabled = true;

      // Get the HTML content from the API
      const response = await fetch(
        `/api/proposals/${proposal.id}/pdf?payment_qr=true&acceptance_qr=true`
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const htmlContent = await response.text();

      // Create a new window with the PDF content
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        throw new Error("Please allow popups for this site to download PDFs");
      }

      // Write the HTML content and add auto-print script
      const htmlDoc = `<!DOCTYPE html>
<html>
<head>
  <title>Proposal PDF</title>
  <style>
    @media print {
      @page { margin: 0.5in; size: letter; }
      body { margin: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        };
      }, 500);
    };
  <\/script>
</body>
</html>`;

      printWindow.document.write(htmlDoc);
      printWindow.document.close();

      // Restore button
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 1000);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Failed to generate PDF. Please try again.");

      // Restore button
      const button = event.target as HTMLButtonElement;
      button.innerHTML = `
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download PDF
      `;
      button.disabled = false;
    }
  }
</script>

<svelte:head>
  <title>{proposal ? proposal.title : "Proposal"} | TrueForm Admin</title>
</svelte:head>

{#if loading}
  <div class="flex items-center justify-center py-12">
    <div
      class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
    />
    <span class="ml-3 text-gray-600">Loading proposal...</span>
  </div>
{:else if error}
  <div class="tf-card border-red-200 bg-red-50">
    <div class="tf-card-body">
      <div class="flex items-center gap-3">
        <svg
          class="w-5 h-5 text-red-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div>
          <h4 class="font-medium text-red-900">Error Loading Proposal</h4>
          <p class="text-red-700 text-sm">{error}</p>
        </div>
      </div>
      <div class="mt-4">
        <button
          class="tf-btn tf-btn-outline"
          on:click={() => goto("/admin/proposals")}
        >
          Back to Proposals
        </button>
      </div>
    </div>
  </div>
{:else if proposal}
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <button
            class="tf-btn tf-btn-ghost tf-btn-sm"
            on:click={() => goto("/admin/proposals")}
          >
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Proposals
          </button>
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(
              proposal.status
            )}"
          >
            {proposal.status}
          </span>
        </div>
        <h1 class="tf-heading-1">{proposal.title}</h1>
        <p class="text-gray-600">
          Created {formatDate(proposal.created_at)}
          {#if proposal.proposal_number}
            • #{proposal.proposal_number}
          {/if}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-2xl font-bold text-primary-600">
            {formatCurrency(proposal.total)}
          </div>
          <div class="text-sm text-gray-600">Total Amount</div>
        </div>
        <div class="flex flex-col gap-2">
          <button class="tf-btn tf-btn-primary" on:click={downloadPDF}>
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
          <button class="tf-btn tf-btn-outline">
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send to Client
          </button>
        </div>
      </div>
    </div>

    <div class="tf-grid tf-grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Client Information -->
        <div class="tf-card">
          <div class="tf-card-header">
            <h3 class="tf-heading-3">Client Information</h3>
          </div>
          <div class="tf-card-body">
            {#if company}
              <div class="flex items-start gap-4">
                <div
                  class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-primary-600"
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
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{company.name}</h4>
                  {#if company.website}
                    <p class="text-sm text-gray-600">{company.website}</p>
                  {/if}
                  {#if company.billing_city && company.billing_state}
                    <p class="text-sm text-gray-600">
                      {company.billing_city}, {company.billing_state}
                    </p>
                  {/if}
                </div>
              </div>

              {#if contact}
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <div class="flex items-center gap-3">
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
                      <p class="font-medium text-gray-900">
                        {contact.first_name}
                        {contact.last_name}
                      </p>
                      {#if contact.title}
                        <p class="text-sm text-gray-600">{contact.title}</p>
                      {/if}
                      {#if contact.email}
                        <p class="text-sm text-gray-600">{contact.email}</p>
                      {/if}
                    </div>
                  </div>
                </div>
              {/if}
            {:else}
              <p class="text-gray-600">Company information not available</p>
            {/if}
          </div>
        </div>

        <!-- Line Items -->
        <div class="tf-card">
          <div class="tf-card-header">
            <h3 class="tf-heading-3">Services & Products</h3>
            <p class="text-gray-600 text-sm">
              {proposal.line_items?.length || 0} items
            </p>
          </div>
          <div class="tf-card-body">
            {#if proposal.line_items && proposal.line_items.length > 0}
              <div class="space-y-4">
                {#each proposal.line_items as item, index}
                  <div
                    class="flex items-start justify-between py-3 {index <
                    proposal.line_items.length - 1
                      ? 'border-b border-gray-100'
                      : ''}"
                  >
                    <div class="flex-1">
                      <h4 class="font-medium text-gray-900">{item.name}</h4>
                      {#if item.description}
                        <p class="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      {/if}
                      <div
                        class="flex items-center gap-4 mt-2 text-sm text-gray-700"
                      >
                        <span class="text-gray-700 font-medium"
                          >Qty: {item.quantity}</span
                        >
                        <span class="text-gray-500">•</span>
                        <span class="text-gray-700 font-medium"
                          >Unit Price: {formatCurrency(item.unitPrice)}</span
                        >
                      </div>
                    </div>
                    <div class="ml-6 text-right">
                      <div class="font-semibold text-lg text-gray-900">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="text-gray-600">No line items found</p>
            {/if}
          </div>
        </div>

        <!-- Notes & Terms -->
        {#if proposal.notes}
          <div class="tf-card">
            <div class="tf-card-header">
              <h3 class="tf-heading-3">Notes & Terms</h3>
            </div>
            <div class="tf-card-body">
              <div class="prose prose-sm max-w-none">
                <p class="whitespace-pre-wrap text-gray-700">
                  {proposal.notes}
                </p>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1">
        <div class="sticky top-6 space-y-6">
          <!-- Pricing Summary -->
          <div class="tf-card">
            <div class="tf-card-header">
              <h4 class="tf-heading-4">Pricing Summary</h4>
            </div>
            <div class="tf-card-body space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-gray-900"
                  >{formatCurrency(proposal.subtotal)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax ({proposal.tax_rate}%)</span>
                <span class="font-medium text-gray-900"
                  >{formatCurrency(proposal.tax)}</span
                >
              </div>
              <hr class="border-gray-200" />
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-gray-900">Total</span>
                <span class="font-bold text-primary-600"
                  >{formatCurrency(proposal.total)}</span
                >
              </div>
            </div>
          </div>

          <!-- Proposal Details -->
          <div class="tf-card">
            <div class="tf-card-header">
              <h4 class="tf-heading-4">Proposal Details</h4>
            </div>
            <div class="tf-card-body space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Status</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(
                    proposal.status
                  )}"
                >
                  {proposal.status}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Created</span>
                <span class="font-medium text-gray-900"
                  >{formatDate(proposal.created_at)}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Updated</span>
                <span class="font-medium text-gray-900"
                  >{formatDate(proposal.updated_at)}</span
                >
              </div>
              {#if proposal.valid_until}
                <div class="flex justify-between">
                  <span class="text-gray-600">Valid Until</span>
                  <span class="font-medium text-gray-900"
                    >{formatDate(proposal.valid_until)}</span
                  >
                </div>
              {/if}
            </div>
          </div>

          <!-- Actions -->
          <div class="tf-card">
            <div class="tf-card-header">
              <h4 class="tf-heading-4">Actions</h4>
            </div>
            <div class="tf-card-body space-y-3">
              <button class="tf-btn tf-btn-outline w-full">
                <svg
                  class="w-4 h-4 mr-2"
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
                Edit Proposal
              </button>
              <button class="tf-btn tf-btn-outline w-full">
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Duplicate
              </button>
              <button
                class="tf-btn tf-btn-outline w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <svg
                  class="w-4 h-4 mr-2"
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
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="text-center py-12">
    <h3 class="tf-heading-3 text-gray-600">Proposal not found</h3>
    <button
      class="tf-btn tf-btn-primary mt-4"
      on:click={() => goto("/admin/proposals")}
    >
      Back to Proposals
    </button>
  </div>
{/if}
