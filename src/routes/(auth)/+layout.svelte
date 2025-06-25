<!-- Auth layout - simple, clean, focused on login/signup -->
<div class="min-h-screen bg-gray-50 flex items-center justify-center">
  <div class="max-w-md w-full">
    <!-- Logo/Header -->
    <div class="text-center mb-8">
      <a href="/" class="text-2xl font-bold text-blue-600">TrueForm</a>
      <p class="text-gray-600 mt-2">Professional Web Development Platform</p>
    </div>

    <!-- Auth forms go here -->
    <slot />

    <!-- Back to home link -->
    <div class="text-center mt-6">
      <a href="/" class="text-sm text-gray-600 hover:text-gray-900">
        ← Back to homepage
      </a>
    </div>
  </div>
</div>
