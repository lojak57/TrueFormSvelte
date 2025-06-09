import { writable, derived } from 'svelte/store';

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

// Step definitions with starter prompts
export const WIZARD_STEPS: WizardStep[] = [
  // Welcome
  {
    id: 'welcome',
    section: 'intro',
    component: null, // Will import later
    title: '',
    subtitle: ''
  },
  
  // Company Name with examples
  {
    id: 'companyName',
    section: 'basic',
    component: null,
    title: "First, what's your company name?",
    placeholder: 'e.g., Acme Corp, Smith & Associates, TechStart Inc.',
    starterPrompts: [
      'Just use my name',
      'It\'s a new startup',
      'Still deciding on the name'
    ]
  },
  
  // Contact Name with friendly options
  {
    id: 'contactName',
    section: 'basic',
    component: null,
    title: 'And who am I speaking with?',
    placeholder: 'e.g., John Smith',
    subtitle: 'Your first and last name'
  },
  
  // Contact Role - new step with dropdown
  {
    id: 'contactRole',
    section: 'basic',
    component: null,
    title: 'What\'s your role in the company?',
    subtitle: 'This helps us understand your decision-making authority'
  },
  
  // Email with domain suggestions
  {
    id: 'contactEmail',
    section: 'basic',
    component: null,
    title: 'What\'s the best email to reach you?',
    placeholder: 'you@company.com',
    subtitle: 'We\'ll send project updates here'
  },
  
  // Phone number - important but optional
  {
    id: 'contactPhone',
    section: 'basic',
    component: null,
    title: 'What\'s the best number to reach you?',
    placeholder: '(555) 123-4567',
    subtitle: 'For quick questions and project coordination',
    skipLabel: 'I prefer email only'
  },
  
  // Industry with visual cards + "Other" option
  {
    id: 'industry',
    section: 'basic',
    component: null,
    title: 'What industry are you in?',
    subtitle: 'This helps us tailor your site'
    // Will show top 8 industries + "Other" + "Multiple industries"
  },
  
  // Project Description with starter templates
  {
    id: 'projectDescription',
    section: 'vision',
    component: null,
    title: 'Tell us about your project',
    subtitle: 'In your own words, or use a starter below',
    starterPrompts: [
      'We need a modern website to showcase our services and generate leads',
      'We\'re launching a new product and need an online presence',
      'Our current website is outdated and doesn\'t work on mobile',
      'We want to start selling our products online',
      'We need a platform for our customers to book appointments',
      'We\'re a new business and need our first website'
    ]
  },
  
  // Goals with descriptions
  {
    id: 'primaryGoals',
    section: 'vision',
    component: null,
    title: 'What\'s your main goal?',
    subtitle: 'Pick the most important one (you can add more next)'
  },
  
  // Target Audience with templates
  {
    id: 'targetAudience',
    section: 'vision',
    component: null,
    title: 'Who\'s your ideal customer?',
    starterPrompts: [
      'Small business owners who need our services',
      'Consumers looking for quality products',
      'Enterprise companies in our industry',
      'Local community members',
      'Young professionals aged 25-40',
      'Parents and families',
      'B2B decision makers',
      'Anyone interested in our topic'
    ],
    skipLabel: 'I\'ll figure this out later'
  },
  
  // Website Type - already visual
  {
    id: 'websiteType',
    section: 'type',
    component: null,
    title: 'What type of website do you need?',
    subtitle: 'Don\'t worry if you need features from multiple types'
  },
  
  // Features with smart defaults
  {
    id: 'coreFeatures',
    section: 'features',
    component: null,
    title: 'Which features do you need?',
    subtitle: 'Select the features that matter most to your business'
  },

  // Design Mood
  {
    id: 'designMood',
    section: 'design',
    component: null,
    title: 'How should your site feel?',
    subtitle: 'Pick one or two that resonate'
  },
  
  // Typography Style
  {
    id: 'typography',
    section: 'design',
    component: null,
    title: 'What typography style fits your brand?',
    subtitle: 'Typography sets the tone for your entire website'
  },
  
  // Color with smart suggestions
  {
    id: 'colorPalette',
    section: 'design',
    component: null,
    title: 'Color preferences?',
    subtitle: 'We\'ll suggest palettes based on your mood choice'
  },
  
  // Branding Assets
  {
    id: 'brandingAssets',
    section: 'design',
    component: null,
    title: 'Do you have existing brand materials?',
    subtitle: 'Logos, colors, fonts, or brand guidelines we should know about'
  },
  
  // Timeline with context
  {
    id: 'timeline',
    section: 'planning',
    component: null,
    title: 'When do you need this?',
    subtitle: 'Be realistic - good things take time',
    starterPrompts: [
      'ASAP - I have a deadline',
      'Within a month',
      'Next 2-3 months',
      'No rush, let\'s do it right'
    ]
  },
  
  // Additional info with prompts
  {
    id: 'additionalInfo',
    section: 'planning',
    component: null,
    title: 'Anything else we should know?',
    starterPrompts: [
      'I have existing branding/logos',
      'I need help with content writing',
      'This needs to integrate with existing systems',
      'I have specific accessibility requirements',
      'I want to be able to update it myself',
      'I have examples of sites I like'
    ],
    skipLabel: 'No, I think we covered everything!'
  },
  
  // Summary/Review
  {
    id: 'summary',
    section: 'review',
    component: null,
    title: 'Review Your Project',
    subtitle: 'Almost done! Let\'s make sure we got everything right'
  }
];

// Initial state
const initialState: WizardState = {
  isOpen: false,
  currentStepIndex: 0,
  answers: {},
  startTime: 0,
  completedSteps: new Set(),
  isSubmitting: false,
  isSuccess: false
};

// Create the store
function createWizardStore() {
  const { subscribe, set, update } = writable<WizardState>(initialState);

  return {
    subscribe,
    
    // Open the wizard
    open: () => update(state => ({
      ...state,
      isOpen: true,
      startTime: Date.now()
    })),
    
    // Close the wizard
    close: () => update(state => ({
      ...state,
      isOpen: false
    })),
    
    // Reset the wizard
    reset: () => set(initialState),
    
    // Go to next step
    nextStep: () => update(state => ({
      ...state,
      currentStepIndex: state.currentStepIndex + 1
    })),
    
    // Go to previous step
    prevStep: () => update(state => ({
      ...state,
      currentStepIndex: Math.max(0, state.currentStepIndex - 1)
    })),
    
    // Jump to specific step
    goToStep: (index: number) => update(state => ({
      ...state,
      currentStepIndex: index
    })),
    
    // Save answer for current step
    saveAnswer: (stepId: string, answer: any) => update(state => ({
      ...state,
      answers: {
        ...state.answers,
        [stepId]: answer
      },
      completedSteps: new Set([...state.completedSteps, stepId])
    })),
    
    // Get answer for a specific step
    getAnswer: (stepId: string) => {
      let currentAnswers: any;
      subscribe(state => currentAnswers = state.answers)();
      return currentAnswers[stepId];
    },
    
    // Set submitting state
    setSubmitting: (submitting: boolean) => update(state => ({
      ...state,
      isSubmitting: submitting
    })),
    
    // Set success state
    setSuccess: (success: boolean) => update(state => ({
      ...state,
      isSuccess: success
    }))
  };
}

export const wizardStore = createWizardStore();

// Derived store for progress percentage
export const wizardProgress = derived(
  wizardStore,
  $wizard => {
    return Math.round(($wizard.currentStepIndex / WIZARD_STEPS.length) * 100);
  }
);

// Derived store for current step
export const currentStep = derived(
  wizardStore,
  $wizard => WIZARD_STEPS[$wizard.currentStepIndex] || WIZARD_STEPS[0]
);

// Derived store for section progress
export const sectionProgress = derived(
  [wizardStore, currentStep],
  ([$wizard, $currentStep]) => {
    const currentSection = $currentStep.section;
    const sectionSteps = WIZARD_STEPS.filter(s => s.section === currentSection);
    const currentSectionIndex = sectionSteps.findIndex(s => s.id === $currentStep.id);
    return {
      current: currentSectionIndex + 1,
      total: sectionSteps.length,
      percentage: Math.round(((currentSectionIndex + 1) / sectionSteps.length) * 100)
    };
  }
); 