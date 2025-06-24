import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import CTAButtons from "./CTAButtons.svelte";

describe("CTAButtons Component", () => {
  it("renders Get Started button", () => {
    render(CTAButtons);

    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeInTheDocument();
  });

  it("applies responsive visibility classes", () => {
    const { container } = render(CTAButtons);

    const buttonContainer = container.firstChild as HTMLElement;
    expect(buttonContainer).toHaveClass(
      "hidden",
      "md:flex",
      "items-center",
      "space-x-4"
    );
  });

  it("renders button with correct variant and size", () => {
    render(CTAButtons);

    const button = screen.getByRole("button", { name: /get started/i });
    expect(button).toHaveClass("bg-accent-600", "text-white");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm"); // size="sm"
  });

  it("applies custom styling classes", () => {
    render(CTAButtons);

    const button = screen.getByRole("button", { name: /get started/i });
    expect(button).toHaveClass("text-sm");
    expect(button).toHaveClass(
      "shadow-lg",
      "hover:shadow-xl",
      "transition-shadow",
      "duration-300"
    );
  });

  it("renders Zap icon in Get Started button", () => {
    render(CTAButtons);

    const button = screen.getByRole("button", { name: /get started/i });

    // Check for SVG icon (Lucide icons render as SVGs)
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("maintains semantic structure", () => {
    const { container } = render(CTAButtons);

    // Should be wrapped in a flex container
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.tagName).toBe("DIV");
    expect(outerDiv).toHaveClass(
      "hidden",
      "md:flex",
      "items-center",
      "space-x-4"
    );

    // Should contain 1 button element
    const buttons = outerDiv.querySelectorAll("button");
    expect(buttons).toHaveLength(1);
  });

  it("uses imported Button component with correct props", () => {
    render(CTAButtons);

    const button = screen.getByRole("button", { name: /get started/i });
    expect(button).toHaveClass("bg-accent-600"); // accent variant
    expect(button).toHaveClass("px-3", "py-1.5"); // sm size
  });
});
