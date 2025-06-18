<script lang="ts">
  import VisualSelectionStep from "../components/VisualSelectionStep.svelte";

  export let selected: string = "";

  const goals = [
    {
      id: "leads",
      name: "Generate Leads",
      icon: "🎯",
      description: "Capture potential customers",
    },
    {
      id: "sales",
      name: "Increase Sales",
      icon: "💰",
      description: "Drive revenue growth",
    },
    {
      id: "brand",
      name: "Build Brand",
      icon: "📢",
      description: "Increase awareness",
    },
    {
      id: "service",
      name: "Customer Service",
      icon: "🤝",
      description: "Support your customers",
    },
    {
      id: "showcase",
      name: "Showcase Work",
      icon: "🎨",
      description: "Display portfolio",
    },
    {
      id: "educate",
      name: "Educate",
      icon: "📚",
      description: "Share knowledge",
    },
    {
      id: "community",
      name: "Build Community",
      icon: "👥",
      description: "Connect people",
    },
    {
      id: "automate",
      name: "Automate",
      icon: "⚙️",
      description: "Streamline processes",
    },
  ];
</script>

<VisualSelectionStep
  options={goals}
  {selected}
  columns={2}
  autoAdvance={false}
  on:complete
/>
