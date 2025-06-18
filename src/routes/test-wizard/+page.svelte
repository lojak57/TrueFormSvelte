<script lang="ts">
  import ConversationalWizard from "$lib/components/forms/wizard/ConversationalWizard.svelte";
  import { wizardStore } from "$lib/components/forms/wizard/stores/wizardStore";
  import Button from "$lib/components/ui/Button.svelte";
</script>

<div class="container mx-auto px-4 py-20">
  <h1 class="text-3xl font-bold mb-8">Wizard Test Page</h1>

  <Button on:click={() => wizardStore.open()}>Open Wizard</Button>

  <div class="mt-8 p-4 bg-gray-100 rounded">
    <h2 class="font-semibold mb-2">Wizard State:</h2>
    <pre>{JSON.stringify($wizardStore, null, 2)}</pre>
  </div>
</div>

<ConversationalWizard />
