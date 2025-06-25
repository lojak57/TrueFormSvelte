<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatDistanceToNow } from "date-fns";
  import { fade, scale, fly } from "svelte/transition";
  import { FileText, Download, Image as ImageIcon, Check, CheckCheck } from "lucide-svelte";

  export let message: any;
  export let isOwn: boolean = false;
  export let showAvatar: boolean = true;
  export let isTyping: boolean = false;
  export let typingUser: string = "";

  const dispatch = createEventDispatcher();

  let showReactionPicker = false;
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "👎"];

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  }
  
  function getFileIcon(fileType: string) {
    if (fileType?.startsWith('image/')) return ImageIcon;
    return FileText;
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

<div 
  class="flex {isOwn ? 'justify-end' : 'justify-start'} group message-wrapper"
  in:fly={{ y: 20, duration: 300 }}
>
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
      {#if isTyping}
        <!-- Typing Indicator -->
        <div
          class="rounded-2xl px-4 py-3 bg-gray-100 border border-gray-200"
          transition:scale={{ duration: 200 }}
        >
          <div class="flex items-center gap-1">
            <span class="text-xs text-gray-600 mr-2">{typingUser} is typing</span>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      {:else}
        <!-- Regular Message Bubble -->
        <div
          class="message-bubble rounded-2xl px-4 py-2 {isOwn
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'}
          transition-all duration-200 hover:shadow-md"
        >
          {#if !isOwn && showAvatar}
            <div
              class="text-xs font-semibold mb-1 {isOwn
                ? 'text-blue-100'
                : 'text-gray-700'}"
            >
              {message.sender.first_name}
              {message.sender.last_name}
            </div>
          {/if}

          <!-- File Attachments -->
          {#if message.attachments?.length > 0}
            <div class="mb-2 space-y-2">
              {#each message.attachments as attachment}
                {@const FileIcon = getFileIcon(attachment.type)}
                <div class="attachment-preview">
                  {#if attachment.type?.startsWith('image/')}
                    <img 
                      src={attachment.url} 
                      alt={attachment.name}
                      class="rounded-lg max-w-full max-h-64 object-cover"
                    />
                  {:else}
                    <div class="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded-lg">
                      <FileIcon size={20} class="{isOwn ? 'text-blue-100' : 'text-gray-600'}" />
                      <span class="text-sm flex-1 truncate">{attachment.name}</span>
                      <a 
                        href={attachment.url} 
                        download={attachment.name}
                        class="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                      >
                        <Download size={16} />
                      </a>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <p class="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {#if message.is_edited}
            <span
              class="text-xs {isOwn
                ? 'text-blue-100'
                : 'text-gray-500'} mt-1 block"
            >
              (edited)
            </span>
          {/if}
        </div>
      {/if}

      <!-- Reactions -->
      {#if groupedReactions.length > 0 && !isTyping}
        <div 
          class="absolute -bottom-3 left-0 flex gap-1"
          transition:scale={{ duration: 200 }}
        >
          {#each groupedReactions as [reaction, count]}
            <button
              on:click={() => handleReaction(reaction)}
              class="bg-white border border-gray-200 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
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
          transition:scale={{ duration: 200, start: 0.8 }}
        >
          {#each reactions as reaction}
            <button
              on:click={() => handleReaction(reaction)}
              class="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center transition-all duration-200 hover:scale-125"
            >
              {reaction}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Actions (visible on hover) -->
    {#if !isTyping}
      <div
        class="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1"
      >
        <button
          on:click={toggleReactionPicker}
          class="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
          title="Add reaction"
        >
          <svg
            class="w-4 h-4 text-gray-400 hover:text-gray-600"
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
    {/if}
  </div>
</div>

<!-- Time and Read Status -->
{#if !isTyping}
  <div class="flex {isOwn ? 'justify-end' : 'justify-start'} mt-1 px-10">
    <div class="flex items-center gap-1 text-xs text-gray-500">
      <span>
        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
      </span>
      {#if isOwn}
        <span class="flex items-center gap-0.5">
          {#if message.read_by?.length > 0}
            <CheckCheck size={14} class="text-blue-500" />
          {:else if message.delivered}
            <CheckCheck size={14} />
          {:else}
            <Check size={14} />
          {/if}
        </span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .message-bubble {
    word-break: break-word;
  }
  
  .message-wrapper {
    margin-bottom: 0.5rem;
  }
  
  /* Typing indicator animation */
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  
  .typing-indicator span {
    height: 8px;
    width: 8px;
    background-color: #9ca3af;
    border-radius: 50%;
    display: inline-block;
    animation: typing 1.4s infinite;
  }
  
  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
  
  /* Smooth hover effects */
  .message-bubble:hover {
    transform: translateY(-1px);
  }
  
  /* Attachment preview styles */
  .attachment-preview img {
    cursor: pointer;
  }
  
  .attachment-preview:hover img {
    opacity: 0.95;
  }
</style>
