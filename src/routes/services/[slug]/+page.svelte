<script lang="ts">
  import ServiceLayout from "$lib/components/services/ServiceLayout.svelte";
  import { page } from "$app/stores";
  import { getServiceBySlug } from "$lib/data/services";
  import { goto } from "$app/navigation";

  $: slug = $page.params.slug;
  $: service = getServiceBySlug(slug);

  // Redirect to 404 if service not found
  $: if (!service && slug) {
    goto("/404", { replaceState: true });
  }
</script>

{#if service}
  <ServiceLayout {service} />
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
      <p class="text-gray-600 mb-6">
        The service you're looking for doesn't exist.
      </p>
      <a
        href="/services"
        class="text-accent-600 hover:text-accent-700 font-medium"
      >
        ← Back to Services
      </a>
    </div>
  </div>
{/if}
