<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Check, Upload, Palette, Lightbulb, Briefcase, Eye, Heart, Zap, Target } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  export let formData: {
    designMood: string[];
    colorPalette: string;
    typography: string;
    visualStyle: string;
    hasLogo: boolean;
    hasBrandGuidelines: boolean;
    logoFile: File | null;
    brandFiles: File[];
    inspirationFiles: File[];
  };

  // File upload refs
  let logoUpload: HTMLInputElement;
  let brandAssetsUpload: HTMLInputElement;
  let inspirationUpload: HTMLInputElement;

  const designMoodOptions = [
    { 
      label: 'Professional & Corporate', 
      icon: Briefcase, 
      desc: 'Clean, trustworthy, established',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop'
    },
    { 
      label: 'Modern & Minimal', 
      icon: Eye, 
      desc: 'Simple, clean, contemporary',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop'
    },
    { 
      label: 'Creative & Artistic', 
      icon: Palette, 
      desc: 'Unique, expressive, bold',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
    },
    { 
      label: 'Warm & Friendly', 
      icon: Heart, 
      desc: 'Approachable, welcoming, personal',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop'
    },
    { 
      label: 'Tech & Innovation', 
      icon: Zap, 
      desc: 'Cutting-edge, dynamic, forward-thinking',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop'
    },
    { 
      label: 'Elegant & Luxury', 
      icon: Target, 
      desc: 'Premium, sophisticated, refined',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    }
  ];

  const colorPaletteOptions = [
    {
      name: 'Blues & Whites (Trust, Professional)',
      colors: ['#1e40af', '#3b82f6', '#60a5fa', '#ffffff'],
      description: 'Trust, Professional'
    },
    {
      name: 'Greens & Earth Tones (Growth, Natural)',
      colors: ['#166534', '#16a34a', '#86efac', '#fef3c7'],
      description: 'Growth, Natural'
    },
    {
      name: 'Bold & Vibrant (Energy, Creative)',
      colors: ['#dc2626', '#f59e0b', '#8b5cf6', '#ec4899'],
      description: 'Energy, Creative'
    },
    {
      name: 'Black & White (Classic, Minimal)',
      colors: ['#000000', '#374151', '#9ca3af', '#ffffff'],
      description: 'Classic, Minimal'
    },
    {
      name: 'Warm Tones (Friendly, Welcoming)',
      colors: ['#ea580c', '#f97316', '#fbbf24', '#fef3c7'],
      description: 'Friendly, Welcoming'
    },
    {
      name: 'I have specific brand colors',
      custom: true,
      description: 'Use your brand colors'
    },
    {
      name: 'Need help choosing',
      help: true,
      description: 'We\'ll help you decide'
    }
  ];

  const typographyOptions = [
    {
      name: 'Clean & Modern Sans-serif',
      example: 'Aa',
      font: 'font-sans',
      description: 'Clean, readable, contemporary',
      sample: 'The quick brown fox jumps over the lazy dog'
    },
    {
      name: 'Professional Serif',
      example: 'Aa',
      font: 'font-serif',
      description: 'Traditional, trustworthy, elegant',
      sample: 'The quick brown fox jumps over the lazy dog'
    },
    {
      name: 'Creative Display Fonts',
      example: 'Aa',
      font: 'font-bold',
      description: 'Unique, expressive, memorable',
      sample: 'THE QUICK BROWN FOX'
    },
    {
      name: 'Tech/Code-inspired',
      example: 'Aa',
      font: 'font-mono',
      description: 'Technical, precise, modern',
      sample: 'console.log("Hello World");'
    },
    {
      name: 'Handwritten/Script',
      example: 'Aa',
      font: 'italic',
      description: 'Personal, warm, creative',
      sample: 'Welcome to our story...'
    },
    {
      name: 'Bold & Impactful',
      example: 'Aa',
      font: 'font-black',
      description: 'Strong, confident, attention-grabbing',
      sample: 'MAKE AN IMPACT'
    },
    {
      name: 'Let you choose',
      example: '?',
      font: 'font-medium',
      description: 'We\'ll recommend the perfect typography',
      sample: 'Trust our design expertise'
    }
  ];

  const visualStyleOptions = [
    {
      name: 'Photo-heavy/Visual storytelling',
      icon: '📸',
      description: 'High-quality images tell your story',
      example: 'Large hero images, photo galleries, visual narratives'
    },
    {
      name: 'Illustration-based',
      icon: '🎨',
      description: 'Custom illustrations and graphics',
      example: 'Unique artwork, custom icons, branded illustrations'
    },
    {
      name: 'Icon & graphic-focused',
      icon: '⚡',
      description: 'Clean icons and infographics',
      example: 'Minimalist icons, data visualizations, clean graphics'
    },
    {
      name: 'Video & animation',
      icon: '🎬',
      description: 'Dynamic motion and video content',
      example: 'Background videos, animations, interactive elements'
    },
    {
      name: 'Text & typography-focused',
      icon: '📝',
      description: 'Beautiful typography as the hero',
      example: 'Elegant text layouts, minimal visuals, content-first'
    },
    {
      name: 'Mixed media approach',
      icon: '🎭',
      description: 'Combination of all visual elements',
      example: 'Photos + illustrations + icons + video'
    }
  ];

  function toggleArrayOption(array: string[], option: string) {
    if (array.includes(option)) {
      return array.filter(item => item !== option);
    } else {
      return [...array, option];
    }
  }

  function handleFileUpload(event: Event, fileType: 'logo' | 'brand' | 'inspiration') {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      switch (fileType) {
        case 'logo':
          formData.logoFile = target.files[0];
          formData.hasLogo = true;
          break;
        case 'brand':
          formData.brandFiles = Array.from(target.files);
          formData.hasBrandGuidelines = true;
          break;
        case 'inspiration':
          formData.inspirationFiles = Array.from(target.files);
          break;
      }
    }
  }

  // Validation
  $: isValid = !!(formData.designMood.length > 0 && formData.colorPalette?.trim());

  // Emit validation state changes
  $: dispatch('validation', { isValid });
</script>

<div class="space-y-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Design Mood * (What feeling should your website convey?)
    </label>
    <div class="grid md:grid-cols-3 gap-4">
      {#each designMoodOptions as mood}
        <button
          type="button"
          on:click={() => formData.designMood = toggleArrayOption(formData.designMood, mood.label)}
          class="border rounded-lg overflow-hidden transition-all hover:shadow-lg
            {formData.designMood.includes(mood.label) ? 'border-accent-600 ring-2 ring-accent-600' : 'border-gray-300 hover:border-gray-400'}"
        >
          <div class="relative h-32 overflow-hidden">
            <img 
              src={mood.image} 
              alt={mood.label}
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-2 left-2 right-2 text-white">
              <div class="flex items-center gap-2 mb-1">
                <svelte:component this={mood.icon} size={16} />
                <span class="font-medium text-sm">{mood.label}</span>
              </div>
              <p class="text-xs opacity-90">{mood.desc}</p>
            </div>
          </div>
          {#if formData.designMood.includes(mood.label)}
            <div class="bg-accent-600 text-white p-2 text-center">
              <Check size={16} class="inline" />
              <span class="text-xs ml-1">Selected</span>
            </div>
          {:else}
            <div class="bg-gray-50 p-2 text-center">
              <span class="text-xs text-gray-600">Click to select</span>
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Color Palette Preference *
    </label>
    <div class="space-y-2">
      {#each colorPaletteOptions as palette}
        <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all
          {formData.colorPalette === palette.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200'}">
          <input
            type="radio"
            bind:group={formData.colorPalette}
            value={palette.name}
            class="text-accent-600 focus:ring-accent-500"
          />
          <div class="flex-1">
            <div class="flex items-center gap-3">
              {#if palette.colors}
                <div class="flex gap-1">
                  {#each palette.colors as color}
                    <div 
                      class="w-8 h-8 rounded border border-gray-200" 
                      style="background-color: {color}"
                    ></div>
                  {/each}
                </div>
              {:else if palette.custom}
                <div class="p-2 rounded bg-gray-100">
                  <Palette size={20} class="text-gray-600" />
                </div>
              {:else if palette.help}
                <div class="p-2 rounded bg-gray-100">
                  <Lightbulb size={20} class="text-gray-600" />
                </div>
              {/if}
              <div>
                <span class="text-sm font-medium block">{palette.name}</span>
                {#if palette.description}
                  <span class="text-xs text-gray-500">{palette.description}</span>
                {/if}
              </div>
            </div>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Typography Style
    </label>
    <div class="grid md:grid-cols-2 gap-4">
      {#each typographyOptions as typo}
        <label class="relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
          {formData.typography === typo.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}">
          <input
            type="radio"
            bind:group={formData.typography}
            value={typo.name}
            class="absolute top-3 right-3 text-accent-600 focus:ring-accent-500"
          />
          
          <!-- Typography Preview -->
          <div class="mb-3">
            <div class="text-3xl {typo.font} text-gray-800 mb-1">
              {typo.example}
            </div>
            <div class="text-sm {typo.font} text-gray-600 truncate">
              {typo.sample}
            </div>
          </div>
          
          <!-- Typography Info -->
          <div>
            <h4 class="font-medium text-gray-900 text-sm mb-1">{typo.name}</h4>
            <p class="text-xs text-gray-600">{typo.description}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-3">
      Visual Style Direction
    </label>
    <div class="grid md:grid-cols-2 gap-4">
      {#each visualStyleOptions as style}
        <label class="relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
          {formData.visualStyle === style.name ? 'border-accent-600 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}">
          <input
            type="radio"
            bind:group={formData.visualStyle}
            value={style.name}
            class="absolute top-3 right-3 text-accent-600 focus:ring-accent-500"
          />
          
          <!-- Visual Style Icon -->
          <div class="mb-3">
            <div class="text-3xl mb-2">{style.icon}</div>
          </div>
          
          <!-- Visual Style Info -->
          <div>
            <h4 class="font-medium text-gray-900 text-sm mb-1">{style.name}</h4>
            <p class="text-xs text-gray-600 mb-2">{style.description}</p>
            <p class="text-xs text-gray-500 italic">{style.example}</p>
          </div>
        </label>
      {/each}
    </div>
  </div>

  <!-- File Upload Section -->
  <div class="bg-gray-50 rounded-lg p-6 space-y-4">
    <h3 class="font-medium text-gray-900">Upload Brand Assets</h3>
    
    <!-- Logo Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Logo Files
      </label>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          on:change={(e) => handleFileUpload(e, 'logo')}
          class="hidden"
          bind:this={logoUpload}
        />
        <button
          type="button"
          on:click={() => logoUpload?.click()}
          class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
        >
          <Upload size={24} />
          <span class="text-sm">Click to upload logo</span>
          <span class="text-xs text-gray-500">PNG, JPG, SVG up to 10MB</span>
        </button>
        {#if formData.logoFile}
          <p class="text-sm text-green-600 mt-2">✓ {formData.logoFile.name}</p>
        {/if}
      </div>
    </div>

    <!-- Brand Guidelines Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Brand Guidelines / Reference Materials
      </label>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          on:change={(e) => handleFileUpload(e, 'brand')}
          class="hidden"
          bind:this={brandAssetsUpload}
        />
        <button
          type="button"
          on:click={() => brandAssetsUpload?.click()}
          class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
        >
          <Upload size={24} />
          <span class="text-sm">Upload brand guidelines</span>
          <span class="text-xs text-gray-500">PDF, DOC, Images up to 10MB each</span>
        </button>
        {#if formData.brandFiles.length > 0}
          <div class="text-sm text-green-600 mt-2">
            ✓ {formData.brandFiles.length} file(s) uploaded
          </div>
        {/if}
      </div>
    </div>

    <!-- Inspiration Upload -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Inspiration Images / Screenshots
      </label>
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-accent-400 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          on:change={(e) => handleFileUpload(e, 'inspiration')}
          class="hidden"
          bind:this={inspirationUpload}
        />
        <button
          type="button"
          on:click={() => inspirationUpload?.click()}
          class="flex flex-col items-center gap-2 text-gray-600 hover:text-accent-600"
        >
          <Upload size={24} />
          <span class="text-sm">Upload inspiration images</span>
          <span class="text-xs text-gray-500">Screenshots of sites you like</span>
        </button>
        {#if formData.inspirationFiles.length > 0}
          <div class="text-sm text-green-600 mt-2">
            ✓ {formData.inspirationFiles.length} file(s) uploaded
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>