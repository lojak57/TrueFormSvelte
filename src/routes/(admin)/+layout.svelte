<script lang="ts">
  import AdminSidebar from "$lib/components/admin/AdminSidebar.svelte";
  import { Menu, X } from "lucide-svelte";
  
  let sidebarOpen = false;
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }
  
  function closeSidebar() {
    sidebarOpen = false;
  }
</script>

<!-- Admin layout with modern navigation -->
<div class="min-h-screen bg-gray-50">
  <!-- Mobile header -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between px-4 py-3">
      <button
        on:click={toggleSidebar}
        class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {#if sidebarOpen}
          <X size={24} />
        {:else}
          <Menu size={24} />
        {/if}
      </button>
      
      <div class="flex items-center gap-2">
        <img src="/logo.svg" alt="TrueForm" class="h-8 w-8" />
        <span class="font-bold text-lg">TrueForm</span>
      </div>
      
      <div class="w-10" /> <!-- Spacer for centering -->
    </div>
  </div>
  
  <!-- Backdrop for mobile -->
  {#if sidebarOpen}
    <div
      class="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
      on:click={closeSidebar}
    />
  {/if}
  
  <div class="flex h-screen">
    <!-- Admin Sidebar -->
    <div class="hidden md:block">
      <AdminSidebar />
    </div>
    
    <!-- Mobile Sidebar -->
    <div class="md:hidden">
      <div class="fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
        <AdminSidebar />
      </div>
    </div>

    <!-- Main admin content -->
    <div class="flex flex-col flex-1">
      <main class="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0 md:ml-[260px]">
        <slot />
      </main>
    </div>
  </div>
</div>

<style>
  /* Smooth transitions for mobile sidebar */
  @media (max-width: 768px) {
    :global(.admin-sidebar) {
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }
  }
</style>
