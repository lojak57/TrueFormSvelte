<script lang="ts">
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import Logo from "./navigation/Logo.svelte";
  import DesktopNav from "./navigation/DesktopNav.svelte";
  import MobileNav from "./navigation/MobileNav.svelte";
  import CTAButtons from "./navigation/CTAButtons.svelte";
  import type { NavItem } from "$lib/types";

  let isMenuOpen = false;
  let isServicesOpen = false;

  $: currentPath = $page.url.pathname;

  // Navigation configuration using our centralized types
  $: navigation = [
    {
      id: "home",
      label: "Home",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      id: "services",
      label: "Services",
      href: "#",
      children: [], // Services dropdown handled in DesktopNav
      isActive: false,
    },
    {
      id: "about",
      label: "About",
      href: "/about",
      isActive: currentPath === "/about",
    },
    {
      id: "contact",
      label: "Contact",
      href: "/contact",
      isActive: currentPath === "/contact",
    },
  ] satisfies NavItem[];

  // Close dropdowns when clicking outside
  function closeDropdowns() {
    isServicesOpen = false;
  }
</script>

<!-- Main Header -->
<header
  class="relative bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50"
>
  <div
    class="absolute inset-0 bg-gradient-to-r from-white via-gray-50 to-white opacity-60"
  />

  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4 md:py-6">
      <!-- Logo -->
      <Logo />

      <!-- Desktop Navigation -->
      <DesktopNav {navigation} bind:isServicesOpen />

      <!-- CTA Buttons -->
      <CTAButtons />

      <!-- Mobile Navigation -->
      <MobileNav {navigation} bind:isMenuOpen bind:isServicesOpen />
    </div>
  </div>
</header>

<!-- Click outside to close dropdown -->
{#if isServicesOpen}
  <button
    class="fixed inset-0 z-30 bg-transparent border-none cursor-default"
    on:click={closeDropdowns}
    on:keydown={(e) => e.key === "Escape" && closeDropdowns()}
    aria-label="Close services menu"
    transition:fade={{ duration: 100 }}
  />
{/if}
