<script lang="ts">
  import { page } from "$app/stores";
  import { ChevronRight, Home } from "lucide-svelte";

  export let title: string;
  export let subtitle: string = "";
  export let icon: any = null;
  export let breadcrumbs: Array<{ label: string; href?: string }> = [];

  // Auto-generate breadcrumbs based on current path if not provided
  $: if (breadcrumbs.length === 0 && $page.url.pathname) {
    const pathSegments = $page.url.pathname.split("/").filter(Boolean);
    breadcrumbs = [
      { label: "Command Center", href: "/admin/dashboard" },
      ...pathSegments.slice(1).map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href:
          index === pathSegments.length - 2
            ? undefined
            : `/${pathSegments.slice(0, index + 2).join("/")}`,
      })),
    ];
  }
</script>

<div class="crm-header">
  <div class="header-background" />

  <div class="header-content">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumb-nav">
      <div class="breadcrumb-trail">
        {#each breadcrumbs as crumb, index}
          {#if index > 0}
            <ChevronRight size={14} class="breadcrumb-separator" />
          {/if}
          {#if crumb.href}
            <a href={crumb.href} class="breadcrumb-link">
              {#if index === 0}
                <Home size={14} class="breadcrumb-home" />
              {/if}
              {crumb.label}
            </a>
          {:else}
            <span class="breadcrumb-current">
              {crumb.label}
            </span>
          {/if}
        {/each}
      </div>
    </nav>

    <!-- Page Header -->
    <div class="page-header">
      <div class="header-main">
        <div class="title-section">
          {#if icon}
            <div class="title-icon">
              <svelte:component this={icon} size={32} class="icon-component" />
            </div>
          {/if}
          <div class="title-content">
            <h1 class="page-title">{title}</h1>
            {#if subtitle}
              <p class="page-subtitle">{subtitle}</p>
            {/if}
          </div>
        </div>

        <!-- Action Slot -->
        <div class="header-actions">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .crm-header {
    position: relative;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    overflow: hidden;
  }

  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(248, 250, 252, 0.9) 50%,
      rgba(241, 245, 249, 0.8) 100%
    );
    backdrop-filter: blur(8px);
  }

  .header-content {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .breadcrumb-nav {
    margin-bottom: 16px;
  }

  .breadcrumb-trail {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    padding: 4px 8px;
    border-radius: 6px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .breadcrumb-link:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
  }

  .breadcrumb-separator {
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }

  .breadcrumb-home {
    flex-shrink: 0;
  }

  .breadcrumb-current {
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .page-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .title-icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }

  :global(.title-icon .icon-component) {
    color: #475569;
  }

  .title-content {
    flex: 1;
    min-width: 0;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px 0;
    line-height: 1.2;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.5;
    font-weight: 400;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-content {
      padding: 16px;
    }

    .header-main {
      flex-direction: column;
      align-items: stretch;
      gap: 16px;
    }

    .title-section {
      gap: 12px;
    }

    .title-icon {
      width: 48px;
      height: 48px;
    }

    .page-title {
      font-size: 24px;
    }

    .page-subtitle {
      font-size: 14px;
    }

    .breadcrumb-trail {
      gap: 6px;
    }

    .breadcrumb-link {
      font-size: 13px;
      padding: 3px 6px;
    }

    .header-actions {
      justify-content: stretch;
    }
  }

  @media (max-width: 480px) {
    .title-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .title-icon {
      width: 40px;
      height: 40px;
    }

    .page-title {
      font-size: 22px;
    }
  }

  /* Dark mode support */
  :global(.dark) .crm-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-bottom-color: rgba(55, 65, 81, 0.5);
  }

  :global(.dark) .header-background {
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.9) 0%,
      rgba(30, 41, 59, 0.8) 50%,
      rgba(51, 65, 85, 0.9) 100%
    );
  }

  :global(.dark) .page-title {
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  :global(.dark) .title-icon {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(55, 65, 81, 0.5);
  }

  :global(.dark .title-icon .icon-component) {
    color: #94a3b8;
  }
</style>
