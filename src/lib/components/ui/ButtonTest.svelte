<script lang="ts">
  import Button from "./Button.svelte";

  export let variant: "default" | "accent" | "outline" | "ghost" = "default";
  export let size: "sm" | "default" | "lg" = "default";
  export let disabled = false;
  export let slotContent = "Test button";
</script>

<Button {variant} {size} {disabled} on:click>
  {slotContent}
</Button>
