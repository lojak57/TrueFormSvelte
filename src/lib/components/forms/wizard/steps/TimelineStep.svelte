<script lang="ts">
  import VisualSelectionStep from "../components/VisualSelectionStep.svelte";

  export let selected: string = "";

  const timelines = [
    {
      id: "asap",
      name: "ASAP",
      icon: "🚨",
      description: "I have an urgent deadline",
    },
    {
      id: "1month",
      name: "Within 1 Month",
      icon: "⚡",
      description: "Quick turnaround needed",
    },
    {
      id: "2-3months",
      name: "2-3 Months",
      icon: "📅",
      description: "Standard timeline",
    },
    {
      id: "3-6months",
      name: "3-6 Months",
      icon: "🎯",
      description: "Plenty of time for perfection",
    },
    {
      id: "flexible",
      name: "I'm Flexible",
      icon: "🌟",
      description: "Quality matters more than speed",
    },
  ];
</script>

<div class="mb-4">
  <p class="text-sm text-gray-600">
    Realistic timelines help us deliver quality work. Rush jobs may have limited
    revision rounds.
  </p>
</div>

<VisualSelectionStep
  options={timelines}
  {selected}
  columns={1}
  autoAdvance={false}
  on:complete
/>
