<script lang="ts">
  import { CompanyCard } from "$lib/components/business/index.js";
  import type { Company } from "$lib/types";

  export let companies: Company[];
</script>

<section class="demo-section">
  <h2 class="section-title">Company Cards</h2>
  <p class="section-description">
    Company cards with vertical-specific styling and multiple display variants.
  </p>

  <!-- Hero Variant -->
  <div class="demo-subsection">
    <h3 class="subsection-title">Hero Variant</h3>
    <div class="hero-demo">
      <CompanyCard company={companies[0]} variant="hero" />
    </div>
  </div>

  <!-- Compact Grid -->
  <div class="demo-subsection">
    <h3 class="subsection-title">Compact Grid</h3>
    <div class="compact-grid">
      {#each companies as company}
        <CompanyCard {company} variant="compact" />
      {/each}
    </div>
  </div>

  <!-- Mini List -->
  <div class="demo-subsection">
    <h3 class="subsection-title">Mini List</h3>
    <div class="mini-list">
      {#each companies as company}
        <CompanyCard {company} variant="mini" />
      {/each}
    </div>
  </div>
</section>

<style>
  .demo-section {
    margin-bottom: var(--space-12);
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    font-weight: var(--font-bold);
    color: var(--color-text);
    margin: 0 0 var(--space-3) 0;
  }

  .section-description {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-6) 0;
    line-height: var(--leading-relaxed);
  }

  .demo-subsection {
    margin-bottom: var(--space-8);
  }

  .subsection-title {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-4) 0;
  }

  .hero-demo {
    max-width: 600px;
  }

  .compact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .mini-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 400px;
  }
</style>
