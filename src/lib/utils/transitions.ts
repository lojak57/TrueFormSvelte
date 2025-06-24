import type { FadeParams, FlyParams, SlideParams } from 'svelte/transition';

// Common transition durations
export const DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800
} as const;

// Common delays for staggered animations
export const DELAY = {
  none: 0,
  short: 100,
  medium: 200,
  long: 400,
  stagger: (index: number, base = 50) => index * base
} as const;

// Fade transition presets
export const fadePresets = {
  fast: { duration: DURATION.fast } as FadeParams,
  normal: { duration: DURATION.normal } as FadeParams,
  slow: { duration: DURATION.slow } as FadeParams,
  delayed: { duration: DURATION.normal, delay: DELAY.short } as FadeParams,
  longDelay: { duration: DURATION.normal, delay: DELAY.long } as FadeParams
} as const;

// Fly transition presets
export const flyPresets = {
  // Vertical movement
  fromTop: { y: -30, duration: DURATION.normal } as FlyParams,
  fromBottom: { y: 30, duration: DURATION.normal } as FlyParams,
  fromTopSlow: { y: -50, duration: DURATION.slow } as FlyParams,
  fromBottomSlow: { y: 50, duration: DURATION.slow } as FlyParams,
  
  // Horizontal movement
  fromLeft: { x: -30, duration: DURATION.normal } as FlyParams,
  fromRight: { x: 30, duration: DURATION.normal } as FlyParams,
  
  // With delays (common in wizard steps)
  stepIn: { y: 20, duration: DURATION.normal, delay: DELAY.medium } as FlyParams,
  cardIn: { y: 30, duration: DURATION.slow, delay: DELAY.long } as FlyParams,
  
  // Staggered animations
  staggered: (index: number) => ({ 
    y: 20, 
    duration: DURATION.normal, 
    delay: DELAY.stagger(index) 
  }) as FlyParams,
  
  // Modal/overlay transitions
  modal: { y: 50, duration: DURATION.normal } as FlyParams,
  drawer: { x: 300, duration: DURATION.normal } as FlyParams
} as const;

// Slide transition presets
export const slidePresets = {
  fast: { duration: DURATION.fast } as SlideParams,
  normal: { duration: DURATION.normal } as SlideParams,
  slow: { duration: DURATION.slow } as SlideParams
} as const;

// Combined transition configurations (commonly used together)
export const transitionCombos = {
  // Wizard step transitions
  wizardStep: {
    container: { y: 30, duration: DURATION.slow } as FlyParams,
    title: { y: 20, duration: DURATION.normal, delay: DELAY.medium } as FlyParams,
    subtitle: { y: 20, duration: DURATION.normal, delay: DELAY.long } as FlyParams,
    content: { y: 30, duration: DURATION.slow, delay: DELAY.long } as FlyParams
  },
  
  // List item animations
  listItem: {
    enter: { y: 20, duration: DURATION.normal } as FlyParams,
    exit: { duration: DURATION.fast } as SlideParams
  },
  
  // Card animations
  card: {
    hover: { duration: DURATION.fast } as FadeParams,
    appear: { y: 20, duration: DURATION.normal } as FlyParams
  },
  
  // Form field animations
  form: {
    field: { duration: DURATION.fast } as FadeParams,
    error: { y: -10, duration: DURATION.fast } as FlyParams,
    success: { duration: DURATION.normal } as FadeParams
  }
} as const;

// Utility function to create staggered animations for lists
export function createStaggeredAnimation(
  baseTransition: FlyParams,
  staggerDelay: number = 50
) {
  return (index: number): FlyParams => ({
    ...baseTransition,
    delay: (baseTransition.delay || 0) + (index * staggerDelay)
  });
}

// Utility function to create responsive transitions (reduced motion)
export function createResponsiveTransition<T extends { duration: number }>(
  normalTransition: T,
  reducedMotion: Partial<T> = {}
): T {
  // Check for user's motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (prefersReducedMotion) {
    return {
      ...normalTransition,
      duration: DURATION.fast,
      ...reducedMotion
    };
  }

  return normalTransition;
}

// Export commonly used combinations as convenience functions
export const wizardTransitions = transitionCombos.wizardStep;
export const listTransitions = transitionCombos.listItem;
export const cardTransitions = transitionCombos.card;
export const formTransitions = transitionCombos.form;