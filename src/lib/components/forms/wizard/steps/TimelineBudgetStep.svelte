<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let formData: {
    timeline: string;
    budgetRange: string;
    launchDate: string;
    additionalRequirements: string;
  };

  const timelineOptions = [
    "ASAP (Rush - 1 week)",
    "2 weeks",
    "1 month",
    "2-3 months",
    "Flexible timeline",
  ];

  const budgetOptions = [
    "Free Demo Only",
    "$999 - Professional",
    "$2,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000+ Custom Enterprise",
    "Need consultation on budget",
  ];

  // Validation
  $: isValid = !!(formData.timeline?.trim() && formData.budgetRange?.trim());

  // Emit validation state changes
  $: dispatch("validation", { isValid });
</script>

<div class="space-y-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Timeline *
    </label>
    <div class="grid md:grid-cols-2 gap-3">
      {#each timelineOptions as timeline}
        <button
          type="button"
          on:click={() => (formData.timeline = timeline)}
          class="p-4 border rounded-lg text-left transition-all
            {formData.timeline === timeline
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <span class="font-medium">{timeline}</span>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Budget Range *
    </label>
    <div class="grid md:grid-cols-2 gap-3">
      {#each budgetOptions as budget}
        <button
          type="button"
          on:click={() => (formData.budgetRange = budget)}
          class="p-4 border rounded-lg text-left transition-all
            {formData.budgetRange === budget
            ? 'border-accent-600 bg-accent-50'
            : 'border-gray-300 hover:border-gray-400'}"
        >
          <span class="font-medium">{budget}</span>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label
      for="launchDate"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      Launch Date
    </label>
    <input
      id="launchDate"
      type="date"
      bind:value={formData.launchDate}
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
    />
  </div>

  <div>
    <label
      for="additionalRequirements"
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      Additional Requirements
    </label>
    <textarea
      id="additionalRequirements"
      bind:value={formData.additionalRequirements}
      rows="3"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
      placeholder="Any additional requirements or notes..."
    />
  </div>
</div>
