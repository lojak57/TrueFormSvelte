<script lang="ts">
  import { page } from '$app/stores';
  import { userSession } from '$lib/stores/user';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import { 
    LayoutDashboard, 
    Briefcase, 
    FileText, 
    Receipt, 
    Settings, 
    LogOut,
    Menu
  } from 'lucide-svelte';

  let sidebarOpen = false;

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', href: '/admin/opportunities', icon: Briefcase },
    { name: 'Proposals', href: '/admin/proposals', icon: FileText },
    { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/login');
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
</script>

<div class="flex h-screen bg-gray-50">
  <!-- Sidebar -->
  <aside class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform 
    {sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
    transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
    
    <!-- Logo -->
    <div class="flex items-center justify-center h-16 px-6 border-b border-gray-200">
      <h1 class="text-xl font-semibold text-gray-900">True-Form</h1>
    </div>

    <!-- Navigation -->
    <nav class="mt-6 px-3">
      <div class="space-y-1">
        {#each navigation as item}
          <a
            href={item.href}
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
              {$page.url.pathname === item.href 
                ? 'bg-accent-50 text-accent-700 border-r-2 border-accent-600' 
                : 'text-gray-700 hover:bg-gray-50'}"
          >
            <svelte:component this={item.icon} size={20} class="mr-3" />
            {item.name}
          </a>
        {/each}
      </div>
    </nav>

    <!-- User info -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      {#if $userSession}
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <p class="font-medium text-gray-900">{$userSession.email}</p>
          </div>
          <Button variant="ghost" size="sm" on:click={handleLogout}>
            <LogOut size={16} />
          </Button>
        </div>
      {/if}
    </div>
  </aside>

  <!-- Mobile sidebar overlay -->
  {#if sidebarOpen}
    <div class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" on:click={toggleSidebar}></div>
  {/if}

  <!-- Main content -->
  <div class="flex-1 flex flex-col lg:ml-0">
    <!-- Top bar -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="sm" class="lg:hidden" on:click={toggleSidebar}>
            <Menu size={20} />
          </Button>
          <h2 class="text-2xl font-semibold text-gray-900 capitalize">
            {$page.url.pathname.split('/').pop() || 'Dashboard'}
          </h2>
        </div>

        <div class="flex items-center gap-4">
          {#if $userSession}
            <span class="text-sm text-gray-600">Welcome back, {$userSession.email}</span>
          {/if}
        </div>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-auto p-6">
      <slot />
    </main>
  </div>
</div> 