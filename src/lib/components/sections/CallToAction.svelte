<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { ArrowRight } from "lucide-svelte";
  import { CTA_CONTENT } from "$lib/data/content";
</script>

<!-- CTA Section -->
<section
  class="py-20 bg-gradient-to-r from-accent-600 to-yellow-600 text-white"
>
  <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl md:text-4xl font-bold mb-6">
      {CTA_CONTENT.title}
    </h2>
    <p class="text-xl mb-10 text-white/90">
      {CTA_CONTENT.description}
    </p>
    <Button
      variant="default"
      size="lg"
      class="bg-white text-accent-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:scale-105"
      on:click={() =>
        (window.location.href = `${CTA_CONTENT.button.href}?start=true`)}
    >
      <div class="flex items-center gap-3">
        <svelte:component this={CTA_CONTENT.button.icon} size={24} />
        {CTA_CONTENT.button.text}
        <ArrowRight size={20} />
      </div>
    </Button>
  </div>
</section>
