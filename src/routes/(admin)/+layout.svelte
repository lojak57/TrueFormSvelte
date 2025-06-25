<script lang="ts">
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<!-- Admin layout with expanded navigation -->
<div class="min-h-screen bg-gray-50">
  <div class="flex h-screen">
    <!-- Admin Sidebar -->
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div class="flex flex-col flex-grow pt-5 overflow-y-auto bg-indigo-700">
        <div class="flex items-center flex-shrink-0 px-4">
          <a href="/" class="text-xl font-bold text-white">TrueForm Admin</a>
        </div>

        <div class="mt-5 flex-1 flex flex-col">
          <nav class="flex-1 px-2 space-y-1">
            <!-- Admin Navigation -->
            <a
              href="/admin/dashboard"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Dashboard
            </a>
            <a
              href="/admin/companies"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Companies
            </a>
            <a
              href="/admin/contacts"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Contacts
            </a>
            <a
              href="/admin/projects"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Projects
            </a>
            <a
              href="/admin/proposals"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Proposals
            </a>
            <a
              href="/admin/opportunities"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Opportunities
            </a>
            <a
              href="/admin/invoices"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Invoices
            </a>
            <a
              href="/admin/verticals"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Verticals
            </a>
            <a
              href="/admin/settings"
              class="text-indigo-100 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              Settings
            </a>

            <!-- App link -->
            <div class="pt-4 mt-4 border-t border-indigo-800">
              <a
                href="/companies"
                class="text-indigo-200 hover:bg-indigo-600 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
              >
                ← Back to App
              </a>
            </div>
          </nav>
        </div>

        <!-- Admin user menu -->
        <div class="flex-shrink-0 flex border-t border-indigo-800 p-4">
          <div class="flex-shrink-0 w-full group block">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-white">{data.user.email}</p>
                <p class="text-xs font-medium text-indigo-300 capitalize">
                  {data.user.role} Admin
                </p>
              </div>
              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  class="text-xs text-indigo-300 hover:text-white"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main admin content -->
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <slot />
      </main>
    </div>
  </div>
</div>
