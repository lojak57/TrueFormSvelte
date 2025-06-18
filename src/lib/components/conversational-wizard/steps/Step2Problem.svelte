<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import TextInputStep from '../../forms/wizard/components/TextInputStep.svelte';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let value = '';
  
  // Subscribe to store data
  $: if ($conversationalWizard.data.problemDescription) {
    value = $conversationalWizard.data.problemDescription;
  }
  
  const starterPrompts = [
    "We need a complete website from scratch—our business has outgrown what we have...",
    "Our current site looks like it's from 2015 and people notice. It's embarrassing when we send people there...",
    "We're launching this new thing and need a place to explain it properly. Right now we're just sending people to our LinkedIn...", 
    "People visit our site but they don't become customers. We can see the traffic but something's not clicking...",
    "We're completely rebranding—new name, new everything—and need a website that matches this new direction...",
    "Our biggest competitor just launched something that makes us look amateur. We need to step up our game...",
    "When people visit on their phones, they leave immediately. We're probably losing half our potential customers...",
    "We sell stuff but don't have a real online store. People have to email us and it's messy for everyone..."
  ];
  
  function handleComplete(event: CustomEvent) {
    const { value: problemDescription } = event.detail;
    
    conversationalWizard.updateData({ problemDescription });
    conversationalWizard.nextStep();
  }
  
  function goBack() {
    conversationalWizard.prevStep();
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  <div in:fly={{ y: 30, duration: 500 }}>
    <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
      Tell us about your project—no filter needed.
    </h2>
    
    <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
      Dump everything on us. What's bugging you? What do you need? What's the dream?
    </p>
    
    <div class="encouragement-box" in:fly={{ y: 20, duration: 400, delay: 400 }}>
      <div class="icon">💡</div>
      <div class="text">
        <strong>Our specialty:</strong> Taking your messy, incomplete ideas and turning them into something that works. 
        The more you tell us—even the scattered thoughts—the better we can help.
      </div>
    </div>
    
    <div class="input-wrapper" in:fly={{ y: 30, duration: 500, delay: 500 }}>
      <TextInputStep
        {value}
        placeholder="Just start typing... what's the situation? What do you want? What's driving this project? Don't hold back..."
        multiline={true}
        {starterPrompts}
        on:complete={handleComplete}
      />
      
      <InlineReassurance 
        text="Think stream-of-consciousness. We love the details, the context, the 'why'. It all helps us build exactly what you need."
        delay={1400}
      />
    </div>
    
    <button
      on:click={goBack}
      class="back-button"
      in:fade={{ duration: 300, delay: 700 }}
    >
      ← Back
    </button>
  </div>
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
  
  .encouragement-box {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .encouragement-box .icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  .encouragement-box .text {
    color: #1e40af;
    line-height: 1.5;
    font-size: 0.938rem;
  }
  
  .encouragement-box .text strong {
    color: #1e3a8a;
    font-weight: 600;
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