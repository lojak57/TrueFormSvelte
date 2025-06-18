<script lang="ts">
  import VisualSelectionStep from "../components/VisualSelectionStep.svelte";
  import { createEventDispatcher } from "svelte";

  export let selected: string = "";

  const dispatch = createEventDispatcher();

  const industries = [
    {
      id: "tech",
      name: "Technology",
      icon: "💻",
      description: "Software, IT, Tech Services",
      image:
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "health",
      name: "Healthcare",
      icon: "🏥",
      description: "Medical, Wellness, Health Services",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "retail",
      name: "Retail",
      icon: "🛍️",
      description: "E-commerce, Stores, Products",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "services",
      name: "Services",
      icon: "🤝",
      description: "Consulting, Professional Services",
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "education",
      name: "Education",
      icon: "🎓",
      description: "Schools, Training, E-learning",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "nonprofit",
      name: "Non-Profit",
      icon: "❤️",
      description: "Charity, Community, Causes",
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "realestate",
      name: "Real Estate",
      icon: "🏠",
      description: "Property, Construction, Architecture",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "finance",
      name: "Finance",
      icon: "💰",
      description: "Banking, Insurance, Investments",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "food",
      name: "Food & Beverage",
      icon: "🍽️",
      description: "Restaurants, Catering, Food Services",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "creative",
      name: "Creative",
      icon: "🎨",
      description: "Design, Marketing, Media",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "manufacturing",
      name: "Manufacturing",
      icon: "🏭",
      description: "Production, Industrial, B2B",
      image:
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&crop=center",
    },
    {
      id: "other",
      name: "Other",
      icon: "🔧",
      description: "Something else",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center",
    },
  ];
</script>

<VisualSelectionStep
  options={industries}
  {selected}
  columns={3}
  autoAdvance={false}
  on:complete
/>
