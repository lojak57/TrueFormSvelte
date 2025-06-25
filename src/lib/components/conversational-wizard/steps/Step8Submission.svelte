<script lang="ts">
  import { conversationalWizard } from "../conversationalWizardStore";
  import InlineReassurance from "../reassurance/InlineReassurance.svelte";
  import ProcessStep from "../../submission/ProcessStep.svelte";
  import PricingBreakdown from "../../submission/PricingBreakdown.svelte";
  import GuaranteesGrid from "../../submission/GuaranteesGrid.svelte";
  import { fade, fly } from "svelte/transition";
  import { SUBMISSION_PROCESS_STEPS } from "$lib/data/submissionProcess";

  let isSubmitting = false;
  let isSubmitted = false;

  // Subscribe to store
  $: data = $conversationalWizard.data;

  async function handleSubmission() {
    isSubmitting = true;
    conversationalWizard.setSubmitting(true);

    try {
      const response = await fetch("/api/wizard-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit project request");
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      isSubmitted = true;
      conversationalWizard.complete();

      // Redirect to success page after a short delay
      setTimeout(() => {
        window.location.href = "/request/success?submitted=true";
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      isSubmitting = false;
      conversationalWizard.setSubmitting(false);
      alert("There was an error submitting your request. Please try again.");
    }
  }

  function goBack() {
    conversationalWizard.prevStep();
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  {#if !isSubmitted}
    <div in:fly={{ y: 30, duration: 500 }}>
      <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        Ready to bring your vision to life?
      </h2>

      <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
        Here's exactly what happens next—no surprises, just clear next steps.
      </p>

      <!-- What Happens Next Section -->
      <div
        class="process-section"
        in:fly={{ y: 30, duration: 500, delay: 400 }}
      >
        <h3 class="process-title" in:fade={{ duration: 400, delay: 500 }}>
          Your ${data.estimatedTotal?.toLocaleString() || "999"} Investment Process
        </h3>

        <div class="process-steps">
          {#each SUBMISSION_PROCESS_STEPS as step}
            <ProcessStep {step} />
          {/each}
        </div>
      </div>

      <!-- Pricing Clarity Section -->
      <div in:fly={{ y: 30, duration: 500, delay: 1000 }}>
        <PricingBreakdown estimatedTotal={data.estimatedTotal || 999} />
      </div>

      <!-- Guarantees Section -->
      <div in:fly={{ y: 30, duration: 500, delay: 1400 }}>
        <GuaranteesGrid />
      </div>

      <InlineReassurance
        text="Thousands of businesses trust us with their most important asset—their website. You're in excellent hands."
        delay={2000}
      />

      <!-- Submit Button -->
      <div class="submit-section" in:fade={{ duration: 400, delay: 2200 }}>
        <button
          on:click={handleSubmission}
          class="submit-button"
          disabled={isSubmitting}
        >
          {#if isSubmitting}
            <div class="loading-spinner" />
            Submitting Your Project...
          {:else}
            Submit Project Request
          {/if}
        </button>

        <p class="submit-note">
          By submitting, you're not committing to anything yet—just starting a
          conversation about your project.
        </p>
      </div>

      <!-- Back Button -->
      <button
        on:click={goBack}
        class="back-button"
        in:fade={{ duration: 300, delay: 2400 }}
      >
        ← Back to Scoping
      </button>
    </div>
  {:else}
    <!-- Success State -->
    <div class="success-state" in:fly={{ y: 30, duration: 600 }}>
      <div class="success-icon" in:fade={{ duration: 400, delay: 200 }}>
        <CheckCircle size={64} />
      </div>
      <h2 class="success-title" in:fade={{ duration: 400, delay: 400 }}>
        Project Submitted Successfully!
      </h2>
      <p class="success-message" in:fade={{ duration: 400, delay: 600 }}>
        We've received your project details and our designer is already
        reviewing everything. You'll hear from us within 24-48 hours with your
        official proposal.
      </p>
      <div class="success-redirect" in:fade={{ duration: 400, delay: 800 }}>
        Redirecting you to confirmation page...
      </div>
    </div>
  {/if}
</div>

<style>
  .step-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    height: auto;
    min-height: auto;
  }

  .step-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    line-height: 1.2;
    text-align: center;
  }

  .step-subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    margin-bottom: 3rem;
    line-height: 1.5;
    text-align: center;
  }

  /* Process Section */
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

  /* Pricing Clarity */
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

  /* Guarantees Section */
  .guarantees-section {
    margin-bottom: 3rem;
  }

  .guarantees-section h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    text-align: center;
  }

  .guarantees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .guarantee-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  .guarantee-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .guarantee-text {
    font-size: 0.875rem;
    line-height: 1.4;
    color: #374151;
  }

  /* Submit Section */
  .submit-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .submit-button {
    width: 100%;
    padding: 1rem 2rem;
    background: #3b82f6;
    color: white;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .submit-button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .submit-note {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .back-button {
    color: #6b7280;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
    display: block;
    margin: 0 auto;
  }

  .back-button:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  /* Success State */
  .success-state {
    text-align: center;
    padding: 3rem 2rem;
  }

  .success-icon {
    color: #10b981;
    margin-bottom: 2rem;
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
  }

  .success-message {
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .success-redirect {
    font-size: 0.875rem;
    color: #3b82f6;
    font-style: italic;
  }

  @media (max-width: 640px) {
    .step-container {
      padding: 1rem;
    }

    .step-title {
      font-size: 2rem;
    }

    .process-step {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .step-icon {
      margin: 0 auto;
    }

    .pricing-split {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .split-divider {
      transform: rotate(90deg);
      font-size: 1rem;
    }

    .guarantees-grid {
      grid-template-columns: 1fr;
    }

    .guarantee-item {
      text-align: left;
    }
  }
</style>
