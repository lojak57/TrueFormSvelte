<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let selectedPalette = "";

  const dispatch = createEventDispatcher();

  const colorPalettes = [
    {
      id: "blues-whites",
      label: "Blues & Whites",
      description: "Professional, trustworthy, calming",
      style: "classic",
      colors: ["#1e40af", "#3b82f6", "#dbeafe", "#ffffff"],
      gradient:
        "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #dbeafe 100%)",
    },
    {
      id: "warm-earth",
      label: "Warm Earth Tones",
      description: "Natural, grounded, organic",
      style: "muted",
      colors: ["#92400e", "#f59e0b", "#fef3c7", "#fffbeb"],
      gradient:
        "linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fef3c7 100%)",
    },
    {
      id: "black-white",
      label: "Black & White Classic",
      description: "Timeless, elegant, bold",
      style: "minimal",
      colors: ["#000000", "#374151", "#9ca3af", "#ffffff"],
      gradient:
        "linear-gradient(135deg, #000000 0%, #374151 50%, #9ca3af 100%)",
    },
    {
      id: "forest-green",
      label: "Forest Greens",
      description: "Growth, stability, eco-friendly",
      style: "natural",
      colors: ["#064e3b", "#10b981", "#a7f3d0", "#ecfdf5"],
      gradient:
        "linear-gradient(135deg, #064e3b 0%, #10b981 50%, #a7f3d0 100%)",
    },
    {
      id: "purple-luxury",
      label: "Purple Luxury",
      description: "Premium, creative, sophisticated",
      style: "vibrant",
      colors: ["#581c87", "#7c3aed", "#c4b5fd", "#faf5ff"],
      gradient:
        "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #c4b5fd 100%)",
    },
    {
      id: "sunset-orange",
      label: "Sunset Orange",
      description: "Energetic, friendly, optimistic",
      style: "vibrant",
      colors: ["#c2410c", "#f97316", "#fed7aa", "#fff7ed"],
      gradient:
        "linear-gradient(135deg, #c2410c 0%, #f97316 50%, #fed7aa 100%)",
    },
    {
      id: "ocean-teal",
      label: "Ocean Teal",
      description: "Modern, fresh, innovative",
      style: "cool",
      colors: ["#0f766e", "#14b8a6", "#99f6e4", "#f0fdfa"],
      gradient:
        "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #99f6e4 100%)",
    },
    {
      id: "burgundy-gold",
      label: "Burgundy & Gold",
      description: "Luxury, tradition, prestige",
      style: "rich",
      colors: ["#7f1d1d", "#dc2626", "#fbbf24", "#fffbeb"],
      gradient:
        "linear-gradient(135deg, #7f1d1d 0%, #dc2626 40%, #fbbf24 100%)",
    },
    {
      id: "soft-pastels",
      label: "Soft Pastels",
      description: "Gentle, calming, approachable",
      style: "muted",
      colors: ["#a78bfa", "#fb7185", "#fbbf24", "#f3f4f6"],
      gradient:
        "linear-gradient(135deg, #a78bfa 0%, #fb7185 50%, #fbbf24 100%)",
    },
    {
      id: "brand-colors",
      label: "Our Brand Colors Are Set",
      description: "I already have specific colors",
      style: "custom",
      colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"],
      gradient:
        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 30%, #ec4899 70%, #f59e0b 100%)",
      special: true,
    },
    {
      id: "open-suggestions",
      label: "I'm Open to Suggestions",
      description: "Let our designers choose",
      style: "flexible",
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      gradient:
        "linear-gradient(135deg, #3b82f6 0%, #10b981 30%, #f59e0b 70%, #ef4444 100%)",
      special: true,
    },
  ];

  const styleLabels = {
    classic: "Classic",
    muted: "Muted",
    minimal: "Minimal",
    natural: "Natural",
    vibrant: "Vibrant",
    cool: "Cool",
    rich: "Rich",
    custom: "Custom",
    flexible: "Flexible",
  };

  function selectPalette(palette) {
    selectedPalette = palette.id;
    dispatch("select", {
      value: palette.label,
      paletteData: palette,
    });
  }
</script>

<div class="color-selector">
  <div class="color-grid">
    {#each colorPalettes as palette, i}
      <button
        class="color-card"
        class:selected={selectedPalette === palette.id}
        class:special={palette.special}
        on:click={() => selectPalette(palette)}
        in:fade={{ duration: 300, delay: i * 60 }}
      >
        <div class="color-preview">
          <!-- Gradient Background -->
          <div
            class="gradient-background"
            style="background: {palette.gradient}"
          />

          <!-- Color Dots -->
          <div class="color-dots">
            {#each palette.colors as color}
              <div class="color-dot" style="background-color: {color}" />
            {/each}
          </div>

          <!-- Style Badge -->
          <div class="style-badge style-{palette.style}">
            {styleLabels[palette.style]}
          </div>
        </div>

        <div class="color-info">
          <h4>{palette.label}</h4>
          <p>{palette.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .color-selector {
    width: 100%;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .color-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    width: 100%;
    overflow: hidden;
  }

  .color-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }

  .color-card.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  .color-card.special {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px dashed #94a3b8;
  }

  .color-card.special:hover {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  }

  .color-card.special.selected {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  }

  .color-preview {
    position: relative;
    height: 100px;
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem;
  }

  .gradient-background {
    position: absolute;
    inset: 0;
    opacity: 0.9;
  }

  .color-dots {
    display: flex;
    gap: 0.5rem;
    z-index: 2;
  }

  .color-dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .style-badge {
    z-index: 2;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    align-self: flex-end;
  }

  .style-classic {
    background: rgba(255, 255, 255, 0.9);
    color: #1e40af;
  }
  .style-muted {
    background: rgba(255, 255, 255, 0.9);
    color: #92400e;
  }
  .style-minimal {
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
  }
  .style-natural {
    background: rgba(255, 255, 255, 0.9);
    color: #064e3b;
  }
  .style-vibrant {
    background: rgba(255, 255, 255, 0.9);
    color: #581c87;
  }
  .style-cool {
    background: rgba(255, 255, 255, 0.9);
    color: #0f766e;
  }
  .style-rich {
    background: rgba(255, 255, 255, 0.9);
    color: #7f1d1d;
  }
  .style-custom {
    background: rgba(255, 255, 255, 0.9);
    color: #6366f1;
  }
  .style-flexible {
    background: rgba(255, 255, 255, 0.9);
    color: #374151;
  }

  .color-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .color-info p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .color-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .color-preview {
      height: 80px;
      padding: 0.5rem;
    }

    .color-dots {
      gap: 0.375rem;
    }

    .color-dot {
      width: 16px;
      height: 16px;
    }
  }
</style>
