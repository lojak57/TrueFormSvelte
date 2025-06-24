<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { CheckCircle, DollarSign, FileText, Zap } from "lucide-svelte";

  export let estimatedTotal: number = 999;
</script>

<div class="process-section" in:fly={{ y: 30, duration: 500, delay: 400 }}>
  <h3 class="process-title" in:fade={{ duration: 400, delay: 500 }}>
    Your ${estimatedTotal.toLocaleString()} Investment Process
  </h3>

  <div class="process-steps">
    <div class="process-step" in:fly={{ x: -30, duration: 400, delay: 600 }}>
      <div class="step-icon step-1">
        <FileText size={24} />
      </div>
      <div class="step-content">
        <h4>1. Designer Review</h4>
        <p>
          Our designer reviews your scoped project and all the details you've
          shared. We'll refine the exact features and ensure everything aligns
          with your vision.
        </p>
        <span class="step-timing">Within 24-48 hours (usually much sooner)</span
        >
      </div>
    </div>

    <div class="process-step" in:fly={{ x: -30, duration: 400, delay: 700 }}>
      <div class="step-icon step-2">
        <DollarSign size={24} />
      </div>
      <div class="step-content">
        <h4>2. Official Proposal + 25% Deposit</h4>
        <p>
          You'll receive a refined proposal with a secure payment link. Pay just
          25% to get started—this confirms your spot in our queue and kicks off
          the design process.
        </p>
        <span class="step-timing">Proposal valid for 7 days</span>
      </div>
    </div>

    <div class="process-step" in:fly={{ x: -30, duration: 400, delay: 800 }}>
      <div class="step-icon step-3">
        <Zap size={24} />
      </div>
      <div class="step-content">
        <h4>3. We Build Your Site</h4>
        <p>
          Our team gets to work immediately. You'll see progress updates and can
          provide feedback throughout the process. Most sites are completed
          within 7 business days.
        </p>
        <span class="step-timing">7-day delivery promise</span>
      </div>
    </div>

    <div class="process-step" in:fly={{ x: -30, duration: 400, delay: 900 }}>
      <div class="step-icon step-4">
        <CheckCircle size={24} />
      </div>
      <div class="step-content">
        <h4>4. Final Payment + Launch</h4>
        <p>
          Once you approve the final site, we collect the remaining 75% and
          launch your site live. Your hosting and support start immediately.
        </p>
        <span class="step-timing">Same-day launch after approval</span>
      </div>
    </div>
  </div>
</div>

<style>
  .process-section {
    margin-bottom: 3rem;
  }

  .process-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    text-align: center;
  }

  .process-steps {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .process-step {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .step-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .step-1 {
    background: #3b82f6;
  }
  .step-2 {
    background: #10b981;
  }
  .step-3 {
    background: #f59e0b;
  }
  .step-4 {
    background: #8b5cf6;
  }

  .step-content h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .step-content p {
    color: #6b7280;
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }

  .step-timing {
    font-size: 0.875rem;
    color: #3b82f6;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .process-step {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .step-icon {
      margin: 0 auto;
    }
  }
</style>
