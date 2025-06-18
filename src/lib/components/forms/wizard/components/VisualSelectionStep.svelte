<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { Check, ArrowRight } from "lucide-svelte";

  export let options: Array<{
    id: string;
    name: string;
    icon?: string;
    image?: string;
    description?: string;
    recommended?: boolean;
  }> = [];

  export let selected: string | string[] = "";
  export let multiple: boolean = false;
  export let columns: number = 2;
  export let autoAdvance: boolean = true;
  export let maxSelections: number = 0;

  const dispatch = createEventDispatcher();

  $: selectedArray = Array.isArray(selected)
    ? selected
    : selected
    ? [selected]
    : [];
  $: canSelectMore = !maxSelections || selectedArray.length < maxSelections;

  let animatingOption = "";

  function handleSelect(optionId: string) {
    if (multiple) {
      // Multiple selection: toggle each option independently
      if (selectedArray.includes(optionId)) {
        // Deselecting this specific option
        selected = selectedArray.filter((id) => id !== optionId);
        // Clear animation for this option
        if (animatingOption === optionId) {
          animatingOption = "";
        }
      } else if (canSelectMore) {
        // Selecting this option (add to existing selections)
        selected = [...selectedArray, optionId];
        animatingOption = optionId;
        setTimeout(() => {
          animatingOption = "";
        }, 600);
      }
    } else {
      // Single selection: toggle the clicked option
      if (isSelected(optionId)) {
        // Clicking the same option that's already selected = deselect it
        selected = "";
        animatingOption = "";
      } else {
        // Clicking a different option = select it (replaces any previous selection)
        selected = optionId;
        animatingOption = optionId;
        // Clear animation state after animation completes
        setTimeout(() => {
          animatingOption = "";
        }, 600);
        if (autoAdvance) {
          // Show the fill animation, bloom effect, and checkmark, then advance
          setTimeout(() => {
            dispatch("complete", { value: selected });
          }, 1200); // Extended delay to enjoy the bloom
        }
      }
    }
  }

  function handleContinue() {
    dispatch("complete", { value: selected });
  }

  function isSelected(optionId: string): boolean {
    return selectedArray.includes(optionId);
  }
</script>

<div class="space-y-6">
  <!-- Options Grid -->
  <div class="grid gap-4" style="grid-template-columns: repeat({columns}, 1fr)">
    {#each options as option}
      <button
        on:click={() => handleSelect(option.id)}
        class="relative {option.image
          ? 'p-0'
          : 'p-6'} border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] overflow-hidden
          {isSelected(option.id)
          ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05] shadow-accent-200/50'
          : 'border-gray-200 hover:border-gray-300 bg-white'}"
      >
        <!-- Fill-up animation background -->
        {#if animatingOption === option.id || isSelected(option.id)}
          <div
            class="absolute inset-0 bg-orange-600"
            in:scale={{
              duration: multiple ? 300 : 500,
              start: 0,
              easing: (t) => t * t * (3 - 2 * t),
            }}
            out:scale={{ duration: 200, start: 1 }}
            style="transform-origin: center center;"
          />
          {#if !multiple}
            <!-- Beautiful bloom effect (only for single selection) -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 opacity-60"
              in:scale={{
                duration: 800,
                delay: 400,
                start: 0.3,
                easing: (t) => 1 - Math.pow(1 - t, 3),
              }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
            <!-- Subtle sparkle overlay (only for single selection) -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"
              in:scale={{ duration: 600, delay: 600, start: 0.8 }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
          {/if}
        {/if}

        {#if option.recommended}
          <span
            class="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full z-10"
          >
            Recommended
          </span>
        {/if}

        {#if animatingOption === option.id || isSelected(option.id)}
          <div
            class="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl z-20 ring-2 ring-white/50"
            in:scale={{ duration: 400, delay: multiple ? 100 : 300, start: 0 }}
            out:scale={{ duration: 200, start: 0.5 }}
          >
            <Check size={18} class="text-orange-600 font-bold" />
          </div>
        {/if}

        <div class="{option.image ? 'space-y-0' : 'space-y-3'} relative z-10">
          {#if option.image}
            <!-- Image version with overlay -->
            <div class="relative h-32 overflow-hidden rounded-t-xl">
              <img
                src={option.image}
                alt={option.name}
                class="w-full h-full object-cover {isSelected(option.id)
                  ? 'brightness-110'
                  : ''}"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              />
              <div class="absolute bottom-2 left-2 right-2">
                <div class="flex items-center gap-2 mb-1">
                  {#if option.icon}
                    <span class="text-lg filter drop-shadow-sm"
                      >{option.icon}</span
                    >
                  {/if}
                  <h3 class="font-bold text-white drop-shadow-sm text-sm">
                    {option.name}
                  </h3>
                </div>
                {#if option.description}
                  <p class="text-xs text-white/90 drop-shadow-sm">
                    {option.description}
                  </p>
                {/if}
              </div>
            </div>
            <!-- Add some padding at bottom for image cards -->
            <div class="p-4" />
          {:else}
            <!-- Icon version (fallback) -->
            {#if option.icon}
              <div
                class="text-4xl {isSelected(option.id)
                  ? 'filter drop-shadow-sm'
                  : ''}"
              >
                {option.icon}
              </div>
            {/if}

            <div>
              <h3
                class="font-bold {isSelected(option.id)
                  ? 'text-white drop-shadow-sm'
                  : 'text-gray-900'} transition-colors duration-300"
              >
                {option.name}
              </h3>
              {#if option.description}
                <p
                  class="text-sm font-medium {isSelected(option.id)
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-600'} mt-1 transition-colors duration-300"
                >
                  {option.description}
                </p>
              {/if}
            </div>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Continue Button (for multiple selection) -->
  {#if multiple || !autoAdvance}
    <div class="flex justify-end">
      <button
        on:click={handleContinue}
        disabled={selectedArray.length === 0}
        class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
      >
        Continue
        <ArrowRight size={20} />
      </button>
    </div>
  {/if}

  <!-- Helper Text -->
  {#if multiple && maxSelections > 0}
    <p class="text-sm text-gray-500 text-center">
      Select up to {maxSelections} option{maxSelections > 1 ? "s" : ""}
      ({selectedArray.length} selected)
    </p>
  {:else if multiple}
    <p class="text-sm text-gray-500 text-center">Select all that apply</p>
  {/if}
</div>
