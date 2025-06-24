<script lang="ts">
  import { fly, fade } from "svelte/transition";

  export let basePrice: number = 999;
</script>

<div class="base-package" in:fly={{ y: 30, duration: 500, delay: 400 }}>
  <div class="base-header" in:fade={{ duration: 400, delay: 500 }}>
    <h3>BASE PACKAGE — ${basePrice}</h3>
    <p>Everything you need to launch strong.</p>
  </div>

  <div class="base-features" in:fade={{ duration: 500, delay: 600 }}>
    <div class="feature-grid">
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 700 }}>
        ✅ Design Discovery Wizard
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 750 }}>
        ✅ Custom Homepage
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 800 }}>
        ✅ 2–3 Supporting Pages
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 850 }}>
        ✅ Mobile Responsive
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 900 }}>
        ✅ Visual CMS
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 950 }}>
        ✅ One-on-One Revision
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 1000 }}>
        ✅ Hosting + SSL (1 year)
      </div>
      <div class="feature-item" in:fly={{ x: -20, duration: 300, delay: 1050 }}>
        ✅ Designer Support (24hr)
      </div>
    </div>
  </div>
</div>

<style>
  .base-package {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 3rem;
  }

  .base-header h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .base-header p {
    opacity: 0.9;
    margin-bottom: 1.5rem;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .feature-item {
    font-size: 0.875rem;
    opacity: 0.95;
  }

  @media (max-width: 640px) {
    .base-package {
      padding: 1.5rem;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
