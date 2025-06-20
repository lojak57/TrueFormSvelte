<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import { Mail, Lock } from "lucide-svelte";
  import { loginUser, signupUser } from "$lib/services/authService";
  import type { LoginCredentials } from "$lib/types";

  let credentials: LoginCredentials = {
    email: "",
    password: "",
  };
  let loading = false;
  let error = "";
  let isSignupMode = false;

  async function handleSubmit() {
    console.log("Form submitted!", { credentials, isSignupMode });
    loading = true;
    error = "";

    try {
      console.log("Calling auth service...");
      const result = isSignupMode
        ? await signupUser(credentials)
        : await loginUser(credentials);

      console.log("Auth result:", result);

      if (result.error) {
        console.error("Auth error:", result.error);
        error = result.error;
      } else if (result.user) {
        console.log("Login successful, redirecting...");
        // Login successful - redirect immediately
        setTimeout(() => {
          if (window.location.hostname.startsWith('crm.') || window.location.hostname === 'localhost') {
            // Force a full page reload to ensure cookies are set properly
            window.location.href = "/admin/dashboard";
          } else {
            // External redirect for different domain
            window.location.href = "https://crm.true-form-apps.com/admin/dashboard";
          }
        }, 500); // Shorter delay
      } else if (isSignupMode) {
        // Signup successful - show confirmation message
        error =
          "Account created! Please check your email for the confirmation link.";
      }
    } catch (err) {
      console.error("Caught error:", err);
      error = "An unexpected error occurred. Please try again.";
    } finally {
      loading = false;
    }
  }

  function toggleMode() {
    isSignupMode = !isSignupMode;
    error = "";
  }
</script>

<svelte:head>
  <title>{isSignupMode ? "Sign Up" : "Login"} | TrueForm Admin</title>
</svelte:head>

<div
  class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6"
>
  <Card class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">
        {isSignupMode ? "Create Account" : "Welcome Back"}
      </h1>
      <p class="text-gray-600">
        {isSignupMode
          ? "Create your TrueForm admin account"
          : "Sign in to your TrueForm admin account"}
      </p>
    </div>

    {#if error}
      <div
        class="mb-6 p-4 rounded-lg {error.includes('created') ||
        error.includes('confirmation')
          ? 'bg-green-50 border border-green-200'
          : 'bg-red-50 border border-red-200'}"
      >
        <p
          class="text-sm {error.includes('created') ||
          error.includes('confirmation')
            ? 'text-green-700'
            : 'text-red-700'}"
        >
          {error}
        </p>
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div class="relative">
          <Mail
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            bind:value={credentials.email}
            required
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            placeholder="you@company.com"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div class="relative">
          <Lock
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="password"
            bind:value={credentials.password}
            required
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>
        {#if isSignupMode}
          <p class="text-xs text-gray-500 mt-1">
            Password must be at least 8 characters with uppercase, lowercase,
            and number
          </p>
        {/if}
      </div>

      <div class="space-y-4">
        <button
          type="submit"
          class="w-full py-3 px-4 bg-accent-600 text-white rounded-lg hover:bg-accent-700 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading
            ? isSignupMode
              ? "Creating Account..."
              : "Signing In..."
            : isSignupMode
            ? "Create Account"
            : "Sign In"}
        </button>

        <Button
          type="button"
          variant="ghost"
          size="lg"
          class="w-full"
          disabled={loading}
          on:click={toggleMode}
        >
          {isSignupMode
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </Button>
      </div>
    </form>

    {#if !isSignupMode}
      <div class="mt-6 text-center">
        <a
          href="/reset-password"
          class="text-sm text-accent-600 hover:text-accent-700 transition-colors"
        >
          Forgot your password?
        </a>
      </div>
    {/if}
  </Card>
</div>
