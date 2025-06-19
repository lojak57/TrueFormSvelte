<script lang="ts">
  import { page } from "$app/stores";
  import { slide } from "svelte/transition";
  import { ChevronDown, Zap, Users, Award, Phone } from "lucide-svelte";
  import type { NavItem } from "$lib/types";

  export let navigation: NavItem[];
  export let isServicesOpen = false;

  $: currentPath = $page.url.pathname;

  function toggleServices() {
    isServicesOpen = !isServicesOpen;
  }

  function closeServices() {
    isServicesOpen = false;
  }

  const services = [
    {
      name: "Marketing Websites",
      href: "/services/marketing",
      icon: Zap,
      description: "Landing pages & brand sites",
    },
    {
      name: "E-commerce Stores",
      href: "/services/ecommerce",
      icon: Award,
      description: "Like our flagship vcsews.com",
    },
    {
      name: "Booking Systems",
      href: "/services/booking",
      icon: Users,
      description: "Appointments & scheduling",
    },
    {
      name: "Membership Sites",
      href: "/services/membership",
      icon: Award,
      description: "Private communities",
    },
    {
      name: "Real Estate",
      href: "/services/realestate",
      icon: Zap,
      description: "Property platforms",
    },
    {
      name: "Educational",
      href: "/services/education",
      icon: Phone,
      description: "Learning management",
    },
  ];
</script>

<nav class="hidden md:flex items-center space-x-8">
  {#each navigation as item}
    {#if item.children}
      <div class="relative">
        <button
          on:click={toggleServices}
          class="flex items-center text-gray-700 hover:text-accent-600 px-3 py-2 text-sm font-medium transition-colors duration-200 group"
        >
          {item.label}
          <ChevronDown
            size={16}
            class="ml-1 transform transition-transform duration-200 {isServicesOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>

        {#if isServicesOpen}
          <div
            class="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50"
            transition:slide={{ duration: 200 }}
          >
            {#each services as service}
              <a
                href={service.href}
                class="flex items-start px-6 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                on:click={closeServices}
              >
                <div
                  class="flex-shrink-0 w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors duration-200"
                >
                  <svelte:component
                    this={service.icon}
                    size={20}
                    class="text-accent-600"
                  />
                </div>
                <div class="ml-4">
                  <div
                    class="text-sm font-semibold text-gray-900 group-hover:text-accent-600 transition-colors duration-200"
                  >
                    {service.name}
                  </div>
                  <div class="text-xs text-gray-600 mt-1">
                    {service.description}
                  </div>
                </div>
              </a>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <a
        href={item.href}
        class="text-gray-700 hover:text-accent-600 px-3 py-2 text-sm font-medium transition-all duration-200 relative group
          {item.isActive ? 'text-accent-600' : ''}"
      >
        {item.label}
        {#if item.isActive}
          <div
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600 rounded-full"
          />
        {/if}
        <div
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
        />
      </a>
    {/if}
  {/each}
</nav>
