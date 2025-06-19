<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { onMount } from "svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    AlertTriangle,
    DollarSign,
    Lightbulb,
    Target,
    Zap,
    Heart,
    Award,
    Globe,
  } from "lucide-svelte";

  let heroVisible = false;
  let storyVisible = false;

  onMount(() => {
    setTimeout(() => (heroVisible = true), 100);
    setTimeout(() => (storyVisible = true), 800);
  });

  const painPoints = [
    {
      icon: AlertTriangle,
      title: "Terrible User Experience",
      description: "Wix and Squarespace were clunky, unintuitive, and frustrating to use. Simple changes took hours.",
      color: "text-red-600 bg-red-100",
    },
    {
      icon: DollarSign,
      title: "Not Even That Cheap",
      description: "Despite the marketing, costs quickly added up with premium features, plugins, and monthly fees.",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Target,
      title: "Limited & Generic",
      description: "Templates were cookie-cutter, customization was severely limited, and sites looked amateurish.",
      color: "text-yellow-600 bg-yellow-100",
    }
  ];

  const realization = [
    {
      icon: DollarSign,
      title: "Outrageous Agency Pricing",
      description: "Software companies charging $5,000-10,000+ for what seemed like relatively simple websites.",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Lightbulb,
      title: "The 'Aha' Moment",
      description: "There had to be a better way - professional quality without the insane markup or terrible UX.",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Heart,
      title: "The Solution",
      description: "What if we could deliver agency-quality work at fair prices, with a process that actually makes sense?",
      color: "text-green-600 bg-green-100",
    }
  ];
</script>

<svelte:head>
  <title>About TrueForm | Why I Started This Company</title>
  <meta
    name="description"
    content="The story behind TrueForm - born from frustration with Wix/Squarespace and outrageous agency pricing. There had to be a better way."
  />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section
    class="relative bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white overflow-hidden py-20 lg:py-32"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-600/20 via-transparent to-transparent"
    />
    <!-- Geometric Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="story-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="#38bdf8"/>
            <rect x="5" y="5" width="10" height="10" fill="none" stroke="#38bdf8" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#story-pattern)"/>
      </svg>
    </div>

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if heroVisible}
        <div class="text-center" in:fly={{ y: 50, duration: 800, delay: 200 }}>
          <div
            class="inline-flex items-center px-4 py-2 mb-8 bg-accent-600/90 border border-accent-400/50 rounded-full text-white text-sm font-medium shadow-lg backdrop-blur-sm"
          >
            <Award size={16} class="mr-2" />
            The TrueForm Origin Story
          </div>

          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Why I Started
            <span
              class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent block"
            >
              TrueForm
            </span>
          </h1>

          <p
            class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Frustrated with terrible DIY platforms and outrageous agency pricing, 
            I knew there had to be a better way to get professional websites built.
          </p>
        </div>
      {/if}
    </div>
  </section>

  <!-- The Problem Section -->
  {#if storyVisible}
    <section class="py-20 bg-gray-50" in:fade={{ duration: 800, delay: 400 }}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Problem I Faced
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Like many business owners, I tried the "easy" DIY website builders first. 
            Here's what I discovered...
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          {#each painPoints as pain, i}
            <div in:fly={{ y: 50, duration: 600, delay: 600 + (i * 150) }}>
              <Card class="p-8 text-center hover:shadow-xl transition-all duration-300 h-full">
                <div
                  class="w-16 h-16 {pain.color} rounded-xl flex items-center justify-center mx-auto mb-6"
                >
                  <svelte:component this={pain.icon} size={32} />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                  {pain.title}
                </h3>
                <p class="text-gray-600 leading-relaxed">{pain.description}</p>
              </Card>
            </div>
          {/each}
        </div>

        <!-- Personal Story -->
        <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12" in:fly={{ y: 30, duration: 800, delay: 1200 }}>
          <div class="max-w-4xl mx-auto">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              My Personal Experience
            </h3>
            <div class="prose prose-lg prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed text-lg">
                I spent <strong>countless hours</strong> fighting with Wix and Squarespace, trying to make my business website look professional. 
                The drag-and-drop editors were clunky, the templates were generic, and every small customization felt like pulling teeth.
              </p>
              <p class="text-gray-700 leading-relaxed text-lg">
                After months of frustration and a site that still looked amateur, I decided to get quotes from professional developers. 
                The prices were <strong>shocking</strong> - $5,000, $10,000, even $15,000+ for what seemed like relatively straightforward websites.
              </p>
              <p class="text-gray-700 leading-relaxed text-lg">
                That's when it hit me: <strong>there had to be a better way.</strong> 
                Why couldn't someone deliver professional-quality websites at reasonable prices, 
                with a process that didn't make you want to pull your hair out?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- The Realization Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            The Realization
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Looking at the market, I saw two extremes - and a massive gap in between.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-16">
          {#each realization as insight, i}
            <div in:fly={{ y: 50, duration: 600, delay: 200 + (i * 150) }}>
              <Card class="p-8 text-center hover:shadow-xl transition-all duration-300 h-full">
                <div
                  class="w-16 h-16 {insight.color} rounded-xl flex items-center justify-center mx-auto mb-6"
                >
                  <svelte:component this={insight.icon} size={32} />
                </div>
                <h3 class="text-xl font-semibold text-gray-900 mb-4">
                  {insight.title}
                </h3>
                <p class="text-gray-600 leading-relaxed">{insight.description}</p>
              </Card>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- The Solution Section -->
    <section class="py-20 bg-gradient-to-br from-accent-50 to-blue-50">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div class="text-center mb-12">
            <div class="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-full text-sm font-medium mb-6">
              <Zap size={16} class="mr-2" />
              The TrueForm Solution
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What TrueForm Represents
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Professional Quality</h3>
                    <p class="text-gray-600">Custom-designed websites that look and perform like they cost $10k</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Fair, Fixed Pricing</h3>
                    <p class="text-gray-600">$999 flat rate. No surprises, no hourly billing, no hidden costs</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Actually Fast Delivery</h3>
                    <p class="text-gray-600">7 days from start to finish. Not 6-12 weeks like agencies</p>
                  </div>
                </div>
                
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span class="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 mb-2">Human Support</h3>
                    <p class="text-gray-600">Real people who answer emails and help you succeed</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-center">
              <div class="bg-accent-600 text-white p-8 rounded-2xl">
                <h3 class="text-2xl font-bold mb-4">The TrueForm Promise</h3>
                <p class="text-accent-100 text-lg leading-relaxed">
                  "Professional websites shouldn't cost $10,000 or take 6 months to build. 
                  They shouldn't require you to wrestle with terrible DIY tools either. 
                  There's a better way - and that's what TrueForm is all about."
                </p>
                <div class="mt-6 text-right">
                  <p class="font-semibold">- Mitch Mechelay, Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Doesn't Scale Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            Special Doesn't Scale
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlike where the rest of the industry is going, you won't see us advertising "Go live tonight!" or "Millions served!" 
          </p>
        </div>

        <div class="bg-gray-800 rounded-2xl p-8 md:p-12 mb-12">
          <div class="prose prose-lg prose-invert max-w-none">
            <p class="text-gray-300 leading-relaxed text-lg mb-6">
              <strong>No.</strong> If you look at our workflow, we aren't set up to serve millions. Every single request that comes through our site is reviewed and then designed by a real designer.
            </p>
            <p class="text-gray-300 leading-relaxed text-lg mb-6">
              That real designer delivers you your site, complete with your authentication into the platform, as well as either a demo call or demo walkthrough video of your site with your actual designer.
            </p>
            <p class="text-accent-400 leading-relaxed text-lg font-semibold">
              That's what makes us special, and why we will never "scale" in the traditional sense. We want to scale with YOU, our loyal clients.
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe size={32} class="text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Real Designers</h3>
            <p class="text-gray-400">Every project is handled by an actual human designer, not a template generator.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart size={32} class="text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Personal Touch</h3>
            <p class="text-gray-400">Demo calls and walkthrough videos with your designer, not a support ticket system.</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award size={32} class="text-white" />
            </div>
            <h3 class="text-xl font-semibold mb-3">Quality Over Quantity</h3>
            <p class="text-gray-400">We'd rather do fewer projects exceptionally well than millions mediocrely.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-accent-600 text-white">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          Ready to Experience the Difference?
        </h2>
        <p class="text-xl mb-10 text-accent-100">
          Join the businesses who've discovered there really is a better way to get professional websites built.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            class="border-white text-white hover:bg-white hover:text-accent-600 font-semibold px-8 py-4 text-lg transition-all duration-300"
          >
            <a href="/request?start=true" class="flex items-center gap-2">
              Start Your Project Today
              <Zap size={20} />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="border-white/70 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm font-semibold px-8 py-4 text-lg"
          >
            <a href="/contact"> Get in Touch </a>
          </Button>
        </div>
      </div>
    </section>
  {/if}
</div>