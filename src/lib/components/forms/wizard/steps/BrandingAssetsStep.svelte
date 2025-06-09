<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ArrowRight, Upload, FileText, Palette, Image, Check, X } from 'lucide-svelte';
  import { scale, fade } from 'svelte/transition';
  
  export let selected: any = { hasBrandAssets: '', files: [] };
  
  const dispatch = createEventDispatcher();
  
  let dragActive = false;
  let uploadedFiles: File[] = [];
  
  const brandAssetOptions = [
    {
      id: 'yes',
      name: 'Yes, I have brand materials',
      icon: '✅',
      description: 'I have logos, colors, fonts, or brand guidelines'
    },
    {
      id: 'no',
      name: 'No, I need help creating them',
      icon: '🎨',
      description: 'I\'d like TrueForm to help develop my brand identity'
    }
  ];
  
  const fileTypes = [
    {
      id: 'logo',
      name: 'Logo Files',
      icon: Image,
      description: 'PNG, SVG, AI, or other logo formats',
      accept: '.png,.jpg,.jpeg,.svg,.ai,.eps,.pdf'
    },
    {
      id: 'brandGuide',
      name: 'Brand Guidelines',
      icon: FileText,
      description: 'Brand guides, style sheets, or documentation',
      accept: '.pdf,.doc,.docx,.txt'
    },
    {
      id: 'colorPalette',
      name: 'Color Palettes',
      icon: Palette,
      description: 'Color swatches, hex codes, or palette files',
      accept: '.pdf,.png,.jpg,.jpeg,.ase,.txt'
    }
  ];
  
  function selectOption(optionId: string) {
    selected = { ...selected, hasBrandAssets: optionId };
    if (optionId === 'no') {
      // Clear any uploaded files if they switch to "no"
      uploadedFiles = [];
      selected.files = [];
    }
  }
  
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }
  
  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
  }
  
  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    addFiles(files);
  }
  
  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    addFiles(files);
  }
  
  function addFiles(files: File[]) {
    // Filter for supported file types
    const supportedFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      return fileTypes.some(type => type.accept.includes(extension));
    });
    
    uploadedFiles = [...uploadedFiles, ...supportedFiles];
    selected.files = uploadedFiles;
  }
  
  function removeFile(index: number) {
    uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    selected.files = uploadedFiles;
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
  
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
</script>

<div class="space-y-6">
  <!-- Initial Question -->
  <div class="grid grid-cols-1 gap-4">
    {#each brandAssetOptions as option}
      <button
        on:click={() => selectOption(option.id)}
        class="relative p-6 border-2 rounded-xl text-left transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]
          {selected.hasBrandAssets === option.id 
            ? 'border-accent-600 ring-2 ring-accent-200 shadow-lg scale-[1.05] bg-accent-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'}"
      >
        {#if selected.hasBrandAssets === option.id}
          <div class="absolute top-4 right-4 w-8 h-8 bg-accent-600 rounded-full flex items-center justify-center">
            <Check size={18} class="text-white" />
          </div>
        {/if}
        
        <div class="space-y-3">
          <div class="text-4xl">{option.icon}</div>
          <div>
            <h3 class="font-bold text-gray-900">{option.name}</h3>
            <p class="text-sm text-gray-600 mt-1">{option.description}</p>
          </div>
        </div>
      </button>
    {/each}
  </div>

  <!-- File Upload Section (only show if they have brand assets) -->
  {#if selected.hasBrandAssets === 'yes'}
    <div class="space-y-6" in:fade={{ duration: 300 }}>
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Upload Your Brand Materials</h3>
        <p class="text-sm text-gray-600 mb-6">
          Upload any existing brand materials you have. Don't worry if you don't have everything - we can work with whatever you provide!
        </p>
        
        <!-- File Type Suggestions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {#each fileTypes as fileType}
            <div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div class="flex items-center gap-3 mb-2">
                <svelte:component this={fileType.icon} size={20} class="text-gray-600" />
                <h4 class="font-medium text-gray-900">{fileType.name}</h4>
              </div>
              <p class="text-xs text-gray-600">{fileType.description}</p>
            </div>
          {/each}
        </div>
        
        <!-- Drag & Drop Area -->
        <div
          class="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
            {dragActive ? 'border-accent-400 bg-accent-50' : 'border-gray-300 hover:border-gray-400'}"
          on:dragover={handleDragOver}
          on:dragleave={handleDragLeave}
          on:drop={handleDrop}
          role="button"
          tabindex="0"
        >
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.svg,.ai,.eps,.pdf,.doc,.docx,.txt,.ase"
            on:change={handleFileSelect}
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <Upload size={48} class="mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p class="text-sm text-gray-600">
            Supports: PNG, JPG, SVG, AI, EPS, PDF, DOC, TXT files
          </p>
        </div>
        
        <!-- Uploaded Files List -->
        {#if uploadedFiles.length > 0}
          <div class="space-y-3" in:fade={{ duration: 300 }}>
            <h4 class="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
            {#each uploadedFiles as file, index}
              <div 
                class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                in:scale={{ duration: 300, delay: index * 50 }}
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={16} class="text-green-600" />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{file.name}</p>
                    <p class="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  on:click={() => removeFile(index)}
                  class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- Helpful Tips -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 class="font-medium text-blue-900 mb-2">💡 Helpful Tips</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• High-resolution logo files work best (PNG or SVG preferred)</li>
            <li>• Include both light and dark versions of your logo if available</li>
            <li>• Brand guidelines help us match your existing style perfectly</li>
            <li>• Don't have everything? No problem - we can work with what you have!</li>
          </ul>
        </div>
      </div>
    </div>
  {/if}

  <!-- Continue Button -->
  <div class="flex justify-end">
    <button
      on:click={handleContinue}
      disabled={!selected.hasBrandAssets}
      class="flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
    >
      Continue
      <ArrowRight size={20} />
    </button>
  </div>
  
  {#if selected.hasBrandAssets === 'yes' && uploadedFiles.length === 0}
    <p class="text-center text-sm text-gray-500">
      You can upload files now or send them to us later - whatever works best for you!
    </p>
  {/if}
</div> 