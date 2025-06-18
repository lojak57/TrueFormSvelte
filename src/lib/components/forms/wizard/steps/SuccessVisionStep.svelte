<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, scale, fly } from "svelte/transition";
  import {
    Target,
    TrendingUp,
    Users,
    DollarSign,
    Clock,
    Star,
    Rocket,
    Trophy,
  } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let selected: string[] = [];

  const successMetrics = [
    {
      id: "more-leads",
      title: "Generate More Leads",
      description: "Convert visitors into potential customers",
      icon: TrendingUp,
      color: "blue",
      benefits: [
        "Higher conversion rates",
        "Better lead quality",
        "Automated lead capture",
      ],
    },
    {
      id: "increase-sales",
      title: "Increase Sales Revenue",
      description: "Drive more transactions and higher order values",
      icon: DollarSign,
      color: "green",
      benefits: [
        "Streamlined checkout",
        "Trust-building design",
        "Persuasive product pages",
      ],
    },
    {
      id: "save-time",
      title: "Save Time & Automate",
      description: "Reduce manual work and streamline processes",
      icon: Clock,
      color: "purple",
      benefits: [
        "Automated bookings",
        "Self-service options",
        "Reduced admin work",
      ],
    },
    {
      id: "build-credibility",
      title: "Build Credibility & Trust",
      description: "Look professional and establish authority",
      icon: Star,
      color: "yellow",
      benefits: [
        "Professional appearance",
        "Social proof display",
        "Trust indicators",
      ],
    },
    {
      id: "reach-audience",
      title: "Reach More People",
      description: "Expand your reach and find new customers",
      icon: Users,
      color: "indigo",
      benefits: [
        "Better SEO rankings",
        "Mobile optimization",
        "Social media integration",
      ],
    },
    {
      id: "compete-better",
      title: "Outshine Competitors",
      description: "Stand out in your industry",
      icon: Trophy,
      color: "orange",
      benefits: [
        "Modern design edge",
        "Better user experience",
        "Unique positioning",
      ],
    },
    {
      id: "launch-product",
      title: "Launch Successfully",
      description: "Make a strong first impression",
      icon: Rocket,
      color: "red",
      benefits: [
        "Launch-ready design",
        "Scalable foundation",
        "Market positioning",
      ],
    },
    {
      id: "improve-experience",
      title: "Improve User Experience",
      description: "Make it easier for customers to engage",
      icon: Target,
      color: "teal",
      benefits: [
        "Intuitive navigation",
        "Fast loading times",
        "Mobile-first design",
      ],
    },
  ];

  function toggleSuccess(successId: string) {
    if (selected.includes(successId)) {
      selected = selected.filter((id) => id !== successId);
    } else if (selected.length < 3) {
      selected = [...selected, successId];
    }
  }

  function handleContinue() {
    dispatch("complete", { value: selected });
  }

  $: selectedMetrics = successMetrics.filter((m) => selected.includes(m.id));
</script>

<div class="space-y-8" in:fade={{ duration: 300 }}>
  <!-- Header -->
  <div class="text-center">
    <div
      class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl mb-6 shadow-xl"
    >
      <Target size={40} class="text-white" />
    </div>

    <div class="mb-8">
      <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Let's envision your success! What will this new website help you
        achieve? Pick up to 3 main goals.
      </p>
    </div>
  </div>

  <!-- Success metrics grid -->
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
    {#each successMetrics as metric, i}
      <button
        class="success-card group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] text-left
               {selected.includes(metric.id)
          ? `border-${metric.color}-500 bg-${metric.color}-50 shadow-xl shadow-${metric.color}-100`
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'}
               focus:outline-none focus:ring-4 focus:ring-purple-200"
        on:click={() => toggleSuccess(metric.id)}
        disabled={!selected.includes(metric.id) && selected.length >= 3}
        in:scale={{ duration: 300, delay: Math.min(i * 75, 500) }}
      >
        <!-- Selection indicator -->
        {#if selected.includes(metric.id)}
          <div
            class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
            in:scale={{ duration: 200 }}
          >
            {selected.indexOf(metric.id) + 1}
          </div>
        {/if}

        <!-- Icon and title -->
        <div class="flex items-start gap-4 mb-4">
          <div
            class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                      {selected.includes(metric.id)
              ? `bg-${metric.color}-100`
              : `bg-${metric.color}-50 group-hover:bg-${metric.color}-100`}
                      transition-colors duration-200"
          >
            <svelte:component
              this={metric.icon}
              size={24}
              class="text-{metric.color}-600"
            />
          </div>

          <div class="flex-1">
            <h3
              class="text-lg font-bold text-gray-900 mb-2 group-hover:text-{metric.color}-700 transition-colors"
            >
              {metric.title}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-3">
              {metric.description}
            </p>
          </div>
        </div>

        <!-- Benefits list -->
        <div class="space-y-1">
          {#each metric.benefits as benefit}
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <div class="w-1 h-1 bg-{metric.color}-400 rounded-full" />
              <span>{benefit}</span>
            </div>
          {/each}
        </div>

        <!-- Disabled overlay -->
        {#if !selected.includes(metric.id) && selected.length >= 3}
          <div
            class="absolute inset-0 bg-gray-100 bg-opacity-75 rounded-2xl flex items-center justify-center"
          >
            <span class="text-sm font-medium text-gray-500"
              >3 goals selected</span
            >
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Selected goals preview -->
  {#if selected.length > 0}
    <div
      class="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 max-w-4xl mx-auto border border-green-200"
      in:fade={{ duration: 300 }}
    >
      <h4 class="text-lg font-semibold text-gray-900 mb-4 text-center">
        🎯 Your success vision:
      </h4>

      <div class="grid md:grid-cols-{selected.length} gap-4">
        {#each selectedMetrics as metric, i}
          <div
            class="text-center"
            in:fly={{ y: 20, duration: 300, delay: i * 100 }}
          >
            <div
              class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl shadow-sm mb-3 border border-{metric.color}-200"
            >
              <svelte:component
                this={metric.icon}
                size={24}
                class="text-{metric.color}-600"
              />
            </div>
            <h5 class="font-semibold text-gray-800 mb-1">{metric.title}</h5>
            <p class="text-sm text-gray-600">{metric.description}</p>
          </div>
        {/each}
      </div>

      <div class="text-center mt-6 pt-6 border-t border-green-200">
        <p class="text-sm text-gray-600 italic">
          "In 6 months, our new website will be {selectedMetrics
            .map((m) => m.title.toLowerCase())
            .join(", ")
            .replace(/, ([^,]*)$/, ", and $1")}."
        </p>
      </div>
    </div>
  {/if}

  <!-- Continue button -->
  <div class="text-center pt-6">
    {#if selected.length > 0}
      <button
        on:click={handleContinue}
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl
               hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-4 focus:ring-green-200"
      >
        <Target size={20} />
        Let's make this vision reality!
      </button>

      <p class="text-sm text-gray-500 mt-3">
        {selected.length}/3 success goals selected
      </p>
    {:else}
      <div class="space-y-3">
        <p class="text-gray-600">
          Select at least one success goal to continue
        </p>
        <p class="text-sm text-gray-500">
          💡 Choose the outcomes that matter most to your business
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .success-card:disabled {
    cursor: not-allowed;
  }

  .success-card:disabled:hover {
    transform: none;
    border-color: rgb(229, 231, 235);
  }
</style>
