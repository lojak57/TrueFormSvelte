import { derived, writable } from "svelte/store";

export interface ConversationalWizardData {
  // Step 1: Identity
  name: string;
  email: string;
  phone?: string;
  businessName: string;
  businessWebsite?: string;

  // Step 2: Problem
  problemDescription: string;

  // Step 3: Current Situation
  currentTools: string[];
  frustrations: string;

  // Step 4: Vision
  successVision: string;

  // Step 5: Vibe
  designVibe: string;
  fontFeel: string[];
  colorPalette: string;
  inspirationLinks?: string;

  // Step 6: Relationship
  workingStyle: string;
  wantToTalk: boolean;
  wantMockup: boolean;

  // Step 7: Scoping
  selectedAddons: string[];
  estimatedTotal: number;

  // Meta
  startedAt: number;
  completedAt?: number;
}

interface WizardState {
  currentStep: number;
  data: Partial<ConversationalWizardData>;
  isSubmitting: boolean;
  isComplete: boolean;
  trustAcknowledged: boolean;
}

const initialState: WizardState = {
  currentStep: 0,
  data: {},
  isSubmitting: false,
  isComplete: false,
  trustAcknowledged: false,
};

function createConversationalWizardStore() {
  const { subscribe, set, update } = writable<WizardState>(initialState);

  return {
    subscribe,

    // Navigation with smooth scroll
    nextStep: () => {
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      update((state) => ({
        ...state,
        currentStep: Math.min(state.currentStep + 1, 8),
      }));
    },

    prevStep: () => {
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      update((state) => ({
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      }));
    },

    goToStep: (step: number) => {
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      update((state) => ({
        ...state,
        currentStep: step,
      }));
    },

    // Data updates
    updateData: (data: Partial<ConversationalWizardData>) =>
      update((state) => ({
        ...state,
        data: { ...state.data, ...data },
      })),

    // Trust acknowledgment
    acknowledgeTrust: () =>
      update((state) => ({
        ...state,
        trustAcknowledged: true,
      })),

    // Submission
    setSubmitting: (isSubmitting: boolean) =>
      update((state) => ({
        ...state,
        isSubmitting,
      })),

    complete: () =>
      update((state) => ({
        ...state,
        isComplete: true,
        data: { ...state.data, completedAt: Date.now() },
      })),

    // Reset
    reset: () => set(initialState),

    // Initialize with timestamp
    start: () =>
      update((state) => ({
        ...state,
        data: { ...state.data, startedAt: Date.now() },
      })),
  };
}

export const conversationalWizard = createConversationalWizardStore();

// Derived store for progress
export const wizardProgress = derived(conversationalWizard, ($wizard) => ({
  percentage: Math.round(($wizard.currentStep / 8) * 100),
  currentStep: $wizard.currentStep,
  totalSteps: 8,
}));

// Step configuration
export const WIZARD_STEPS = [
  {
    id: "identity",
    title: "Let's get to know you real quick.",
    fields: ["name", "email", "phone", "businessName", "businessWebsite"],
  },
  {
    id: "problem",
    title: "Describe what you need help building.",
    fields: ["problemDescription"],
  },
  {
    id: "current",
    title: "What's not working right now?",
    fields: ["currentTools", "frustrations"],
  },
  {
    id: "vision",
    title: "Imagine the perfect version.",
    fields: ["successVision"],
  },
  {
    id: "vibe",
    title: "What kind of design are you going for?",
    fields: ["designVibe", "fontFeel", "colorPalette", "inspirationLinks"],
  },
  {
    id: "relationship",
    title: "How do you want to work with us?",
    fields: ["workingStyle", "wantToTalk", "wantMockup"],
  },
  {
    id: "scoping",
    title: "Let's scope your project & add-ons.",
    fields: ["selectedAddons", "estimatedTotal"],
  },
  {
    id: "submission",
    title: "Ready to bring your vision to life?",
    fields: [],
  },
];
