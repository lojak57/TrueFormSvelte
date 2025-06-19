<script lang="ts">
  import { slide } from "svelte/transition";
  import {
    Menu,
    X,
    ChevronDown,
    Zap,
    Users,
    Award,
    Phone,
  } from "lucide-svelte";
  import Button from "../Button.svelte";
  import type { NavItem } from "$lib/types";

  export let navigation: NavItem[];
  export let isMenuOpen = false;
  export let isServicesOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
    isServicesOpen = false;
  }

  function toggleServices() {
    isServicesOpen = !isServicesOpen;
  }

  const services = [
    { name: "Marketing Websites", href: "/services/marketing", icon: Zap },
    { name: "E-commerce Stores", href: "/services/ecommerce", icon: Award },
    { name: "Booking Systems", href: "/services/booking", icon: Users },
    { name: "Membership Sites", href: "/services/membership", icon: Award },
    { name: "Real Estate", href: "/services/realestate", icon: Zap },
    { name: "Educational", href: "/services/education", icon: Phone },
  ];
</script>

<!-- Mobile Menu Button -->
<div class="md:hidden">
  <button
    on:click={toggleMenu}
    class="text-gray-700 hover:text-accent-600 p-2 rounded-lg transition-colors duration-200"
  >
    {#if isMenuOpen}
      <X size={24} />
    {:else}
      <Menu size={24} />
    {/if}
  </button>
</div>

<!-- Mobile Menu -->
{#if isMenuOpen}
  <div
    class="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-40"
    transition:slide={{ duration: 300 }}
  >
    <div class="px-4 py-6 space-y-4">
      {#each navigation as item}
        {#if item.children}
          <div class="space-y-2">
            <button
              on:click={toggleServices}
              class="flex items-center justify-between w-full text-left text-gray-700 font-medium py-2"
            >
              {item.label}
              <ChevronDown
                size={16}
                class="transform transition-transform duration-200 {isServicesOpen
                  ? 'rotate-180'
                  : ''}"
              />
            </button>

            {#if isServicesOpen}
              <div class="pl-4 space-y-2" transition:slide={{ duration: 200 }}>
                {#each services as service}
                  <a
                    href={service.href}
                    class="flex items-center py-2 text-sm text-gray-600 hover:text-accent-600 transition-colors duration-200"
                    on:click={closeMenu}
                  >
                    <svelte:component
                      this={service.icon}
                      size={16}
                      class="mr-3 text-accent-600"
                    />
                    {service.name}
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        {:else}
          <a
            href={item.href}
            class="block text-gray-700 hover:text-accent-600 font-medium py-2 transition-colors duration-200
              {item.isActive ? 'text-accent-600' : ''}"
            on:click={closeMenu}
          >
            {item.label}
          </a>
        {/if}
      {/each}

      <!-- Mobile CTA -->
      <div class="pt-4 border-t border-gray-100 space-y-3">
        <Button variant="outline" size="sm" class="w-full justify-center">
          <a href="/admin/opportunities"> Admin Dashboard </a>
        </Button>
        <Button
          variant="accent"
          size="sm"
          class="w-full justify-center shadow-lg"
        >
          <a href="/request" class="flex items-center gap-2">
            Get Started
            <Zap size={16} />
          </a>
        </Button>
      </div>
    </div>
  </div>
{/if}
