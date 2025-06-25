import { derived, writable, type Readable } from "svelte/store";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface ApiStoreOptions {
  initialData?: any;
  errorMessage?: string;
  retryCount?: number;
}

/**
 * Creates a reactive store for API requests with built-in loading, error, and retry logic
 */
export function createApiStore<T>(
  fetcher: () => Promise<T>,
  options: ApiStoreOptions = {}
) {
  const {
    initialData = null,
    errorMessage = "Failed to load data",
    retryCount = 3,
  } = options;

  // Internal state
  const state = writable<ApiState<T>>({
    data: initialData,
    loading: true,
    error: null,
  });

  let currentRetry = 0;

  async function execute(retryAttempt = 0): Promise<void> {
    if (retryAttempt === 0) {
      state.update((s) => ({ ...s, loading: true, error: null }));
    }

    try {
      const result = await fetcher();
      state.set({
        data: result,
        loading: false,
        error: null,
      });
      currentRetry = 0; // Reset retry counter on success
    } catch (err) {
      console.error("API request failed:", err);

      if (retryAttempt < retryCount) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryAttempt) * 1000;
        setTimeout(() => execute(retryAttempt + 1), delay);
        return;
      }

      // All retries exhausted
      state.set({
        data: initialData,
        loading: false,
        error: err instanceof Error ? err.message : errorMessage,
      });
    }
  }

  async function refresh(): Promise<void> {
    await execute(0);
  }

  function reset(): void {
    state.set({
      data: initialData,
      loading: false,
      error: null,
    });
  }

  // Derived stores for convenience
  const data: Readable<T | null> = derived(state, ($state) => $state.data);
  const loading: Readable<boolean> = derived(state, ($state) => $state.loading);
  const error: Readable<string | null> = derived(
    state,
    ($state) => $state.error
  );
  const isError: Readable<boolean> = derived(state, ($state) => !!$state.error);
  const isEmpty: Readable<boolean> = derived(
    state,
    ($state) =>
      !$state.loading &&
      !$state.error &&
      (!$state.data || (Array.isArray($state.data) && $state.data.length === 0))
  );

  // Auto-execute on creation
  execute();

  return {
    // Main store
    subscribe: state.subscribe,

    // Derived stores
    data,
    loading,
    error,
    isError,
    isEmpty,

    // Actions
    refresh,
    reset,
    execute: () => execute(0),
  };
}

/**
 * Creates an API store for fetching from a specific endpoint
 */
export function createFetchStore<T>(
  url: string,
  options: RequestInit & ApiStoreOptions = {}
) {
  const { errorMessage, retryCount, initialData, ...fetchOptions } = options;

  return createApiStore<T>(
    async () => {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    { errorMessage, retryCount, initialData }
  );
}

/**
 * Creates an API store for mutations (POST, PUT, DELETE)
 */
export function createMutationStore<TRequest, TResponse>(
  fetcher: (data: TRequest) => Promise<TResponse>,
  options: ApiStoreOptions = {}
) {
  const store = writable<ApiState<TResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  async function mutate(data: TRequest): Promise<TResponse | null> {
    store.update((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await fetcher(data);
      store.update((s) => ({ ...s, data: result, loading: false }));
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Mutation failed";
      store.update((s) => ({
        ...s,
        loading: false,
        error: errorMessage,
      }));
      console.error("Mutation failed:", err);
      return null;
    }
  }

  function reset(): void {
    store.set({
      data: null,
      loading: false,
      error: null,
    });
  }

  // Derived stores
  const data: Readable<TResponse | null> = derived(
    store,
    ($store) => $store.data
  );
  const loading: Readable<boolean> = derived(store, ($store) => $store.loading);
  const error: Readable<string | null> = derived(
    store,
    ($store) => $store.error
  );

  return {
    subscribe: store.subscribe,
    data,
    loading,
    error,
    mutate,
    reset,
  };
}
