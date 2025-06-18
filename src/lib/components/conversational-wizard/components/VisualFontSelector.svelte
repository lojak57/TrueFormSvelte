<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  
  export let selectedFont = '';
  
  const dispatch = createEventDispatcher();
  
  const fontOptions = [
    {
      id: 'clean-modern',
      label: 'Clean & Modern',
      description: 'Sans-serif, crisp, readable',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weight: '400',
      sampleText: 'Your Business Name',
      subText: 'Professional and approachable'
    },
    {
      id: 'classic-elegant',
      label: 'Classic & Elegant',
      description: 'Serif, traditional, refined',
      fontFamily: 'Georgia, "Times New Roman", serif',
      weight: '400',
      sampleText: 'Your Business Name',
      subText: 'Timeless and sophisticated'
    },
    {
      id: 'bold-strong',
      label: 'Bold & Strong',
      description: 'Heavy weight, impactful',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weight: '700',
      sampleText: 'YOUR BUSINESS',
      subText: 'Confident and powerful'
    },
    {
      id: 'friendly-approachable',
      label: 'Friendly & Approachable',
      description: 'Rounded, warm, welcoming',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weight: '500',
      sampleText: 'Your Business Name',
      subText: 'Friendly and accessible',
      borderRadius: '0.75rem'
    },
    {
      id: 'sophisticated-refined',
      label: 'Sophisticated & Refined',
      description: 'Light serif, luxury feel',
      fontFamily: 'Georgia, "Times New Roman", serif',
      weight: '300',
      sampleText: 'Your Business Name',
      subText: 'Elegant and premium'
    },
    {
      id: 'casual-relaxed',
      label: 'Casual & Relaxed',
      description: 'Informal, easy-going',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weight: '400',
      sampleText: 'your business name',
      subText: 'Laid-back and genuine'
    },
    {
      id: 'tech-sharp',
      label: 'Tech & Sharp',
      description: 'Monospace-inspired, precise',
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
      weight: '500',
      sampleText: 'YOUR_BUSINESS',
      subText: 'Technical and precise'
    },
    {
      id: 'trust-judgment',
      label: 'I Trust Your Judgment',
      description: 'Let our designers choose',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      weight: '400',
      sampleText: 'We\'ll Choose Perfect Fonts',
      subText: 'Based on your brand and industry',
      special: true
    }
  ];
  
  function selectFont(font) {
    selectedFont = font.id;
    dispatch('select', { 
      value: font.label,
      fontData: font 
    });
  }
</script>

<div class="font-selector">
  <div class="font-grid">
    {#each fontOptions as font, i}
      <button
        class="font-card"
        class:selected={selectedFont === font.id}
        class:special={font.special}
        on:click={() => selectFont(font)}
        in:fade={{ duration: 300, delay: i * 80 }}
      >
        <div class="font-preview">
          <div 
            class="sample-text"
            style="font-family: {font.fontFamily}; font-weight: {font.weight}; border-radius: {font.borderRadius || '0'}"
          >
            {font.sampleText}
          </div>
          <div 
            class="sub-text"
            style="font-family: {font.fontFamily}; font-weight: {font.weight === '700' ? '400' : font.weight}"
          >
            {font.subText}
          </div>
        </div>
        
        <div class="font-info">
          <h4>{font.label}</h4>
          <p>{font.description}</p>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .font-selector {
    width: 100%;
  }
  
  .font-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .font-card {
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    width: 100%;
  }
  
  .font-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    transform: translateY(-1px);
  }
  
  .font-card.selected {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }
  
  .font-card.special {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    border: 2px dashed #94a3b8;
  }
  
  .font-card.special:hover {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  }
  
  .font-card.special.selected {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  }
  
  .font-preview {
    margin-bottom: 1rem;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .sample-text {
    font-size: 1.5rem;
    color: #111827;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }
  
  .sub-text {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.4;
  }
  
  .font-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  .font-info p {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
    font-family: system-ui, -apple-system, sans-serif;
  }
  
  /* Special styling for specific font types */
  .font-card:nth-child(7) .sample-text {
    letter-spacing: 0.05em;
  }
  
  .font-card:nth-child(6) .sample-text {
    text-transform: lowercase;
  }
  
  @media (max-width: 768px) {
    .font-grid {
      grid-template-columns: 1fr;
    }
    
    .sample-text {
      font-size: 1.25rem;
    }
    
    .font-preview {
      min-height: 70px;
    }
  }
</style>