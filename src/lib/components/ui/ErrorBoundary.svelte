<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { handleError } from "$lib/services/errorService";
  import { AlertCircle, RefreshCw, Home } from "lucide-svelte";
  import Button from "./Button.svelte";

  export let fallback: "inline" | "page" | "component" = "component";
  export let showRetry = true;
  export let showHome = false;
  export let context = "Unknown Component";

  const dispatch = createEventDispatcher();

  let hasError = false;
  let error: Error | null = null;

  // Error catching mechanism
  onMount(() => {
    const originalConsoleError = console.error;

    // Override console.error to catch unhandled errors
    console.error = (...args) => {
      originalConsoleError(...args);

      // Check if this looks like a component error
      const errorMessage = args.join(" ");
      if (
        errorMessage.includes("Error") ||
        errorMessage.includes("TypeError")
      ) {
        catchError(new Error(errorMessage));
      }
    };

    // Listen for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      catchError(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason))
      );
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  });

  function catchError(err: Error) {
    error = err;
    hasError = true;

    // Handle the error through our error service
    handleError(err, context);

    // Dispatch error event for parent components
    dispatch("error", { error: err, context });
  }

  function retry() {
    hasError = false;
    error = null;
    dispatch("retry");
  }

  function goHome() {
    window.location.href = "/";
  }

  // Expose error catching method for child components
  export function handleChildError(err: Error) {
    catchError(err);
  }
</script>

{#if hasError}
  {#if fallback === "page"}
    <!-- Full page error -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div
          class="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
        >
          <AlertCircle size={32} class="text-red-600" />
        </div>

        <h1 class="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h1>

        <p class="text-gray-600 mb-6">
          We encountered an unexpected error. This has been reported and we're
          working to fix it.
        </p>

        {#if error}
          <details class="text-left mb-6">
            <summary
              class="text-sm text-gray-500 cursor-pointer hover:text-gray-700"
            >
              Technical Details
            </summary>
            <pre
              class="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto text-gray-700">
              {error.message}
              {#if error.stack}
                {"\n\n" + error.stack}
              {/if}
            </pre>
          </details>
        {/if}

        <div class="flex gap-3 justify-center">
          {#if showRetry}
            <Button
              variant="accent"
              on:click={retry}
              class="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
          {/if}

          {#if showHome}
            <Button
              variant="outline"
              on:click={goHome}
              class="flex items-center gap-2"
            >
              <Home size={16} />
              Go Home
            </Button>
          {/if}
        </div>
      </div>
    </div>
  {:else if fallback === "inline"}
    <!-- Inline error -->
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-start gap-3">
        <AlertCircle size={20} class="text-red-600 flex-shrink-0 mt-0.5" />
        <div class="flex-1">
          <h3 class="font-medium text-red-800 mb-1">
            Error in {context}
          </h3>
          <p class="text-red-700 text-sm mb-3">
            {error?.message ||
              "An unexpected error occurred in this component."}
          </p>
          {#if showRetry}
            <Button
              size="sm"
              variant="outline"
              on:click={retry}
              class="flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Retry
            </Button>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- Component-level error -->
    <div
      class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
    >
      <div
        class="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"
      >
        <AlertCircle size={24} class="text-red-600" />
      </div>

      <h3 class="font-medium text-gray-900 mb-2">Component Error</h3>

      <p class="text-gray-600 text-sm mb-4">
        This component encountered an error and cannot be displayed.
      </p>

      {#if showRetry}
        <Button
          size="sm"
          variant="outline"
          on:click={retry}
          class="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Retry
        </Button>
      {/if}
    </div>
  {/if}
{:else}
  <!-- Render children when no error -->
  <slot />
{/if}
