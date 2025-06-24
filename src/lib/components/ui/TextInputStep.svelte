<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  export let value: string = "";
  export let placeholder: string = "";
  export let inputType: string = "text";
  export let autocomplete: string = "";
  export let skipLabel: string = "";
  export let starterPrompts: string[] = [];
  export let multiline: boolean = false;
  export let rows: number = 4;

  const dispatch = createEventDispatcher();

  let inputElement: HTMLInputElement | HTMLTextAreaElement;
  let showPrompts = starterPrompts.length > 0;

  onMount(() => {
    if (inputElement) {
      inputElement.focus();
    }
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      if (!multiline || (multiline && event.ctrlKey)) {
        event.preventDefault();
        handleContinue();
      }
    }
  }

  function handleContinue() {
    if (value.trim() || skipLabel) {
      dispatch("complete", { value: value.trim() });
    }
  }

  function handleSkip() {
    if (skipLabel) {
      dispatch("complete", { value: "" });
    }
  }

  function usePrompt(prompt: string) {
    value = prompt;
    showPrompts = false;
    handleContinue();
  }

  function togglePrompts() {
    showPrompts = !showPrompts;
  }
</script>

<div class="text-input-step">
  <!-- Input Field -->
  <div class="input-container">
    {#if multiline}
      <textarea
        bind:this={inputElement}
        bind:value
        {placeholder}
        {autocomplete}
        {rows}
        on:keydown={handleKeyDown}
        class="input-field textarea"
      />
    {:else if inputType === "email"}
      <input
        bind:this={inputElement}
        type="email"
        bind:value
        {placeholder}
        {autocomplete}
        on:keydown={handleKeyDown}
        class="input-field"
      />
    {:else if inputType === "tel"}
      <input
        bind:this={inputElement}
        type="tel"
        bind:value
        {placeholder}
        {autocomplete}
        on:keydown={handleKeyDown}
        class="input-field"
      />
    {:else}
      <input
        bind:this={inputElement}
        type="text"
        bind:value
        {placeholder}
        {autocomplete}
        on:keydown={handleKeyDown}
        class="input-field"
      />
    {/if}
  </div>

  <!-- Action Buttons -->
  <div class="action-container">
    {#if value.trim()}
      <button on:click={handleContinue} class="continue-button" in:fade>
        Continue →
      </button>
    {/if}

    {#if skipLabel}
      <button on:click={handleSkip} class="skip-button" in:fade>
        {skipLabel}
      </button>
    {/if}
  </div>

  <!-- Starter Prompts -->
  {#if starterPrompts.length > 0}
    <div class="prompts-section">
      <button on:click={togglePrompts} class="prompts-toggle">
        {showPrompts ? "Hide" : "Show"} examples
      </button>

      {#if showPrompts}
        <div class="prompts-list" in:fly={{ y: 20, duration: 300 }}>
          {#each starterPrompts as prompt, index}
            <button
              on:click={() => usePrompt(prompt)}
              class="prompt-item"
              in:fly={{ y: 10, duration: 200, delay: index * 50 }}
            >
              {prompt}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .text-input-step {
    width: 100%;
  }

  .input-container {
    margin-bottom: 1rem;
  }

  .input-field {
    width: 100%;
    padding: 1rem;
    font-size: 1.125rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    transition: all 0.2s;
    resize: none;
    font-family: inherit;
  }

  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .textarea {
    min-height: 120px;
    line-height: 1.6;
  }

  .action-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .continue-button {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .continue-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .skip-button {
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .skip-button:hover {
    background: #f9fafb;
    color: #374151;
  }

  .prompts-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }

  .prompts-toggle {
    color: #6b7280;
    font-size: 0.875rem;
    text-decoration: underline;
    margin-bottom: 0.75rem;
  }

  .prompts-toggle:hover {
    color: #374151;
  }

  .prompts-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .prompt-item {
    text-align: left;
    padding: 0.75rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    color: #475569;
    font-size: 0.875rem;
    line-height: 1.4;
    transition: all 0.2s;
  }

  .prompt-item:hover {
    background: #e2e8f0;
    color: #1e293b;
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    .input-field {
      font-size: 1rem;
      padding: 0.875rem;
    }

    .action-container {
      flex-direction: column;
    }

    .continue-button,
    .skip-button {
      text-align: center;
    }
  }
</style>
