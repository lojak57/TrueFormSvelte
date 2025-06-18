<script lang="ts">
  import { fade, fly, scale } from "svelte/transition";
  import { onMount } from "svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    Award,
    Users,
    Target,
    Zap,
    Heart,
    Code,
    Palette,
    Globe,
  } from "lucide-svelte";

  let heroVisible = false;
  let statsVisible = false;
  let teamVisible = false;

  onMount(() => {
    setTimeout(() => (heroVisible = true), 100);
    setTimeout(() => (statsVisible = true), 800);
    setTimeout(() => (teamVisible = true), 1400);
  });

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description:
        "We never compromise on quality. Every pixel, every line of code, every interaction is crafted with meticulous attention to detail.",
      color: "text-accent-600 bg-accent-100",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "We're genuinely passionate about helping businesses succeed online. Your success is our motivation and our reward.",
      color: "text-red-600 bg-red-100",
    },
    {
      icon: Users,
      title: "Partnership",
      description:
        "We don't just build websites; we build lasting partnerships. Your business goals become our roadmap to success.",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We stay ahead of the curve with cutting-edge technologies and design trends to ensure your website stands out.",
      color: "text-yellow-600 bg-yellow-100",
    },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & Lead Designer",
      bio: "With 10+ years in UX/UI design, Sarah has led digital transformations for Fortune 500 companies and startups alike.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b14ac5ad?w=300&h=300&fit=crop&crop=face",
      skills: ["UI/UX Design", "Brand Strategy", "User Research"],
    },
    {
      name: "Michael Rodriguez",
      role: "Lead Developer",
      bio: "Full-stack architect with expertise in modern web technologies. Michael ensures every website is fast, secure, and scalable.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      skills: ["React/Svelte", "Node.js", "Cloud Architecture"],
    },
    {
      name: "Emma Thompson",
      role: "Digital Strategy Director",
      bio: "Former marketing executive turned digital strategist. Emma helps businesses maximize their online potential and ROI.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      skills: ["Digital Marketing", "SEO Strategy", "Conversion Optimization"],
    },
  ];

  const stats = [
    { number: "200+", label: "Websites Delivered" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "5", label: "Years of Excellence" },
    { number: "40%", label: "Avg. Conversion Increase" },
  ];

  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      description:
        "Founded with a simple mission: make professional web design accessible to all businesses.",
    },
    {
      year: "2020",
      title: "First 50 Clients",
      description:
        "Achieved our first major milestone during a challenging year, proving our resilient approach.",
    },
    {
      year: "2021",
      title: "Team Expansion",
      description:
        "Grew our team of experts and established our signature rapid delivery process.",
    },
    {
      year: "2022",
      title: "100+ Success Stories",
      description:
        "Celebrated over 100 successful website launches with measurable business impact.",
    },
    {
      year: "2023",
      title: "Industry Recognition",
      description:
        "Named 'Top Web Design Agency' by Industry Awards and featured in major publications.",
    },
    {
      year: "2024",
      title: "Excellence Refined",
      description:
        "Launching our next-generation platform and continuing to set new standards in web development.",
    },
  ];
</script>

<svelte:head>
  <title>About TrueForm | Excellence Refined in Web Development</title>
  <meta
    name="description"
    content="Learn about TrueForm's mission to deliver exceptional websites that drive real business results. Meet our team and discover our story."
  />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section
    class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-accent-900 text-white overflow-hidden py-20 lg:py-32"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-900/20 via-transparent to-transparent"
    />
    <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if heroVisible}
        <div class="text-center" in:fly={{ y: 50, duration: 800, delay: 200 }}>
          <div
            class="inline-flex items-center px-4 py-2 mb-8 bg-accent-600/20 border border-accent-400/30 rounded-full text-accent-300 text-sm font-medium backdrop-blur-sm"
          >
            <Award size={16} class="mr-2" />
            Excellence Refined - Our Story
          </div>

          <h1
            class="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          >
            Transforming Businesses
            <span
              class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent"
            >
              One Website at a Time
            </span>
          </h1>

          <p
            class="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Since 2019, we've been on a mission to make professional web design
            accessible to businesses of all sizes. Our story is one of passion,
            innovation, and unwavering commitment to excellence.
          </p>
        </div>
      {/if}
    </div>
  </section>

  <!-- Stats Section -->
  {#if statsVisible}
    <section class="py-16 bg-white" in:fade={{ duration: 600 }}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          {#each stats as stat, i}
            <div
              class="text-center group"
              in:fly={{ y: 30, duration: 600, delay: i * 100 }}
            >
              <div class="text-3xl md:text-4xl font-bold text-accent-600 mb-2">
                {stat.number}
              </div>
              <div class="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Mission Section -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Our Mission
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          To democratize professional web design and help every business - from
          startups to enterprises - establish a powerful online presence that
          drives real results.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <div class="prose prose-lg">
            <p class="text-gray-700 leading-relaxed">
              We believe that every business deserves a website that not only
              looks stunning but also performs exceptionally. That's why we've
              streamlined our process to deliver enterprise-quality websites in
              days, not months.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Our approach combines cutting-edge technology with timeless design
              principles, ensuring your website stands the test of time while
              staying ahead of digital trends.
            </p>
          </div>

          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center"
            >
              <Target size={32} class="text-accent-600" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                Results-Driven Approach
              </h3>
              <p class="text-gray-600">
                Every decision is made with your business goals in mind.
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center">
            <div class="text-6xl font-bold text-accent-600 mb-4">40%</div>
            <div class="text-xl font-semibold text-gray-900 mb-2">
              Average Conversion Increase
            </div>
            <p class="text-gray-600">
              Our websites don't just look good—they deliver measurable business
              results.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Values Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Our Values
        </h2>
        <p class="text-xl text-gray-600">
          The principles that guide everything we do
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {#each values as value, i}
          <div in:fly={{ y: 50, duration: 600, delay: i * 150 }}>
            <Card
              class="p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div
                class="w-16 h-16 {value.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
              >
                <svelte:component this={value.icon} size={32} />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p class="text-gray-600 leading-relaxed">{value.description}</p>
            </Card>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Team Section -->
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Meet Our Team
        </h2>
        <p class="text-xl text-gray-600">
          The experts behind every exceptional website
        </p>
      </div>

      {#if teamVisible}
        <div class="grid md:grid-cols-3 gap-8">
          {#each team as member, i}
            <div in:scale={{ duration: 500, delay: i * 200 }}>
              <Card
                class="p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div class="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent-100 group-hover:border-accent-200 transition-colors duration-300"
                  />
                  <div
                    class="absolute inset-0 w-32 h-32 rounded-full mx-auto bg-gradient-to-tr from-accent-600/20 to-transparent group-hover:from-accent-600/30 transition-all duration-300"
                  />
                </div>

                <h3 class="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p class="text-accent-600 font-medium mb-4">{member.role}</p>
                <p class="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>

                <div class="flex flex-wrap gap-2 justify-center">
                  {#each member.skills as skill}
                    <span
                      class="px-3 py-1 bg-accent-100 text-accent-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  {/each}
                </div>
              </Card>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Timeline Section -->
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Our Journey
        </h2>
        <p class="text-xl text-gray-600">
          Five years of growth, innovation, and success
        </p>
      </div>

      <div class="relative">
        <!-- Timeline Line -->
        <div
          class="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-accent-200"
        />

        <div class="space-y-12">
          {#each timeline as item, i}
            <div
              class="relative flex items-center {i % 2 === 0
                ? 'justify-start'
                : 'justify-end'}"
            >
              <!-- Timeline Dot -->
              <div
                class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-600 rounded-full border-4 border-white shadow-lg z-10"
              />

              <!-- Content -->
              <div
                class="w-5/12 {i % 2 === 0
                  ? 'pr-8 text-right'
                  : 'pl-8 text-left'}"
              >
                <Card
                  class="p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div class="text-2xl font-bold text-accent-600 mb-2">
                    {item.year}
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p class="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section
    class="py-20 bg-gradient-to-r from-accent-600 to-yellow-600 text-white"
  >
    <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">
        Ready to Start Your Success Story?
      </h2>
      <p class="text-xl mb-10 text-accent-100">
        Join our growing family of successful businesses. Let's create something
        extraordinary together.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          size="lg"
          class="bg-white text-accent-600 hover:bg-gray-50 px-8 py-4 text-lg shadow-2xl"
        >
          <a href="/request" class="flex items-center gap-2">
            Start Your Project
            <Globe size={20} />
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
        >
          <a href="/contact"> Get in Touch </a>
        </Button>
      </div>
    </div>
  </section>
</div>
