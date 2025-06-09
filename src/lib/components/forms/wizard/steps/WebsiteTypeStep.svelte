<script lang="ts">
  import VisualSelectionStep from '../components/VisualSelectionStep.svelte';
  
  export let selected: string = '';
  
  const websiteTypes = [
    { 
      id: 'business', 
      name: 'Business Website', 
      icon: '🏢', 
      description: 'Professional site for your company',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'ecommerce', 
      name: 'E-commerce', 
      icon: '🛒', 
      description: 'Sell products online',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'portfolio', 
      name: 'Portfolio', 
      icon: '🎨', 
      description: 'Showcase your work',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'blog', 
      name: 'Blog/Content', 
      icon: '📝', 
      description: 'Share articles and insights',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'booking', 
      name: 'Booking/Services', 
      icon: '📅', 
      description: 'Schedule appointments',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'membership', 
      name: 'Membership', 
      icon: '👥', 
      description: 'Gated content & community',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'landing', 
      name: 'Landing Page', 
      icon: '🚀', 
      description: 'Single page for campaigns',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center'
    },
    { 
      id: 'webapp', 
      name: 'Web Application', 
      icon: '💻', 
      description: 'Custom functionality',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop&crop=center'
    }
  ];
</script>

<VisualSelectionStep
  options={websiteTypes}
  {selected}
  columns={2}
  autoAdvance={false}
  on:complete
/> 