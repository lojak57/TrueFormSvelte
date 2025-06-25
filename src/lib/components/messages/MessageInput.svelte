<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabase.client";

  export let threadId: string;

  const dispatch = createEventDispatcher();

  let message = "";
  let files: File[] = [];
  let fileInput: HTMLInputElement;
  let isTyping = false;
  let typingTimeout: NodeJS.Timeout;

  async function sendMessage() {
    if (!message.trim() && files.length === 0) return;

    dispatch("send", {
      content: message.trim(),
      type: files.length > 0 ? "document" : "text",
      files,
    });

    // Clear input
    message = "";
    files = [];

    // Clear typing indicator
    if (isTyping) {
      await clearTypingIndicator();
    }
  }

  async function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendMessage();
    } else {
      // Handle typing indicator
      if (!isTyping) {
        await setTypingIndicator();
      } else {
        // Reset timeout
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(clearTypingIndicator, 5000);
      }
    }
  }

  async function setTypingIndicator() {
    isTyping = true;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("tf_typing_indicators").insert({
      thread_id: threadId,
      user_id: user.id,
    });

    // Auto-clear after 5 seconds
    typingTimeout = setTimeout(clearTypingIndicator, 5000);
  }

  async function clearTypingIndicator() {
    isTyping = false;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("tf_typing_indicators").delete().match({
      thread_id: threadId,
      user_id: user.id,
    });
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      files = [...files, ...Array.from(input.files)];
    }
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
</script>

<div class="border-t bg-white p-4">
  <!-- File Attachments Preview -->
  {#if files.length > 0}
    <div class="mb-3 flex flex-wrap gap-2">
      {#each files as file, i}
        <div
          class="bg-gray-100 rounded-lg px-3 py-2 flex items-center gap-2 text-sm"
        >
          <svg
            class="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
          <span class="font-medium">{file.name}</span>
          <span class="text-gray-500">({formatFileSize(file.size)})</span>
          <button
            on:click={() => removeFile(i)}
            class="ml-1 text-gray-500 hover:text-red-600 transition-colors"
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
      {/each}
    </div>
  {/if}

  <!-- Input Area -->
  <div class="flex items-end gap-2">
    <!-- File Upload Button -->
    <button
      on:click={() => fileInput.click()}
      class="p-2 text-gray-600 hover:text-primary-600 transition-colors"
      title="Attach files"
    >
      <svg
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
    </button>

    <!-- Hidden File Input -->
    <input
      bind:this={fileInput}
      type="file"
      multiple
      on:change={handleFileSelect}
      class="hidden"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
    />

    <!-- Message Input -->
    <div class="flex-1 relative">
      <textarea
        bind:value={message}
        on:keydown={handleKeydown}
        placeholder="Type a message..."
        rows="1"
        class="w-full px-4 py-2 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        style="min-height: 40px; max-height: 120px;"
      />

      <!-- Send Button -->
      <button
        on:click={sendMessage}
        disabled={!message.trim() && files.length === 0}
        class="absolute right-2 bottom-2 p-1.5 rounded-full transition-all
          {message.trim() || files.length > 0
          ? 'bg-primary-500 text-white hover:bg-primary-600'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'}"
      >
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
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </div>

    <!-- Emoji Button -->
    <button
      class="p-2 text-gray-600 hover:text-primary-600 transition-colors"
      title="Add emoji"
    >
      <svg
        class="w-6 h-6"
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

<style>
  textarea {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 #f7fafc;
  }

  textarea::-webkit-scrollbar {
    width: 6px;
  }

  textarea::-webkit-scrollbar-track {
    background: #f7fafc;
  }

  textarea::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
  }
</style>
