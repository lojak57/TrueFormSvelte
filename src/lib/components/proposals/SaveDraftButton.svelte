<!-- Save Draft Button Component -->
<script lang="ts">
  import { proposalActions, proposalStore } from '$lib/stores/proposalStore';
  import { Save, Check } from 'lucide-svelte';
  import { onMount } from 'svelte';

  // Props
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let variant: 'default' | 'minimal' | 'icon' = 'default';
  export let showAutoSaveStatus = true;

  // Local state
  let savePromise: Promise<void> | null = null;
  let justSaved = false;
  let showSaved = false;

  // Reactive statements
  $: isDirty = $proposalStore.isDirty;
  $: isSaving = $proposalStore.isSavingDraft || savePromise !== null;
  $: lastSaved = $proposalStore.lastSaved;

  // Auto-save status
  $: autoSaveStatus = getAutoSaveStatus();

  function getAutoSaveStatus() {
    if (isSaving) return 'Saving...';
    if (!isDirty && lastSaved) return 'Saved';
    if (isDirty) return 'Unsaved changes';
    return '';
  }

  async function handleSaveDraft() {
    if (isSaving) return;
    
    try {
      isSaving = true;
      savePromise = proposalActions.saveDraft();
      await savePromise;
      
      // Show saved confirmation
      showSaved = true;
      setTimeout(() => {
        showSaved = false;
      }, 2000);
      
    } catch (error) {
      console.error('Failed to save draft:', error);
      // TODO: Show error notification
    } finally {
      savePromise = null;
      isSaving = false;
    }
  }

  // Keyboard shortcut
  onMount(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSaveDraft();
      }
    }

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });

  // Size classes
  $: sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }[size];

  // Button content based on variant
  $: buttonContent = getButtonContent();

  function getButtonContent() {
    if (variant === 'icon') {
      return { 
        icon: true, 
        text: false, 
        classes: 'p-2' 
      };
    }
    
    if (variant === 'minimal') {
      return { 
        icon: false, 
        text: true, 
        classes: 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-100 border-0' 
      };
    }
    
    return { 
      icon: true, 
      text: true, 
      classes: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300' 
    };
  }
</script>

<!-- Save Draft Button -->
<div class="save-draft-button flex items-center space-x-2">
  <button
    type="button"
    class="save-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg font-medium {sizeClasses} {buttonContent.classes}"
    class:opacity-50={!isDirty || isSaving}
    class:cursor-not-allowed={!isDirty || isSaving}
    class:animate-pulse={isSaving}
    disabled={!isDirty || isSaving}
    on:click={handleSaveDraft}
    title="Save draft (Ctrl+S)"
  >
    <div class="flex items-center space-x-2">
      {#if buttonContent.icon}
        {#if isSaving}
          <!-- Spinning save icon -->
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
        {:else if showSaved}
          <!-- Success checkmark -->
          <Check size={16} class="text-green-600" />
        {:else}
          <!-- Save icon -->
          <Save size={16} />
        {/if}
      {/if}
      
      {#if buttonContent.text}
        <span>
          {#if isSaving}
            Saving...
          {:else if showSaved}
            Saved!
          {:else}
            Save Draft
          {/if}
        </span>
      {/if}
    </div>
  </button>

  <!-- Auto-save status (if enabled) -->
  {#if showAutoSaveStatus && variant !== 'icon'}
    <div class="auto-save-status text-xs text-slate-500 flex items-center space-x-1">
      {#if autoSaveStatus}
        <div class="flex items-center space-x-1">
          {#if isSaving}
            <div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          {:else if !isDirty && lastSaved}
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
          {:else if isDirty}
            <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
          {/if}
          <span>{autoSaveStatus}</span>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Tooltip for icon variant -->
{#if variant === 'icon'}
  <div class="sr-only">
    Save draft (Ctrl+S) - {autoSaveStatus}
  </div>
{/if}

<style>
  .save-btn:disabled {
    cursor: not-allowed;
  }
  
  .save-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .save-btn:not(:disabled):active {
    transform: translateY(0);
  }
  
  /* Custom animations */
  @keyframes save-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .save-btn.just-saved {
    animation: save-success 0.3s ease-in-out;
  }
</style> 