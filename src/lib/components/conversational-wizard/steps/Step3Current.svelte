<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import TextInputStep from '../../forms/wizard/components/TextInputStep.svelte';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let currentField = 0;
  let formData = {
    currentTools: [],
    frustrations: ''
  };
  
  // Subscribe to store data
  $: if ($conversationalWizard.data) {
    formData = {
      currentTools: $conversationalWizard.data.currentTools || [],
      frustrations: $conversationalWizard.data.frustrations || ''
    };
  }
  
  const fields = [
    {
      key: 'currentTools',
      title: "What are you using now for your online presence?",
      placeholder: "WordPress, social media, nothing yet...",
      inputType: "text",
      starterPrompts: [
        "We don't have anything yet",
        "An old WordPress site that's broken",
        "Just social media pages",
        "A basic website builder site",
        "Business cards and word of mouth",
        "A site someone built years ago"
      ],
      reassurance: "Even if it's 'nothing' or 'it's a mess' - that's totally fine!"
    },
    {
      key: 'frustrations',
      title: "What's driving you crazy about your current situation?",
      placeholder: "Vent here... what makes you cringe? What keeps you up at night thinking about your online presence?",
      inputType: "text",
      multiline: true,
      starterPrompts: [
        "People can't find us online and when they do, they probably think we're out of business...",
        "It looks like it was built in 2010 and customers notice. I'm embarrassed to send people there...",
        "We're losing customers to competitors who just look more professional online. It hurts...",
        "Every tiny change takes forever and costs money. I can't even update our phone number without hiring someone...",
        "Mobile users give up immediately. Half our potential customers are bouncing before they even see what we do...",
        "People want to buy from us but there's no easy way. They have to email or call and half don't bother..."
      ],
      reassurance: "Let it all out. The more specific you are about what's broken, the better we can fix it."
    }
  ];
  
  function handleFieldComplete(event: CustomEvent) {
    const { value } = event.detail;
    const field = fields[currentField];
    
    // For currentTools, we'll store as an array if it's multiple items
    let processedValue = value;
    if (field.key === 'currentTools') {
      // Simple processing - split by commas if user lists multiple things
      processedValue = value.includes(',') 
        ? value.split(',').map(tool => tool.trim()).filter(Boolean)
        : [value];
    }
    
    // Update store
    conversationalWizard.updateData({ [field.key]: processedValue });
    
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
  
  // Get display value for current field
  function getDisplayValue() {
    const field = fields[currentField];
    const value = formData[field.key];
    
    if (field.key === 'currentTools') {
      return Array.isArray(value) ? value.join(', ') : value || '';
    }
    return value || '';
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  {#key currentField}
    <div in:fly={{ x: 50, duration: 500 }} out:fly={{ x: -50, duration: 300 }}>
      <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        {fields[currentField].title}
      </h2>
      
      <div class="input-wrapper" in:fly={{ y: 30, duration: 500, delay: 300 }}>
        <TextInputStep
          value={getDisplayValue()}
          placeholder={fields[currentField].placeholder}
          inputType={fields[currentField].inputType}
          multiline={fields[currentField].multiline || false}
          starterPrompts={fields[currentField].starterPrompts}
          on:complete={handleFieldComplete}
        />
        
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
        in:fade={{ duration: 300, delay: 500 }}
      >
        ← Back
      </button>
    </div>
  {/key}
</div>

<style>
  .step-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    height: auto;
    min-height: auto;
  }
  
  .step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    line-height: 1.2;
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
  }
</style>