import { render, screen } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import Logo from "./Logo.svelte";

describe("Logo Component", () => {
  it("renders the logo image with correct attributes", () => {
    render(Logo);

    const logoImage = screen.getByAltText("TrueForm Logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "/logo.svg");
    expect(logoImage).toHaveClass("w-full", "h-full", "object-contain");
  });

  it("has a clickable link to home page", () => {
    render(Logo);

    const logoLink = screen.getByRole("link");
    expect(logoLink).toHaveAttribute("href", "/");
    expect(logoLink).toBeInTheDocument();
  });

  it("applies correct responsive classes", () => {
    render(Logo);

    const logoContainer = screen.getByAltText("TrueForm Logo").parentElement;
    expect(logoContainer).toHaveClass(
      "h-12",
      "w-32",
      "md:h-14",
      "md:w-40",
      "lg:h-16",
      "lg:w-48"
    );
  });

  it("applies hover effect classes", () => {
    render(Logo);

    const logoLink = screen.getByRole("link");
    expect(logoLink).toHaveClass(
      "group",
      "transition-transform",
      "duration-300",
      "hover:scale-105"
    );

    const logoImage = screen.getByAltText("TrueForm Logo");
    expect(logoImage).toHaveClass(
      "drop-shadow-md",
      "group-hover:drop-shadow-lg",
      "transition-all",
      "duration-300"
    );
  });

  it("has accessible structure", () => {
    render(Logo);

    // Should have one main link
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);

    // Image should have meaningful alt text
    const logoImage = screen.getByRole("img");
    expect(logoImage).toHaveAccessibleName("TrueForm Logo");
  });

  it("maintains proper semantic structure", () => {
    const { container } = render(Logo);

    // Should be wrapped in a flex container
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass("flex", "items-center");

    // Link should contain one image container
    const logoLink = screen.getByRole("link");
    expect(logoLink.children).toHaveLength(1); // Image container only
  });
});
