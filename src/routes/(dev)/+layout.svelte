<!-- Development layout - only visible in dev mode -->
<div class="min-h-screen bg-yellow-50">
  <!-- Dev warning banner -->
  <div class="bg-yellow-200 border-b border-yellow-300 px-4 py-2">
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center">
        <span class="text-yellow-800 font-medium text-sm"
          >🚧 Development Mode</span
        >
      </div>
      <div class="flex items-center space-x-4">
        <a
          href="/design-system"
          class="text-yellow-700 hover:text-yellow-900 text-sm">Design System</a
        >
        <a
          href="/business-demo"
          class="text-yellow-700 hover:text-yellow-900 text-sm">Business Demo</a
        >
        <a href="/test-db" class="text-yellow-700 hover:text-yellow-900 text-sm"
          >Test DB</a
        >
        <a href="/" class="text-yellow-700 hover:text-yellow-900 text-sm"
          >← Back to App</a
        >
      </div>
    </div>
  </div>

  <main>
    <slot />
  </main>
</div>
