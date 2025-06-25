<script lang="ts">
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<!-- App layout with sidebar navigation -->
<div class="min-h-screen bg-gray-50">
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div
        class="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r"
      >
        <div class="flex items-center flex-shrink-0 px-4">
          <a href="/" class="text-xl font-bold text-blue-600">TrueForm</a>
        </div>

        <div class="mt-5 flex-1 flex flex-col">
          <nav class="flex-1 px-2 space-y-1">
            <!-- App Navigation -->
            <a
              href="/companies"
              class="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Companies
            </a>
            <a
              href="/contacts"
              class="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Contacts
            </a>
            <a
              href="/projects"
              class="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Projects
            </a>
            <a
              href="/crm"
              class="text-gray-700 hover:bg-gray-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              CRM Pipeline
            </a>

            <!-- Admin link if user is admin -->
            {#if data.user.role === "admin" || data.user.role === "super_admin"}
              <div class="pt-4 mt-4 border-t border-gray-200">
                <a
                  href="/admin/dashboard"
                  class="text-indigo-600 hover:bg-indigo-50 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  Admin Panel
                </a>
              </div>
            {/if}
          </nav>
        </div>

        <!-- User menu at bottom -->
        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex-shrink-0 w-full group block">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700">
                  {data.user.email}
                </p>
                <p class="text-xs font-medium text-gray-500 capitalize">
                  {data.user.role}
                </p>
              </div>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  class="text-xs text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <!-- Top bar for mobile -->
      <div class="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
        <button
          type="button"
          class="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
        >
          <!-- Mobile menu button -->
          <span class="sr-only">Open sidebar</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <slot />
      </main>
    </div>
  </div>
</div>
