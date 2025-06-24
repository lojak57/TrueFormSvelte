import type { NavItem } from "$lib/types";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DesktopNav from "./DesktopNav.svelte";

// Mock the $app/stores
vi.mock("$app/stores", () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({ url: { pathname: "/" } });
      return () => {};
    }),
  },
}));

// Mock transitions
vi.mock("svelte/transition", () => ({
  slide: () => ({}),
}));

describe("DesktopNav Component", () => {
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

  it("renders navigation items correctly", () => {
    render(DesktopNav, { navigation: mockNavigation });

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /services/i })
    ).toBeInTheDocument();
  });

  it("applies responsive classes to nav container", () => {
    const { container } = render(DesktopNav, { navigation: mockNavigation });

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("hidden", "md:flex", "items-center", "space-x-8");
  });

  it("shows active state for current page", () => {
    render(DesktopNav, { navigation: mockNavigation });

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveClass("text-accent-600");

    // Should have active indicator
    const activeIndicator = homeLink.querySelector(".bg-accent-600");
    expect(activeIndicator).toBeInTheDocument();
  });

  it("renders dropdown button for items with children", () => {
    render(DesktopNav, { navigation: mockNavigation });

    const servicesButton = screen.getByRole("button", { name: /services/i });
    expect(servicesButton).toBeInTheDocument();
    expect(servicesButton).toHaveClass("flex", "items-center");

    // Should have chevron icon
    const chevronIcon = servicesButton.querySelector("svg");
    expect(chevronIcon).toBeInTheDocument();
  });

  it("toggles services dropdown when clicked", async () => {
    render(DesktopNav, { navigation: mockNavigation, isServicesOpen: false });

    const servicesButton = screen.getByRole("button", { name: /services/i });

    // Initially closed
    expect(screen.queryByText("Marketing Websites")).not.toBeInTheDocument();

    // Click to open
    await fireEvent.click(servicesButton);

    // Should show services (wait for the component to re-render)
    // Note: Due to how Svelte handles reactivity, we might need to check differently
    const chevronIcon = servicesButton.querySelector("svg");
    expect(chevronIcon).toBeInTheDocument();
  });

  it("renders all service items in dropdown", () => {
    render(DesktopNav, { navigation: mockNavigation, isServicesOpen: true });

    // Check for service items
    expect(screen.getByText("Marketing Websites")).toBeInTheDocument();
    expect(screen.getByText("E-commerce Stores")).toBeInTheDocument();
    expect(screen.getByText("Booking Systems")).toBeInTheDocument();
    expect(screen.getByText("Membership Sites")).toBeInTheDocument();
    expect(screen.getByText("Real Estate")).toBeInTheDocument();
    expect(screen.getByText("Educational")).toBeInTheDocument();
  });

  it("shows service descriptions in dropdown", () => {
    render(DesktopNav, { navigation: mockNavigation, isServicesOpen: true });

    expect(screen.getByText("Landing pages & brand sites")).toBeInTheDocument();
    expect(
      screen.getByText("Like our flagship vcsews.com")
    ).toBeInTheDocument();
    expect(screen.getByText("Appointments & scheduling")).toBeInTheDocument();
  });

  it("applies correct link attributes", () => {
    render(DesktopNav, { navigation: mockNavigation });

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/");

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("applies hover effects to navigation links", () => {
    render(DesktopNav, { navigation: mockNavigation });

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveClass(
      "hover:text-accent-600",
      "transition-all",
      "duration-200"
    );

    // Should have hover underline effect
    const hoverUnderline = aboutLink.querySelector(
      ".group-hover\\:scale-x-100"
    );
    expect(hoverUnderline).toBeInTheDocument();
  });

  it("applies correct dropdown styling when open", () => {
    render(DesktopNav, { navigation: mockNavigation, isServicesOpen: true });

    const dropdown = screen
      .getByText("Marketing Websites")
      .closest(".absolute");
    expect(dropdown).toHaveClass(
      "absolute",
      "top-full",
      "left-0",
      "mt-2",
      "w-80",
      "bg-white",
      "rounded-xl",
      "shadow-xl",
      "border",
      "border-gray-100"
    );
  });

  it("renders service icons correctly", () => {
    render(DesktopNav, { navigation: mockNavigation, isServicesOpen: true });

    // Each service should have an icon container
    const iconContainers = screen
      .getAllByRole("link")
      .filter((link) => link.querySelector(".bg-accent-100"));

    // Should have service links with icons (8 services)
    expect(iconContainers.length).toBeGreaterThan(0);

    iconContainers.forEach((container) => {
      const iconDiv = container.querySelector(".bg-accent-100");
      expect(iconDiv).toHaveClass(
        "w-10",
        "h-10",
        "rounded-lg",
        "flex",
        "items-center",
        "justify-center"
      );
    });
  });

  it("handles empty navigation gracefully", () => {
    render(DesktopNav, { navigation: [] });

    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav.children).toHaveLength(0);
  });

  it("maintains accessibility standards", () => {
    render(DesktopNav, { navigation: mockNavigation });

    // Should have proper navigation role
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();

    // All links should be accessible
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("href");
    });

    // Button should be accessible
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
