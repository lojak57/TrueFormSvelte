<script lang="ts">
  import { fade } from "svelte/transition";

  export let text: string =
    "Not sure? Just pick what feels close. You'll get a chance to revise with your designer.";
  export let delay: number = 800;
</script>

<p class="inline-reassurance" in:fade={{ duration: 400, delay }}>
  {text}
</p>

<style>
  .inline-reassurance {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
    margin-top: 0.5rem;
    margin-bottom: 0;
    line-height: 1.5;
  }

  @media (max-width: 640px) {
    .inline-reassurance {
      font-size: 0.813rem;
    }
  }
</style>
