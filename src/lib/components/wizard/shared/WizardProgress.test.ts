import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import WizardProgress from './WizardProgress.svelte';
import type { WizardStep } from '$lib/types';

describe('WizardProgress Component', () => {
  const mockSteps: WizardStep[] = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Enter your basic details',
      isComplete: true,
      isValid: true
    },
    {
      id: 2,
      title: 'Project Details',
      description: 'Describe your project',
      isComplete: false,
      isValid: false
    },
    {
      id: 3,
      title: 'Review & Submit',
      description: 'Review your information',
      isComplete: false,
      isValid: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all wizard steps', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    // Should render step indicators for all steps
    const stepButtons = screen.getAllByRole('button');
    expect(stepButtons).toHaveLength(3);
    
    // Check step numbers/icons
    expect(screen.getByRole('button', { name: '' })).toBeInTheDocument(); // Step 1 (check icon)
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument(); // Step 2 (number)
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument(); // Step 3 (number)
  });

  it('shows check icon for completed steps', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const completedStepButton = screen.getAllByRole('button')[0]; // First step is completed
    const checkIcon = completedStepButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('shows step numbers for incomplete steps', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });

  it('applies correct CSS classes for step status', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const stepButtons = screen.getAllByRole('button');
    
    // First step should be complete
    expect(stepButtons[0]).toHaveClass('complete');
    
    // Second step should be current
    expect(stepButtons[1]).toHaveClass('current');
    
    // Third step should be pending
    expect(stepButtons[2]).toHaveClass('pending');
  });

  it('displays current step title and description', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    expect(screen.getByText('Step 2: Project Details')).toBeInTheDocument();
    expect(screen.getByText('Describe your project')).toBeInTheDocument();
  });

  it('handles step clicks when onStepClick is provided', async () => {
    const onStepClick = vi.fn();
    render(WizardProgress, { 
      steps: mockSteps, 
      currentStep: 2, 
      onStepClick 
    });
    
    const stepButtons = screen.getAllByRole('button');
    
    // Click on completed step (should be accessible)
    await fireEvent.click(stepButtons[0]);
    expect(onStepClick).toHaveBeenCalledWith(1);
    
    // Click on current step (should be accessible)
    await fireEvent.click(stepButtons[1]);
    expect(onStepClick).toHaveBeenCalledWith(2);
    
    // Click on future step (should not be accessible)
    await fireEvent.click(stepButtons[2]);
    expect(onStepClick).not.toHaveBeenCalledWith(3);
  });

  it('applies clickable class when onStepClick is provided and step is accessible', () => {
    const onStepClick = vi.fn();
    render(WizardProgress, { 
      steps: mockSteps, 
      currentStep: 2, 
      onStepClick 
    });
    
    const stepButtons = screen.getAllByRole('button');
    
    // Completed and current steps should be clickable
    expect(stepButtons[0]).toHaveClass('clickable');
    expect(stepButtons[1]).toHaveClass('clickable');
    
    // Future step should not be clickable
    expect(stepButtons[2]).not.toHaveClass('clickable');
  });

  it('disables inaccessible steps', () => {
    const onStepClick = vi.fn();
    render(WizardProgress, { 
      steps: mockSteps, 
      currentStep: 2, 
      onStepClick 
    });
    
    const stepButtons = screen.getAllByRole('button');
    
    // Completed and current steps should be enabled
    expect(stepButtons[0]).not.toBeDisabled();
    expect(stepButtons[1]).not.toBeDisabled();
    
    // Future step should be disabled
    expect(stepButtons[2]).toBeDisabled();
  });

  it('works without onStepClick callback', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const stepButtons = screen.getAllByRole('button');
    
    // None should have clickable class
    stepButtons.forEach(button => {
      expect(button).not.toHaveClass('clickable');
    });
    
    // Only inaccessible steps should be disabled (step 3 is not accessible when currentStep=2)
    expect(stepButtons[0]).not.toBeDisabled(); // Step 1 (completed, always accessible)
    expect(stepButtons[1]).not.toBeDisabled(); // Step 2 (current, always accessible)
    expect(stepButtons[2]).toBeDisabled(); // Step 3 (future, not accessible)
  });

  it('handles empty steps array gracefully', () => {
    render(WizardProgress, { steps: [], currentStep: 1 });
    
    // Should not crash and should show appropriate message
    expect(screen.getByText('Step 1: Unknown')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('handles invalid current step', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 999 });
    
    expect(screen.getByText('Step 999: Unknown')).toBeInTheDocument();
    expect(screen.queryByText('Describe your project')).not.toBeInTheDocument();
  });

  it('renders step connectors between steps', () => {
    const { container } = render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    // Should have connectors between steps (n-1 connectors for n steps)
    const connectors = container.querySelectorAll('.step-connector');
    expect(connectors).toHaveLength(2); // 3 steps = 2 connectors
  });

  it('applies correct connector styling based on completion', () => {
    const { container } = render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const connectors = container.querySelectorAll('.step-connector');
    
    // First connector should be complete (step 1 is complete)
    expect(connectors[0]).toHaveClass('complete');
    
    // Second connector should be pending (step 2 is not complete)
    expect(connectors[1]).toHaveClass('pending');
  });

  it('maintains responsive layout', () => {
    const { container } = render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const progressContainer = container.querySelector('.flex.items-center.justify-between');
    expect(progressContainer).toHaveClass('overflow-x-auto');
    
    // Step containers should not shrink
    const stepContainers = container.querySelectorAll('.flex-shrink-0');
    expect(stepContainers).toHaveLength(3);
  });

  it('applies proper accessibility attributes', () => {
    render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    const stepButtons = screen.getAllByRole('button');
    
    // All should be proper buttons
    stepButtons.forEach(button => {
      expect(button.tagName).toBe('BUTTON');
    });
    
    // Should have proper text content for screen readers
    expect(stepButtons[1]).toHaveTextContent('2');
    expect(stepButtons[2]).toHaveTextContent('3');
  });

  it('has proper semantic structure', () => {
    const { container } = render(WizardProgress, { steps: mockSteps, currentStep: 2 });
    
    // Should have main wizard-progress container
    const wizardProgress = container.querySelector('.wizard-progress');
    expect(wizardProgress).toBeInTheDocument();
    
    // Should have step-info section
    const stepInfo = container.querySelector('.step-info');
    expect(stepInfo).toBeInTheDocument();
    
    // Should have proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Step 2: Project Details');
  });

  it('handles step accessibility correctly', () => {
    const stepsWithMixedCompletion: WizardStep[] = [
      { id: 1, title: 'Step 1', description: 'Desc 1', isComplete: true, isValid: true },
      { id: 2, title: 'Step 2', description: 'Desc 2', isComplete: true, isValid: true },
      { id: 3, title: 'Step 3', description: 'Desc 3', isComplete: false, isValid: false },
      { id: 4, title: 'Step 4', description: 'Desc 4', isComplete: false, isValid: false }
    ];
    
    const onStepClick = vi.fn();
    render(WizardProgress, { 
      steps: stepsWithMixedCompletion, 
      currentStep: 3, 
      onStepClick 
    });
    
    const stepButtons = screen.getAllByRole('button');
    
    // Steps 1, 2, 3 should be accessible (completed or current)
    expect(stepButtons[0]).not.toBeDisabled(); // Completed
    expect(stepButtons[1]).not.toBeDisabled(); // Completed  
    expect(stepButtons[2]).not.toBeDisabled(); // Current
    
    // Step 4 should not be accessible
    expect(stepButtons[3]).toBeDisabled();
  });
}); 