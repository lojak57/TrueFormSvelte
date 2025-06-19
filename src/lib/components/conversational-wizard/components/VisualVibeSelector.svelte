<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, scale } from "svelte/transition";

  export let selectedVibe = "";

  const dispatch = createEventDispatcher();

  const vibes = [
    {
      id: "professional-trustworthy",
      label: "Professional & Trustworthy",
      description: "Clean, corporate, reliable",
      colors: ["#1e40af", "#ffffff", "#f8fafc"],
      elements: {
        header: "#1e40af",
        text: "#374151",
        accent: "#3b82f6",
        bg: "#ffffff",
      },
      layout: "corporate",
      headerStyle: "traditional",
    },
    {
      id: "modern-sleek",
      label: "Modern & Sleek",
      description: "Minimal, tech-forward, sharp",
      colors: ["#000000", "#ffffff", "#6366f1"],
      elements: {
        header: "#000000",
        text: "#1f2937",
        accent: "#6366f1",
        bg: "#ffffff",
      },
      layout: "minimal",
      headerStyle: "thin",
    },
    {
      id: "warm-approachable",
      label: "Warm & Approachable",
      description: "Friendly, welcoming, organic",
      colors: ["#f59e0b", "#fef3c7", "#92400e"],
      elements: {
        header: "#92400e",
        text: "#451a03",
        accent: "#f59e0b",
        bg: "#fffbeb",
      },
      layout: "rounded",
      headerStyle: "organic",
    },
    {
      id: "bold-edgy",
      label: "Bold & Edgy",
      description: "Dynamic, confident, striking",
      colors: ["#dc2626", "#000000", "#fca5a5"],
      elements: {
        header: "#dc2626",
        text: "#ffffff",
        accent: "#ef4444",
        bg: "#1f2937",
      },
      layout: "angular",
      headerStyle: "bold",
    },
    {
      id: "clean-minimal",
      label: "Clean & Minimal",
      description: "Simple, spacious, zen",
      colors: ["#6b7280", "#ffffff", "#f3f4f6"],
      elements: {
        header: "#374151",
        text: "#6b7280",
        accent: "#9ca3af",
        bg: "#ffffff",
      },
      layout: "spacious",
      headerStyle: "light",
    },
    {
      id: "creative-artistic",
      label: "Creative & Artistic",
      description: "Expressive, unique, vibrant",
      colors: ["#7c3aed", "#ec4899", "#fbbf24"],
      elements: {
        header: "#7c3aed",
        text: "#374151",
        accent: "#ec4899",
        bg: "#faf5ff",
      },
      layout: "creative",
      headerStyle: "artistic",
    },
    {
      id: "luxury-premium",
      label: "Luxury & Premium",
      description: "Elegant, sophisticated, refined",
      colors: ["#1f2937", "#d4af37", "#ffffff"],
      elements: {
        header: "#1f2937",
        text: "#374151",
        accent: "#d4af37",
        bg: "#f9fafb",
      },
      layout: "elegant",
      headerStyle: "refined",
    },
    {
      id: "fun-playful",
      label: "Fun & Playful",
      description: "Energetic, cheerful, youthful",
      colors: ["#10b981", "#f59e0b", "#ec4899"],
      elements: {
        header: "#10b981",
        text: "#374151",
        accent: "#f59e0b",
        bg: "#f0fdf4",
      },
      layout: "bouncy",
      headerStyle: "playful",
    },
  ];

  function selectVibe(vibe) {
    selectedVibe = vibe.id;
    dispatch("select", {
      value: vibe.label,
      vibeData: vibe,
    });
  }
</script>

<div class="vibe-selector">
  <div class="vibe-grid">
    {#each vibes as vibe, i}
      <button
        class="vibe-card"
        class:selected={selectedVibe === vibe.id}
        on:click={() => selectVibe(vibe)}
        in:fade={{ duration: 300, delay: i * 100 }}
      >
        <!-- Mini Website Preview -->
        <div
          class="mini-website layout-{vibe.layout}"
          style="background-color: {vibe.elements.bg}"
        >
          <!-- Header -->
          <div
            class="mini-header header-{vibe.headerStyle}"
            style="background-color: {vibe.elements.header}"
          >
            <div class="mini-logo" />
            <div class="mini-nav">
              <span />
              <span />
              <span />
            </div>
          </div>

          <!-- Hero Section -->
          <div class="mini-hero">
            <div class="mini-title" style="color: {vibe.elements.header}" />
            <div class="mini-subtitle" style="color: {vibe.elements.text}" />
            <div
              class="mini-button layout-{vibe.layout}"
              style="background-color: {vibe.elements.accent}"
            />
          </div>

          <!-- Content Section -->
          <div class="mini-content">
            {#if vibe.layout === "minimal" || vibe.layout === "spacious"}
              <!-- Minimal layout: single centered card -->
              <div
                class="mini-card minimal-card"
                style="border: 1px solid {vibe.elements.accent}"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}"
                />
                <div
                  class="mini-text wide"
                  style="background-color: {vibe.elements.text}"
                />
              </div>
            {:else if vibe.layout === "creative" || vibe.layout === "artistic"}
              <!-- Creative layout: asymmetric cards -->
              <div
                class="mini-card creative-card"
                style="border-radius: 8px; border: 2px solid {vibe.elements
                  .accent}"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .text}; border-radius: 2px;"
                />
              </div>
              <div
                class="mini-card creative-card small"
                style="border-radius: 12px; background: {vibe.elements.accent}"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .bg}; border-radius: 2px;"
                />
              </div>
            {:else if vibe.layout === "angular"}
              <!-- Angular layout: sharp, bold cards -->
              <div
                class="mini-card angular-card"
                style="background: {vibe.elements
                  .accent}; clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.bg}"
                />
              </div>
              <div
                class="mini-card angular-card"
                style="background: {vibe.elements
                  .header}; clip-path: polygon(10% 0, 100% 0, 100% 100%, 0 100%);"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.bg}"
                />
              </div>
            {:else if vibe.layout === "rounded"}
              <!-- Rounded layout: organic shapes -->
              <div
                class="mini-card rounded-card"
                style="border-radius: 16px; background: {vibe.elements
                  .accent}; opacity: 0.8;"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .bg}; border-radius: 8px;"
                />
              </div>
              <div
                class="mini-card rounded-card"
                style="border-radius: 20px; border: 2px solid {vibe.elements
                  .accent};"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .text}; border-radius: 6px;"
                />
              </div>
            {:else if vibe.layout === "elegant"}
              <!-- Elegant layout: sophisticated spacing -->
              <div
                class="mini-card elegant-card"
                style="border-bottom: 2px solid {vibe.elements.accent};"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}; height: 2px;"
                />
                <div
                  class="mini-text elegant-text"
                  style="background-color: {vibe.elements.text}; width: 80%;"
                />
              </div>
              <div
                class="mini-card elegant-card"
                style="border-bottom: 1px solid {vibe.elements
                  .accent}; opacity: 0.7;"
              >
                <div
                  class="mini-text elegant-text"
                  style="background-color: {vibe.elements.text}; width: 90%;"
                />
              </div>
            {:else if vibe.layout === "bouncy"}
              <!-- Bouncy layout: playful elements -->
              <div
                class="mini-card bouncy-card"
                style="border-radius: 50% 20% 50% 20%; background: {vibe
                  .elements.accent}; transform: rotate(-2deg);"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .bg}; border-radius: 4px;"
                />
              </div>
              <div
                class="mini-card bouncy-card"
                style="border-radius: 20% 50% 20% 50%; border: 2px solid {vibe
                  .elements.accent}; transform: rotate(2deg);"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements
                    .text}; border-radius: 4px;"
                />
              </div>
            {:else}
              <!-- Corporate layout: traditional cards -->
              <div
                class="mini-card corporate-card"
                style="border-left: 3px solid {vibe.elements.accent}"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}"
                />
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}"
                />
              </div>
              <div
                class="mini-card corporate-card"
                style="border-left: 3px solid {vibe.elements.accent}"
              >
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}"
                />
                <div
                  class="mini-text"
                  style="background-color: {vibe.elements.text}"
                />
              </div>
            {/if}
          </div>
        </div>

        <!-- Color Palette -->
        <div class="color-palette">
          {#each vibe.colors as color}
            <div class="color-dot" style="background-color: {color}" />
          {/each}
        </div>

        <!-- Labels -->
        <div class="vibe-info">
          <h4>{vibe.label}</h4>
          <p>{vibe.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .vibe-selector {
    width: 100%;
  }

  .vibe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .vibe-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    width: 100%;
  }

  .vibe-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
  }

  .vibe-card.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  .mini-website {
    width: 100%;
    height: 160px;
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    position: relative;
  }

  /* Layout variations */
  .layout-minimal {
    border-radius: 0;
    border: 1px solid #e5e7eb;
  }
  .layout-rounded {
    border-radius: 1rem;
  }
  .layout-angular {
    border-radius: 0;
    clip-path: polygon(0 0, 95% 0, 100% 10px, 100% 100%, 0 100%);
  }
  .layout-creative {
    border-radius: 0.5rem 1.5rem 0.5rem 1.5rem;
    transform: rotate(0.5deg);
  }
  .layout-elegant {
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .layout-bouncy {
    border-radius: 1rem;
    transform: rotate(-0.5deg);
  }
  .layout-spacious {
    border-radius: 0.25rem;
  }
  .layout-corporate {
    border-radius: 0.5rem;
  }

  .mini-header {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
  }

  /* Header style variations */
  .header-traditional {
    height: 28px;
  }
  .header-thin {
    height: 20px;
  }
  .header-organic {
    height: 26px;
    border-radius: 0 0 8px 8px;
  }
  .header-bold {
    height: 32px;
    position: relative;
  }
  .header-light {
    height: 22px;
    opacity: 0.9;
  }
  .header-artistic {
    height: 30px;
    clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
  }
  .header-refined {
    height: 26px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  .header-playful {
    height: 24px;
    border-radius: 0 0 12px 12px;
  }

  .mini-logo {
    width: 40px;
    height: 8px;
    background: white;
    opacity: 0.9;
    border-radius: 2px;
  }

  .mini-nav {
    display: flex;
    gap: 4px;
  }

  .mini-nav span {
    width: 20px;
    height: 4px;
    background: white;
    opacity: 0.7;
    border-radius: 1px;
  }

  .mini-hero {
    padding: 16px 8px;
    height: 80px;
  }

  .mini-title {
    width: 70%;
    height: 12px;
    border-radius: 2px;
    margin-bottom: 6px;
    opacity: 0.9;
  }

  .mini-subtitle {
    width: 50%;
    height: 6px;
    border-radius: 1px;
    margin-bottom: 12px;
    opacity: 0.6;
  }

  .mini-button {
    width: 40px;
    height: 16px;
    border-radius: 4px;
  }

  /* Button layout variations */
  .mini-button.layout-minimal {
    border-radius: 0;
    width: 35px;
    height: 14px;
  }
  .mini-button.layout-rounded {
    border-radius: 12px;
    width: 45px;
  }
  .mini-button.layout-angular {
    border-radius: 0;
    clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
    width: 38px;
  }
  .mini-button.layout-creative {
    border-radius: 8px 4px 8px 4px;
    transform: rotate(-1deg);
  }
  .mini-button.layout-elegant {
    border-radius: 2px;
    width: 42px;
    height: 14px;
  }
  .mini-button.layout-bouncy {
    border-radius: 20px;
    width: 38px;
    height: 18px;
  }
  .mini-button.layout-spacious {
    border-radius: 3px;
    width: 36px;
    height: 15px;
  }
  .mini-button.layout-corporate {
    border-radius: 4px;
  }

  .mini-content {
    display: flex;
    gap: 4px;
    padding: 0 8px;
    height: 56px;
  }

  .mini-card {
    flex: 1;
    padding: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }

  .mini-text {
    height: 3px;
    border-radius: 1px;
    margin-bottom: 4px;
    opacity: 0.3;
  }

  .mini-text:last-child {
    width: 60%;
  }

  .mini-text.wide {
    width: 80%;
  }

  /* Card variations */
  .minimal-card {
    flex: 1;
    padding: 8px 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0;
    text-align: center;
  }

  .creative-card {
    flex: 1;
    padding: 4px;
    margin: 2px;
  }

  .creative-card.small {
    flex: 0.6;
    height: 70%;
  }

  .angular-card {
    flex: 1;
    padding: 4px;
    margin: 1px;
    position: relative;
  }

  .rounded-card {
    flex: 1;
    padding: 6px;
    margin: 2px;
  }

  .elegant-card {
    flex: 1;
    padding: 6px 8px;
    background: rgba(255, 255, 255, 0.3);
  }

  .elegant-text {
    height: 2px;
    margin-bottom: 3px;
  }

  .bouncy-card {
    flex: 1;
    padding: 4px;
    margin: 2px;
    position: relative;
  }

  .corporate-card {
    flex: 1;
    padding: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }

  .color-palette {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    justify-content: center;
  }

  .color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .vibe-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .vibe-info p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .vibe-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .mini-website {
      height: 140px;
    }

    .mini-hero {
      padding: 12px 6px;
      height: 70px;
    }

    .mini-content {
      height: 46px;
      padding: 0 6px;
    }
  }
</style>
