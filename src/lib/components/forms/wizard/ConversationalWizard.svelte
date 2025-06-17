<script lang="ts">
  import { wizardStore, currentStep, WIZARD_STEPS } from './stores/wizardStore';
  import WizardModal from './WizardModal.svelte';
  import { fade } from 'svelte/transition';
  
  // Import step components for rich consultation experience
  import WelcomeScreen from './steps/welcome/WelcomeScreen.svelte';
  import ContactInfoStep from './steps/ContactInfoStep.svelte';
  import BrandPersonalityStep from './steps/BrandPersonalityStep.svelte';
  import PremiumDesignVibeStep from './steps/PremiumDesignVibeStep.svelte';
  import InspirationStep from './steps/InspirationStep.svelte';
  import SuccessVisionStep from './steps/SuccessVisionStep.svelte';
  import TextInputStep from './components/TextInputStep.svelte';
  import EnhancedWebsiteTypeStep from './steps/EnhancedWebsiteTypeStep.svelte';
  import CurrentSituationStep from './steps/CurrentSituationStep.svelte';
  import SummaryStep from './steps/SummaryStep.svelte';
  
  // Map step IDs to rich visual components
  const stepComponents: Record<string, any> = {
    welcome: WelcomeScreen,
    contactInfo: ContactInfoStep, // Beautiful contact form
    projectVision: TextInputStep, // Vision with emotional prompts
    brandPersonality: BrandPersonalityStep, // Industry + audience + personality
    designVibe: PremiumDesignVibeStep, // Premium visual vibe selection
    websiteScope: EnhancedWebsiteTypeStep, // Website type + features with visual previews
    designElements: TextInputStep, // Color + typography (simplified for now)
    inspiration: InspirationStep, // Visual inspiration collection
    projectContext: TextInputStep, // Timeline + budget
    decisionProcess: TextInputStep, // Decision making process
    currentSituation: CurrentSituationStep, // Pain points with emojis
    successVision: SuccessVisionStep, // Future state visualization
    summary: SummaryStep,
  };
  
  // Get current step component
  $: StepComponent = stepComponents[$currentStep.id] || TextInputStep;
  
  // Simple linear step progression for streamlined flow
  function getNextStep(currentStepId: string, answer: any): number {
    const currentIndex = $wizardStore.currentStepIndex;
    
    // Simple linear progression
    return currentIndex + 1;
  }

  // Handle step completion
  function handleStepComplete(event: CustomEvent) {
    const { value, skipped } = event.detail || {};
    
    // Special handling for summary step
    if ($currentStep.id === 'summary') {
      handleSubmit();
      return;
    }
    
    // Save the answer
    if (!skipped && value !== undefined) {
      // Special handling for contactInfo step - save individual fields
      if ($currentStep.id === 'contactInfo' && typeof value === 'object') {
        Object.keys(value).forEach(key => {
          wizardStore.saveAnswer(key, value[key]);
        });
      }
      wizardStore.saveAnswer($currentStep.id, value);
    }
    
    // Add a small delay for smooth transitions
    setTimeout(() => {
      const nextStepIndex = getNextStep($currentStep.id, value);
      
      if (nextStepIndex < WIZARD_STEPS.length) {
        wizardStore.goToStep(nextStepIndex);
      } else {
        // We're done! Submit the form
        handleSubmit();
      }
    }, 400);
  }
  
  async function handleSubmit() {
    // Set submitting state
    wizardStore.setSubmitting(true);
    
    // Collect all answers and submit
    const formData = $wizardStore.answers;
    console.log('Submitting form data:', formData);
    
    try {
      // Call the API to create the opportunity
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }
      
      // Set success state
      wizardStore.setSuccess(true);
      
      // Show success message
      alert('Thank you! Your project request has been submitted. We\'ll be in touch within 24 hours.');
      
      // Close and reset the wizard after a delay
      setTimeout(() => {
        wizardStore.close();
        wizardStore.reset();
      }, 2000);
      
      // Optionally redirect to a thank you page
      // window.location.href = '/thank-you';
    } catch (error) {
      console.error('Error submitting form:', error);
      wizardStore.setSubmitting(false);
      alert('There was an error submitting your request. Please try again.');
    }
  }
  
  // Helper function to get autocomplete values
  function getAutocompleteValue(stepId: string): string {
    const autocompleteMap: Record<string, string> = {
      companyName: 'organization',
      contactName: 'name',
      contactEmail: 'email',
      contactPhone: 'tel',
      // Other fields don't have standard autocomplete values
    };
    return autocompleteMap[stepId] || '';
  }
  
  // Helper function to get input type
  function getInputType(stepId: string): string {
    const typeMap: Record<string, string> = {
      contactEmail: 'email',
      contactPhone: 'tel',
    };
    return typeMap[stepId] || 'text';
  }
  
  // Props for rich visual step components
  function getStepProps(step: any) {
    switch (step.id) {
      case 'welcome':
        return {};
        
      case 'contactInfo':
        return {
          value: $wizardStore.answers.contactInfo || {
            companyName: $wizardStore.answers.companyName || '',
            contactName: $wizardStore.answers.contactName || '',
            contactEmail: $wizardStore.answers.contactEmail || '',
            contactPhone: $wizardStore.answers.contactPhone || ''
          }
        };
        
      case 'projectVision':
        return {
          value: $wizardStore.answers.projectVision || '',
          placeholder: 'Share your vision and what impact you want to make...',
          starterPrompts: step.starterPrompts || [],
          name: step.id
        };
        
      case 'brandPersonality':
        return {
          selected: $wizardStore.answers.brandPersonality || {
            industry: '',
            audience: '',
            personality: []
          }
        };
        
      case 'designVibe':
        return {
          selected: $wizardStore.answers.designVibe || []
        };
        
      case 'websiteScope':
        return {
          selected: $wizardStore.answers.websiteScope || '',
          showFeatures: true
        };
        
      case 'designElements':
        return {
          value: $wizardStore.answers.designElements || '',
          placeholder: 'Describe your ideal colors, fonts, and visual style...',
          name: step.id
        };
        
      case 'inspiration':
        return {
          selected: $wizardStore.answers.inspiration || {
            websiteUrls: [],
            description: '',
            keywords: [],
            feeling: ''
          }
        };
        
      case 'projectContext':
        return {
          value: $wizardStore.answers.projectContext || '',
          placeholder: 'Timeline, budget range, and any constraints...',
          name: step.id
        };
        
      case 'decisionProcess':
        return {
          value: $wizardStore.answers.decisionProcess || '',
          placeholder: 'Who\'s involved in decisions and how do you typically choose partners?',
          name: step.id
        };
        
      case 'currentSituation':
        return {
          selected: $wizardStore.answers.currentSituation || '',
          starterPrompts: step.starterPrompts || []
        };
        
      case 'successVision':
        return {
          selected: $wizardStore.answers.successVision || []
        };
        
      case 'summary':
        return {};
        
      default:
        return {
          value: $wizardStore.answers[step.id] || '',
          placeholder: step.placeholder,
          starterPrompts: step.starterPrompts || [],
          name: step.id
        };
    }
  }
</script>

<WizardModal>
  {#key $currentStep.id}
    <div 
      in:fade={{ duration: 300, delay: 150 }} 
      out:fade={{ duration: 200 }}
      class="transition-all duration-300"
    >
      <svelte:component 
        this={StepComponent}
        {...getStepProps($currentStep)}
        on:complete={handleStepComplete}
      />
    </div>
  {/key}
</WizardModal> 