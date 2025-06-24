import type { NavItem } from "$lib/types";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MobileNav from "./MobileNav.svelte";

// Mock transitions
vi.mock("svelte/transition", () => ({
  slide: () => ({}),
}));

describe("MobileNav Component", () => {
  const mockNavigation: NavItem[] = [
    {
      label: "Home",
      href: "/",
      isActive: true,
    },
    {
      label: "About",
      href: "/about",
      isActive: false,
    },
    {
      label: "Services",
      href: "/services",
      isActive: false,
      children: [{ label: "Marketing", href: "/services/marketing" }],
    },
    {
      label: "Contact",
      href: "/contact",
      isActive: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders mobile menu toggle button", () => {
    render(MobileNav, { navigation: mockNavigation });

    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton.closest("div")).toHaveClass("md:hidden");
  });

  it("shows hamburger icon when menu is closed", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: false });

    const button = screen.getByRole("button");
    const menuIcon = button.querySelector("svg");
    expect(menuIcon).toBeInTheDocument();
  });

  it("shows X icon when menu is open", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const button = screen.getAllByRole("button")[0]; // First button is the toggle
    const xIcon = button.querySelector("svg");
    expect(xIcon).toBeInTheDocument();
  });

  it("does not show mobile menu when closed", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: false });

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });

  it("shows mobile menu when open", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("applies correct mobile menu container styling", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const menuContainer = screen.getByText("Home").closest(".absolute");
    expect(menuContainer).toHaveClass(
      "md:hidden",
      "absolute",
      "top-full",
      "left-0",
      "right-0",
      "bg-white",
      "border-t",
      "border-gray-100",
      "shadow-xl",
      "z-40"
    );
  });

  it("shows active state for current page", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass("text-accent-600");
  });

  it("renders services dropdown button for items with children", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const servicesButton = screen.getByRole("button", { name: /services/i });
    expect(servicesButton).toBeInTheDocument();
    expect(servicesButton).toHaveClass(
      "flex",
      "items-center",
      "justify-between",
      "w-full"
    );

    // Should have chevron icon
    const chevronIcon = servicesButton.querySelector("svg");
    expect(chevronIcon).toBeInTheDocument();
  });

  it("shows services submenu when services dropdown is open", () => {
    render(MobileNav, {
      navigation: mockNavigation,
      isMenuOpen: true,
      isServicesOpen: true,
    });

    expect(screen.getByText("Marketing Websites")).toBeInTheDocument();
    expect(screen.getByText("E-commerce Stores")).toBeInTheDocument();
    expect(screen.getByText("Booking Systems")).toBeInTheDocument();
    expect(screen.getByText("SaaS Platforms")).toBeInTheDocument();
  });

  it("hides services submenu when services dropdown is closed", () => {
    render(MobileNav, {
      navigation: mockNavigation,
      isMenuOpen: true,
      isServicesOpen: false,
    });

    expect(screen.queryByText("Marketing Websites")).not.toBeInTheDocument();
    expect(screen.queryByText("E-commerce Stores")).not.toBeInTheDocument();
  });

  it("renders service items with icons", () => {
    render(MobileNav, {
      navigation: mockNavigation,
      isMenuOpen: true,
      isServicesOpen: true,
    });

    const serviceLinks = screen
      .getAllByRole("link")
      .filter((link) =>
        (link as HTMLAnchorElement).href.includes("/services/")
      );

    expect(serviceLinks.length).toBeGreaterThan(0);

    serviceLinks.forEach((link) => {
      const icon = link.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  it("renders mobile CTA buttons", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    expect(
      screen.getByRole("link", { name: /admin dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeInTheDocument();
  });

  it("applies correct styling to CTA buttons", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const buttons = screen.getAllByRole("button");
    const ctaButtons = buttons.slice(-2); // Last 2 buttons are CTAs

    // Admin button should be outline variant
    expect(ctaButtons[0]).toHaveClass("border-gray-300", "bg-white");
    expect(ctaButtons[0]).toHaveClass("w-full", "justify-center");

    // Get Started button should be accent variant
    expect(ctaButtons[1]).toHaveClass("bg-accent-600", "text-white");
    expect(ctaButtons[1]).toHaveClass("w-full", "justify-center", "shadow-lg");
  });

  it("applies correct link attributes", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");

    const adminLink = screen.getByRole("link", { name: /admin dashboard/i });
    expect(adminLink).toHaveAttribute("href", "/admin/opportunities");

    const getStartedLink = screen.getByRole("link", { name: /get started/i });
    expect(getStartedLink).toHaveAttribute("href", "/request");
  });

  it("applies hover effects correctly", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveClass(
      "hover:text-accent-600",
      "transition-colors",
      "duration-200"
    );
  });

  it("has proper responsive visibility", () => {
    const { container } = render(MobileNav, { navigation: mockNavigation });

    // Toggle button should be hidden on desktop
    const toggleContainer = container.querySelector(".md\\:hidden");
    expect(toggleContainer).toBeInTheDocument();
  });

  it("maintains accessibility standards", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    // All links should have proper hrefs
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });

    // Buttons should be accessible
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);

    // Services button should have proper structure
    const servicesButton = screen.getByRole("button", { name: /services/i });
    expect(servicesButton).toHaveClass("text-left"); // Better for screen readers
  });

  it("handles empty navigation gracefully", () => {
    render(MobileNav, { navigation: [], isMenuOpen: true });

    // Should still render CTA buttons
    expect(
      screen.getByRole("link", { name: /admin dashboard/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i })
    ).toBeInTheDocument();
  });

  it("applies correct spacing and layout classes", () => {
    render(MobileNav, { navigation: mockNavigation, isMenuOpen: true });

    const menuContent = screen.getByText("Home").closest(".px-4");
    expect(menuContent).toHaveClass("px-4", "py-6", "space-y-4");

    // CTA section should have border separator
    const ctaSection = screen
      .getByRole("link", { name: /admin dashboard/i })
      .closest(".pt-4");
    expect(ctaSection).toHaveClass(
      "pt-4",
      "border-t",
      "border-gray-100",
      "space-y-3"
    );
  });
});
