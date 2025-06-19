<script lang="ts">
  import type { VibeOption } from "$lib/data/designVibes";

  export let vibe: VibeOption;
  export let isSelected = false;

  // Generate preview content based on layout style
  function getLayoutClass(layout: string): string {
    const layoutClasses: Record<string, string> = {
      corporate: "grid-cols-12 gap-2",
      minimal: "grid-cols-6 gap-4",
      rounded: "grid-cols-8 gap-3",
      angular: "grid-cols-10 gap-1",
      spacious: "grid-cols-4 gap-6",
      creative: "grid-cols-5 gap-2",
      elegant: "grid-cols-8 gap-3",
      organic: "grid-cols-6 gap-4",
    };
    return layoutClasses[layout] || "grid-cols-8 gap-2";
  }

  function getHeaderHeight(style: string): string {
    const heights: Record<string, string> = {
      traditional: "h-10",
      thin: "h-6",
      organic: "h-12",
      bold: "h-14",
      light: "h-8",
      artistic: "h-16",
      premium: "h-10",
      natural: "h-11",
    };
    return heights[style] || "h-10";
  }
</script>

<div class="preview-window rounded-lg shadow-sm overflow-hidden">
  <!-- Header -->
  <div
    class="preview-header {getHeaderHeight(vibe.headerStyle)}"
    style="background-color: {vibe.elements.header}"
  >
    <div class="flex items-center h-full px-3 gap-2">
      <div class="w-2 h-2 rounded-full bg-white/30" />
      <div class="w-16 h-4 rounded bg-white/20" />
      <div class="ml-auto flex gap-1">
        {#each Array(3) as _}
          <div class="w-12 h-3 rounded bg-white/10" />
        {/each}
      </div>
    </div>
  </div>

  <!-- Body -->
  <div class="p-4" style="background-color: {vibe.elements.bg}">
    <!-- Hero Section -->
    <div class="mb-4">
      <div
        class="h-20 rounded-lg flex items-center justify-center"
        style="background: linear-gradient(135deg, {vibe.elements.accent}20, {vibe.elements.accent}10)"
      >
        <div
          class="w-32 h-4 rounded"
          style="background-color: {vibe.elements.accent}"
        />
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid {getLayoutClass(vibe.layout)} mb-4">
      {#each Array(3) as _}
        <div
          class="col-span-4 p-3 rounded border"
          style="border-color: {vibe.elements.accent}30"
        >
          <div
            class="w-12 h-2 mb-2 rounded"
            style="background-color: {vibe.elements.text}"
          />
          <div
            class="w-full h-1 mb-1 rounded opacity-40"
            style="background-color: {vibe.elements.text}"
          />
          <div
            class="w-3/4 h-1 rounded opacity-40"
            style="background-color: {vibe.elements.text}"
          />
        </div>
      {/each}
    </div>

    <!-- CTA Button -->
    <div
      class="h-8 rounded flex items-center justify-center"
      style="background-color: {vibe.elements.accent}"
    >
      <div class="w-20 h-3 rounded bg-white/80" />
    </div>
  </div>
</div>

<style>
  .preview-window {
    width: 100%;
    aspect-ratio: 16 / 10;
    background: white;
    border: 1px solid #e5e7eb;
  }
</style>