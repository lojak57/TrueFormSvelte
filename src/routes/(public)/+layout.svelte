<script lang="ts">
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<!-- Public layout with marketing header/footer -->
<div class="min-h-screen flex flex-col">
  <!-- Public header (marketing style) -->
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-blue-600">TrueForm</a>
        </div>
        <div class="flex items-center space-x-4">
          <a href="/about" class="text-gray-600 hover:text-gray-900">About</a>
          <a href="/services" class="text-gray-600 hover:text-gray-900"
            >Services</a
          >
          <a href="/contact" class="text-gray-600 hover:text-gray-900"
            >Contact</a
          >
          {#if data.user}
            <a
              href="/admin/dashboard"
              class="bg-blue-600 text-white px-4 py-2 rounded-md">Dashboard</a
            >
          {:else}
            <a href="/login" class="bg-blue-600 text-white px-4 py-2 rounded-md"
              >Login</a
            >
          {/if}
        </div>
      </div>
    </nav>
  </header>

  <main class="flex-grow">
    <slot />
  </main>

  <!-- Simple footer -->
  <footer class="bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center text-gray-600">
        <p>&copy; 2025 TrueForm. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>
