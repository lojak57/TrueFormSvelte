<script lang="ts">
  import VisualSelectionStep from '../components/VisualSelectionStep.svelte';
  
  export let selected: string[] = [];
  
  const designMoods = [
    { 
      id: 'modern', 
      name: 'Modern & Clean', 
      icon: '✨', 
      description: 'Minimalist, lots of white space',
      image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'bold', 
      name: 'Bold & Dynamic', 
      icon: '🚀', 
      description: 'Strong colors, big statements',
      image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'elegant', 
      name: 'Elegant & Sophisticated', 
      icon: '💎', 
      description: 'Refined, premium feel',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'playful', 
      name: 'Fun & Playful', 
      icon: '🎨', 
      description: 'Colorful, animated, friendly',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'professional', 
      name: 'Professional & Corporate', 
      icon: '💼', 
      description: 'Trustworthy, established',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'tech', 
      name: 'Tech & Innovative', 
      icon: '💻', 
      description: 'Futuristic, cutting-edge',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'organic', 
      name: 'Natural & Organic', 
      icon: '🌿', 
      description: 'Earthy, sustainable feel',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'luxury', 
      name: 'Luxury & Premium', 
      icon: '👑', 
      description: 'High-end, exclusive',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop&crop=center'
    }
  ];
</script>

<div class="mb-4">
  <p class="text-sm text-gray-600">
    Select one or two moods that best represent how you want your site to feel.
  </p>
</div>

<VisualSelectionStep
  options={designMoods}
  {selected}
  multiple={true}
  maxSelections={2}
  columns={2}
  autoAdvance={false}
  on:complete
/> 