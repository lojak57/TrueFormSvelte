<!-- Conflict Resolution Dialog -->
<script lang="ts">
  // Props
  export let onResolve: (strategy: 'local' | 'remote' | 'merge') => void;
  export let onCancel: () => void;

  let selectedStrategy: 'local' | 'remote' | 'merge' | null = null;
  let isResolving = false;

  async function handleResolve() {
    if (!selectedStrategy) return;
    
    isResolving = true;
    try {
      await onResolve(selectedStrategy);
    } finally {
      isResolving = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onCancel();
    }
  }
</script>

<!-- Dialog Backdrop -->
<div 
  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  on:click|self={onCancel}
  on:keydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  aria-labelledby="conflict-title"
>
  <!-- Dialog Content -->
  <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
    <!-- Header -->
    <div class="p-6 border-b border-slate-200">
      <div class="flex items-center space-x-3">
        <!-- Warning Icon -->
        <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div>
          <h2 id="conflict-title" class="text-xl font-semibold text-slate-900">
            Editing Conflict Detected
          </h2>
          <p class="text-slate-600 mt-1">
            This proposal has been modified in another tab or session
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-6">
      <!-- Explanation -->
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          <div class="text-sm text-amber-800">
            <p class="font-medium mb-1">What happened?</p>
            <p>
              The proposal you're editing has been updated elsewhere. This could happen if you have 
              multiple tabs open or someone else is editing the same proposal. Choose how you'd like 
              to resolve this conflict.
            </p>
          </div>
        </div>
      </div>

      <!-- Resolution Options -->
      <div class="space-y-3">
        <h3 class="text-lg font-medium text-slate-900">Choose a resolution strategy:</h3>
        
        <!-- Keep Local Changes -->
        <label class="conflict-option">
          <input
            type="radio"
            name="strategy"
            value="local"
            bind:group={selectedStrategy}
            class="sr-only"
          />
          <div class="option-card">
            <div class="flex items-start space-x-3">
              <div class="option-icon bg-blue-100 text-blue-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-slate-900">Keep my changes</h4>
                <p class="text-sm text-slate-600 mt-1">
                  Discard the remote changes and keep your current work. Use this if you're confident 
                  your changes are more up-to-date.
                </p>
              </div>
            </div>
          </div>
        </label>

        <!-- Use Remote Changes -->
        <label class="conflict-option">
          <input
            type="radio"
            name="strategy"
            value="remote"
            bind:group={selectedStrategy}
            class="sr-only"
          />
          <div class="option-card">
            <div class="flex items-start space-x-3">
              <div class="option-icon bg-green-100 text-green-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-slate-900">Use latest version</h4>
                <p class="text-sm text-slate-600 mt-1">
                  Replace your changes with the latest version. Use this if the remote changes 
                  are more important or if you want to start fresh.
                </p>
              </div>
            </div>
          </div>
        </label>

        <!-- Merge Changes (Future Feature) -->
        <label class="conflict-option opacity-50 cursor-not-allowed">
          <input
            type="radio"
            name="strategy"
            value="merge"
            disabled
            class="sr-only"
          />
          <div class="option-card">
            <div class="flex items-start space-x-3">
              <div class="option-icon bg-purple-100 text-purple-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-slate-900">Smart merge (Coming soon)</h4>
                <p class="text-sm text-slate-600 mt-1">
                  Automatically merge changes where possible. This feature will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
      <button
        type="button"
        class="text-slate-600 hover:text-slate-800 transition-colors"
        on:click={onCancel}
        disabled={isResolving}
      >
        Cancel
      </button>
      
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="btn btn-primary"
          disabled={!selectedStrategy || isResolving}
          on:click={handleResolve}
        >
          {#if isResolving}
            <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Resolving...
          {:else}
            Resolve Conflict
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .conflict-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .conflict-dialog {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 42rem;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .option-card.selected {
    box-shadow: 0 0 0 2px rgb(59, 130, 246);
    border-color: rgb(191, 219, 254);
    background-color: rgb(239, 246, 255);
  }

  .option-card {
    border: 2px solid rgb(226, 232, 240);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s;
    cursor: pointer;
  }

  .option-card:hover {
    border-color: rgb(203, 213, 225);
  }

  .option-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .action-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }

  .action-btn:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-primary {
    background-color: rgb(37, 99, 235);
    color: white;
  }

  .btn-primary:hover {
    background-color: rgb(29, 78, 216);
  }

  .btn-primary:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style> 