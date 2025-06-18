<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import TextInputStep from '../../forms/wizard/components/TextInputStep.svelte';
  import VisualVibeSelector from '../components/VisualVibeSelector.svelte';
  import VisualFontSelector from '../components/VisualFontSelector.svelte';
  import VisualColorSelector from '../components/VisualColorSelector.svelte';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let currentField = 0;
  let formData = {
    designVibe: '',
    fontFeel: [],
    colorPalette: '',
    inspirationLinks: ''
  };
  
  // Subscribe to store data
  $: if ($conversationalWizard.data) {
    formData = {
      designVibe: $conversationalWizard.data.designVibe || '',
      fontFeel: $conversationalWizard.data.fontFeel || [],
      colorPalette: $conversationalWizard.data.colorPalette || '',
      inspirationLinks: $conversationalWizard.data.inspirationLinks || ''
    };
  }
  
  const fields = [
    {
      key: 'designVibe',
      title: "What kind of vibe are you going for?",
      type: 'visual-vibe',
      reassurance: "Pick the style that feels most like your brand's personality."
    },
    {
      key: 'fontFeel',
      title: "What kind of fonts feel right?",
      type: 'visual-font',
      reassurance: "Choose the font style that matches your brand's voice."
    },
    {
      key: 'colorPalette',
      title: "What colors feel right for your brand?",
      type: 'visual-color',
      reassurance: "Select colors that represent your brand's energy and values."
    },
    {
      key: 'inspirationLinks',
      title: "Any websites you love? (Optional)",
      type: 'text-input',
      placeholder: "www.example.com, or describe what you liked about them...",
      inputType: "text",
      skipLabel: "Skip this",
      multiline: true,
      starterPrompts: [
        "I like how [competitor] looks but...",
        "Apple's website is clean and simple",
        "I saw this site that converts really well",
        "Our biggest competitor does this well",
        "I'll send you examples later",
        "Nothing specific comes to mind"
      ],
      reassurance: "Even describing what you liked about a site helps us understand your taste."
    }
  ];
  
  function handleVisualSelect(event: CustomEvent) {
    const { value, vibeData, fontData, paletteData } = event.detail;
    const field = fields[currentField];
    
    // Store the selection
    conversationalWizard.updateData({ [field.key]: value });
    
    // Store additional data for design reference
    if (vibeData) {
      conversationalWizard.updateData({ _vibeData: vibeData });
    }
    if (fontData) {
      conversationalWizard.updateData({ _fontData: fontData });
    }
    if (paletteData) {
      conversationalWizard.updateData({ _paletteData: paletteData });
    }
    
    // Move to next field or complete step
    setTimeout(() => {
      if (currentField < fields.length - 1) {
        currentField++;
      } else {
        conversationalWizard.nextStep();
      }
    }, 500); // Brief delay to show selection
  }
  
  function handleTextComplete(event: CustomEvent) {
    const { value } = event.detail;
    const field = fields[currentField];
    
    // Update store
    conversationalWizard.updateData({ [field.key]: value });
    
    // Move to next field or complete step
    if (currentField < fields.length - 1) {
      currentField++;
    } else {
      conversationalWizard.nextStep();
    }
  }
  
  function goBack() {
    if (currentField > 0) {
      currentField--;
    } else {
      conversationalWizard.prevStep();
    }
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  {#key currentField}
    <div in:fly={{ x: 50, duration: 500 }} out:fly={{ x: -50, duration: 300 }}>
      <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        {fields[currentField].title}
      </h2>
      
      {#if currentField === 0}
        <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
          We want your website to feel authentically <em>you</em>.
        </p>
      {/if}
      
      <div class="input-wrapper" in:fly={{ y: 30, duration: 500, delay: 400 }}>
        {#if fields[currentField].type === 'visual-vibe'}
          <VisualVibeSelector 
            selectedVibe={formData.designVibe}
            on:select={handleVisualSelect}
          />
        {:else if fields[currentField].type === 'visual-font'}
          <VisualFontSelector 
            selectedFont={formData.fontFeel}
            on:select={handleVisualSelect}
          />
        {:else if fields[currentField].type === 'visual-color'}
          <VisualColorSelector 
            selectedPalette={formData.colorPalette}
            on:select={handleVisualSelect}
          />
        {:else}
          <TextInputStep
            value={formData[fields[currentField].key]}
            placeholder={fields[currentField].placeholder}
            inputType={fields[currentField].inputType}
            multiline={fields[currentField].multiline || false}
            skipLabel={fields[currentField].skipLabel}
            starterPrompts={fields[currentField].starterPrompts}
            on:complete={handleTextComplete}
          />
        {/if}
        
        {#if fields[currentField].reassurance}
          <InlineReassurance 
            text={fields[currentField].reassurance}
            delay={1200}
          />
        {/if}
      </div>
      
      <button
        on:click={goBack}
        class="back-button"
        in:fade={{ duration: 300, delay: 600 }}
      >
        ← Back
      </button>
    </div>
  {/key}
</div>

<style>
  .step-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
    min-height: auto;
    height: auto;
  }
  
  .step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .step-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .step-subtitle em {
    color: #374151;
    font-style: italic;
    font-weight: 500;
  }
  
  .input-wrapper {
    margin-bottom: 2rem;
  }
  
  .back-button {
    color: #6b7280;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .back-button:hover {
    color: #374151;
    background-color: #f3f4f6;
  }
  
  @media (max-width: 640px) {
    .step-container {
      padding: 1rem;
    }
    
    .step-title {
      font-size: 1.5rem;
    }
    
    .step-subtitle {
      font-size: 1rem;
    }
  }
</style>