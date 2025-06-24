<script lang="ts">
  import { fly, fade } from "svelte/transition";
</script>

<div class="guarantees-section" in:fly={{ y: 30, duration: 500, delay: 1400 }}>
  <h3 in:fade={{ duration: 400, delay: 1500 }}>Our Promises to You</h3>
  <div class="guarantees-grid">
    <div class="guarantee-item" in:fly={{ y: 20, duration: 400, delay: 1600 }}>
      <div class="guarantee-icon">✅</div>
      <div class="guarantee-text">
        <strong>7-Day Delivery</strong><br />
        Your site launches within one week
      </div>
    </div>
    <div class="guarantee-item" in:fly={{ y: 20, duration: 400, delay: 1700 }}>
      <div class="guarantee-icon">✅</div>
      <div class="guarantee-text">
        <strong>First Year Hosting Free</strong><br />
        $180 value included in your price
      </div>
    </div>
    <div class="guarantee-item" in:fly={{ y: 20, duration: 400, delay: 1800 }}>
      <div class="guarantee-icon">✅</div>
      <div class="guarantee-text">
        <strong>24-Hour Support</strong><br />
        Real humans answer your questions
      </div>
    </div>
    <div class="guarantee-item" in:fly={{ y: 20, duration: 400, delay: 1900 }}>
      <div class="guarantee-icon">✅</div>
      <div class="guarantee-text">
        <strong>One Revision Round</strong><br />
        We polish until you're happy
      </div>
    </div>
  </div>
</div>

<style>
  .guarantees-section {
    margin-bottom: 3rem;
  }

  .guarantees-section h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    text-align: center;
  }

  .guarantees-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .guarantee-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
  }

  .guarantee-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .guarantee-text {
    font-size: 0.875rem;
    line-height: 1.4;
    color: #374151;
  }

  @media (max-width: 640px) {
    .guarantees-grid {
      grid-template-columns: 1fr;
    }

    .guarantee-item {
      text-align: left;
    }
  }
</style>
