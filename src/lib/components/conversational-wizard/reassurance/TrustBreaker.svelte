<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Heart, MessageCircle, Sparkles } from "lucide-svelte";

  export let checked: boolean = false;

  const dispatch = createEventDispatcher();

  function handleContinue() {
    if (checked) {
      dispatch("continue");
    }
  }
</script>

<div class="trust-breaker" in:fade={{ duration: 400 }}>
  <div class="icon-container" in:fly={{ y: 20, duration: 600, delay: 200 }}>
    <Heart size={48} class="icon heart" />
    <MessageCircle size={48} class="icon message" />
    <Sparkles size={48} class="icon sparkles" />
  </div>

  <h2 in:fly={{ y: 20, duration: 600, delay: 400 }}>
    Before We Wrap This Up...
  </h2>

  <div class="content" in:fly={{ y: 20, duration: 600, delay: 600 }}>
    <p>
      <strong>We just want to say: This isn't a test.</strong> You're not being graded.
    </p>

    <p>
      This project is a collaboration—and these answers help your designer
      understand your vision.
    </p>

    <p>You'll get to see a draft, give feedback, and evolve it together.</p>

    <p class="highlight">
      That's the heart of TrueForm: custom websites, built like a conversation.
    </p>

    <p class="reassurance">If anything feels off later—we'll fix it. ✌️</p>
  </div>

  <label
    class="checkbox-container"
    in:fly={{ y: 20, duration: 600, delay: 800 }}
  >
    <input type="checkbox" bind:checked on:change={handleContinue} />
    <span>Got it. Let's move forward.</span>
  </label>
</div>

<style>
  .trust-breaker {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  .icon-container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .icon {
    opacity: 0.2;
    transition: all 0.3s ease;
  }

  .icon.heart {
    color: #ef4444;
    animation: pulse 2s infinite;
  }

  .icon.message {
    color: #3b82f6;
    animation: pulse 2s infinite 0.5s;
  }

  .icon.sparkles {
    color: #f59e0b;
    animation: pulse 2s infinite 1s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.1);
    }
  }

  h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
  }

  .content {
    text-align: left;
    color: #4b5563;
    line-height: 1.75;
    margin-bottom: 2rem;
  }

  .content p {
    margin-bottom: 1rem;
  }

  .content strong {
    color: #111827;
    font-weight: 600;
  }

  .highlight {
    background: linear-gradient(to right, #fef3c7, #fde68a);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    color: #92400e;
    font-weight: 500;
  }

  .reassurance {
    text-align: center;
    font-size: 1.125rem;
    color: #6b7280;
    margin-top: 1.5rem !important;
  }

  .checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 1rem 1.5rem;
    background: #f3f4f6;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .checkbox-container:hover {
    background: #e5e7eb;
  }

  .checkbox-container input[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
  }

  .checkbox-container span {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
  }

  @media (max-width: 640px) {
    .trust-breaker {
      padding: 1.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .icon {
      width: 36px;
      height: 36px;
    }

    .content {
      font-size: 0.938rem;
    }
  }
</style>
