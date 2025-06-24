/**
 * Design Vibe Definitions
 * Extracted from VisualVibeSelector for better maintainability
 */

export interface VibeOption {
  id: string;
  label: string;
  description: string;
  colors: string[];
  elements: {
    header: string;
    text: string;
    accent: string;
    bg: string;
  };
  layout: string;
  headerStyle: string;
}

export const DESIGN_VIBES: VibeOption[] = [
  {
    id: "professional-trustworthy",
    label: "Professional & Trustworthy",
    description: "Clean, corporate, reliable",
    colors: ["#1e40af", "#ffffff", "#f8fafc"],
    elements: {
      header: "#1e40af",
      text: "#374151",
      accent: "#3b82f6",
      bg: "#ffffff",
    },
    layout: "corporate",
    headerStyle: "traditional",
  },
  {
    id: "modern-sleek",
    label: "Modern & Sleek",
    description: "Minimal, tech-forward, sharp",
    colors: ["#000000", "#ffffff", "#6366f1"],
    elements: {
      header: "#000000",
      text: "#1f2937",
      accent: "#6366f1",
      bg: "#ffffff",
    },
    layout: "minimal",
    headerStyle: "thin",
  },
  {
    id: "warm-approachable",
    label: "Warm & Approachable",
    description: "Friendly, welcoming, organic",
    colors: ["#f59e0b", "#fef3c7", "#92400e"],
    elements: {
      header: "#92400e",
      text: "#451a03",
      accent: "#f59e0b",
      bg: "#fffbeb",
    },
    layout: "rounded",
    headerStyle: "organic",
  },
  {
    id: "bold-edgy",
    label: "Bold & Edgy",
    description: "Dynamic, confident, striking",
    colors: ["#dc2626", "#000000", "#fca5a5"],
    elements: {
      header: "#dc2626",
      text: "#ffffff",
      accent: "#ef4444",
      bg: "#1f2937",
    },
    layout: "angular",
    headerStyle: "bold",
  },
  {
    id: "clean-minimal",
    label: "Clean & Minimal",
    description: "Simple, spacious, zen",
    colors: ["#6b7280", "#ffffff", "#f3f4f6"],
    elements: {
      header: "#374151",
      text: "#6b7280",
      accent: "#9ca3af",
      bg: "#ffffff",
    },
    layout: "spacious",
    headerStyle: "light",
  },
  {
    id: "creative-artistic",
    label: "Creative & Artistic",
    description: "Expressive, unique, vibrant",
    colors: ["#7c3aed", "#ec4899", "#fbbf24"],
    elements: {
      header: "#7c3aed",
      text: "#374151",
      accent: "#ec4899",
      bg: "#faf5ff",
    },
    layout: "creative",
    headerStyle: "artistic",
  },
  {
    id: "luxury-premium",
    label: "Luxury & Premium",
    description: "Elegant, sophisticated, refined",
    colors: ["#1f2937", "#d4af37", "#ffffff"],
    elements: {
      header: "#1f2937",
      text: "#374151",
      accent: "#d4af37",
      bg: "#f9fafb",
    },
    layout: "elegant",
    headerStyle: "premium",
  },
  {
    id: "fun-playful",
    label: "Fun & Playful",
    description: "Energetic, cheerful, youthful",
    colors: ["#10b981", "#f59e0b", "#ec4899"],
    elements: {
      header: "#10b981",
      text: "#374151",
      accent: "#f59e0b",
      bg: "#f0fdf4",
    },
    layout: "bouncy",
    headerStyle: "playful",
  },
  {
    id: "natural-organic",
    label: "Natural & Organic",
    description: "Earthy, authentic, sustainable",
    colors: ["#15803d", "#dcfce7", "#14532d"],
    elements: {
      header: "#14532d",
      text: "#15803d",
      accent: "#22c55e",
      bg: "#f0fdf4",
    },
    layout: "organic",
    headerStyle: "natural",
  },
];
