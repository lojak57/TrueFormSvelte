<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { Sparkles, ArrowRight, Zap, Clock, Shield } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  let showContent = false;
  let showFeatures = false;
  let showButton = false;

  onMount(() => {
    // Stagger the animations for maximum impact
    setTimeout(() => (showContent = true), 200);
    setTimeout(() => (showFeatures = true), 600);
    setTimeout(() => (showButton = true), 900);
  });

  function handleStart() {
    dispatch("complete");
  }
</script>

<div class="text-center py-8 space-y-8 relative overflow-hidden">
  <!-- Background decoration -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-accent-50 via-white to-purple-50 opacity-60"
  />
  <div
    class="absolute top-4 left-4 w-16 h-16 bg-accent-200 rounded-full opacity-20 animate-pulse"
  />
  <div
    class="absolute bottom-4 right-4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse"
    style="animation-delay: 1s"
  />

  <div class="relative z-10">
    {#if showContent}
      <!-- Hero Icon & Headline Combined -->
      <div in:scale={{ duration: 600, delay: 0 }} class="space-y-4">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-xl transform hover:scale-105 transition-transform"
        >
          <Sparkles size={40} class="text-white" />
        </div>

        <div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-accent-700 to-purple-700 bg-clip-text text-transparent mb-3"
          >
            Welcome to TrueForm!
          </h1>
          <p class="text-xl text-gray-600 max-w-xl mx-auto">
            Let's create your perfect website together
          </p>
        </div>
      </div>
    {/if}

    {#if showFeatures}
      <!-- Feature Pills -->
      <div
        in:fly={{ y: 20, duration: 400, delay: 0 }}
        class="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto"
      >
        <div
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
        >
          <Zap size={16} class="text-accent-600" />
          <span class="text-gray-700 text-sm font-medium">5-7 minutes</span>
        </div>
        <div
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
        >
          <Shield size={16} class="text-green-600" />
          <span class="text-gray-700 text-sm font-medium"
            >No tech skills needed</span
          >
        </div>
        <div
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100"
        >
          <Clock size={16} class="text-blue-600" />
          <span class="text-gray-700 text-sm font-medium"
            >Save & resume anytime</span
          >
        </div>
      </div>
    {/if}

    {#if showButton}
      <!-- CTA Section -->
      <div in:fade={{ duration: 400 }} class="space-y-4">
        <button
          on:click={handleStart}
          class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-lg font-semibold rounded-xl hover:from-accent-700 hover:to-accent-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl transform"
        >
          <span>Let's Build Something Amazing</span>
          <ArrowRight
            size={20}
            class="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <div
          class="flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <span>Press</span>
          <kbd
            class="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono"
            >Enter</kbd
          >
          <span>to begin</span>
        </div>
      </div>
    {/if}
  </div>
</div>

<svelte:window
  on:keydown={(e) => e.key === "Enter" && showButton && handleStart()}
/>
