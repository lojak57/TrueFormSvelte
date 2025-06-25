<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { fade, scale } from "svelte/transition";
  import { Paperclip, Send, Smile, X, Image, FileText } from "lucide-svelte";

  export let threadId: string;

  const dispatch = createEventDispatcher();

  let message = "";
  let files: File[] = [];
  let fileInput: HTMLInputElement;
  let isTyping = false;
  let typingTimeout: NodeJS.Timeout;
  let dragActive = false;

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
      addFiles(Array.from(input.files));
    }
  }

  function addFiles(newFiles: File[]) {
    files = [...files, ...newFiles];
    // Reset file input
    if (fileInput) fileInput.value = '';
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

  function getFileIcon(file: File) {
    if (file.type.startsWith('image/')) return Image;
    return FileText;
  }

  function getFilePreview(file: File): string | null {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  // Drag and drop handlers
  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    dragActive = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
    
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }
</script>

<div 
  class="border-t bg-white p-4 transition-all duration-200 {dragActive ? 'bg-blue-50 border-blue-300' : ''}"
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:dragover={handleDragOver}
  on:drop={handleDrop}
>
  <!-- Drag Overlay -->
  {#if dragActive}
    <div 
      class="absolute inset-0 bg-blue-100 bg-opacity-90 flex items-center justify-center z-10 rounded-lg"
      transition:fade={{ duration: 200 }}
    >
      <div class="text-center">
        <Paperclip size={48} class="mx-auto mb-2 text-blue-600" />
        <p class="text-lg font-medium text-blue-900">Drop files here</p>
        <p class="text-sm text-blue-700">Images and documents accepted</p>
      </div>
    </div>
  {/if}

  <!-- File Attachments Preview -->
  {#if files.length > 0}
    <div class="mb-3 flex flex-wrap gap-2" transition:fade={{ duration: 200 }}>
      {#each files as file, i}
        {@const preview = getFilePreview(file)}
        {@const FileIcon = getFileIcon(file)}
        <div
          class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
          transition:scale={{ duration: 200, start: 0.8 }}
        >
          {#if preview}
            <!-- Image preview -->
            <div class="relative w-24 h-24">
              <img 
                src={preview} 
                alt={file.name}
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <button
                  on:click={() => removeFile(i)}
                  class="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 transition-all duration-200 transform scale-0 group-hover:scale-100"
                >
                  <X size={16} class="text-gray-700" />
                </button>
              </div>
            </div>
            <div class="px-2 py-1 text-xs text-gray-600 truncate">
              {file.name}
            </div>
          {:else}
            <!-- File preview -->
            <div class="px-3 py-2 flex items-center gap-2">
              <FileIcon size={20} class="text-gray-500 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p class="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                on:click={() => removeFile(i)}
                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all duration-200"
              >
                <X size={16} />
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Input Area -->
  <div class="flex items-end gap-2">
    <!-- File Upload Button -->
    <button
      on:click={() => fileInput.click()}
      class="p-2 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:bg-gray-100 rounded-lg"
      title="Attach files"
    >
      <Paperclip size={20} />
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
        class="w-full px-4 py-3 pr-12 border border-gray-200 rounded-full resize-none 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent
               transition-all duration-200 bg-gray-50 focus:bg-white"
        style="min-height: 44px; max-height: 120px;"
      />

      <!-- Send Button -->
      <button
        on:click={sendMessage}
        disabled={!message.trim() && files.length === 0}
        class="absolute right-1.5 bottom-1.5 p-2 rounded-full transition-all duration-200 transform
          {message.trim() || files.length > 0
          ? 'bg-blue-500 text-white hover:bg-blue-600 scale-100'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed scale-90'}"
      >
        <Send 
          size={18} 
          class="transform transition-transform duration-200 {message.trim() || files.length > 0 ? 'translate-x-0' : '-translate-x-1'}"
        />
      </button>
    </div>

    <!-- Emoji Button -->
    <button
      class="p-2 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:bg-gray-100 rounded-lg"
      title="Add emoji"
    >
      <Smile size={20} />
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

  /* Auto-resize textarea */
  textarea {
    field-sizing: content;
    min-height: 44px;
    max-height: 120px;
  }
  
  /* Fallback for browsers that don't support field-sizing */
  @supports not (field-sizing: content) {
    textarea {
      overflow-y: auto;
    }
  }
</style>
