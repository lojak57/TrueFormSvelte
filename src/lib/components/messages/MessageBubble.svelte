<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatDistanceToNow } from "date-fns";

  export let message: any;
  export let isOwn: boolean = false;
  export let showAvatar: boolean = true;

  const dispatch = createEventDispatcher();

  let showReactionPicker = false;
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "👎"];

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  }

  function handleReaction(reaction: string) {
    dispatch("reaction", { messageId: message.id, reaction });
    showReactionPicker = false;
  }

  function toggleReactionPicker() {
    showReactionPicker = !showReactionPicker;
  }

  // Group reactions by type
  function groupReactions(reactions: any[]) {
    const grouped: Record<string, number> = {};
    reactions?.forEach((r) => {
      grouped[r.reaction_type] = (grouped[r.reaction_type] || 0) + 1;
    });
    return Object.entries(grouped);
  }

  $: groupedReactions = groupReactions(message.reactions);
</script>

<div class="flex {isOwn ? 'justify-end' : 'justify-start'} group">
  <div
    class="flex {isOwn
      ? 'flex-row-reverse'
      : 'flex-row'} items-end gap-2 max-w-[70%]"
  >
    <!-- Avatar -->
    {#if !isOwn && showAvatar}
      <div
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        {message.sender.is_client ? 'bg-green-100' : 'bg-primary-100'}"
      >
        {#if message.sender.avatar_url}
          <img
            src={message.sender.avatar_url}
            alt="{message.sender.first_name} {message.sender.last_name}"
            class="w-full h-full rounded-full object-cover"
          />
        {:else}
          <span
            class="text-xs font-medium {message.sender.is_client
              ? 'text-green-700'
              : 'text-primary-700'}"
          >
            {getInitials(message.sender.first_name, message.sender.last_name)}
          </span>
        {/if}
      </div>
    {:else if !isOwn}
      <div class="w-8" />
    {/if}

    <!-- Message Content -->
    <div class="relative">
      <!-- Bubble -->
      <div
        class="rounded-2xl px-4 py-2 {isOwn
          ? 'bg-primary-500 text-white'
          : 'bg-white border border-gray-200'}"
      >
        {#if !isOwn && showAvatar}
          <div
            class="text-xs font-medium mb-1 {isOwn
              ? 'text-primary-100'
              : 'text-gray-600'}"
          >
            {message.sender.first_name}
            {message.sender.last_name}
          </div>
        {/if}

        <p class="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {#if message.is_edited}
          <span
            class="text-xs {isOwn
              ? 'text-primary-100'
              : 'text-gray-500'} mt-1 block"
          >
            (edited)
          </span>
        {/if}
      </div>

      <!-- Reactions -->
      {#if groupedReactions.length > 0}
        <div class="absolute -bottom-3 left-0 flex gap-1">
          {#each groupedReactions as [reaction, count]}
            <button
              on:click={() => handleReaction(reaction)}
              class="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <span>{reaction}</span>
              {#if count > 1}
                <span class="text-gray-600">{count}</span>
              {/if}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Reaction Picker -->
      {#if showReactionPicker}
        <div
          class="absolute {isOwn
            ? 'right-0'
            : 'left-0'} top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex gap-1 z-10"
        >
          {#each reactions as reaction}
            <button
              on:click={() => handleReaction(reaction)}
              class="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center transition-colors"
            >
              {reaction}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Actions (visible on hover) -->
    <div
      class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
    >
      <button
        on:click={toggleReactionPicker}
        class="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Add reaction"
      >
        <svg
          class="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Time and Read Status -->
<div class="flex {isOwn ? 'justify-end' : 'justify-start'} mt-1 px-10">
  <span class="text-xs text-gray-500">
    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
    {#if isOwn && message.read_by?.length > 0}
      · Read
    {/if}
  </span>
</div>
