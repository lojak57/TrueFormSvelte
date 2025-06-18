<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { ArrowRight, Check, Palette } from "lucide-svelte";
  import { scale, fade } from "svelte/transition";

  export let selected: string = "";
  export let designMood: string[] = [];

  const dispatch = createEventDispatcher();

  const colorPalettes = [
    {
      id: "ocean",
      name: "Ocean Blues",
      colors: ["#0EA5E9", "#0284C7", "#0369A1", "#1E40AF"],
      moods: ["modern", "tech", "professional"],
      description: "Professional and trustworthy",
    },
    {
      id: "sunset",
      name: "Warm Sunset",
      colors: ["#F59E0B", "#EF4444", "#DC2626", "#F97316"],
      moods: ["bold", "playful", "dynamic"],
      description: "Energetic and vibrant",
    },
    {
      id: "forest",
      name: "Forest Greens",
      colors: ["#10B981", "#059669", "#047857", "#065F46"],
      moods: ["organic", "natural", "elegant"],
      description: "Natural and sustainable",
    },
    {
      id: "royal",
      name: "Royal Purple",
      colors: ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6"],
      moods: ["luxury", "elegant", "sophisticated"],
      description: "Luxury and premium",
    },
    {
      id: "monochrome",
      name: "Classic Monochrome",
      colors: ["#000000", "#374151", "#6B7280", "#E5E7EB"],
      moods: ["modern", "professional", "elegant"],
      description: "Timeless and clean",
    },
    {
      id: "candy",
      name: "Candy Pop",
      colors: ["#EC4899", "#F472B6", "#FBBF24", "#34D399"],
      moods: ["playful", "bold", "fun"],
      description: "Fun and playful",
    },
    {
      id: "earth",
      name: "Earth Tones",
      colors: ["#92400E", "#B45309", "#D97706", "#FCD34D"],
      moods: ["organic", "natural", "professional"],
      description: "Warm and grounded",
    },
  ];

  // Custom color picker state
  let showCustomPicker = false;
  let customColors = ["#E5E7EB", "#E5E7EB", "#E5E7EB", "#E5E7EB"];
  let customColorName = "My Custom Palette";

  // Filter palettes based on selected mood
  $: recommendedPalettes =
    designMood.length > 0
      ? colorPalettes.filter((p) =>
          p.moods?.some((mood) => designMood.includes(mood))
        )
      : colorPalettes;

  $: displayPalettes =
    recommendedPalettes.length > 0 ? recommendedPalettes : colorPalettes;

  let animatingPalette = "";

  function selectPalette(paletteId: string) {
    if (paletteId === "custom") {
      showCustomPicker = true;
      selected = "";
      return;
    }

    if (selected === paletteId) {
      // Clicking the same palette that's already selected = deselect it
      selected = "";
      animatingPalette = "";
    } else {
      // Clicking a different palette = select it (replaces previous selection)
      selected = paletteId;
      animatingPalette = paletteId;
      showCustomPicker = false;
      // Clear animation state after animation completes
      setTimeout(() => {
        animatingPalette = "";
      }, 600);
    }
  }

  function updateCustomColor(index: number, color: string) {
    customColors[index] = color;
    customColors = [...customColors]; // Trigger reactivity
  }

  function selectCustomPalette() {
    selected = "custom";
    showCustomPicker = false;
    // Save custom colors for later use
    dispatch("complete", {
      value: "custom",
      customColors: customColors,
      customName: customColorName,
    });
  }

  function backToPresets() {
    showCustomPicker = false;
    selected = "";
  }
</script>

<div class="space-y-6">
  {#if !showCustomPicker}
    {#if designMood.length > 0 && recommendedPalettes.length > 1}
      <p class="text-sm text-gray-600">
        Based on your design mood, we recommend these palettes:
      </p>
    {/if}

    <div class="grid grid-cols-2 gap-4">
      {#each displayPalettes as palette}
        <button
          on:click={() => selectPalette(palette.id)}
          class="relative p-4 border-2 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] overflow-hidden
            {selected === palette.id
            ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05]'
            : 'border-gray-200 hover:border-gray-300 bg-white'}
            {animatingPalette === palette.id ? 'animate-pulse' : ''}"
        >
          {#if designMood.length > 0 && palette.moods?.some( (mood) => designMood.includes(mood) )}
            <span
              class="absolute top-2 right-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-md z-10 font-medium"
            >
              ✓ Recommended
            </span>
          {/if}

          <!-- Fill-up animation background -->
          {#if animatingPalette === palette.id || selected === palette.id}
            <div
              class="absolute inset-0 bg-orange-600"
              in:scale={{
                duration: 500,
                start: 0,
                easing: (t) => t * t * (3 - 2 * t),
              }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
            <!-- Beautiful bloom effect -->
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
            <!-- Subtle sparkle overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"
              in:scale={{ duration: 600, delay: 600, start: 0.8 }}
              out:scale={{ duration: 200, start: 1 }}
              style="transform-origin: center center;"
            />
          {/if}

          {#if animatingPalette === palette.id || selected === palette.id}
            <div
              class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl z-20 ring-2 ring-white/50"
              in:scale={{ duration: 400, delay: 300, start: 0 }}
              out:scale={{ duration: 200, start: 0.5 }}
            >
              <Check size={18} class="text-orange-600 font-bold" />
            </div>
          {/if}

          <div class="space-y-3 relative z-10">
            <div class="flex gap-1 justify-center">
              {#each palette.colors as color}
                <div
                  class="w-12 h-12 rounded-lg shadow-sm {selected === palette.id
                    ? 'ring-2 ring-white/50'
                    : ''}"
                  style="background-color: {color}"
                />
              {/each}
            </div>

            <div>
              <h3
                class="font-bold {selected === palette.id
                  ? 'text-white drop-shadow-sm'
                  : 'text-gray-900'} transition-colors duration-300"
              >
                {palette.name}
              </h3>
              {#if palette.description}
                <p
                  class="text-sm font-medium {selected === palette.id
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-600'} mt-1 transition-colors duration-300"
                >
                  {palette.description}
                </p>
              {/if}
            </div>
          </div>
        </button>
      {/each}

      <!-- Custom Color Option -->
      <button
        on:click={() => selectPalette("custom")}
        class="relative p-4 border-2 border-dashed border-gray-300 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] hover:border-accent-400 bg-gradient-to-br from-gray-50 to-white"
      >
        <div class="space-y-3">
          <div class="flex gap-1 justify-center">
            {#each Array(4) as _, i}
              <div
                class="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center"
              >
                <Palette size={20} class="text-gray-400" />
              </div>
            {/each}
          </div>

          <div>
            <h3 class="font-bold text-gray-900">Custom Colors</h3>
            <p class="text-sm font-medium text-gray-600 mt-1">
              Pick your own 4 colors
            </p>
          </div>
        </div>
      </button>
    </div>

    <!-- Continue Button -->
    <div class="flex justify-end">
      <button
        on:click={() => dispatch("complete", { value: selected })}
        disabled={!selected}
        class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
      >
        Continue
        <ArrowRight size={20} />
      </button>
    </div>
  {:else}
    <!-- Custom Color Picker Interface -->
    <div in:fade={{ duration: 300 }} class="space-y-6">
      <div class="text-center">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          Create Your Custom Palette
        </h3>
        <p class="text-gray-600">Choose 4 colors that represent your brand</p>
      </div>

      <!-- Custom Palette Name -->
      <div class="max-w-md mx-auto">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Palette Name (Optional)
        </label>
        <input
          bind:value={customColorName}
          placeholder="e.g., My Brand Colors"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
        />
      </div>

      <!-- Color Pickers -->
      <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {#each customColors as color, i}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Color {i + 1}
            </label>
            <div class="relative">
              <input
                type="color"
                value={color}
                on:change={(e) => updateCustomColor(i, e.currentTarget.value)}
                class="w-full h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div
                class="absolute inset-0 rounded-lg border-2 border-gray-300 pointer-events-none"
                style="background-color: {color}"
              />
            </div>
          </div>
        {/each}
      </div>

      <!-- Preview -->
      <div class="max-w-md mx-auto">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Preview</h4>
        <div class="p-4 border-2 border-gray-200 rounded-xl bg-white">
          <div class="flex gap-1 justify-center mb-3">
            {#each customColors as color}
              <div
                class="w-12 h-12 rounded-lg shadow-sm"
                style="background-color: {color}"
              />
            {/each}
          </div>
          <div class="text-center">
            <h3 class="font-bold text-gray-900">{customColorName}</h3>
            <p class="text-sm text-gray-600">Your custom palette</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between max-w-md mx-auto">
        <button
          on:click={backToPresets}
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to presets
        </button>

        <button
          on:click={selectCustomPalette}
          class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all"
        >
          Use This Palette
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  {/if}

  <div class="text-center text-sm text-gray-500">
    <p>Don't worry - we can always adjust colors later!</p>
  </div>
</div>
