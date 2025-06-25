<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { MessageWithDetails } from "$lib/types";

  export let placeholder = "Type a message...";
  export let disabled = false;
  export let replyingTo: MessageWithDetails | null = null;
  export let editingMessage: MessageWithDetails | null = null;

  const dispatch = createEventDispatcher<{
    send: { content: string; replyTo?: string };
    typing: { isTyping: boolean };
    attach: void;
    cancelReply: void;
    cancelEdit: void;
    editSave: { messageId: string; content: string };
  }>();

  let content = "";
  let textArea: HTMLTextAreaElement;
  let isTyping = false;
  let typingTimeout: NodeJS.Timeout;

  $: if (editingMessage) {
    content = editingMessage.content || "";
    setTimeout(() => textArea?.focus(), 0);
  }

  onMount(() => {
    textArea?.focus();
  });

  function handleInput() {
    // Auto-resize textarea
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = Math.min(textArea.scrollHeight, 120) + "px";
    }

    // Typing indicator
    if (!isTyping && content.trim()) {
      isTyping = true;
      dispatch("typing", { isTyping: true });
    }

    // Clear typing timeout
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      if (isTyping) {
        isTyping = false;
        dispatch("typing", { isTyping: false });
      }
    }, 2000);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Escape") {
      if (replyingTo) {
        dispatch("cancelReply");
      } else if (editingMessage) {
        dispatch("cancelEdit");
        content = "";
      }
    }
  }

  function handleSend() {
    const trimmedContent = content.trim();
    if (!trimmedContent || disabled) return;

    if (editingMessage) {
      dispatch("editSave", {
        messageId: editingMessage.id,
        content: trimmedContent,
      });
    } else {
      dispatch("send", {
        content: trimmedContent,
        replyTo: replyingTo?.id,
      });
    }

    content = "";
    isTyping = false;
    dispatch("typing", { isTyping: false });

    // Reset textarea height
    if (textArea) {
      textArea.style.height = "auto";
    }
  }

  function handleAttach() {
    dispatch("attach");
  }

  function handleCancelReply() {
    dispatch("cancelReply");
  }

  function handleCancelEdit() {
    dispatch("cancelEdit");
    content = "";
  }

  // Format user name for display
  function formatUserName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`.trim();
  }
</script>

<!-- Reply/Edit indicator -->
{#if replyingTo}
  <div
    class="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 flex items-start justify-between"
  >
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium text-blue-900">
        Replying to {formatUserName(
          replyingTo.sender.first_name,
          replyingTo.sender.last_name
        )}
      </div>
      <div class="text-sm text-blue-700 truncate mt-1">
        {replyingTo.content || "Attachment"}
      </div>
    </div>
    <button
      class="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
      on:click={handleCancelReply}
      aria-label="Cancel reply"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
{:else if editingMessage}
  <div
    class="px-4 py-2 bg-amber-50 border-l-4 border-amber-400 flex items-start justify-between"
  >
    <div class="flex-1 min-w-0">
      <div class="text-sm font-medium text-amber-900">Editing message</div>
      <div class="text-xs text-amber-700 mt-1">
        Press Escape to cancel, Enter to save
      </div>
    </div>
    <button
      class="ml-2 p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded"
      on:click={handleCancelEdit}
      aria-label="Cancel edit"
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
{/if}

<!-- Message input -->
<div class="flex items-end p-4 bg-white border-t border-gray-200 space-x-3">
  <!-- Attachment button -->
  <button
    class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
    on:click={handleAttach}
    {disabled}
    aria-label="Attach file"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
      />
    </svg>
  </button>

  <!-- Text input area -->
  <div class="flex-1 relative">
    <textarea
      bind:this={textArea}
      bind:value={content}
      {placeholder}
      {disabled}
      class="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      class:border-red-300={disabled}
      class:bg-gray-50={disabled}
      rows="1"
      on:input={handleInput}
      on:keydown={handleKeyDown}
    />

    <!-- Character count (optional) -->
    {#if content.length > 500}
      <div class="absolute -top-6 right-0 text-xs text-gray-500">
        {content.length}/1000
      </div>
    {/if}
  </div>

  <!-- Send button -->
  <button
    class="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    disabled={!content.trim() || disabled}
    on:click={handleSend}
    aria-label={editingMessage ? "Save edit" : "Send message"}
  >
    {#if editingMessage}
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    {:else}
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    {/if}
  </button>
</div>

<!-- Keyboard shortcuts hint -->
<div class="px-4 pb-2 text-xs text-gray-500">
  <span class="inline-flex items-center space-x-4">
    <span>Press Shift+Enter for new line</span>
    {#if replyingTo || editingMessage}
      <span>Press Escape to cancel</span>
    {/if}
  </span>
</div>
