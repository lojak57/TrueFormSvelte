<script lang="ts">
  import { conversationalWizard } from '../conversationalWizardStore';
  import TextInputStep from '../../ui/TextInputStep.svelte';
  import InlineReassurance from '../reassurance/InlineReassurance.svelte';
  import { fade, fly } from 'svelte/transition';
  
  let value = '';
  
  // Subscribe to store data
  $: if ($conversationalWizard.data.successVision) {
    value = $conversationalWizard.data.successVision;
  }
  
  const starterPrompts = [
    "Customers can easily find and contact us—no more explaining where to click or what we do. It just makes sense...",
    "We look as professional as our biggest competitors. Maybe even better. People don't question if we're legitimate anymore...",
    "People trust us immediately when they visit. You can see it in their emails—they're already sold before the first call...",
    "Our site actually converts visitors into customers. We're not just getting traffic anymore, we're getting real business...",
    "We can showcase our work beautifully—everything looks intentional and impressive. People get excited about working with us...",
    "I can update things myself without breaking anything. No more waiting days for simple changes or paying developers for tiny tweaks...",
    "Mobile users have a perfect experience. They're not pinching and zooming or giving up because nothing works on their phone...",
    "We show up first when people search for what we do. Our website helps our SEO instead of hurting it..."
  ];
  
  function handleComplete(event: CustomEvent) {
    const { value: successVision } = event.detail;
    
    conversationalWizard.updateData({ successVision });
    conversationalWizard.nextStep();
  }
  
  function goBack() {
    conversationalWizard.prevStep();
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  <div in:fly={{ y: 30, duration: 500 }}>
    <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
      Paint us the picture—what does success look like?
    </h2>
    
    <p class="step-subtitle" in:fly={{ y: 20, duration: 400, delay: 300 }}>
      6 months from now, this website is working perfectly. What's happening? How do you feel? What changed?
    </p>
    
    <div class="encouragement-box" in:fly={{ y: 20, duration: 400, delay: 400 }}>
      <div class="icon">🎯</div>
      <div class="text">
        <strong>Dream big here.</strong> Tell us about the impact, the feelings, the business outcomes. 
        The more vivid the picture, the better we can build toward that exact vision.
      </div>
    </div>
    
    <div class="input-wrapper" in:fly={{ y: 30, duration: 500, delay: 500 }}>
      <TextInputStep
        {value}
        placeholder="Picture this: customers land on our site and immediately think 'these people know what they're doing.' They trust us before we even talk. The phone rings more. People stop asking if we're a real business..."
        multiline={true}
        {starterPrompts}
        on:complete={handleComplete}
      />
      
      <InlineReassurance 
        text="Go wild with details. How will you know this website is working? What will customers do differently? How will you feel?"
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
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border: 1px solid #bbf7d0;
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
    color: #166534;
    line-height: 1.5;
    font-size: 0.938rem;
  }
  
  .encouragement-box .text strong {
    color: #14532d;
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