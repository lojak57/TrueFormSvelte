<script lang="ts">
  import "../app.css";
  import "$lib/styles/globals.css";
  import "$lib/styles/animations.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { userSession, isAuthenticated } from "$lib/stores/user";
  import {
    themeUtils,
    currentTheme,
    effectiveThemeMode,
  } from "$lib/stores/theme";
  import Header from "$lib/components/ui/Header.svelte";

  export let data;

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        userSession.set({
          id: session.user.id,
          email: session.user.email || "",
          role: session.user.user_metadata?.role,
          organization_id: session.user.user_metadata?.organization_id,
        });
        isAuthenticated.set(true);
      } else {
        userSession.set(null);
        isAuthenticated.set(false);
      }
    });

    // Apply theme on mount
    currentTheme.subscribe((theme) => {
      effectiveThemeMode.subscribe((mode) => {
        themeUtils.applyTheme(theme, mode);
      });
    });

    return () => subscription.unsubscribe();
  });

</script>

<!-- Conditional layout based on subdomain and admin routes -->
{#if data?.isCRMSubdomain || $page.url.pathname.startsWith('/admin')}
  <!-- CRM/Admin: No marketing layout -->
  <slot />
{:else}
  <!-- Marketing site: Full layout -->
  <div class="min-h-screen bg-gray-50">
    <Header />

    <main class="relative">
      <slot />
    </main>
    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Logo & Company Info -->
          <div class="md:col-span-2">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12">
                <img
                  src="/logo.svg"
                  alt="TrueForm Logo"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="ml-3">
                <div class="text-xl font-bold">TrueForm</div>
                <div class="text-sm text-gray-400 italic">
                  Excellence Refined.
                </div>
              </div>
            </div>
            <p class="text-gray-400 mb-4 max-w-md">
              Transform your business with professional website development.
              From concept to completion, we deliver conversion-optimized
              websites that perfectly represent your brand.
            </p>
            <div class="flex space-x-4">
              <a
                href="https://x.com/TrueFormApps"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on X"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                  ><path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  /></svg
                >
              </a>
              <a
                href="https://facebook.com/trueform"
                class="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                  ><path
                    d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                  /></svg
                >
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4"
            >
              Quick Links
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="/"
                  class="text-gray-300 hover:text-white transition-colors duration-200"
                  >Home</a
                >
              </li>
              <li>
                <a
                  href="/request"
                  class="text-gray-300 hover:text-white transition-colors duration-200"
                  >Get Started</a
                >
              </li>
              <li>
                <a
                  href="/about"
                  class="text-gray-300 hover:text-white transition-colors duration-200"
                  >About Us</a
                >
              </li>
              <li>
                <a
                  href="/contact"
                  class="text-gray-300 hover:text-white transition-colors duration-200"
                  >Contact</a
                >
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3
              class="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4"
            >
              Contact
            </h3>
            <ul class="space-y-2">
              <li class="text-gray-300">(720) 993-6562</li>
              <li>
                <a
                  href="mailto:mitch.mechelay@true-form-apps.com"
                  class="text-gray-300 hover:text-white transition-colors duration-200"
                  >mitch.mechelay@true-form-apps.com</a
                >
              </li>
              <li class="text-gray-300">San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div
          class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p class="text-gray-400 text-sm">
            © 2024 TrueForm. All rights reserved. Excellence Refined.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >Privacy Policy</a
            >
            <a
              href="/terms"
              class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >Terms of Service</a
            >
          </div>
        </div>
      </div>
    </footer>
  </div>
{/if}

<style>
  :global(html) {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
    font-size: 18px;
    line-height: 1.6;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

</style>
