<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { Image, Link, Type, Plus, X, Eye, Sparkles } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  export let selected: any = {
    websiteUrls: [],
    description: '',
    keywords: [],
    feeling: ''
  };
  
  let newUrl = '';
  let newKeyword = '';
  
  const inspirationPrompts = [
    "Sites that make you say 'wow'",
    "Colors that catch your eye",
    "Layouts that feel just right",
    "Any visual that speaks to you"
  ];
  
  const feelingOptions = [
    { id: 'excited', label: 'Excited & Energized', emoji: '⚡', color: 'orange' },
    { id: 'calm', label: 'Calm & Peaceful', emoji: '🌊', color: 'blue' },
    { id: 'confident', label: 'Confident & Bold', emoji: '💪', color: 'red' },
    { id: 'sophisticated', label: 'Sophisticated & Elegant', emoji: '✨', color: 'purple' },
    { id: 'friendly', label: 'Friendly & Approachable', emoji: '😊', color: 'green' },
    { id: 'innovative', label: 'Innovative & Cutting-edge', emoji: '🚀', color: 'indigo' },
    { id: 'trustworthy', label: 'Trustworthy & Reliable', emoji: '🛡️', color: 'gray' },
    { id: 'creative', label: 'Creative & Artistic', emoji: '🎨', color: 'pink' }
  ];
  
  function addUrl() {
    if (newUrl.trim() && !selected.websiteUrls.includes(newUrl.trim())) {
      selected.websiteUrls = [...selected.websiteUrls, newUrl.trim()];
      newUrl = '';
    }
  }
  
  function removeUrl(url: string) {
    selected.websiteUrls = selected.websiteUrls.filter(u => u !== url);
  }
  
  function addKeyword() {
    if (newKeyword.trim() && !selected.keywords.includes(newKeyword.trim().toLowerCase())) {
      selected.keywords = [...selected.keywords, newKeyword.trim().toLowerCase()];
      newKeyword = '';
    }
  }
  
  function removeKeyword(keyword: string) {
    selected.keywords = selected.keywords.filter(k => k !== keyword);
  }
  
  function selectFeeling(feelingId: string) {
    selected.feeling = selected.feeling === feelingId ? '' : feelingId;
  }
  
  function handleContinue() {
    dispatch('complete', { value: selected });
  }
  
  function handleSkip() {
    dispatch('complete', { value: { skipped: true } });
  }
  
  function handleUrlKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  }
  
  function handleKeywordKeyPress(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  }
  
  $: selectedFeeling = feelingOptions.find(f => f.id === selected.feeling);
  $: hasContent = selected.websiteUrls.length > 0 || selected.description.trim() || selected.keywords.length > 0 || selected.feeling;
</script>

<div class="space-y-8" in:fade={{ duration: 300 }}>
  <!-- Header -->
  <div class="text-center">
    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-6 shadow-xl">
      <Sparkles size={40} class="text-white" />
    </div>
    
    <div class="mb-8">
      <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Share anything that inspires you - websites, colors, feelings, or just describe what you love. This is completely optional but incredibly helpful!
      </p>
    </div>
  </div>

  <!-- Content sections -->
  <div class="max-w-3xl mx-auto space-y-8">
    
    <!-- Website URLs -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Link size={20} class="text-blue-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Favorite Websites</h3>
          <p class="text-sm text-gray-600">Any sites you love the look or feel of</p>
        </div>
      </div>
      
      <div class="space-y-3">
        <div class="flex gap-2">
          <input
            type="url"
            bind:value={newUrl}
            on:keypress={handleUrlKeyPress}
            placeholder="https://example.com"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            on:click={addUrl}
            disabled={!newUrl.trim()}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {#if selected.websiteUrls.length > 0}
          <div class="space-y-2">
            {#each selected.websiteUrls as url, i}
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg" in:scale={{ duration: 200, delay: i * 50 }}>
                <Eye size={16} class="text-blue-600" />
                <span class="flex-1 text-sm font-medium text-gray-800 truncate">{url}</span>
                <button
                  on:click={() => removeUrl(url)}
                  class="p-1 text-gray-400 hover:text-red-500 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Feeling/Emotion -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <Sparkles size={20} class="text-purple-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Desired Feeling</h3>
          <p class="text-sm text-gray-600">How should visitors feel when they see your site?</p>
        </div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        {#each feelingOptions as feeling, i}
          <button
            class="feeling-card p-3 rounded-xl border-2 transition-all duration-200 text-center
                   {selected.feeling === feeling.id 
                     ? `border-${feeling.color}-500 bg-${feeling.color}-50` 
                     : 'border-gray-200 bg-white hover:border-gray-300'}
                   focus:outline-none focus:ring-4 focus:ring-purple-200"
            on:click={() => selectFeeling(feeling.id)}
            in:scale={{ duration: 200, delay: i * 75 }}
          >
            <div class="text-2xl mb-1">{feeling.emoji}</div>
            <span class="text-xs font-medium text-gray-800">{feeling.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Keywords/Descriptors -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
          <Type size={20} class="text-green-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Style Keywords</h3>
          <p class="text-sm text-gray-600">Words that describe your ideal aesthetic</p>
        </div>
      </div>
      
      <div class="space-y-3">
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={newKeyword}
            on:keypress={handleKeywordKeyPress}
            placeholder="modern, elegant, bold, minimal..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            on:click={addKeyword}
            disabled={!newKeyword.trim()}
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {#if selected.keywords.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each selected.keywords as keyword, i}
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    in:scale={{ duration: 200, delay: i * 50 }}>
                {keyword}
                <button
                  on:click={() => removeKeyword(keyword)}
                  class="text-green-600 hover:text-green-800"
                >
                  <X size={12} />
                </button>
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Free description -->
    <div class="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
          <Image size={20} class="text-pink-600" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900">Describe Your Vision</h3>
          <p class="text-sm text-gray-600">Paint us a picture with words</p>
        </div>
      </div>
      
      <textarea
        bind:value={selected.description}
        placeholder="Imagine walking into your dream space... what does it look like? How does it feel? What makes it special?"
        rows="4"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
      ></textarea>
    </div>

  </div>

  <!-- Summary of selections -->
  {#if hasContent}
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-3xl mx-auto border border-purple-200"
         in:fade={{ duration: 300 }}>
      <h4 class="font-semibold text-gray-900 mb-3">Your inspiration so far:</h4>
      
      <div class="space-y-2 text-sm">
        {#if selected.websiteUrls.length > 0}
          <div>
            <span class="font-medium text-gray-700">Favorite sites:</span>
            <span class="text-gray-600">{selected.websiteUrls.length} reference{selected.websiteUrls.length > 1 ? 's' : ''}</span>
          </div>
        {/if}
        
        {#if selectedFeeling}
          <div>
            <span class="font-medium text-gray-700">Desired feeling:</span>
            <span class="text-gray-600">{selectedFeeling.emoji} {selectedFeeling.label}</span>
          </div>
        {/if}
        
        {#if selected.keywords.length > 0}
          <div>
            <span class="font-medium text-gray-700">Style keywords:</span>
            <span class="text-gray-600">{selected.keywords.join(', ')}</span>
          </div>
        {/if}
        
        {#if selected.description.trim()}
          <div>
            <span class="font-medium text-gray-700">Vision:</span>
            <span class="text-gray-600">"{selected.description.trim().substring(0, 100)}{selected.description.length > 100 ? '...' : ''}"</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Action buttons -->
  <div class="text-center space-y-4">
    {#if hasContent}
      <button
        on:click={handleContinue}
        class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl 
               hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl
               focus:outline-none focus:ring-4 focus:ring-purple-200"
      >
        <Sparkles size={20} />
        Perfect! Let's use this inspiration
      </button>
    {:else}
      <div class="space-y-3">
        <p class="text-gray-600">No inspiration yet? No problem!</p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            on:click={handleSkip}
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Skip for now
          </button>
          <button
            on:click={handleContinue}
            class="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            Continue anyway
          </button>
        </div>
      </div>
    {/if}
    
    <p class="text-sm text-gray-500">
      💡 Pro tip: The more inspiration you share, the better we can capture your vision
    </p>
  </div>
</div>

<style>
  .feeling-card {
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>