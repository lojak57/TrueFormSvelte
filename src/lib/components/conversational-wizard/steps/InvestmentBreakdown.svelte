<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { Clock } from "lucide-svelte";

  export let estimatedTotal: number = 999;
</script>

<div class="pricing-clarity" in:fly={{ y: 30, duration: 500, delay: 1000 }}>
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
        <div class="split-amount">
          ${Math.round(estimatedTotal * 0.25).toLocaleString()}
        </div>
        <div class="split-desc">Secures your spot, starts design</div>
      </div>
      <div class="split-divider">+</div>
      <div class="split-item">
        <div class="split-label">At Completion (75%)</div>
        <div class="split-amount">
          ${Math.round(estimatedTotal * 0.75).toLocaleString()}
        </div>
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
    background: #f8fafc;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 3rem;
  }

  .clarity-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .clarity-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .clarity-header p {
    color: #6b7280;
  }

  .pricing-breakdown {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .pricing-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1.5rem;
    font-size: 1.125rem;
  }

  .price-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #3b82f6;
  }

  .pricing-split {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
  }

  .split-item {
    text-align: center;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.75rem;
  }

  .split-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
  }

  .split-amount {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .split-desc {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .split-divider {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6b7280;
    text-align: center;
  }

  .pricing-note {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 1rem;
    background: #fef3c7;
    border-radius: 0.5rem;
    border-left: 4px solid #f59e0b;
  }

  .pricing-note p {
    margin: 0;
    color: #92400e;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  @media (max-width: 640px) {
    .pricing-split {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .split-divider {
      transform: rotate(90deg);
      font-size: 1rem;
    }
  }
</style>
