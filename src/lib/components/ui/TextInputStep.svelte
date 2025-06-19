<script lang="ts">
  export let label: string = '';
  export let placeholder: string = '';
  export let value: string = '';
  export let required: boolean = false;
  export let type: string = 'text';
  export let rows: number = 3;
  export let maxLength: number | undefined = undefined;
  
  // Multi-line support
  export let multiline: boolean = false;
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    value = target.value;
  }
</script>

<div class="text-input-step">
  {#if label}
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}
  
  {#if multiline}
    <textarea
      bind:value
      {placeholder}
      {required}
      {rows}
      {maxLength}
      on:input={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    ></textarea>
  {:else if type === 'email'}
    <input
      type="email"
      bind:value
      {placeholder}
      {required}
      {maxLength}
      on:input={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  {:else if type === 'tel'}
    <input
      type="tel"
      bind:value
      {placeholder}
      {required}
      {maxLength}
      on:input={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  {:else}
    <input
      type="text"
      bind:value
      {placeholder}
      {required}
      {maxLength}
      on:input={handleInput}
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  {/if}
</div>

<style>
  .text-input-step {
    margin-bottom: 1rem;
  }
</style>