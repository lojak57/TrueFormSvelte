<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import Card from "../ui/Card.svelte";
  import WizardProgress from "./shared/WizardProgress.svelte";
  import WizardNavigation from "./shared/WizardNavigation.svelte";
  import Step1BasicInfo from "./steps/Step1BasicInfo.svelte";
  import type {
    SiteRequestFormData,
    WizardStep,
    WizardValidationResult,
    WizardSubmitEvent,
    BasicInfoStep,
  } from "$lib/types/wizard.types";

  const dispatch = createEventDispatcher<{
    submit: WizardSubmitEvent;
  }>();

  // Wizard state
  let currentStep = 1;
  let isSubmitting = false;
  let submitError = "";
  let stepErrors: Record<string, string> = {};

  // Form data - starts with empty/default values
  let formData: SiteRequestFormData = {
    // Step 1: Basic Information
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    industry: "",
    companySize: "",

    // Step 2: Project Vision & Goals
    projectDescription: "",
    primaryGoals: [],
    targetAudience: "",
    successMetrics: [],
    competitorExamples: "",

    // Step 3: Website Type & Features
    websiteType: "",
    platformType: "",
    coreFeatures: [],
    advancedFeatures: [],
    integrations: [],

    // Step 4: Design & Branding
    designMood: [],
    colorPalette: "",
    typography: "",
    visualStyle: "",
    hasLogo: false,
    hasBrandGuidelines: false,
    logoFile: null,
    brandFiles: [],

    // Step 5: Content & Structure
    pageStructure: [],
    contentSections: [],
    copywriting: "",
    mediaRequirements: [],

    // Step 6: Functionality & User Experience
    userJourney: "",
    keyInteractions: [],
    responsiveRequirements: [],
    performanceRequirements: [],

    // Step 7: Technical Requirements
    hostingPreference: "",
    domainStatus: "",
    analyticsRequirements: [],
    securityRequirements: [],

    // Step 8: Timeline & Additional Info
    timeline: "",
    budgetRange: "",
    launchDate: "",
    additionalRequirements: "",
    inspirationFiles: [],
  };

  // Wizard steps configuration
  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Basic Information",
      description: "Tell us about your company and project basics",
      isComplete: false,
      isValid: false,
    },
    {
      id: 2,
      title: "Project Vision",
      description: "Help us understand your vision and goals",
      isComplete: false,
      isValid: false,
    },
    {
      id: 3,
      title: "Type & Features",
      description: "What type of platform do you need?",
      isComplete: false,
      isValid: false,
    },
    {
      id: 4,
      title: "Design & Branding",
      description: "Let's define your visual identity",
      isComplete: false,
      isValid: false,
    },
    {
      id: 5,
      title: "Content & Structure",
      description: "What content and pages do you need?",
      isComplete: false,
      isValid: false,
    },
    {
      id: 6,
      title: "User Experience",
      description: "How should users interact with your site?",
      isComplete: false,
      isValid: false,
    },
    {
      id: 7,
      title: "Technical Details",
      description: "Technical requirements and hosting",
      isComplete: false,
      isValid: false,
    },
    {
      id: 8,
      title: "Timeline & Wrap-up",
      description: "Timeline, budget, and final details",
      isComplete: false,
      isValid: false,
    },
  ];

  // Helper functions
  function validateCurrentStep(): WizardValidationResult {
    const errors: Record<string, string> = {};
    let isValid = true;

    switch (currentStep) {
      case 1: // Basic Information
        if (!formData.companyName?.trim()) {
          errors.companyName = "Company name is required";
          isValid = false;
        }

        if (!formData.contactName?.trim()) {
          errors.contactName = "Contact name is required";
          isValid = false;
        }

        if (!formData.contactEmail?.trim()) {
          errors.contactEmail = "Email is required";
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
          errors.contactEmail = "Please enter a valid email address";
          isValid = false;
        }

        if (!formData.industry?.trim()) {
          errors.industry = "Please select an industry";
          isValid = false;
        }
        break;

      // TODO: Add validation for other steps
      default:
        break;
    }

    return { isValid, errors };
  }

  function updateStepStatus(stepId: number, isValid: boolean) {
    steps[stepId - 1].isValid = isValid;
    steps[stepId - 1].isComplete = isValid;
  }

  // Event handlers
  function handleStepChange(field: string, value: any) {
    // Update form data
    (formData as any)[field] = value;

    // Clear any existing errors for this field
    if (stepErrors[field]) {
      const { [field]: _, ...rest } = stepErrors;
      stepErrors = rest;
    }

    // Validate current step
    const validation = validateCurrentStep();
    stepErrors = validation.errors;
    updateStepStatus(currentStep, validation.isValid);
  }

  function handlePrevious() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  function handleNext() {
    const validation = validateCurrentStep();

    if (validation.isValid && currentStep < steps.length) {
      stepErrors = {};
      updateStepStatus(currentStep, true);
      currentStep++;
    } else {
      stepErrors = validation.errors;
    }
  }

  function handleStepClick(step: number) {
    // Allow clicking on current step or completed steps
    if (step <= currentStep || steps[step - 1]?.isComplete) {
      currentStep = step;
    }
  }

  async function handleSubmit() {
    const validation = validateCurrentStep();

    if (!validation.isValid) {
      stepErrors = validation.errors;
      return;
    }

    try {
      isSubmitting = true;
      submitError = "";

      // TODO: Replace with actual API call
      console.log("Submitting wizard data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Dispatch submit event
      dispatch("submit", {
        formData,
        opportunity: { id: "temp-123" },
        contact: { id: "temp-contact-456" },
      });

      // Navigate to success page
      await goto("/request/success");
    } catch (error) {
      console.error("Error submitting form:", error);
      submitError =
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  // Reactive statements
  $: currentStepData = steps.find((s) => s.id === currentStep);
  $: canGoBack = currentStep > 1;
  $: canGoNext = currentStepData?.isValid ?? false;

  // Extract step-specific data for components
  $: step1Data = {
    companyName: formData.companyName,
    contactName: formData.contactName,
    contactEmail: formData.contactEmail,
    contactPhone: formData.contactPhone,
    industry: formData.industry,
    companySize: formData.companySize,
  } satisfies BasicInfoStep;
</script>

<Card class="max-w-5xl mx-auto">
  <!-- Progress Steps -->
  <WizardProgress {steps} {currentStep} onStepClick={handleStepClick} />

  <!-- Error Message -->
  {#if submitError}
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" in:fade>
      <p class="text-red-700 text-sm">{submitError}</p>
    </div>
  {/if}

  <!-- Form Steps -->
  <div class="min-h-96">
    {#if currentStep === 1}
      <div in:fade={{ duration: 300 }}>
        <Step1BasicInfo
          data={step1Data}
          errors={stepErrors}
          on:change={(e) => handleStepChange(e.detail.field, e.detail.value)}
        />
      </div>
    {/if}

    <!-- TODO: Add other step components -->
    {#if currentStep === 2}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Project Vision Step
          </h3>
          <p class="text-gray-600">Step 2 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 3}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Website Type & Features
          </h3>
          <p class="text-gray-600">Step 3 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 4}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Design & Branding
          </h3>
          <p class="text-gray-600">Step 4 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 5}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Content & Structure
          </h3>
          <p class="text-gray-600">Step 5 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 6}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            User Experience
          </h3>
          <p class="text-gray-600">Step 6 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 7}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Technical Requirements
          </h3>
          <p class="text-gray-600">Step 7 component coming soon...</p>
        </div>
      </div>
    {/if}

    {#if currentStep === 8}
      <div in:fade={{ duration: 300 }}>
        <div class="text-center py-12">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">
            Timeline & Budget
          </h3>
          <p class="text-gray-600">Step 8 component coming soon...</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <WizardNavigation
    {currentStep}
    totalSteps={steps.length}
    {canGoBack}
    {canGoNext}
    {isSubmitting}
    onPrevious={handlePrevious}
    onNext={handleNext}
    onSubmit={handleSubmit}
  />
</Card>
