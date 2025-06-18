/**
 * TrueForm Design System Components - Barrel Export
 *
 * Centralized export for all design system components.
 * Import components from this single location for consistency.
 */

// ============================================================================
// BASE COMPONENTS
// ============================================================================
export { default as BaseButton } from "./BaseButton.svelte";
export { default as BaseCard } from "./BaseCard.svelte";
export { default as BaseInput } from "./BaseInput.svelte";

// ============================================================================
// BUSINESS COMPONENTS
// ============================================================================
// Re-export business components for convenience
export { CompanyCard, ContactCard, ProjectCard } from "../business/index.js";

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================
// Re-export layout components for convenience
export { DashboardLayout } from "../layout/index.js";

// ============================================================================
// COMPONENT TYPES
// ============================================================================
// Export common component prop types for TypeScript users
export type CardVariant = "hero" | "compact" | "mini";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search";
export type InputSize = "sm" | "md" | "lg";
export type PaddingSize = "none" | "sm" | "md" | "lg";

// ============================================================================
// DESIGN SYSTEM UTILITIES
// ============================================================================
// Re-export theme utilities for component consumers
export {
  availableThemes,
  currentTheme,
  effectiveThemeMode,
  themeMode,
  themeUtils,
  type ThemeConfig,
  type ThemeMode,
} from "../../stores/theme.js";
