<script lang="ts">
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import {
    themeMode,
    currentTheme,
    effectiveThemeMode,
    themeUtils,
  } from "$lib/stores/theme.js";

  export let title: string;
  export let subtitle: string = "";
  export let showThemeToggle: boolean = true;
  export let actions: Array<{
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    onClick: () => void;
  }> = [];

  // Reactive theme values
  $: currentThemeName = $currentTheme.name;
  $: isDark = $effectiveThemeMode === "dark";

  function toggleTheme() {
    themeUtils.toggleThemeMode();
  }

  function switchTheme(theme: "default" | "golf" | "oilfield") {
    themeUtils.setTheme(theme);
  }
</script>

<div class="dashboard-layout">
  <!-- Dashboard Header -->
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-main">
        <div class="title-section">
          <h1 class="dashboard-title">{title}</h1>
          {#if subtitle}
            <p class="dashboard-subtitle">{subtitle}</p>
          {/if}
        </div>

        <div class="header-actions">
          <!-- Custom Actions -->
          {#each actions as action}
            <BaseButton
              variant={action.variant || "primary"}
              size="sm"
              on:click={action.onClick}
            >
              {action.label}
            </BaseButton>
          {/each}

          <!-- Theme Controls -->
          {#if showThemeToggle}
            <div class="theme-controls">
              <!-- Theme Selector -->
              <div class="theme-selector">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  on:click={() => switchTheme("default")}
                >
                  Default
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  on:click={() => switchTheme("golf")}
                >
                  Golf
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  on:click={() => switchTheme("oilfield")}
                >
                  Oilfield
                </BaseButton>
              </div>

              <!-- Dark/Light Toggle -->
              <BaseButton variant="ghost" size="sm" on:click={toggleTheme}>
                {#if isDark}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                    />
                  </svg>
                {:else}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                    />
                  </svg>
                {/if}
              </BaseButton>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Dashboard Content -->
  <main class="dashboard-main">
    <div class="dashboard-content">
      <slot />
    </div>
  </main>
</div>

<style>
  .dashboard-layout {
    min-height: 100vh;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  /* Header Styles */
  .dashboard-header {
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: var(--z-header);
    backdrop-filter: blur(8px);
    background-color: var(--color-surface-alpha);
  }

  .header-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    min-height: 72px;
  }

  .title-section {
    flex: 1;
    min-width: 0;
  }

  .dashboard-title {
    font-family: var(--font-heading);
    font-size: var(--text-h1);
    font-weight: var(--font-bold);
    color: var(--color-text);
    margin: 0 0 var(--space-1) 0;
    line-height: var(--leading-tight);
  }

  .dashboard-subtitle {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    margin: 0;
    line-height: var(--leading-normal);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-shrink: 0;
  }

  .theme-controls {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-left: var(--space-3);
    border-left: 1px solid var(--color-border);
  }

  .theme-selector {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1);
    background-color: var(--color-neutral-100);
    border-radius: var(--radius-md);
  }

  .theme-selector :global(.active) {
    background-color: var(--color-primary);
    color: white;
  }

  /* Main Content Styles */
  .dashboard-main {
    flex: 1;
    padding: var(--space-6) 0;
  }

  .dashboard-content {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  /* Dark mode adjustments */
  :global(.dark) .theme-selector {
    background-color: var(--color-neutral-800);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-main {
      flex-direction: column;
      align-items: stretch;
      gap: var(--space-3);
      min-height: auto;
      padding: var(--space-4) 0;
    }

    .title-section {
      text-align: center;
    }

    .dashboard-title {
      font-size: var(--text-h2);
    }

    .header-actions {
      justify-content: center;
      flex-wrap: wrap;
    }

    .theme-controls {
      border-left: none;
      border-top: 1px solid var(--color-border);
      padding-left: 0;
      padding-top: var(--space-3);
      justify-content: center;
      width: 100%;
    }

    .theme-selector {
      flex-wrap: wrap;
      justify-content: center;
    }

    .dashboard-main {
      padding: var(--space-4) 0;
    }
  }

  @media (max-width: 480px) {
    .header-content {
      padding: 0 var(--space-3);
    }

    .dashboard-content {
      padding: 0 var(--space-3);
    }

    .dashboard-title {
      font-size: var(--text-h3);
    }

    .theme-selector {
      gap: var(--space-0-5);
    }

    .theme-selector :global(button) {
      font-size: var(--text-xs);
      padding: var(--space-1) var(--space-2);
    }
  }

  /* Animation and Transitions */
  .dashboard-header {
    transition: var(--transition-colors);
  }

  .theme-selector :global(button) {
    transition: var(--transition-all);
  }

  .theme-selector :global(button:hover) {
    transform: translateY(-1px);
  }

  /* Focus and Accessibility */
  .theme-selector :global(button:focus) {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Print Styles */
  @media print {
    .dashboard-header {
      position: static;
      border-bottom: 2px solid #000;
      background: white;
    }

    .theme-controls {
      display: none;
    }

    .header-actions {
      display: none;
    }
  }
</style>
