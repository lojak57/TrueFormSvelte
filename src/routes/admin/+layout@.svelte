<script lang="ts">
  import "../../app.css";
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

  export let data = undefined;

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

<!-- Admin Layout: Clean, focused on productivity -->
<div class="min-h-screen bg-gray-100 admin-layout">
  <!-- Admin Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Admin Logo & Nav -->
        <div class="flex items-center">
          <a href="/admin/dashboard" class="flex items-center">
            <div class="w-8 h-8">
              <img
                src="/logo.svg"
                alt="TrueForm Admin"
                class="w-full h-full object-contain"
              />
            </div>
            <div class="ml-3">
              <div class="text-lg font-bold text-gray-900">TrueForm Admin</div>
            </div>
          </a>
        </div>

        <!-- Admin Actions -->
        <div class="flex items-center space-x-4">
          <a
            href="https://true-form-apps.com"
            target="_blank"
            class="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            View Site
          </a>
          <a
            href="/auth/signout"
            class="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Admin Content -->
  <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <slot />
  </main>
</div>

<style>
  .admin-layout {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }
</style>