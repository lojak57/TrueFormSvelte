import { fireEvent, render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WizardNavigation from "./WizardNavigation.svelte";

describe("WizardNavigation Component", () => {
  const defaultProps = {
    currentStep: 2,
    totalSteps: 3,
    canGoBack: true,
    canGoNext: true,
    isLoading: false,
    isSubmitting: false,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders step counter correctly", () => {
    render(WizardNavigation, defaultProps);

    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("shows Back button when not on first step", () => {
    render(WizardNavigation, defaultProps);

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass("border-gray-300"); // outline variant
  });

  it("hides Back button when on first step", () => {
    render(WizardNavigation, { ...defaultProps, currentStep: 1 });

    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();
  });

  it("shows Next button when not on last step", () => {
    render(WizardNavigation, defaultProps);

    const nextButton = screen.getByRole("button", { name: /next step/i });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveClass("bg-accent-600"); // accent variant
  });

  it("shows Submit button when on last step", () => {
    render(WizardNavigation, { ...defaultProps, currentStep: 3 });

    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveClass("bg-accent-600"); // accent variant
    expect(submitButton).toHaveClass("px-8"); // extra padding
  });

  it("hides Next button when on last step", () => {
    render(WizardNavigation, { ...defaultProps, currentStep: 3 });

    expect(
      screen.queryByRole("button", { name: /next step/i })
    ).not.toBeInTheDocument();
  });

  it("calls onPrevious when Back button is clicked", async () => {
    const onPrevious = vi.fn();
    render(WizardNavigation, { ...defaultProps, onPrevious });

    const backButton = screen.getByRole("button", { name: /back/i });
    await fireEvent.click(backButton);

    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when Next button is clicked", async () => {
    const onNext = vi.fn();
    render(WizardNavigation, { ...defaultProps, onNext });

    const nextButton = screen.getByRole("button", { name: /next step/i });
    await fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when Submit button is clicked", async () => {
    const onSubmit = vi.fn();
    render(WizardNavigation, { ...defaultProps, currentStep: 3, onSubmit });

    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });
    await fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when isLoading is true", () => {
    render(WizardNavigation, { ...defaultProps, isLoading: true });

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /validating/i });

    expect(backButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it("shows loading state in Next button when isLoading", () => {
    render(WizardNavigation, { ...defaultProps, isLoading: true });

    expect(screen.getByText("Validating...")).toBeInTheDocument();

    // Should have loading spinner
    const nextButton = screen.getByRole("button", { name: /validating/i });
    const spinner = nextButton.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("shows loading state in Submit button when isSubmitting", () => {
    render(WizardNavigation, {
      ...defaultProps,
      currentStep: 3,
      isSubmitting: true,
    });

    expect(screen.getByText("Creating Your Request...")).toBeInTheDocument();

    // Should have loading spinner
    const submitButton = screen.getByRole("button", {
      name: /creating your request/i,
    });
    const spinner = submitButton.querySelector("svg");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("hides Next button when canGoNext is false", () => {
    render(WizardNavigation, { ...defaultProps, canGoNext: false });

    // When canGoNext is false, the Next button should be hidden completely
    expect(
      screen.queryByRole("button", { name: /next step/i })
    ).not.toBeInTheDocument();
  });

  it("disables Submit button when canGoNext is false", () => {
    render(WizardNavigation, {
      ...defaultProps,
      currentStep: 3,
      canGoNext: false,
    });

    // When canGoNext is false, the Submit button should be shown but disabled
    const submitButton = screen.getByRole("button", {
      name: /submit request/i,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("hides Back button when canGoBack is false", () => {
    render(WizardNavigation, { ...defaultProps, canGoBack: false });

    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();
  });

  it("hides buttons when callbacks are not provided", () => {
    render(WizardNavigation, {
      ...defaultProps,
      onPrevious: null,
      onNext: null,
      onSubmit: null,
    });

    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /next/i })
    ).not.toBeInTheDocument();
  });

  it("prevents callback execution when loading", async () => {
    const onNext = vi.fn();
    render(WizardNavigation, { ...defaultProps, onNext, isLoading: true });

    const nextButton = screen.getByRole("button", { name: /validating/i });
    await fireEvent.click(nextButton);

    // Callback should not be called because button is disabled
    expect(onNext).not.toHaveBeenCalled();
  });

  it("prevents submit callback when submitting", async () => {
    const onSubmit = vi.fn();
    render(WizardNavigation, {
      ...defaultProps,
      currentStep: 3,
      onSubmit,
      isSubmitting: true,
    });

    const submitButton = screen.getByRole("button", {
      name: /creating your request/i,
    });
    await fireEvent.click(submitButton);

    // Callback should not be called because button is disabled
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("has proper layout structure", () => {
    const { container } = render(WizardNavigation, defaultProps);

    const navigation = container.querySelector(".wizard-navigation");
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveClass("wizard-navigation");

    // Should have three sections
    const navLeft = container.querySelector(".nav-left");
    const navCenter = container.querySelector(".nav-center");
    const navRight = container.querySelector(".nav-right");

    expect(navLeft).toBeInTheDocument();
    expect(navCenter).toBeInTheDocument();
    expect(navRight).toBeInTheDocument();
  });

  it("displays icons correctly in buttons", () => {
    render(WizardNavigation, defaultProps);

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /next step/i });

    // Back button should have ChevronLeft icon
    const backIcon = backButton.querySelector("svg");
    expect(backIcon).toBeInTheDocument();

    // Next button should have ChevronRight icon
    const nextIcon = nextButton.querySelector("svg");
    expect(nextIcon).toBeInTheDocument();
  });

  it("applies correct button styling", () => {
    render(WizardNavigation, defaultProps);

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /next step/i });

    // Both should have flex items-center gap-2
    expect(backButton).toHaveClass("flex", "items-center", "gap-2");
    expect(nextButton).toHaveClass("flex", "items-center", "gap-2");
  });

  it("handles edge case with single step", () => {
    render(WizardNavigation, {
      ...defaultProps,
      currentStep: 1,
      totalSteps: 1,
    });

    expect(screen.getByText("1 of 1")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit request/i })
    ).toBeInTheDocument();
  });

  it("handles step counter display correctly", () => {
    render(WizardNavigation, {
      ...defaultProps,
      currentStep: 5,
      totalSteps: 10,
    });

    expect(screen.getByText("5 of 10")).toBeInTheDocument();

    const stepCounter = screen.getByText("5 of 10");
    expect(stepCounter.closest(".step-counter")).toBeInTheDocument();
  });

  it("maintains accessibility standards", () => {
    render(WizardNavigation, defaultProps);

    // All buttons should be properly labeled
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });

    // Step counter should be readable
    const stepCounter = screen.getByText("2 of 3");
    expect(stepCounter).toBeInTheDocument();
  });

  it("handles complex state combinations correctly", () => {
    // Test middle step with canGoNext false - button should be hidden
    render(WizardNavigation, {
      currentStep: 2,
      totalSteps: 5,
      canGoBack: false,
      canGoNext: false,
      isLoading: false,
      isSubmitting: false,
      onPrevious: vi.fn(),
      onNext: vi.fn(),
      onSubmit: vi.fn(),
    });

    // Should show step counter
    expect(screen.getByText("2 of 5")).toBeInTheDocument();

    // Back should be hidden (canGoBack: false)
    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();

    // Next should be hidden (canGoNext: false)
    expect(
      screen.queryByRole("button", { name: /next step/i })
    ).not.toBeInTheDocument();
  });
});
