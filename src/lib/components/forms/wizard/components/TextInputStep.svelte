<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { ArrowRight, Sparkles } from 'lucide-svelte';
  
  export let value: string = '';
  export let placeholder: string = '';
  export let starterPrompts: string[] = [];
  export let multiline: boolean = false;
  export let skipLabel: string = '';
  export let autoFocus: boolean = true;
  export let autocomplete: string = '';
  export let inputType: string = 'text';
  export let name: string = '';
  
  const dispatch = createEventDispatcher();
  
  let showPrompts = true;
  let isTyping = false;
  let inputElement: HTMLInputElement | HTMLTextAreaElement;
  
  // Show prompts if we have them, user hasn't typed, and no value
  $: shouldShowPrompts = starterPrompts.length > 0 && showPrompts && !value.trim() && !isTyping;
  
  function handlePromptClick(prompt: string) {
    value = prompt;
    showPrompts = false;
    isTyping = false;
    // Focus on the input so user can edit if needed
    inputElement?.focus();
    // Move cursor to end
    if (inputElement) {
      inputElement.setSelectionRange(value.length, value.length);
    }
  }
  
  function handleInput() {
    if (!isTyping && value.length > 0) {
      isTyping = true;
      // Smooth fade out prompts after a short delay
      setTimeout(() => {
        showPrompts = false;
      }, 300);
    }
    
    // If user clears the input, show prompts again
    if (value.trim() === '') {
      isTyping = false;
      showPrompts = true;
    }
  }
  
  function handleSubmit() {
    if (value.trim() || skipLabel) {
      dispatch('complete', { value: value.trim() });
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }
  
  // Auto-focus on mount
  $: if (inputElement && autoFocus) {
    inputElement.focus();
  }
</script>

<div class="space-y-6">
  <!-- Input Field -->
  <div class="relative">
    {#if multiline}
      <textarea
        bind:this={inputElement}
        bind:value
        {placeholder}
        {autocomplete}
        {name}
        on:keydown={handleKeydown}
        on:input={handleInput}
        rows="4"
        class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all resize-none"
      />
    {:else if inputType === 'email'}
      <input
        bind:this={inputElement}
        bind:value
        {placeholder}
        {autocomplete}
        {name}
        on:keydown={handleKeydown}
        on:input={handleInput}
        type="email"
        class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all"
      />
    {:else if inputType === 'tel'}
      <input
        bind:this={inputElement}
        bind:value
        {placeholder}
        {autocomplete}
        {name}
        on:keydown={handleKeydown}
        on:input={handleInput}
        type="tel"
        class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all"
      />
    {:else}
      <input
        bind:this={inputElement}
        bind:value
        {placeholder}
        {autocomplete}
        {name}
        on:keydown={handleKeydown}
        on:input={handleInput}
        type="text"
        class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all"
      />
    {/if}
  </div>

  <!-- Starter Prompts Container with minimum height to prevent layout shift -->
  <div class="{starterPrompts.length > 0 ? 'min-h-[120px]' : 'min-h-[60px]'} transition-all duration-300">
    {#if shouldShowPrompts}
      <div 
        in:fade={{ duration: 300 }} 
        out:fade={{ duration: 400 }}
        class="transition-all duration-300"
      >
        <div class="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Sparkles size={16} />
          <span>Or choose a starter:</span>
        </div>
        <div class="space-y-2">
          {#each starterPrompts as prompt, i}
            <div
              in:fade={{ duration: 200, delay: i * 100 }}
              out:fade={{ duration: 150 }}
            >
              <button
                on:click={() => handlePromptClick(prompt)}
                class="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-gray-700 hover:text-gray-900 hover:shadow-sm transform hover:scale-[1.01]"
              >
                {prompt}
              </button>
            </div>
          {/each}
        </div>
      </div>
    {:else if isTyping && value.length > 0}
      <!-- Show a subtle hint that prompts are available -->
      <div 
        in:fade={{ duration: 300, delay: 200 }} 
        class="text-center py-8"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <Sparkles size={14} class="text-gray-400" />
          <button
            on:click={() => {
              value = '';
              isTyping = false;
              showPrompts = true;
              inputElement?.focus();
            }}
            class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear and see starter options
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Action Buttons -->
  <div class="flex items-center justify-between">
    {#if skipLabel}
      <button
        on:click={() => dispatch('complete', { value: '', skipped: true })}
        class="text-gray-500 hover:text-gray-700 transition-colors"
      >
        {skipLabel}
      </button>
    {:else}
      <div />
    {/if}

    <button
      on:click={handleSubmit}
      disabled={!value.trim() && !skipLabel}
      class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
    >
      Continue
      <ArrowRight size={20} />
    </button>
  </div>

  <!-- Helper Text -->
  {#if !multiline}
    <p class="text-sm text-gray-500 text-center">
      Press <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to continue
    </p>
  {/if}
</div> 