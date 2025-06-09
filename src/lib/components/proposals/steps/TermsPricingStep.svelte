<!-- Review Step -->
<script lang="ts">
    import { proposalActions, currentProposal, proposalTotals, totalEstimatedHours } from '$lib/stores/proposalStore';
  
    let isGeneratingPDF = false;
    let isSending = false;
    let generatedPDFUrl: string | null = null;
  
    // Auto-mark this step as complete when viewing
    $: if ($currentProposal) {
      proposalActions.markStepComplete(6, true);
    }
  
    async function generatePDF() {
      isGeneratingPDF = true;
      try {
        // This will be implemented with actual PDF generation
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        generatedPDFUrl = '/mock-proposal.pdf';
      } catch (error) {
        console.error('Failed to generate PDF:', error);
      } finally {
        isGeneratingPDF = false;
      }
    }
  
    async function sendProposal() {
      isSending = true;
      try {
        // This will be implemented with actual sending logic
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        console.log('Proposal sent!');
      } catch (error) {
        console.error('Failed to send proposal:', error);
      } finally {
        isSending = false;
      }
    }
  
    async function saveAsDraft() {
      await proposalActions.saveDraft();
    }
  
    function downloadPDF() {
      if (generatedPDFUrl) {
        window.open(generatedPDFUrl, '_blank');
      }
    }
  
    function formatCurrency(amount: number, currency: string = 'USD'): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  </script>
  
  <!-- Review Step -->
  <div class="review-step space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h3 class="text-2xl font-bold text-slate-900 mb-2">Review Your Proposal</h3>
      <p class="text-slate-600">Review all details before generating and sending your proposal</p>
    </div>
  
    {#if $currentProposal}
      <!-- Proposal Preview -->
      <div class="proposal-preview bg-white border border-slate-200 rounded-lg shadow-sm">
        <!-- Header Section -->
        <div class="p-8 border-b border-slate-200 bg-gradient-to-r from-primary-50 to-primary-100">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 mb-2">{$currentProposal.title}</h1>
              <p class="text-lg text-slate-600">{$currentProposal.description}</p>
            </div>
            <div class="text-right">
              <div class="text-sm text-slate-500 uppercase tracking-wide">Proposal</div>
              <div class="text-2xl font-bold text-primary-600">
                {#if $proposalTotals}
                  {$proposalTotals.total.format()}
                {/if}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Client Information -->
        <div class="p-8 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Client Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-slate-900">{$currentProposal.clientCompany}</h3>
              <p class="text-slate-600">{$currentProposal.clientContactName}</p>
              <p class="text-slate-600">{$currentProposal.clientEmail}</p>
              {#if $currentProposal.clientPhone}
                <p class="text-slate-600">{$currentProposal.clientPhone}</p>
              {/if}
            </div>
            {#if $currentProposal.clientAddress && ($currentProposal.clientAddress.street || $currentProposal.clientAddress.city)}
              <div>
                <h4 class="font-medium text-slate-900 mb-1">Address</h4>
                <div class="text-slate-600 text-sm">
                  {#if $currentProposal.clientAddress.street}
                    <p>{$currentProposal.clientAddress.street}</p>
                  {/if}
                  <p>
                    {$currentProposal.clientAddress.city || ''}
                    {#if $currentProposal.clientAddress.city && $currentProposal.clientAddress.state}, {/if}
                    {$currentProposal.clientAddress.state || ''}
                    {$currentProposal.clientAddress.zip || ''}
                  </p>
                  {#if $currentProposal.clientAddress.country}
                    <p>{$currentProposal.clientAddress.country}</p>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
  
        <!-- Project Details -->
        <div class="p-8 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Project Overview</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            {#if $currentProposal.projectTimeline}
              <div>
                <h4 class="font-medium text-slate-900 mb-1">Timeline</h4>
                <p class="text-slate-600">{$currentProposal.projectTimeline}</p>
              </div>
            {/if}
            {#if $totalEstimatedHours > 0}
              <div>
                <h4 class="font-medium text-slate-900 mb-1">Estimated Hours</h4>
                <p class="text-slate-600">{$totalEstimatedHours} hours</p>
              </div>
            {/if}
            <div>
              <h4 class="font-medium text-slate-900 mb-1">Currency</h4>
              <p class="text-slate-600">{$currentProposal.currencyCode}</p>
            </div>
          </div>
        </div>
  
        <!-- Line Items -->
        {#if $currentProposal.lineItems && $currentProposal.lineItems.length > 0}
          <div class="p-8 border-b border-slate-200">
            <h2 class="text-xl font-semibold text-slate-900 mb-6">Services & Deliverables</h2>
            <div class="space-y-4">
              {#each $currentProposal.lineItems as item, index}
                <div class="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                  <div class="flex-1">
                    <h4 class="font-medium text-slate-900">{item.title}</h4>
                    {#if item.description}
                      <p class="text-slate-600 mt-1">{item.description}</p>
                    {/if}
                    <div class="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <span class="capitalize">{item.itemType}</span>
                      <span>•</span>
                      <span>{item.quantity} {item.unitType}</span>
                      <span>•</span>
                      <span>{formatCurrency(item.unitPrice, $currentProposal.currencyCode)} each</span>
                      {#if item.estimatedHours}
                        <span>•</span>
                        <span>{item.estimatedHours}h estimated</span>
                      {/if}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-semibold text-slate-900">
                      {formatCurrency(item.totalPrice, $currentProposal.currencyCode)}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
  
        <!-- Pricing Summary -->
        {#if $proposalTotals}
          <div class="p-8 border-b border-slate-200">
            <h2 class="text-xl font-semibold text-slate-900 mb-4">Pricing Summary</h2>
            <div class="max-w-md ml-auto">
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-slate-600">Subtotal:</span>
                  <span class="font-medium">{$proposalTotals.subtotal.format()}</span>
                </div>
                {#if $currentProposal.taxRate && $currentProposal.taxRate > 0}
                  <div class="flex justify-between">
                    <span class="text-slate-600">
                      Tax ({($currentProposal.taxRate * 100).toFixed(2)}%):
                    </span>
                    <span class="font-medium">{$proposalTotals.taxAmount.format()}</span>
                  </div>
                {/if}
                <div class="flex justify-between text-xl font-bold border-t border-slate-300 pt-3">
                  <span>Total:</span>
                  <span class="text-primary-600">{$proposalTotals.total.format()}</span>
                </div>
              </div>
            </div>
          </div>
        {/if}
  
        <!-- Terms & Conditions -->
        <div class="p-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Terms & Conditions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-slate-900 mb-2">Payment Terms</h4>
              <p class="text-slate-600">{$currentProposal.paymentTerms}</p>
            </div>
            {#if $currentProposal.validUntil}
              <div>
                <h4 class="font-medium text-slate-900 mb-2">Valid Until</h4>
                <p class="text-slate-600">
                  {new Date($currentProposal.validUntil).toLocaleDateString()}
                </p>
              </div>
            {/if}
          </div>
          {#if $currentProposal.notes}
            <div class="mt-6">
              <h4 class="font-medium text-slate-900 mb-2">Additional Notes</h4>
              <p class="text-slate-600">{$currentProposal.notes}</p>
            </div>
          {/if}
        </div>
      </div>
  
      <!-- Actions -->
      <div class="flex items-center justify-center space-x-4">
        <!-- Save as Draft -->
        <button
          type="button"
          class="btn btn-secondary"
          on:click={saveAsDraft}
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save as Draft
        </button>
  
        <!-- Generate PDF -->
        <button
          type="button"
          class="btn btn-outline"
          class:loading={isGeneratingPDF}
          disabled={isGeneratingPDF}
          on:click={generatePDF}
        >
          {#if isGeneratingPDF}
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Generating...
          {:else}
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate PDF
          {/if}
        </button>
  
        <!-- Download PDF (if generated) -->
        {#if generatedPDFUrl}
          <button
            type="button"
            class="btn btn-outline"
            on:click={downloadPDF}
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        {/if}
  
        <!-- Send Proposal -->
        <button
          type="button"
          class="btn btn-primary"
          class:loading={isSending}
          disabled={isSending}
          on:click={sendProposal}
        >
          {#if isSending}
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sending...
          {:else}
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Proposal
          {/if}
        </button>
      </div>
  
      <!-- Success Message (if sent) -->
      {#if generatedPDFUrl}
        <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div class="flex items-center justify-center space-x-2 text-green-800">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="font-semibold">Proposal generated successfully!</span>
          </div>
          <p class="text-green-700 mt-2">
            Your PDF is ready for download. You can now send it to your client.
          </p>
        </div>
      {/if}
    {:else}
      <!-- Empty state -->
      <div class="text-center py-12">
        <div class="text-slate-400 text-4xl mb-4">📄</div>
        <h4 class="text-lg font-medium text-slate-900 mb-2">No proposal data</h4>
        <p class="text-slate-600">Please go back and complete the previous steps.</p>
      </div>
    {/if}
  </div>
  
  <style>
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
  
    .section-card {
      padding: 1.5rem;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid rgb(229, 231, 235);
      margin-bottom: 1rem;
    }
  
    .edit-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.875rem;
      color: rgb(59, 130, 246);
      border: 1px solid rgb(59, 130, 246);
      border-radius: 0.375rem;
      background-color: transparent;
      transition: all 0.2s;
    }
  
    .edit-btn:hover {
      background-color: rgb(59, 130, 246);
      color: white;
    }
  
    .table-container {
      overflow-x: auto;
      border-radius: 0.5rem;
      border: 1px solid rgb(229, 231, 235);
    }
  
    .table {
      width: 100%;
      border-collapse: collapse;
    }
  
    .table th {
      background-color: rgb(249, 250, 251);
      padding: 0.75rem;
      text-align: left;
      font-weight: 500;
      color: rgb(55, 65, 81);
      border-bottom: 1px solid rgb(229, 231, 235);
    }
  
    .table td {
      padding: 0.75rem;
      border-bottom: 1px solid rgb(229, 231, 235);
      color: rgb(55, 65, 81);
    }
  
    .table tr:last-child td {
      border-bottom: none;
    }
  </style> 