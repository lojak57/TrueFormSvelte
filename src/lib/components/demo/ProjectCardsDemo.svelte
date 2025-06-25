<script lang="ts">
  import { ProjectCard } from "$lib/components/business/index.js";
  import type { Project } from "$lib/types";

  export let projects: Project[];
</script>

<section class="demo-section">
  <h2 class="section-title">Project Cards</h2>
  <p class="section-description">
    Project cards with status tracking and budget management.
  </p>

  <!-- Compact Grid -->
  <div class="demo-subsection">
    <h3 class="subsection-title">Project Grid</h3>
    <div class="project-grid">
      {#each projects as project}
        <ProjectCard {project} />
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

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--space-6);
  }
</style>
