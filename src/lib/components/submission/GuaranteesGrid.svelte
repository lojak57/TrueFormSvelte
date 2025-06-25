<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { GUARANTEES } from "$lib/data/submissionProcess";
</script>

<div class="guarantees-section">
  <h3 in:fade={{ duration: 400, delay: 1500 }}>Our Promises to You</h3>
  <div class="guarantees-grid">
    {#each GUARANTEES as guarantee, i}
      <div
        class="guarantee-item"
        in:fly={{ y: 20, duration: 400, delay: guarantee.animationDelay }}
      >
        <div class="guarantee-icon">{guarantee.icon}</div>
        <div class="guarantee-text">
          <strong>{guarantee.title}</strong><br />
          {guarantee.description}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .guarantees-section {
    margin: 2rem 0;
    text-align: center;
  }

  .guarantees-section h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }

  .guarantees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .guarantee-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    text-align: left;
    transition: all 0.3s ease;
  }

  .guarantee-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .guarantee-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .guarantee-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.4;
  }

  .guarantee-text strong {
    color: #1f2937;
    font-weight: 600;
  }

  @media (max-width: 640px) {
    .guarantees-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .guarantee-item {
      padding: 0.75rem;
    }
  }
</style>
