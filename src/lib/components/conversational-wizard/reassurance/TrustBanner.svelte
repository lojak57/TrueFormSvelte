<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Sparkles } from 'lucide-svelte';
</script>

<div 
  class="trust-banner"
  in:fade={{ duration: 300, delay: 500 }}
>
  <Sparkles size={14} class="icon" />
  <span>You're not locked in. Everything here is editable later.</span>
</div>

<style>
  .trust-banner {
    position: sticky;
    top: 0;
    background: rgba(59, 130, 246, 0.05);
    border-bottom: 1px solid rgba(59, 130, 246, 0.1);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgb(59, 130, 246);
    backdrop-filter: blur(8px);
    z-index: 10;
  }

  .icon {
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .trust-banner {
      font-size: 0.813rem;
      padding: 0.625rem 0.875rem;
    }
  }
</style>