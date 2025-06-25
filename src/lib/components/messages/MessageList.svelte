<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  export let threads: any[] = [];
  export let selectedThreadId: string | null = null;

  const dispatch = createEventDispatcher();

  function selectThread(threadId: string) {
    dispatch("select", threadId);
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  }

  function truncateMessage(message: string, maxLength: number = 60) {
    if (!message) return "";
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  }
</script>

<div class="h-full flex flex-col">
  <!-- Search Header -->
  <div class="p-4 border-b">
    <div class="relative">
      <input
        type="text"
        placeholder="Search conversations..."
        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <svg
        class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </div>

  <!-- Thread List -->
  <div class="flex-1 overflow-y-auto">
    {#each threads as thread}
      <button
        on:click={() => selectThread(thread.id)}
        class="w-full p-4 hover:bg-gray-50 border-b transition-colors text-left
          {selectedThreadId === thread.id
          ? 'bg-primary-50 border-l-4 border-l-primary-500'
          : ''}"
      >
        <div class="flex items-start gap-3">
          <!-- Company Avatar -->
          <div
            class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-primary-700 font-semibold">
              {thread.company.name.substring(0, 2).toUpperCase()}
            </span>
          </div>

          <!-- Thread Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-1">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 truncate">
                  {thread.company.name}
                </h3>
                <p class="text-sm text-gray-600">
                  {thread.title}
                </p>
              </div>
              <div class="flex flex-col items-end ml-2">
                <span class="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(thread.updated_at), {
                    addSuffix: true,
                  })}
                </span>
                {#if thread.unread_count > 0}
                  <span
                    class="mt-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-primary-500 rounded-full"
                  >
                    {thread.unread_count}
                  </span>
                {/if}
              </div>
            </div>

            <!-- Last Message Preview -->
            {#if thread.last_message}
              <div class="flex items-center gap-1 text-sm text-gray-600">
                <span class="font-medium">
                  {thread.last_message.sender.first_name}:
                </span>
                <span class="truncate">
                  {truncateMessage(thread.last_message.content)}
                </span>
              </div>
            {:else}
              <p class="text-sm text-gray-500 italic">No messages yet</p>
            {/if}

            <!-- Thread Type Badge -->
            <div class="mt-1">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                {thread.thread_type === 'support'
                  ? 'bg-yellow-100 text-yellow-800'
                  : ''}
                {thread.thread_type === 'billing'
                  ? 'bg-purple-100 text-purple-800'
                  : ''}
                {thread.thread_type === 'project'
                  ? 'bg-blue-100 text-blue-800'
                  : ''}
                {thread.thread_type === 'general'
                  ? 'bg-gray-100 text-gray-800'
                  : ''}
              "
              >
                {thread.thread_type}
              </span>
            </div>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>
