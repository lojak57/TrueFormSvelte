<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { supabase } from "$lib/supabase.client";
  import { formatDistanceToNow } from "date-fns";
  import MessageList from "$lib/components/messages/MessageList.svelte";
  import MessageThread from "$lib/components/messages/MessageThread.svelte";
  import type { RealtimeChannel } from "@supabase/supabase-js";

  interface Thread {
    id: string;
    company_id: string;
    title: string;
    thread_type: string;
    updated_at: string;
    is_archived: boolean;
    company: {
      id: string;
      name: string;
    };
    last_message?: {
      content: string;
      created_at: string;
      sender: {
        first_name: string;
        last_name: string;
      };
    };
    unread_count: number;
  }

  let threads: Thread[] = [];
  let selectedThreadId: string | null = null;
  let loading = true;
  let error = "";
  let subscription: RealtimeChannel;

  $: selectedThread = threads.find((t) => t.id === selectedThreadId);

  onMount(async () => {
    await loadThreads();
    setupRealtimeSubscription();
  });

  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  async function loadThreads() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Load all threads user has access to
      const { data: threadsData, error: threadsError } = await supabase
        .from("tf_message_threads")
        .select(
          `
          *,
          company:tf_companies(id, name),
          messages:tf_messages(
            content,
            created_at,
            sender_id,
            sender:tf_user_profiles!tf_messages_sender_id_fkey(
              first_name,
              last_name
            )
          )
        `
        )
        .eq("is_archived", false)
        .order("updated_at", { ascending: false });

      if (threadsError) throw threadsError;

      // Get unread counts
      const threadIds = threadsData?.map((t) => t.id) || [];
      const { data: unreadData } = await supabase.rpc(
        "get_unread_message_count",
        { user_uuid: user.user.id }
      );

      // Process threads with last message and unread count
      threads = (threadsData || []).map((thread) => {
        const messages = thread.messages || [];
        const lastMessage = messages.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
          ...thread,
          last_message: lastMessage,
          unread_count: 0, // TODO: Calculate per thread
        };
      });

      // Auto-select first thread on desktop
      if (threads.length > 0 && window.innerWidth >= 768) {
        selectedThreadId = threads[0].id;
      }
    } catch (err) {
      console.error("Error loading threads:", err);
      error = "Failed to load conversations";
    } finally {
      loading = false;
    }
  }

  function setupRealtimeSubscription() {
    subscription = supabase
      .channel("messages-hub")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tf_messages",
        },
        async (payload) => {
          // Reload threads when new message arrives
          await loadThreads();
        }
      )
      .subscribe();
  }

  function handleThreadSelect(threadId: string) {
    selectedThreadId = threadId;
  }

  function handleBackToList() {
    selectedThreadId = null;
  }

  async function createNewThread() {
    // TODO: Implement new thread creation
    console.log("Create new thread");
  }
</script>

<svelte:head>
  <title>Messages | TrueForm Admin</title>
</svelte:head>

<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="border-b bg-white px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
        <p class="text-sm text-gray-600 mt-1">
          All client conversations in one place
        </p>
      </div>
      <button on:click={createNewThread} class="tf-btn tf-btn-primary">
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Conversation
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="flex-1 flex overflow-hidden bg-gray-50">
    {#if loading}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="tf-spinner tf-spinner-lg mb-4" />
          <p class="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    {:else if error}
      <div class="flex-1 flex items-center justify-center">
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
          <button on:click={loadThreads} class="tf-btn tf-btn-secondary mt-4">
            Try Again
          </button>
        </div>
      </div>
    {:else if threads.length === 0}
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p class="text-gray-600 mb-4">Start a conversation with a client</p>
          <button on:click={createNewThread} class="tf-btn tf-btn-primary">
            Start First Conversation
          </button>
        </div>
      </div>
    {:else}
      <!-- Split View: Thread List + Active Thread -->
      <div class="flex-1 flex">
        <!-- Thread List (Always visible on desktop, hidden on mobile when thread selected) -->
        <div
          class="w-full md:w-96 border-r bg-white {selectedThreadId &&
            'hidden md:block'}"
        >
          <MessageList
            {threads}
            {selectedThreadId}
            on:select={(e) => handleThreadSelect(e.detail)}
          />
        </div>

        <!-- Active Thread -->
        {#if selectedThreadId && selectedThread}
          <div class="flex-1 flex flex-col bg-white">
            <MessageThread thread={selectedThread} on:back={handleBackToList} />
          </div>
        {:else}
          <!-- Empty State for Desktop -->
          <div
            class="hidden md:flex flex-1 items-center justify-center bg-gray-50"
          >
            <div class="text-center">
              <svg
                class="w-16 h-16 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p class="text-gray-600">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Ensure full height for messaging interface */
  :global(.admin-content) {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
