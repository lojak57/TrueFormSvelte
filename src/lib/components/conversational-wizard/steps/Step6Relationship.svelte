<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import TextInputStep from '../../forms/wizard/components/TextInputStep.svelte';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let currentField = 0;
  let formData = {
    workingStyle: '',
    wantToTalk: null
  };
  
  // Subscribe to store data
  $: if ($conversationalWizard.data) {
    formData = {
      workingStyle: $conversationalWizard.data.workingStyle || '',
      wantToTalk: $conversationalWizard.data.wantToTalk ?? null
    };
  }
  
  const fields = [
    {
      key: 'workingStyle',
      title: "How do you like to work with people?",
      placeholder: "Keep me in the loop, surprise me with the final result...",
      inputType: "text",
      multiline: true,
      starterPrompts: [
        "Keep me in the loop throughout the process",
        "Show me a few options and let me choose",
        "I trust you—surprise me with something great",
        "Let me give feedback at key milestones",
        "I want to be very hands-on",
        "Just check with me before major decisions",
        "I prefer minimal back-and-forth",
        "I like collaborative, creative sessions"
      ],
      reassurance: "There's no wrong answer—we adapt to how you work best."
    },
    {
      key: 'wantToTalk',
      title: "Want to hop on a quick call to discuss this?",
      inputType: "boolean",
      options: [
        { value: true, label: "Yes, I'd love to chat", description: "15-30 min call to dive deeper" },
        { value: false, label: "No thanks, email is fine", description: "We'll work through email/messages" }
      ],
      reassurance: "Either way works perfectly—we're flexible with communication."
    },
  ];
  
  function handleFieldComplete(event: CustomEvent) {
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
  
  function handleBooleanChoice(value: boolean) {
    const field = fields[currentField];
    conversationalWizard.updateData({ [field.key]: value });
    
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

<div class="step-container">
  {#key currentField}
    <div in:fly={{ x: 50, duration: 400 }} out:fly={{ x: -50, duration: 300 }}>
      <h2 class="step-title" in:fade={{ duration: 300, delay: 100 }}>
        {fields[currentField].title}
      </h2>
      
      {#if currentField === 0}
        <p class="step-subtitle" in:fade={{ duration: 300, delay: 200 }}>
          Everyone's different—some love updates, others prefer the big reveal.
        </p>
      {/if}
      
      <div class="input-wrapper">
        {#if fields[currentField].inputType === 'boolean'}
          <!-- Boolean choice buttons -->
          <div class="choice-container" in:fade={{ duration: 400, delay: 200 }}>
            {#each fields[currentField].options as option, i}
              <button
                on:click={() => handleBooleanChoice(option.value)}
                class="choice-button"
                class:selected={formData[fields[currentField].key] === option.value}
                in:fade={{ duration: 300, delay: 300 + (i * 100) }}
              >
                <div class="choice-label">{option.label}</div>
                <div class="choice-description">{option.description}</div>
              </button>
            {/each}
          </div>
        {:else}
          <!-- Text input -->
          <TextInputStep
            value={formData[fields[currentField].key]}
            placeholder={fields[currentField].placeholder}
            inputType={fields[currentField].inputType}
            multiline={fields[currentField].multiline || false}
            starterPrompts={fields[currentField].starterPrompts}
            on:complete={handleFieldComplete}
          />
        {/if}
        
        {#if fields[currentField].reassurance}
          <InlineReassurance 
            text={fields[currentField].reassurance}
            delay={1000}
          />
        {/if}
      </div>
      
      <button
        on:click={goBack}
        class="back-button"
        in:fade={{ duration: 200, delay: 300 }}
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
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .step-subtitle {
    font-size: 1.125rem;
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  .input-wrapper {
    margin-bottom: 2rem;
  }
  
  .choice-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .choice-button {
    padding: 1.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    background: white;
    text-align: left;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .choice-button:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
  }
  
  .choice-button.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .choice-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .choice-description {
    font-size: 0.875rem;
    color: #6b7280;
    line-height: 1.4;
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
    
    .choice-button {
      padding: 1.25rem;
    }
    
    .choice-label {
      font-size: 1rem;
    }
  }
</style>