<script lang="ts">
  import VisualSelectionStep from '../components/VisualSelectionStep.svelte';
  
  export let selected: string = '';
  
  const budgetRanges = [
    { 
      id: 'starter', 
      name: '$2,500 - $5,000', 
      icon: '🌱', 
      description: 'Essential features, perfect for startups' 
    },
    { 
      id: 'professional', 
      name: '$5,000 - $10,000', 
      icon: '💼', 
      description: 'Full-featured professional site'
    },
    { 
      id: 'premium', 
      name: '$10,000 - $25,000', 
      icon: '💎', 
      description: 'Advanced features & customization' 
    },
    { 
      id: 'enterprise', 
      name: '$25,000+', 
      icon: '🏢', 
      description: 'Complex projects & integrations' 
    },
    { 
      id: 'unsure', 
      name: 'Not Sure Yet', 
      icon: '🤔', 
      description: 'Let\'s discuss what\'s possible' 
    }
  ];
</script>

<div class="space-y-4">
  <div class="mb-4">
    <p class="text-sm text-gray-600">
      All packages include design, development, and launch support. Payment plans available.
    </p>
  </div>

  <VisualSelectionStep
    options={budgetRanges}
    {selected}
    columns={1}
    autoAdvance={false}
    on:complete
  />
  
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
    <p class="text-blue-800">
      💡 <strong>Financing Available:</strong> We offer flexible payment plans to fit your budget. 
      No interest for 6 months on projects over $5,000.
    </p>
  </div>
</div> 