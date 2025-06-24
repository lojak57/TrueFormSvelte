<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { CheckCircle } from "lucide-svelte";
</script>

<div class="success-state" in:fly={{ y: 30, duration: 600 }}>
  <div class="success-icon" in:fade={{ duration: 400, delay: 200 }}>
    <CheckCircle size={64} />
  </div>
  <h2 class="success-title" in:fade={{ duration: 400, delay: 400 }}>
    Project Submitted Successfully!
  </h2>
  <p class="success-message" in:fade={{ duration: 400, delay: 600 }}>
    We've received your project details and our designer is already reviewing
    everything. You'll hear from us within 24-48 hours with your official
    proposal.
  </p>
  <div class="success-redirect" in:fade={{ duration: 400, delay: 800 }}>
    Redirecting you to confirmation page...
  </div>
</div>

<style>
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
</style>
