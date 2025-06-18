import { derived, writable } from "svelte/store";

export interface WizardStep {
  id: string;
  section: string;
  component: any; // Will be Svelte component
  title?: string;
  subtitle?: string;
  starterPrompts?: string[]; // Guided options for text inputs
  placeholder?: string; // Example text
  skipLabel?: string; // Option to skip non-required fields
}

export interface WizardState {
  isOpen: boolean;
  currentStepIndex: number;
  answers: Record<string, any>;
  startTime: number;
  completedSteps: Set<string>;
  isSubmitting: boolean;
  isSuccess: boolean;
}

// Rich, consultative wizard - UI/UX masterpiece for design consultation
export const WIZARD_STEPS: WizardStep[] = [
  // Welcome Screen - Sets premium consultation tone
  {
    id: "welcome",
    section: "intro",
    component: null,
    title: "",
    subtitle: "",
  },

  // Step 1: Contact & Company Info (Beautiful, professional form)
  {
    id: "contactInfo",
    section: "discovery",
    component: null,
    title: "Let's get acquainted",
    subtitle: "Every great partnership starts with introductions",
  },

  // Step 2: Vision & Goals (Consultative with emotional hooks)
  {
    id: "projectVision",
    section: "discovery",
    component: null,
    title: "What's your big vision?",
    subtitle: "Tell us about the impact you want to make",
    starterPrompts: [
      "🚀 We're launching something revolutionary and need a stunning showcase",
      "💼 We want to dominate our industry with a premium digital presence",
      "📱 Our outdated site is embarrassing and losing us serious business",
      "🛒 We're ready to sell online and compete with the big players",
      "📅 Our clients need a seamless way to book and engage with us",
      "✨ We're starting fresh and want to make an unforgettable first impression",
    ],
  },

  // Step 3: Industry & Audience (Visual selection with personality)
  {
    id: "brandPersonality",
    section: "discovery",
    component: null,
    title: "Who are you speaking to?",
    subtitle: "Understanding your audience shapes everything we create",
  },

  // Step 4: Design Vibe & Aesthetic (Rich visual selection)
  {
    id: "designVibe",
    section: "design",
    component: null,
    title: "What's your vibe?",
    subtitle: "Let's capture the feeling you want your visitors to experience",
  },

  // Step 5: Website Type & Features (Visual cards with previews)
  {
    id: "websiteScope",
    section: "design",
    component: null,
    title: "What kind of experience are we building?",
    subtitle: "Each type has its own personality and purpose",
  },

  // Step 6: Color & Typography Mood (Interactive design elements)
  {
    id: "designElements",
    section: "design",
    component: null,
    title: "Let's talk colors and style",
    subtitle: "These choices will define your brand's visual voice",
  },

  // Step 7: Inspiration & References (Upload/describe inspirations)
  {
    id: "inspiration",
    section: "design",
    component: null,
    title: "Show us what inspires you",
    subtitle: "Share anything that captures the feeling you're after",
  },

  // Step 8: Timeline & Investment (Contextual with value framing)
  {
    id: "projectContext",
    section: "planning",
    component: null,
    title: "Let's talk timing and investment",
    subtitle: "Great work takes time, but we understand your urgency",
  },

  // Step 9: Decision Process (Relationship building)
  {
    id: "decisionProcess",
    section: "planning",
    component: null,
    title: "How do you make big decisions?",
    subtitle: "We want to make this process smooth for everyone involved",
  },

  // Step 10: Current Challenges (Pain point discovery)
  {
    id: "currentSituation",
    section: "planning",
    component: null,
    title: "What's not working right now?",
    subtitle:
      "Understanding your frustrations helps us solve the right problems",
    starterPrompts: [
      "😤 Our current site makes us look amateur compared to competitors",
      "📱 Nothing works properly on mobile and we're losing mobile customers",
      "🐌 Our site is so slow that people leave before it even loads",
      "🔍 Nobody can find us online - our SEO is basically non-existent",
      "🛒 Our checkout process is a nightmare and killing our sales",
      "📞 We're manually handling everything that should be automated",
    ],
  },

  // Step 11: Success Vision (Future state visualization)
  {
    id: "successVision",
    section: "planning",
    component: null,
    title: "Picture your success",
    subtitle: "When this project is complete, what will have changed?",
  },

  // Step 12: Summary & Next Steps (Exciting conclusion)
  {
    id: "summary",
    section: "review",
    component: null,
    title: "This is going to be amazing!",
    subtitle: "Let's review your vision and start bringing it to life",
  },
];

// Initial state
const initialState: WizardState = {
  isOpen: false,
  currentStepIndex: 0,
  answers: {},
  startTime: 0,
  completedSteps: new Set(),
  isSubmitting: false,
  isSuccess: false,
};

// Create the store
function createWizardStore() {
  const { subscribe, set, update } = writable<WizardState>(initialState);

  return {
    subscribe,

    // Open the wizard
    open: () =>
      update((state) => ({
        ...state,
        isOpen: true,
        startTime: Date.now(),
      })),

    // Close the wizard
    close: () =>
      update((state) => ({
        ...state,
        isOpen: false,
      })),

    // Reset the wizard
    reset: () => set(initialState),

    // Go to next step
    nextStep: () =>
      update((state) => ({
        ...state,
        currentStepIndex: state.currentStepIndex + 1,
      })),

    // Go to previous step
    prevStep: () =>
      update((state) => ({
        ...state,
        currentStepIndex: Math.max(0, state.currentStepIndex - 1),
      })),

    // Jump to specific step
    goToStep: (index: number) =>
      update((state) => ({
        ...state,
        currentStepIndex: index,
      })),

    // Save answer for current step
    saveAnswer: (stepId: string, answer: any) =>
      update((state) => ({
        ...state,
        answers: {
          ...state.answers,
          [stepId]: answer,
        },
        completedSteps: new Set([...state.completedSteps, stepId]),
      })),

    // Get answer for a specific step
    getAnswer: (stepId: string) => {
      let currentAnswers: any;
      subscribe((state) => (currentAnswers = state.answers))();
      return currentAnswers[stepId];
    },

    // Set submitting state
    setSubmitting: (submitting: boolean) =>
      update((state) => ({
        ...state,
        isSubmitting: submitting,
      })),

    // Set success state
    setSuccess: (success: boolean) =>
      update((state) => ({
        ...state,
        isSuccess: success,
      })),
  };
}

export const wizardStore = createWizardStore();

// Derived store for progress percentage - streamlined flow
export const wizardProgress = derived(wizardStore, ($wizard) => {
  const currentIndex = $wizard.currentStepIndex;

  // Simple linear progress for streamlined flow
  return Math.round(((currentIndex + 1) / WIZARD_STEPS.length) * 100);
});

// Derived store for current step
export const currentStep = derived(
  wizardStore,
  ($wizard) => WIZARD_STEPS[$wizard.currentStepIndex] || WIZARD_STEPS[0]
);

// Derived store for section progress
export const sectionProgress = derived(
  [wizardStore, currentStep],
  ([$wizard, $currentStep]) => {
    const currentSection = $currentStep.section;
    const sectionSteps = WIZARD_STEPS.filter(
      (s) => s.section === currentSection
    );
    const currentSectionIndex = sectionSteps.findIndex(
      (s) => s.id === $currentStep.id
    );
    return {
      current: currentSectionIndex + 1,
      total: sectionSteps.length,
      percentage: Math.round(
        ((currentSectionIndex + 1) / sectionSteps.length) * 100
      ),
    };
  }
);
