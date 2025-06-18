import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import CTAButtons from "./CTAButtons.svelte";

describe("CTAButtons Component", () => {
  it("renders both CTA buttons", () => {
    render(CTAButtons);

    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeInTheDocument();
  });

  it("has correct navigation links", () => {
    render(CTAButtons);

    const adminLink = screen.getByRole("link", { name: /admin/i });
    expect(adminLink).toHaveAttribute("href", "/admin/opportunities");

    const getStartedLink = screen.getByRole("link", { name: /get started/i });
    expect(getStartedLink).toHaveAttribute("href", "/request");
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

  it("renders buttons with correct variants and sizes", () => {
    render(CTAButtons);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);

    // Admin button should be outline variant
    const adminButton = buttons[0];
    expect(adminButton).toHaveClass(
      "border",
      "border-gray-300",
      "bg-white",
      "text-gray-900"
    );
    expect(adminButton).toHaveClass("px-3", "py-1.5", "text-sm"); // size="sm"

    // Get Started button should be accent variant
    const getStartedButton = buttons[1];
    expect(getStartedButton).toHaveClass("bg-accent-600", "text-white");
    expect(getStartedButton).toHaveClass("px-3", "py-1.5", "text-sm"); // size="sm"
  });

  it("applies custom styling classes", () => {
    render(CTAButtons);

    const buttons = screen.getAllByRole("button");

    // Both buttons should have text-sm class
    expect(buttons[0]).toHaveClass("text-sm");
    expect(buttons[1]).toHaveClass("text-sm");

    // Get Started button should have shadow effects
    expect(buttons[1]).toHaveClass(
      "shadow-lg",
      "hover:shadow-xl",
      "transition-shadow",
      "duration-300"
    );
  });

  it("renders Zap icon in Get Started button", () => {
    render(CTAButtons);

    const getStartedLink = screen.getByRole("link", { name: /get started/i });
    expect(getStartedLink).toHaveClass("flex", "items-center", "gap-2");

    // Check for SVG icon (Lucide icons render as SVGs)
    const icon = getStartedLink.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("has proper accessibility structure", () => {
    render(CTAButtons);

    // Should have exactly 2 buttons and 2 links
    const buttons = screen.getAllByRole("button");
    const links = screen.getAllByRole("link");

    expect(buttons).toHaveLength(2);
    expect(links).toHaveLength(2);

    // Links should have meaningful text
    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeInTheDocument();
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

    // Should contain 2 button elements
    const buttons = outerDiv.querySelectorAll("button");
    expect(buttons).toHaveLength(2);
  });

  it("uses imported Button component with correct props", () => {
    render(CTAButtons);

    const buttons = screen.getAllByRole("button");

    // First button (Admin) should have outline variant
    expect(buttons[0]).toHaveClass("border-gray-300"); // outline variant

    // Second button (Get Started) should have accent variant
    expect(buttons[1]).toHaveClass("bg-accent-600"); // accent variant

    // Both should have small size
    buttons.forEach((button) => {
      expect(button).toHaveClass("px-3", "py-1.5"); // sm size
    });
  });
});
