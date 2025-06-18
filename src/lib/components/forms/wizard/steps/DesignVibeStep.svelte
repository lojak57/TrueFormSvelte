<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    Palette,
    Sparkles,
    Zap,
    Crown,
    Heart,
    Briefcase,
    Leaf,
    Coffee,
  } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let selected: string[] = [];

  const vibes = [
    {
      id: "modern-minimal",
      name: "Modern & Minimal",
      description:
        "Clean lines, plenty of whitespace, sophisticated simplicity",
      icon: Sparkles,
      gradient: "from-slate-50 to-gray-100",
      accentColor: "rgb(15, 23, 42)",
      tags: ["Clean", "Professional", "Timeless"],
      mood: "Effortlessly elegant",
      preview: {
        bgClass: "bg-slate-50",
        textClass: "text-slate-900",
        accentClass: "bg-slate-900",
        fontClass: "font-light tracking-wide",
        example: "PROFESSIONAL SERVICES",
        tagline: "Excellence in simplicity",
      },
    },
    {
      id: "bold-dynamic",
      name: "Bold & Dynamic",
      description: "High energy, vibrant colors, attention-grabbing design",
      icon: Zap,
      gradient: "from-orange-400 to-red-500",
      accentColor: "rgb(249, 115, 22)",
      tags: ["Energetic", "Eye-catching", "Memorable"],
      mood: "⚡ Impossible to ignore",
      preview: {
        bg: "bg-gradient-to-br from-orange-500 to-red-600",
        text: "text-white",
        accent: "bg-yellow-400",
        font: "font-bold",
        example: "BREAKTHROUGH RESULTS",
        tagline: "Ready to dominate your market?",
      },
    },
    {
      id: "premium-luxury",
      name: "Premium & Luxury",
      description: "Sophisticated, exclusive, high-end appeal",
      icon: Crown,
      gradient: "from-purple-900 to-indigo-900",
      accentColor: "rgb(88, 28, 135)",
      tags: ["Sophisticated", "Exclusive", "Premium"],
      mood: "👑 Undeniably prestigious",
      preview: {
        bg: "bg-gradient-to-br from-gray-900 to-purple-900",
        text: "text-white",
        accent: "bg-gradient-to-r from-gold-400 to-yellow-500",
        font: "font-serif",
        example: "Exclusive Collection",
        tagline: "Crafted for the discerning few",
      },
    },
    {
      id: "warm-friendly",
      name: "Warm & Friendly",
      description: "Inviting, approachable, human-centered design",
      icon: Heart,
      gradient: "from-pink-200 to-rose-300",
      accentColor: "rgb(236, 72, 153)",
      tags: ["Welcoming", "Personal", "Trustworthy"],
      mood: "❤️ Instantly likeable",
      preview: {
        bg: "bg-gradient-to-br from-pink-50 to-rose-100",
        text: "text-gray-800",
        accent: "bg-pink-500",
        font: "font-medium",
        example: "Welcome Home",
        tagline: "Where every detail shows we care",
      },
    },
    {
      id: "corporate-professional",
      name: "Corporate & Professional",
      description: "Trustworthy, established, business-focused",
      icon: Briefcase,
      gradient: "from-blue-600 to-blue-800",
      accentColor: "rgb(29, 78, 216)",
      tags: ["Authoritative", "Reliable", "Established"],
      mood: "💼 Seriously credible",
      preview: {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
        text: "text-gray-900",
        accent: "bg-blue-600",
        font: "font-semibold",
        example: "Trusted Solutions",
        tagline: "Your success is our priority",
      },
    },
    {
      id: "organic-natural",
      name: "Organic & Natural",
      description: "Earth-inspired, sustainable, authentic feel",
      icon: Leaf,
      gradient: "from-green-400 to-emerald-600",
      accentColor: "rgb(34, 197, 94)",
      tags: ["Authentic", "Sustainable", "Calming"],
      mood: "🌿 Naturally beautiful",
      preview: {
        bg: "bg-gradient-to-br from-green-50 to-emerald-100",
        text: "text-green-900",
        accent: "bg-green-600",
        font: "font-normal",
        example: "Pure & Natural",
        tagline: "In harmony with nature",
      },
    },
    {
      id: "creative-artistic",
      name: "Creative & Artistic",
      description: "Unique, expressive, showcases creativity",
      icon: Palette,
      gradient: "from-violet-400 via-pink-500 to-orange-400",
      accentColor: "rgb(168, 85, 247)",
      tags: ["Unique", "Expressive", "Innovative"],
      mood: "🎨 Creatively inspiring",
      preview: {
        bg: "bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100",
        text: "text-gray-900",
        accent: "bg-gradient-to-r from-purple-500 to-pink-500",
        font: "font-light italic",
        example: "Creative Vision",
        tagline: "Where imagination meets reality",
      },
    },
    {
      id: "cozy-personal",
      name: "Cozy & Personal",
      description: "Intimate, handcrafted, personal touch",
      icon: Coffee,
      gradient: "from-amber-200 to-orange-300",
      accentColor: "rgb(217, 119, 6)",
      tags: ["Intimate", "Handcrafted", "Personal"],
      mood: "☕ Warmly personal",
      preview: {
        bg: "bg-gradient-to-br from-amber-50 to-orange-100",
        text: "text-amber-900",
        accent: "bg-amber-600",
        font: "font-medium",
        example: "Handcrafted with Love",
        tagline: "Made just for you",
      },
    },
  ];

  let hoveredVibe: string | null = null;

  function toggleVibe(vibeId: string) {
    if (selected.includes(vibeId)) {
      selected = selected.filter((id) => id !== vibeId);
    } else {
      // Allow up to 2 selections for combined vibes
      if (selected.length < 2) {
        selected = [...selected, vibeId];
      } else {
        // Replace the first selection
        selected = [selected[1], vibeId];
      }
    }
  }

  function handleContinue() {
    dispatch("complete", { value: selected });
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter" && selected.length > 0) {
      handleContinue();
    }
  }

  $: selectedVibes = vibes.filter((v) => selected.includes(v.id));
</script>

<svelte:window on:keydown={handleKeyPress} />

<div class="space-y-8" in:fade={{ duration: 300 }}>
  <!-- Header with icon -->
  <div class="text-center">
    <div
      class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-xl"
    >
      <Palette size={40} class="text-white" />
    </div>

    <div class="mb-8">
      <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Choose 1-2 vibes that resonate with your brand. This will guide every
        design decision we make together.
      </p>
    </div>
  </div>

  <!-- Vibe Selection Grid -->
  <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    {#each vibes as vibe}
      <button
        class="vibe-card group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-200
               {selected.includes(vibe.id)
          ? 'border-purple-500 bg-white shadow-2xl shadow-purple-100'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xl'}"
        on:click={() => toggleVibe(vibe.id)}
        on:mouseenter={() => (hoveredVibe = vibe.id)}
        on:mouseleave={() => (hoveredVibe = null)}
        in:scale={{
          duration: 300,
          delay: Math.min(vibes.indexOf(vibe) * 100, 700),
        }}
      >
        <!-- Selection indicator -->
        {#if selected.includes(vibe.id)}
          <div
            class="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
            in:scale={{ duration: 200 }}
          >
            {selected.indexOf(vibe.id) + 1}
          </div>
        {/if}

        <!-- Gradient background -->
        <div
          class="absolute inset-0 bg-gradient-to-br {vibe.gradient} opacity-10 rounded-2xl"
        />

        <!-- Content -->
        <div class="relative z-10">
          <!-- Icon and title -->
          <div class="flex items-start gap-4 mb-4">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style="background-color: {vibe.accentColor}20"
            >
              <svelte:component
                this={vibe.icon}
                size={24}
                style="color: {vibe.accentColor}"
              />
            </div>

            <div class="flex-1 text-left">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{vibe.name}</h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {vibe.description}
              </p>
            </div>
          </div>

          <!-- Mood indicator -->
          <div class="mb-4">
            <span
              class="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
            >
              {vibe.mood}
            </span>
          </div>

          <!-- Visual Preview -->
          <div class="mt-4 p-3 rounded-xl border border-gray-200 bg-white">
            <div class="mini-preview {vibe.preview.bg} p-3 rounded-lg">
              <div class="{vibe.preview.text} {vibe.preview.font} text-sm mb-1">
                {vibe.preview.example}
              </div>
              <div class="text-xs opacity-75 mb-2">
                {vibe.preview.tagline}
              </div>
              <div class="flex gap-1">
                <div class="{vibe.preview.accent} w-4 h-1 rounded" />
                <div class="{vibe.preview.accent} w-2 h-1 rounded opacity-60" />
                <div class="{vibe.preview.accent} w-3 h-1 rounded opacity-40" />
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mt-4">
            {#each vibe.tags as tag}
              <span
                class="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600"
              >
                {tag}
              </span>
            {/each}
          </div>

          <!-- Hover effect -->
          {#if hoveredVibe === vibe.id}
            <div
              class="absolute inset-0 bg-gradient-to-br {vibe.gradient} opacity-5 rounded-2xl pointer-events-none"
              in:fade={{ duration: 200 }}
            />
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected vibes preview with visual mockup -->
  {#if selected.length > 0}
    <div
      class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-4xl mx-auto border border-purple-200"
      in:fade={{ duration: 300 }}
    >
      <h4 class="text-lg font-semibold text-gray-900 mb-6 text-center">
        🎨 Here's how your site could look:
      </h4>

      <!-- Website Mockup Preview -->
      <div
        class="website-mockup bg-white rounded-xl shadow-lg overflow-hidden mb-6"
      >
        <!-- Browser bar -->
        <div class="bg-gray-100 px-4 py-2 flex items-center gap-2">
          <div class="flex gap-1">
            <div class="w-3 h-3 bg-red-400 rounded-full" />
            <div class="w-3 h-3 bg-yellow-400 rounded-full" />
            <div class="w-3 h-3 bg-green-400 rounded-full" />
          </div>
          <div class="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
            yourcompany.com
          </div>
        </div>

        <!-- Website content using selected vibe styles -->
        {#if selectedVibes.length > 0}
          {@const primaryVibe = selectedVibes[0]}
          {@const secondaryVibe = selectedVibes[1]}

          <div
            class="website-content {primaryVibe.preview.bg} {primaryVibe.preview
              .text} p-8"
          >
            <!-- Header -->
            <div class="flex justify-between items-center mb-8">
              <div class="{primaryVibe.preview.font} text-xl">Your Company</div>
              <div class="flex gap-4 text-sm">
                <span>About</span>
                <span>Services</span>
                <span>Contact</span>
              </div>
            </div>

            <!-- Hero section -->
            <div class="text-center py-12">
              <h1 class="{primaryVibe.preview.font} text-4xl mb-4">
                {primaryVibe.preview.example}
              </h1>
              <p class="text-lg mb-6 opacity-80">
                {primaryVibe.preview.tagline}
              </p>
              <div
                class="{primaryVibe.preview.accent} {primaryVibe.preview.bg ===
                'bg-white'
                  ? 'text-white'
                  : primaryVibe.preview
                      .text} px-6 py-3 rounded-lg inline-block {primaryVibe
                  .preview.font}"
              >
                Get Started
              </div>
            </div>

            <!-- Feature section with secondary vibe influence -->
            {#if secondaryVibe}
              <div class="grid grid-cols-3 gap-6 mt-12">
                {#each Array(3) as _, i}
                  <div
                    class="text-center p-4 rounded-lg {secondaryVibe.preview
                      .bg} {secondaryVibe.preview.text} bg-opacity-20"
                  >
                    <div
                      class="{secondaryVibe.preview
                        .accent} w-12 h-12 rounded-lg mx-auto mb-3 bg-opacity-80"
                    />
                    <div class="font-medium">Feature {i + 1}</div>
                    <div class="text-sm opacity-75">Description here</div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="grid grid-cols-3 gap-6 mt-12">
                {#each Array(3) as _, i}
                  <div
                    class="text-center p-4 rounded-lg bg-opacity-10 {primaryVibe
                      .preview.accent}"
                  >
                    <div
                      class="{primaryVibe.preview
                        .accent} w-12 h-12 rounded-lg mx-auto mb-3"
                    />
                    <div class="font-medium">Feature {i + 1}</div>
                    <div class="text-sm opacity-75">Description here</div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <!-- Selected vibes summary -->
      <div class="flex flex-wrap gap-3 mb-4 justify-center">
        {#each selectedVibes as vibe}
          <div
            class="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-purple-200"
          >
            <svelte:component
              this={vibe.icon}
              size={16}
              style="color: {vibe.accentColor}"
            />
            <span class="font-medium text-gray-800">{vibe.name}</span>
          </div>
        {/each}
      </div>

      <div class="text-center">
        {#if selected.length > 1}
          <p class="text-sm text-gray-600">
            This unique combination blends <strong
              >{selectedVibes[0]?.name.toLowerCase()}</strong
            >
            with
            <strong>{selectedVibes[1]?.name.toLowerCase()}</strong> for a distinctive
            personality.
          </p>
        {:else}
          <p class="text-sm text-gray-600">
            Your site will have a distinctly <strong
              >{selectedVibes[0]?.name.toLowerCase()}</strong
            > feeling throughout.
          </p>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Continue button -->
  <div class="text-center pt-6">
    <button
      disabled={selected.length === 0}
      on:click={handleContinue}
      class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl
             hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed
             transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
             focus:outline-none focus:ring-4 focus:ring-purple-200"
    >
      <Sparkles size={20} />
      Continue with {selected.length > 1 ? "these vibes" : "this vibe"}
    </button>

    {#if selected.length === 0}
      <p class="text-sm text-gray-500 mt-3">
        Choose at least one vibe to continue
      </p>
    {:else}
      <p class="text-sm text-gray-500 mt-3">
        Press <kbd
          class="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono"
          >Enter</kbd
        > to continue
      </p>
    {/if}
  </div>
</div>

<style>
  .vibe-card {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9),
      rgba(255, 255, 255, 0.95)
    );
    backdrop-filter: blur(10px);
  }

  .vibe-card:hover {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }
</style>
