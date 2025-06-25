<script lang="ts">
  import "../../../app.css";
  import "$lib/styles/globals.css";
  import "$lib/styles/essential-animations.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { userSession, isAuthenticated } from "$lib/stores/user";
  import {
    themeUtils,
    currentTheme,
    effectiveThemeMode,
  } from "$lib/stores/theme";
  import AdminSidebar from "$lib/components/admin/AdminSidebar.svelte";

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

<!-- Admin Layout: Sidebar + Content -->
<div class="admin-layout">
  <!-- Sidebar Navigation -->
  <AdminSidebar />

  <!-- Main Content Area -->
  <div class="admin-content">
    <main class="admin-main">
      <slot />
    </main>
  </div>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }

  .admin-content {
    flex: 1;
    margin-left: 260px; /* Width of sidebar */
    display: flex;
    flex-direction: column;
  }

  .admin-main {
    flex: 1;
    padding: 2rem;
    max-width: 1400px;
    width: 100%;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .admin-content {
      margin-left: 240px;
    }
  }

  @media (max-width: 768px) {
    .admin-content {
      margin-left: 0;
    }

    .admin-main {
      padding: 1rem;
    }
  }
</style>
