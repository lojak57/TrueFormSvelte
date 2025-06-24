<script lang="ts">
  import { conversationalWizard } from "../conversationalWizardStore";
  import InlineReassurance from "../reassurance/InlineReassurance.svelte";
  import ProcessSteps from "./ProcessSteps.svelte";
  import InvestmentBreakdown from "./InvestmentBreakdown.svelte";
  import GuaranteesSection from "./GuaranteesSection.svelte";
  import SuccessState from "./SuccessState.svelte";
  import { fade, fly } from "svelte/transition";

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
      <!-- Header -->
      <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        Ready to bring your vision to life?
      </h2>

      <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
        Here's exactly what happens next—no surprises, just clear next steps.
      </p>

      <!-- Process Steps -->
      <ProcessSteps estimatedTotal={data.estimatedTotal || 999} />

      <!-- Investment Breakdown -->
      <InvestmentBreakdown estimatedTotal={data.estimatedTotal || 999} />

      <!-- Guarantees -->
      <GuaranteesSection />

      <!-- Reassurance -->
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
    <SuccessState />
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
    border: none;
    cursor: pointer;
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
    background: none;
    border: none;
    cursor: pointer;
  }

  .back-button:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  @media (max-width: 640px) {
    .step-container {
      padding: 1rem;
    }

    .step-title {
      font-size: 2rem;
    }
  }
</style>