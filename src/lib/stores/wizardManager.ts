import type { Writable } from "svelte/store";
import { derived, writable } from "svelte/store";

export interface WizardState<T = Record<string, unknown>> {
  currentStep: number;
  totalSteps: number;
  data: T;
  validation: Record<number, boolean>;
  isSubmitting: boolean;
  submitError: string;
}

export interface WizardConfig {
  totalSteps: number;
  persistenceKey?: string;
}

export class WizardManager<T = Record<string, unknown>> {
  private _store: Writable<WizardState<T>>;
  public readonly store;

  constructor(initialData: T, config: WizardConfig) {
    const initialState: WizardState<T> = {
      currentStep: 0,
      totalSteps: config.totalSteps,
      data: initialData,
      validation: {},
      isSubmitting: false,
      submitError: "",
    };

    // Load from localStorage if persistence key is provided
    if (config.persistenceKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(config.persistenceKey);
      if (saved) {
        try {
          const parsedState = JSON.parse(saved);
          initialState.data = { ...initialData, ...parsedState.data };
          initialState.currentStep = parsedState.currentStep || 0;
        } catch (error) {
          console.warn("Failed to load wizard state from localStorage:", error);
        }
      }
    }

    this._store = writable(initialState);
    this.store = derived(this._store, (state) => state);

    // Auto-save to localStorage when data changes
    if (config.persistenceKey && typeof window !== "undefined") {
      this._store.subscribe((state) => {
        try {
          localStorage.setItem(
            config.persistenceKey!,
            JSON.stringify({
              data: state.data,
              currentStep: state.currentStep,
            })
          );
        } catch (error) {
          console.warn("Failed to save wizard state to localStorage:", error);
        }
      });
    }
  }

  // Navigation methods
  nextStep() {
    this._store.update((state) => {
      if (state.currentStep < state.totalSteps - 1) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;
    });
  }

  prevStep() {
    this._store.update((state) => {
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;
    });
  }

  goToStep(step: number) {
    this._store.update((state) => {
      if (step >= 0 && step < state.totalSteps) {
        return { ...state, currentStep: step };
      }
      return state;
    });
  }

  // Data methods
  updateData(updates: Partial<T>): void {
    this._store.update((state) => ({
      ...state,
      data: { ...state.data, ...updates },
    }));
  }

  setData(data: T) {
    this._store.update((state) => ({
      ...state,
      data,
    }));
  }

  // Validation methods
  setStepValidation(step: number, isValid: boolean) {
    this._store.update((state) => ({
      ...state,
      validation: { ...state.validation, [step]: isValid },
    }));
  }

  isStepValid(step: number): boolean {
    let isValid = false;
    this._store.subscribe((state) => {
      isValid = state.validation[step] || false;
    })();
    return isValid;
  }

  getCurrentStepValid(): boolean {
    let isValid = false;
    this._store.subscribe((state) => {
      isValid = state.validation[state.currentStep] || false;
    })();
    return isValid;
  }

  // Submission methods
  setSubmitting(isSubmitting: boolean) {
    this._store.update((state) => ({
      ...state,
      isSubmitting,
    }));
  }

  setSubmitError(error: string) {
    this._store.update((state) => ({
      ...state,
      submitError: error,
    }));
  }

  // Reset methods
  reset(data: T) {
    this._store.set({
      currentStep: 0,
      totalSteps: 0,
      data,
      validation: {},
      isSubmitting: false,
      submitError: "",
    });
  }

  clearPersistence(persistenceKey: string) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(persistenceKey);
    }
  }
}

// Helper function to create a wizard manager
export function createWizardManager<T>(initialData: T, config: WizardConfig) {
  return new WizardManager(initialData, config);
}
