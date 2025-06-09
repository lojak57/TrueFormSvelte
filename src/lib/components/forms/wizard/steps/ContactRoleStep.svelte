<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import VisualSelectionStep from '../components/VisualSelectionStep.svelte';
  import { ArrowRight, User, Crown, Briefcase, Users, Cog, PenTool } from 'lucide-svelte';
  
  export let selected: string = '';
  
  const dispatch = createEventDispatcher();
  
  let showCustomInput = false;
  let customRole = '';
  
  const roleOptions = [
    {
      id: 'owner',
      name: 'Owner/Founder',
      icon: '👑',
      description: 'I own or founded this business'
    },
    {
      id: 'ceo',
      name: 'CEO/President',
      icon: '🎯',
      description: 'Chief executive or president'
    },
    {
      id: 'marketing',
      name: 'Marketing Manager',
      icon: '📈',
      description: 'Marketing, advertising, or growth'
    },
    {
      id: 'operations',
      name: 'Operations Manager',
      icon: '⚙️',
      description: 'Day-to-day operations and management'
    },
    {
      id: 'sales',
      name: 'Sales Manager',
      icon: '💼',
      description: 'Sales, business development, or partnerships'
    },
    {
      id: 'assistant',
      name: 'Assistant/Helper',
      icon: '🤝',
      description: 'Helping someone else with this project'
    },
    {
      id: 'custom',
      name: 'Other Role',
      icon: '✏️',
      description: 'I\'ll describe my role'
    }
  ];
  
  function handleRoleSelect(event: CustomEvent) {
    const { value } = event.detail;
    
    if (value === 'custom') {
      showCustomInput = true;
      selected = '';
    } else {
      showCustomInput = false;
      selected = value;
      dispatch('complete', { value: selected });
    }
  }
  
  function handleCustomSubmit() {
    if (customRole.trim()) {
      selected = customRole.trim();
      dispatch('complete', { value: selected });
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomSubmit();
    }
  }
</script>

<div class="space-y-6">
  {#if !showCustomInput}
    <!-- Role Selection -->
    <VisualSelectionStep
      options={roleOptions}
      {selected}
      columns={2}
      autoAdvance={false}
      on:complete={handleRoleSelect}
    />
  {:else}
    <!-- Custom Role Input -->
    <div in:fade={{ duration: 300 }} class="space-y-4">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <PenTool size={32} class="text-accent-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          What's your role?
        </h3>
        <p class="text-gray-600">
          Describe your position or role in the company
        </p>
      </div>
      
      <div class="max-w-md mx-auto">
        <input
          bind:value={customRole}
          on:keydown={handleKeydown}
          placeholder="e.g., IT Director, Creative Director, Office Manager..."
          class="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-accent-500 focus:ring-4 focus:ring-accent-100 transition-all"
          autofocus
        />
        
        <div class="flex items-center justify-between mt-6">
          <button
            on:click={() => {
              showCustomInput = false;
              selected = '';
              customRole = '';
            }}
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to options
          </button>
          
          <button
            on:click={handleCustomSubmit}
            disabled={!customRole.trim()}
            class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Continue
            <ArrowRight size={20} />
          </button>
        </div>
        
        <p class="text-sm text-gray-500 text-center mt-4">
          Press <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to continue
        </p>
      </div>
    </div>
  {/if}
</div> 