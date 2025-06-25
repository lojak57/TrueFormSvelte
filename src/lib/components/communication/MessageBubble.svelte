<script lang="ts">
  import { formatTime, formatFileSize } from "$lib/utils";
  import type { MessageWithDetails, MessageReactionSummary } from "$lib/types";
  import { createEventDispatcher } from "svelte";
  import DocumentPreview from "./DocumentPreview.svelte";
  import ProposalPreview from "./ProposalPreview.svelte";

  export let message: MessageWithDetails;
  export let isOwn: boolean;
  export let showAvatar = true;
  export let showReactions = true;
  export let currentUserId: string;

  const dispatch = createEventDispatcher<{
    react: { messageId: string; reactionType: string };
    reply: { message: MessageWithDetails };
    edit: { messageId: string };
    delete: { messageId: string };
  }>();

  $: readByOthers =
    message.read_by?.filter((r) => r.user_id !== currentUserId) || [];
  $: userReactions = message.reactions?.filter((r) => r.user_reacted) || [];

  function handleReaction(reactionType: string) {
    dispatch("react", { messageId: message.id, reactionType });
  }

  function handleReply() {
    dispatch("reply", { message });
  }

  function handleEdit() {
    if (isOwn) {
      dispatch("edit", { messageId: message.id });
    }
  }

  function handleDelete() {
    if (isOwn) {
      dispatch("delete", { messageId: message.id });
    }
  }

  const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "👎"] as const;
</script>

<div class="flex {isOwn ? 'justify-end' : 'justify-start'} mb-4 group">
  {#if !isOwn && showAvatar}
    <img
      src={message.sender.avatar_url || "/default-avatar.png"}
      alt={`${message.sender.first_name} ${message.sender.last_name}`}
      class="w-8 h-8 rounded-full mr-3 flex-shrink-0"
    />
  {/if}

  <div class="max-w-xs lg:max-w-md relative">
    <!-- Reply indicator -->
    {#if message.reply_to_message}
      <div
        class="mb-2 px-3 py-2 bg-gray-100 rounded-lg text-xs text-gray-600 border-l-4 border-blue-400"
      >
        <div class="font-medium">
          {message.reply_to_message.sender?.first_name || "User"}
        </div>
        <div class="truncate">{message.reply_to_message.content}</div>
      </div>
    {/if}

    <!-- Message content -->
    <div
      class="px-4 py-2 rounded-2xl {isOwn
        ? 'bg-blue-500 text-white'
        : 'bg-white text-gray-900 border border-gray-200'}"
    >
      {#if message.message_type === "text"}
        <p class="text-sm whitespace-pre-wrap break-words">{message.content}</p>
      {:else if message.message_type === "image"}
        <img
          src={message.metadata.image_url}
          alt="Shared image"
          class="rounded-lg max-w-full h-auto"
          loading="lazy"
        />
        {#if message.content}
          <p class="text-sm mt-2 whitespace-pre-wrap">{message.content}</p>
        {/if}
      {:else if message.message_type === "document"}
        <DocumentPreview document={message.metadata.document} compact={true} />
        {#if message.content}
          <p class="text-sm mt-2 whitespace-pre-wrap">{message.content}</p>
        {/if}
      {:else if message.message_type === "proposal"}
        <ProposalPreview proposal={message.metadata.proposal} compact={true} />
        {#if message.content}
          <p class="text-sm mt-2 whitespace-pre-wrap">{message.content}</p>
        {/if}
      {:else if message.message_type === "system"}
        <p class="text-sm italic opacity-75">{message.content}</p>
      {/if}

      <!-- Attachments -->
      {#if message.attachments && message.attachments.length > 0}
        <div class="mt-2 space-y-2">
          {#each message.attachments as attachment}
            <div
              class="flex items-center p-2 bg-black bg-opacity-10 rounded text-xs"
              class:bg-white={!isOwn}
              class:bg-opacity-50={!isOwn}
            >
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">{attachment.file_name}</div>
                <div class="text-gray-500">
                  {formatFileSize(attachment.file_size)}
                </div>
              </div>
              <button
                class="ml-2 underline hover:no-underline"
                on:click={() => window.open(attachment.file_path, "_blank")}
              >
                Download
              </button>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Message metadata -->
    <div
      class="flex items-center mt-1 {isOwn
        ? 'justify-end'
        : 'justify-start'} text-xs text-gray-500"
    >
      <span>{formatTime(message.created_at)}</span>
      {#if message.is_edited}
        <span class="ml-1">(edited)</span>
      {/if}
      {#if isOwn && readByOthers.length > 0}
        <span class="ml-2">Read by {readByOthers.length}</span>
      {/if}
    </div>

    <!-- Reactions -->
    {#if showReactions && message.reactions && message.reactions.length > 0}
      <div class="flex flex-wrap gap-1 mt-1">
        {#each message.reactions as reaction}
          <button
            class="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 transition-colors"
            class:bg-blue-100={reaction.user_reacted}
            class:border-blue-400={reaction.user_reacted}
            on:click={() => handleReaction(reaction.reaction_type)}
          >
            <span class="mr-1">{reaction.reaction_type}</span>
            <span class="font-medium">{reaction.count}</span>
          </button>
        {/each}
      </div>
    {/if}

    <!-- Message actions (shown on hover) -->
    <div
      class="absolute top-0 right-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 rounded-lg p-1 -mr-2 -mt-2"
    >
      <!-- Quick reactions -->
      <div class="flex space-x-1">
        {#each quickReactions.slice(0, 3) as reactionType}
          <button
            class="w-6 h-6 text-sm hover:bg-gray-100 rounded flex items-center justify-center"
            on:click={() => handleReaction(reactionType)}
            title="React with {reactionType}"
          >
            {reactionType}
          </button>
        {/each}
      </div>

      <!-- Reply button -->
      <button
        class="w-6 h-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center"
        on:click={handleReply}
        title="Reply"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
          />
        </svg>
      </button>

      <!-- More actions for own messages -->
      {#if isOwn}
        <button
          class="w-6 h-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center"
          on:click={handleEdit}
          title="Edit"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          class="w-6 h-6 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded flex items-center justify-center"
          on:click={handleDelete}
          title="Delete"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>

  {#if isOwn && showAvatar}
    <img
      src="/your-professional-photo.jpg"
      alt="You"
      class="w-8 h-8 rounded-full ml-3 flex-shrink-0"
    />
  {/if}
</div>
