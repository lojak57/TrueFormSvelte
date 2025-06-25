<script lang="ts">
  import ContactHeroCard from "$lib/components/contacts/ContactHeroCard.svelte";
  import ContactCompactCard from "$lib/components/contacts/ContactCompactCard.svelte";
  import ContactMiniCard from "$lib/components/contacts/ContactMiniCard.svelte";
  import type { Contact } from "$lib/types.js";

  export let contact: Contact;
  export let variant: "hero" | "compact" | "mini" = "compact";
  export let showActions: boolean = true;
  export let loading: boolean = false;
</script>

{#if variant === "hero"}
  <ContactHeroCard {contact} {showActions} {loading} />
{:else if variant === "compact"}
  <ContactCompactCard {contact} {showActions} {loading} />
{:else}
  <ContactMiniCard {contact} {loading} />
{/if}
