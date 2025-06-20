<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import Button from "../ui/Button.svelte";
  import Card from "../ui/Card.svelte";
  import { ChevronLeft, ChevronRight, Loader2 } from "lucide-svelte";
  import {
    createTrueFormOpportunity,
    type TrueFormLead,
  } from "$lib/api/trueform";
  import { createWizardManager } from "$lib/stores/wizardManager";
  import type {
    SiteRequestFormData,
    StepValidationEvent,
  } from "$lib/types/wizard.types";
  import { handleError, showSuccess } from "$lib/services/errorService";

  // Step components (commented out - missing wizard directory)
  // import WizardProgress from "./wizard/WizardProgress.svelte";
  // import BasicInfoStep from "./wizard/steps/BasicInfoStep.svelte";
  // import ProjectVisionStep from "./wizard/steps/ProjectVisionStep.svelte";
  // import ProjectTypeStep from "./wizard/steps/ProjectTypeStep.svelte";
  // import DesignBrandingStep from "./wizard/steps/DesignBrandingStep.svelte";
  // import ContentStructureStep from "./wizard/steps/ContentStructureStep.svelte";
  // import UserExperienceStep from "./wizard/steps/UserExperienceStep.svelte";
  // import TechnicalRequirementsStep from "./wizard/steps/TechnicalRequirementsStep.svelte";
  // import TimelineBudgetStep from "./wizard/steps/TimelineBudgetStep.svelte";

  const dispatch = createEventDispatcher();

  // Initial form data
  const initialFormData: SiteRequestFormData = {
    // Step 1: Basic Information
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    industry: "",
    companySize: "",

    // Step 2: Project Vision & Goals
    projectDescription: "",
    primaryGoals: [] as string[],
    targetAudience: "",
    successMetrics: [] as string[],
    competitorExamples: "",

    // Step 3: Website Type & Features
    websiteType: "",
    platformType: "",
    coreFeatures: [] as string[],
    advancedFeatures: [] as string[],
    integrations: [] as string[],

    // Step 4: Design & Branding
    designMood: [] as string[],
    colorPalette: "",
    typography: "",
    visualStyle: "",
    hasLogo: false,
    hasBrandGuidelines: false,
    logoFile: null as File | null,
    brandFiles: [] as File[],

    // Step 5: Content & Structure
    pageStructure: [] as string[],
    contentSections: [] as string[],
    copywriting: "",
    mediaRequirements: [] as string[],

    // Step 6: Functionality & User Experience
    userJourney: "",
    keyInteractions: [] as string[],
    responsiveRequirements: [] as string[],
    performanceRequirements: [] as string[],

    // Step 7: Technical Requirements
    hostingPreference: "",
    domainStatus: "",
    analyticsRequirements: [] as string[],
    securityRequirements: [] as string[],

    // Step 8: Timeline & Additional Info
    timeline: "",
    budgetRange: "",
    launchDate: "",
    additionalRequirements: "",
    inspirationFiles: [] as File[],
  };

  // Create wizard manager
  const wizard = createWizardManager(initialFormData, {
    totalSteps: 8,
    persistenceKey: "site-request-wizard",
  });

  $: ({
    currentStep,
    data: formData,
    isSubmitting,
    submitError,
  } = $wizard.store);

  const steps = [
    "Basic Information",
    "Project Vision",
    "Type & Features",
    "Design & Branding",
    "Content & Structure",
    "User Experience",
    "Technical Details",
    "Timeline & Wrap-up",
  ];

  const stepDescriptions = [
    "Tell us about your company and project basics",
    "Help us understand your vision and goals",
    "What type of platform do you need?",
    "Let's define your visual identity",
    "What content and pages do you need?",
    "How should users interact with your site?",
    "Technical requirements and hosting",
    "Timeline, budget, and final details",
  ];

  // Navigation methods
  function nextStep() {
    wizard.nextStep();
  }

  function prevStep() {
    wizard.prevStep();
  }

  function handleStepValidation(event: CustomEvent<StepValidationEvent>) {
    wizard.setStepValidation(currentStep, event.detail.isValid);
  }

  function updateFormData(updates: Partial<SiteRequestFormData>) {
    wizard.updateData(updates);
  }

  async function submitForm() {
    if ($wizard.store.isSubmitting) return;

    try {
      wizard.setSubmitting(true);
      wizard.setSubmitError("");

      // Create the TrueForm opportunity with enhanced data
      const result = await createTrueFormOpportunity(formData as TrueFormLead);

      if (result.success) {
        dispatch("submit", {
          formData,
          opportunity: result.opportunity,
          contact: result.contact,
        });

        // Clear persistence on successful submission
        wizard.clearPersistence("site-request-wizard");

        await goto(`/request/success?id=${result.opportunity.id}`);
      }
    } catch (error) {
      const errorMessage = handleError(error, "Site Request Wizard Submission");
      wizard.setSubmitError(errorMessage.message);
    } finally {
      wizard.setSubmitting(false);
    }
  }

  // Reactive validation
  $: currentStepValid = wizard.getCurrentStepValid();
</script>

<Card class="max-w-5xl mx-auto">
  <!-- Progress Steps -->
  <WizardProgress {steps} {currentStep} {stepDescriptions} />

  <!-- Error Message -->
  {#if submitError}
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" in:fade>
      <p class="text-red-700 text-sm">{submitError}</p>
    </div>
  {/if}

  <!-- Form Steps -->
  <div class="min-h-96">
    {#if currentStep === 0}
      <div in:fade={{ duration: 300 }}>
        <BasicInfoStep bind:formData on:validation={handleStepValidation} />
      </div>
    {/if}

    {#if currentStep === 1}
      <div in:fade={{ duration: 300 }}>
        <ProjectVisionStep bind:formData on:validation={handleStepValidation} />
      </div>
    {/if}

    {#if currentStep === 2}
      <div in:fade={{ duration: 300 }}>
        <ProjectTypeStep bind:formData on:validation={handleStepValidation} />
      </div>
    {/if}

    {#if currentStep === 3}
      <div in:fade={{ duration: 300 }}>
        <DesignBrandingStep
          bind:formData
          on:validation={handleStepValidation}
        />
      </div>
    {/if}

    {#if currentStep === 4}
      <div in:fade={{ duration: 300 }}>
        <ContentStructureStep
          bind:formData
          on:validation={handleStepValidation}
        />
      </div>
    {/if}

    {#if currentStep === 5}
      <div in:fade={{ duration: 300 }}>
        <UserExperienceStep
          bind:formData
          on:validation={handleStepValidation}
        />
      </div>
    {/if}

    {#if currentStep === 6}
      <div in:fade={{ duration: 300 }}>
        <TechnicalRequirementsStep
          bind:formData
          on:validation={handleStepValidation}
        />
      </div>
    {/if}

    {#if currentStep === 7}
      <div in:fade={{ duration: 300 }}>
        <TimelineBudgetStep
          bind:formData
          on:validation={handleStepValidation}
        />
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <div
    class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"
  >
    <div>
      {#if currentStep > 0}
        <Button
          variant="outline"
          on:click={prevStep}
          class="flex items-center gap-2"
          disabled={isSubmitting}
        >
          <ChevronLeft size={20} />
          Back
        </Button>
      {/if}
    </div>

    <div class="flex gap-3">
      <span class="text-sm text-gray-500 self-center">
        {currentStep + 1} of {steps.length}
      </span>
      {#if currentStep < steps.length - 1}
        <Button
          variant="accent"
          on:click={nextStep}
          disabled={!currentStepValid}
          class="flex items-center gap-2"
        >
          Next Step
          <ChevronRight size={20} />
        </Button>
      {:else}
        <Button
          variant="accent"
          on:click={submitForm}
          disabled={!currentStepValid}
          class="px-8 flex items-center gap-2"
        >
          {#if isSubmitting}
            <Loader2 size={20} class="animate-spin" />
            Creating Your Request...
          {:else}
            Submit Request
          {/if}
        </Button>
      {/if}
    </div>
  </div>
</Card>
