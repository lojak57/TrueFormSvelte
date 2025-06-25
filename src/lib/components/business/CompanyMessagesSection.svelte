<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { supabase } from "$lib/supabase.client";
  import MessageThread from "../messages/MessageThread.svelte";
  import type { RealtimeChannel } from "@supabase/supabase-js";

  export let company: any;

  let thread: any = null;
  let loading = true;
  let error = "";
  let subscription: RealtimeChannel;

  onMount(async () => {
    await loadOrCreateThread();
  });

  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  async function loadOrCreateThread() {
    try {
      // Try to find existing general thread for this company
      const { data: existingThread, error: fetchError } = await supabase
        .from("tf_message_threads")
        .select("*")
        .eq("company_id", company.id)
        .eq("thread_type", "general")
        .eq("is_archived", false)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      if (existingThread) {
        thread = existingThread;
      } else {
        // Create new thread if none exists
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: newThread, error: createError } = await supabase
          .from("tf_message_threads")
          .insert({
            company_id: company.id,
            thread_type: "general",
            title: "General Discussion",
            description: `General communication with ${company.name}`,
            created_by: user.id,
          })
          .select()
          .single();

        if (createError) throw createError;

        thread = newThread;
      }

      // Add company info to thread
      thread.company = company;
    } catch (err) {
      console.error("Error loading thread:", err);
      error = "Failed to load messages";
    } finally {
      loading = false;
    }
  }

  function handleThreadUpdate() {
    // Refresh thread if needed
  }
</script>

<div class="tf-card">
  <div class="tf-card-header flex items-center justify-between">
    <div>
      <h3 class="tf-heading-3">Messages</h3>
      <p class="text-sm text-gray-600 mt-1">
        Direct communication with {company.name}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-gray-500">
        <svg
          class="w-4 h-4 inline-block mr-1 text-green-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
        </svg>
        Real-time chat
      </span>
    </div>
  </div>

  <div class="tf-card-body p-0">
    {#if loading}
      <div class="flex items-center justify-center h-96 bg-gray-50">
        <div class="text-center">
          <div class="tf-spinner tf-spinner-lg mb-4" />
          <p class="text-gray-600">Loading messages...</p>
        </div>
      </div>
    {:else if error}
      <div class="flex items-center justify-center h-96 bg-gray-50">
        <div class="text-center">
          <svg
            class="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-red-600">{error}</p>
          <button
            on:click={loadOrCreateThread}
            class="tf-btn tf-btn-secondary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    {:else if thread}
      <!-- Embedded Message Thread -->
      <div
        class="h-[600px] flex flex-col bg-gray-50 rounded-b-lg overflow-hidden"
      >
        <MessageThread
          {thread}
          embedded={true}
          on:update={handleThreadUpdate}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  /* Make the messages section full height on larger screens */
  @media (min-width: 1024px) {
    :global(
        .company-detail > *:has(.tf-card:has(> .tf-card-body > div:last-child))
      ) {
      position: sticky;
      top: 1rem;
      align-self: flex-start;
    }
  }
</style>
