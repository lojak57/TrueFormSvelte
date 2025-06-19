<script lang="ts">
  import ServiceHero from "./ServiceHero.svelte";
  import ServiceFeatures from "./ServiceFeatures.svelte";
  import ServiceGallery from "./ServiceGallery.svelte";
  import ServiceTestimonial from "./ServiceTestimonial.svelte";
  import ServiceCTA from "./ServiceCTA.svelte";
  import type { ServiceData } from "$lib/types/service.types";

  export let service: ServiceData;
</script>

<svelte:head>
  <title>{service.metaTitle} | TrueForm</title>
  <meta name="description" content={service.metaDescription} />
  <meta property="og:title" content="{service.metaTitle} | TrueForm" />
  <meta property="og:description" content={service.metaDescription} />
  <meta property="og:image" content={service.heroImage} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen">
  <ServiceHero
    title={service.title}
    subtitle={service.subtitle}
    description={service.description}
    heroImage={service.heroImage}
    badge={service.badge}
  />
  
  <ServiceFeatures
    features={service.features}
  />
  
  <ServiceGallery
    gallery={service.gallery}
  />
  
  <ServiceTestimonial
    testimonial={service.testimonial}
  />
  
  <ServiceCTA
    title={service.ctaTitle}
    description={service.ctaDescription}
  />
</div>