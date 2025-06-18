<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Check } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let formData: {
    projectDescription: string;
    primaryGoals: string[];
    targetAudience: string;
    successMetrics: string[];
    competitorExamples: string;
  };

  const primaryGoalOptions = [
    {
      name: "Generate Leads",
      icon: "🎯",
      description: "Capture potential customers and grow your pipeline",
    },
    {
      name: "Increase Sales",
      icon: "💰",
      description: "Drive revenue and boost conversions",
    },
    {
      name: "Build Brand Awareness",
      icon: "📢",
      description: "Expand your reach and recognition",
    },
    {
      name: "Improve Customer Service",
      icon: "🤝",
      description: "Enhance support and customer satisfaction",
    },
    {
      name: "Streamline Operations",
      icon: "⚙️",
      description: "Automate processes and increase efficiency",
    },
    {
      name: "Showcase Portfolio",
      icon: "🎨",
      description: "Display your work and attract clients",
    },
    {
      name: "Educate Audience",
      icon: "📚",
      description: "Share knowledge and build authority",
    },
    {
      name: "Build Community",
      icon: "👥",
      description: "Create connections and engagement",
    },
  ];

  const successMetricOptions = [
    {
      name: "Website Traffic",
      icon: "📈",
      description: "Visitors and page views",
    },
    {
      name: "Lead Generation",
      icon: "🎯",
      description: "Contact forms and inquiries",
    },
    {
      name: "Online Sales",
      icon: "💳",
      description: "Revenue and transactions",
    },
    {
      name: "User Engagement",
      icon: "❤️",
      description: "Time on site and interactions",
    },
    {
      name: "Conversion Rate",
      icon: "🔄",
      description: "Visitors to customers ratio",
    },
    {
      name: "Brand Recognition",
      icon: "🏆",
      description: "Awareness and recall",
    },
    {
      name: "Customer Satisfaction",
      icon: "😊",
      description: "Reviews and feedback scores",
    },
    {
      name: "Time on Site",
      icon: "⏱️",
      description: "User engagement duration",
    },
  ];

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter((item) => item !== option);
    } else {
      return [...array, option];
    }
  }

  // Validation
  $: isValid = !!(
    formData.projectDescription?.trim() && formData.primaryGoals.length > 0
  );

  // Emit validation state changes
  $: dispatch("validation", { isValid });
</script>

<div class="space-y-6">
  <div>
    <label
      for="projectDescription"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      Project Description *
    </label>
    <textarea
      id="projectDescription"
      bind:value={formData.projectDescription}
      rows="4"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      placeholder="Describe your project vision, what problem you're solving, and what you want to achieve..."
      required
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Primary Goals * (Select all that apply)
    </label>
    <div class="grid md:grid-cols-2 gap-3">
      {#each primaryGoalOptions as goal}
        <button
          type="button"
          on:click={() =>
            (formData.primaryGoals = toggleArrayOption(
              formData.primaryGoals,
              goal.name
            ))}
          class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
            {formData.primaryGoals.includes(goal.name)
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <div
            class="w-5 h-5 border rounded
            {formData.primaryGoals.includes(goal.name)
              ? 'bg-accent-600 border-accent-600'
              : 'border-gray-300'}"
          >
            {#if formData.primaryGoals.includes(goal.name)}
              <Check size={14} class="text-white" />
            {/if}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">{goal.icon}</span>
              <span class="text-sm font-medium">{goal.name}</span>
            </div>
            <p class="text-xs text-gray-600">{goal.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label
      for="targetAudience"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      Target Audience
    </label>
    <textarea
      id="targetAudience"
      bind:value={formData.targetAudience}
      rows="3"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      placeholder="Who are your ideal customers? Demographics, interests, pain points..."
    />
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Success Metrics (How will you measure success?)
    </label>
    <div class="grid md:grid-cols-2 gap-3">
      {#each successMetricOptions as metric}
        <button
          type="button"
          on:click={() =>
            (formData.successMetrics = toggleArrayOption(
              formData.successMetrics,
              metric.name
            ))}
          class="p-3 border rounded-lg text-left transition-all flex items-center gap-3
            {formData.successMetrics.includes(metric.name)
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <div
            class="w-5 h-5 border rounded
            {formData.successMetrics.includes(metric.name)
              ? 'bg-accent-600 border-accent-600'
              : 'border-gray-300'}"
          >
            {#if formData.successMetrics.includes(metric.name)}
              <Check size={14} class="text-white" />
            {/if}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">{metric.icon}</span>
              <span class="text-sm font-medium">{metric.name}</span>
            </div>
            <p class="text-xs text-gray-600">{metric.description}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label
      for="competitorExamples"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      Competitor Examples or Inspiration Sites
    </label>
    <textarea
      id="competitorExamples"
      bind:value={formData.competitorExamples}
      rows="3"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      placeholder="List websites you admire or compete with. What do you like/dislike about them?"
    />
  </div>
</div>
