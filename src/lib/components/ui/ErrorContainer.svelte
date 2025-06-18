<script lang="ts">
  import { errorMessages, removeError } from "$lib/services/errorService";
  import ErrorToast from "./ErrorToast.svelte";

  function handleDismiss(event: CustomEvent<string>) {
    removeError(event.detail);
  }
</script>

{#if $errorMessages.length > 0}
  <div class="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
    {#each $errorMessages as message (message.id)}
      <ErrorToast {message} on:dismiss={handleDismiss} />
    {/each}
  </div>
{/if}
