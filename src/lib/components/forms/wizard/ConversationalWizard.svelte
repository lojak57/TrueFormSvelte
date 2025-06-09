<script lang="ts">
  import { wizardStore, currentStep, WIZARD_STEPS } from './stores/wizardStore';
  import WizardModal from './WizardModal.svelte';
  import { fade } from 'svelte/transition';
  
  // Import step components
  import WelcomeScreen from './steps/welcome/WelcomeScreen.svelte';
  import TextInputStep from './components/TextInputStep.svelte';
  import VisualSelectionStep from './components/VisualSelectionStep.svelte';
  import IndustryStep from './steps/IndustryStep.svelte';
  import GoalsStep from './steps/GoalsStep.svelte';
  import WebsiteTypeStep from './steps/WebsiteTypeStep.svelte';
  import FeaturesStep from './steps/FeaturesStep.svelte';
  import DesignMoodStep from './steps/DesignMoodStep.svelte';
  import TypographyStep from './steps/TypographyStep.svelte';
  import ColorPaletteStep from './steps/ColorPaletteStep.svelte';
  import BrandingAssetsStep from './steps/BrandingAssetsStep.svelte';
  import TimelineStep from './steps/TimelineStep.svelte';
  import SummaryStep from './steps/SummaryStep.svelte';
  import ContactRoleStep from './steps/ContactRoleStep.svelte';
  
  // Map step IDs to components
  const stepComponents: Record<string, any> = {
    welcome: WelcomeScreen,
    contactRole: ContactRoleStep,
    industry: IndustryStep,
    primaryGoals: GoalsStep,
    websiteType: WebsiteTypeStep,
    coreFeatures: FeaturesStep,
    designMood: DesignMoodStep,
    typography: TypographyStep,
    colorPalette: ColorPaletteStep,
    brandingAssets: BrandingAssetsStep,
    timeline: TimelineStep,
    summary: SummaryStep,
    // Text inputs will use TextInputStep by default
  };
  
  // Get current step component
  $: StepComponent = stepComponents[$currentStep.id] || TextInputStep;
  
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
      wizardStore.saveAnswer($currentStep.id, value);
    }
    
    // Add a small delay for smooth transitions
    setTimeout(() => {
      // Move to next step
      if ($wizardStore.currentStepIndex < WIZARD_STEPS.length - 1) {
        wizardStore.nextStep();
      } else {
        // We're done! Submit the form
        handleSubmit();
      }
    }, 400); // Small delay to show selection before transitioning
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
  
  // Example data for different step types
  function getStepProps(step: any) {
    switch (step.id) {
      case 'welcome':
        return {
          // WelcomeScreen doesn't need any props
        };
        
      case 'companyName':
        return {
          value: $wizardStore.answers.companyName || '',
          placeholder: step.placeholder,
          starterPrompts: step.starterPrompts,
          autocomplete: 'organization'
        };
        
      case 'contactRole':
        return {
          selected: $wizardStore.answers.contactRole || ''
        };
        
      case 'industry':
        return {
          selected: $wizardStore.answers.industry || ''
        };
        
      case 'primaryGoals':
        return {
          selected: $wizardStore.answers.primaryGoals || ''
        };
        
      case 'websiteType':
        return {
          selected: $wizardStore.answers.websiteType || ''
        };
        
      case 'coreFeatures':
        return {
          selected: $wizardStore.answers.coreFeatures || [],
          websiteType: $wizardStore.answers.websiteType || ''
        };
        
      case 'designMood':
        return {
          selected: $wizardStore.answers.designMood || []
        };
        
      case 'typography':
        return {
          selected: $wizardStore.answers.typography || ''
        };
        
      case 'colorPalette':
        return {
          selected: $wizardStore.answers.colorPalette || '',
          designMood: $wizardStore.answers.designMood || []
        };
        
      case 'brandingAssets':
        return {
          selected: $wizardStore.answers.brandingAssets || { hasBrandAssets: '', files: [] }
        };
        
      case 'timeline':
        return {
          selected: $wizardStore.answers.timeline || ''
        };
        
      case 'summary':
        return {
          // Summary step doesn't need props, it reads from wizardStore directly
        };
        
      default:
        return {
          value: $wizardStore.answers[step.id] || '',
          placeholder: step.placeholder,
          starterPrompts: step.starterPrompts || [],
          skipLabel: step.skipLabel,
          autocomplete: getAutocompleteValue(step.id),
          inputType: getInputType(step.id),
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