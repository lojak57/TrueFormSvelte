<script lang="ts">
  import { fade } from "svelte/transition";
  import { Clock } from "lucide-svelte";
  import { PRICING_CONFIG } from "$lib/data/submissionProcess";

  export let estimatedTotal: number;

  $: depositAmount = Math.round(
    estimatedTotal * PRICING_CONFIG.depositPercentage
  );
  $: finalAmount = Math.round(estimatedTotal * PRICING_CONFIG.finalPercentage);
</script>

<div class="pricing-clarity">
  <div class="clarity-header" in:fade={{ duration: 400, delay: 1100 }}>
    <h3>Investment Breakdown</h3>
    <p>Clear, honest pricing with no hidden fees</p>
  </div>

  <div class="pricing-breakdown" in:fade={{ duration: 500, delay: 1200 }}>
    <div class="pricing-item">
      <span>Estimated Total Investment</span>
      <span class="price-amount">${estimatedTotal.toLocaleString()}</span>
    </div>
    <div class="pricing-split">
      <div class="split-item">
        <div class="split-label">To Start (25%)</div>
        <div class="split-amount">${depositAmount.toLocaleString()}</div>
        <div class="split-desc">Secure your spot and begin</div>
      </div>
      <div class="split-item">
        <div class="split-label">At Launch (75%)</div>
        <div class="split-amount">${finalAmount.toLocaleString()}</div>
        <div class="split-desc">Final payment before launch</div>
      </div>
    </div>
  </div>

  <div class="pricing-note" in:fade={{ duration: 400, delay: 1300 }}>
    <Clock size={16} />
    <p>
      <strong>Note:</strong> This is a budgetary estimate. Your designer may suggest
      adjustments based on your specific needs, but we'll always get your approval
      before any changes.
    </p>
  </div>
</div>

<style>
  .pricing-clarity {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    border-radius: 16px;
    padding: 2rem;
    margin: 2rem 0;
    border: 1px solid #cbd5e1;
  }

  .clarity-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .clarity-header h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }

  .clarity-header p {
    margin: 0;
    color: #64748b;
    font-size: 1rem;
  }

  .pricing-breakdown {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .pricing-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
    font-size: 1.125rem;
    font-weight: 600;
  }

  .price-amount {
    font-size: 1.75rem;
    font-weight: 700;
    color: #059669;
  }

  .pricing-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .split-item {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .split-label {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .split-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .split-desc {
    font-size: 0.75rem;
    color: #64748b;
  }

  .pricing-note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 1rem;
    background: #fef3c7;
    border-radius: 8px;
    border: 1px solid #fbbf24;
  }

  .pricing-note p {
    margin: 0;
    font-size: 0.875rem;
    color: #92400e;
    line-height: 1.4;
  }

  .pricing-note :global(svg) {
    color: #f59e0b;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .pricing-split {
      grid-template-columns: 1fr;
    }

    .pricing-clarity {
      padding: 1.5rem;
    }
  }
</style>
