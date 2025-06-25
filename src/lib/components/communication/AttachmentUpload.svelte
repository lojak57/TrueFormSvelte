<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { formatFileSize } from "$lib/utils";

  const dispatch = createEventDispatcher<{
    close: void;
    upload: { files: File[]; message?: string };
  }>();

  let files: File[] = [];
  let message = "";
  let dragOver = false;
  let uploading = false;
  let fileInput: HTMLInputElement;

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  function handleFileSelect(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > maxFileSize) {
        errors.push(
          `${file.name} is too large (max ${formatFileSize(maxFileSize)})`
        );
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name} is not a supported file type`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    files = [...files, ...validFiles];
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
    handleFileSelect(event.dataTransfer?.files || null);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  function removeFile(index: number) {
    files = files.filter((_, i) => i !== index);
  }

  function handleUpload() {
    if (files.length === 0) return;

    uploading = true;
    dispatch("upload", { files, message: message.trim() || undefined });
  }

  function handleClose() {
    dispatch("close");
  }

  function getFileIcon(fileType: string): string {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType === "application/pdf") return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel") || fileType.includes("spreadsheet"))
      return "📊";
    if (fileType.includes("text")) return "📄";
    return "📎";
  }

  function isImage(fileType: string): boolean {
    return fileType.startsWith("image/");
  }
</script>

<!-- Modal backdrop -->
<div
  class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
  on:click={handleClose}
  on:keydown={(e) => e.key === "Escape" && handleClose()}
>
  <!-- Modal content -->
  <div
    class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
    on:click|stopPropagation
  >
    <!-- Header -->
    <div
      class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
    >
      <h2 class="text-lg font-semibold text-gray-900">Share Files</h2>
      <button
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
        on:click={handleClose}
        aria-label="Close"
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- File drop zone -->
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 transition-colors"
        class:border-blue-400={dragOver}
        class:bg-blue-50={dragOver}
        on:drop={handleDrop}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
      >
        <svg
          class="w-12 h-12 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p class="text-lg font-medium text-gray-900 mb-2">Drop files here</p>
        <p class="text-sm text-gray-600 mb-4">
          or
          <button
            class="text-blue-600 hover:text-blue-700 underline"
            on:click={() => fileInput.click()}
          >
            browse to upload
          </button>
        </p>
        <p class="text-xs text-gray-500">
          Max file size: {formatFileSize(maxFileSize)} • Supported: Images, PDFs,
          Documents
        </p>
      </div>

      <!-- Hidden file input -->
      <input
        bind:this={fileInput}
        type="file"
        multiple
        class="hidden"
        accept={allowedTypes.join(",")}
        on:change={(e) => handleFileSelect(e.target.files)}
      />

      <!-- Selected files -->
      {#if files.length > 0}
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-900 mb-3">
            Selected Files ({files.length})
          </h3>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            {#each files as file, index}
              <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                <span class="text-2xl mr-3">{getFileIcon(file.type)}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p class="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.type
                      .split("/")[1]
                      .toUpperCase()}
                  </p>
                </div>
                <button
                  class="ml-2 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  on:click={() => removeFile(index)}
                  aria-label="Remove file"
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
        </div>
      {/if}

      <!-- Message input -->
      <div class="mb-6">
        <label
          for="message"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Add a message (optional)
        </label>
        <textarea
          id="message"
          bind:value={message}
          placeholder="Add a description or context for these files..."
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="3"
        />
      </div>
    </div>

    <!-- Footer -->
    <div
      class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"
    >
      <div class="text-sm text-gray-600">
        {#if files.length > 0}
          {files.length} file{files.length !== 1 ? "s" : ""} selected
        {:else}
          No files selected
        {/if}
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          on:click={handleClose}
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          disabled={files.length === 0 || uploading}
          on:click={handleUpload}
        >
          {#if uploading}
            <svg
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Uploading...
          {:else}
            Share Files
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
