import { browser } from "$app/environment";
import { derived, writable } from "svelte/store";

// Theme types
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    accent: string;
    info: string;
    warn: string;
    error: string;
    success: string;
  };
  fonts: {
    sans: string;
    heading: string;
    mono: string;
  };
  branding: {
    logo?: string;
    favicon?: string;
    companyName: string;
  };
}

export type ThemeMode = "light" | "dark" | "auto";

// Default themes
export const defaultTheme: ThemeConfig = {
  name: "TrueForm Default",
  colors: {
    primary: "#2563eb",
    accent: "#059669",
    info: "#7c3aed",
    warn: "#d97706",
    error: "#dc2626",
    success: "#16a34a",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  branding: {
    companyName: "TrueForm",
  },
};

// Example white-label themes
export const golfTheme: ThemeConfig = {
  name: "Golf Pro",
  colors: {
    primary: "#16a34a",
    accent: "#059669",
    info: "#0ea5e9",
    warn: "#f59e0b",
    error: "#dc2626",
    success: "#22c55e",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  branding: {
    companyName: "Golf Pro CRM",
  },
};

export const oilfieldTheme: ThemeConfig = {
  name: "Oilfield Operations",
  colors: {
    primary: "#ea580c",
    accent: "#dc2626",
    info: "#0ea5e9",
    warn: "#f59e0b",
    error: "#dc2626",
    success: "#16a34a",
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading:
      "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },
  branding: {
    companyName: "Oilfield CRM",
  },
};

// Available themes
export const availableThemes = {
  default: defaultTheme,
  golf: golfTheme,
  oilfield: oilfieldTheme,
};

// Theme stores
export const themeMode = writable<ThemeMode>("auto");
export const currentTheme = writable<ThemeConfig>(defaultTheme);

// Derived store for effective theme mode
export const effectiveThemeMode = derived(themeMode, ($themeMode) => {
  if (!browser) return "light";

  if ($themeMode === "auto") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return $themeMode;
});

// Theme utilities
export const themeUtils = {
  // Apply theme to document
  applyTheme: (theme: ThemeConfig, mode: ThemeMode = "light") => {
    if (!browser) return;

    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty("--color-primary", theme.colors.primary);
    root.style.setProperty("--color-accent", theme.colors.accent);
    root.style.setProperty("--color-info", theme.colors.info);
    root.style.setProperty("--color-warn", theme.colors.warn);
    root.style.setProperty("--color-error", theme.colors.error);
    root.style.setProperty("--color-success", theme.colors.success);

    // Apply font variables
    root.style.setProperty("--font-sans", theme.fonts.sans);
    root.style.setProperty("--font-heading", theme.fonts.heading);
    root.style.setProperty("--font-mono", theme.fonts.mono);

    // Apply dark/light mode class
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Update favicon if provided
    if (theme.branding.favicon) {
      const favicon = document.querySelector(
        'link[rel="icon"]'
      ) as HTMLLinkElement;
      if (favicon) {
        favicon.href = theme.branding.favicon;
      }
    }

    // Update document title
    if (theme.branding.companyName) {
      const titleSuffix = ` | ${theme.branding.companyName}`;
      if (!document.title.includes(titleSuffix)) {
        document.title = document.title.replace(/ \| .*$/, "") + titleSuffix;
      }
    }
  },

  // Load theme from environment or URL
  loadThemeFromEnvironment: (): ThemeConfig => {
    if (!browser) return defaultTheme;

    // Check for theme in URL params (for demos)
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get("theme");

    if (themeParam && themeParam in availableThemes) {
      return availableThemes[themeParam as keyof typeof availableThemes];
    }

    // Check for theme in environment variables (set at build time)
    const envTheme = import.meta.env.VITE_THEME;
    if (envTheme && envTheme in availableThemes) {
      return availableThemes[envTheme as keyof typeof availableThemes];
    }

    return defaultTheme;
  },

  // Load theme from JSON (for runtime customization)
  loadThemeFromJSON: async (url: string): Promise<ThemeConfig> => {
    try {
      const response = await fetch(url);
      const themeData = await response.json();

      // Validate theme structure
      if (themeUtils.validateTheme(themeData)) {
        return themeData;
      }

      console.warn("Invalid theme structure, falling back to default");
      return defaultTheme;
    } catch (error) {
      console.error("Failed to load theme from JSON:", error);
      return defaultTheme;
    }
  },

  // Validate theme structure
  validateTheme: (theme: any): theme is ThemeConfig => {
    return (
      theme &&
      typeof theme.name === "string" &&
      theme.colors &&
      typeof theme.colors.primary === "string" &&
      typeof theme.colors.accent === "string" &&
      theme.fonts &&
      typeof theme.fonts.sans === "string" &&
      theme.branding &&
      typeof theme.branding.companyName === "string"
    );
  },

  // Save theme preference to localStorage
  saveThemePreference: (mode: ThemeMode) => {
    if (!browser) return;
    localStorage.setItem("theme-mode", mode);
  },

  // Load theme preference from localStorage
  loadThemePreference: (): ThemeMode => {
    if (!browser) return "auto";

    const saved = localStorage.getItem("theme-mode");
    if (saved === "light" || saved === "dark" || saved === "auto") {
      return saved;
    }

    return "auto";
  },

  // Toggle between light and dark mode
  toggleThemeMode: () => {
    themeMode.update((current) => {
      const newMode = current === "light" ? "dark" : "light";
      themeUtils.saveThemePreference(newMode);
      return newMode;
    });
  },

  // Set specific theme
  setTheme: (themeName: keyof typeof availableThemes) => {
    if (themeName in availableThemes) {
      currentTheme.set(availableThemes[themeName]);
    }
  },

  // Generate CSS custom properties from theme
  generateCSSVariables: (theme: ThemeConfig): string => {
    return `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-accent: ${theme.colors.accent};
        --color-info: ${theme.colors.info};
        --color-warn: ${theme.colors.warn};
        --color-error: ${theme.colors.error};
        --color-success: ${theme.colors.success};
        --font-sans: ${theme.fonts.sans};
        --font-heading: ${theme.fonts.heading};
        --font-mono: ${theme.fonts.mono};
      }
    `;
  },
};

// Initialize theme on browser load
if (browser) {
  // Load saved theme preference
  const savedMode = themeUtils.loadThemePreference();
  themeMode.set(savedMode);

  // Load theme from environment
  const envTheme = themeUtils.loadThemeFromEnvironment();
  currentTheme.set(envTheme);

  // Apply initial theme
  currentTheme.subscribe((theme) => {
    effectiveThemeMode.subscribe((mode) => {
      themeUtils.applyTheme(theme, mode);
    });
  });

  // Listen for system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    // Only update if in auto mode
    themeMode.subscribe((mode) => {
      if (mode === "auto") {
        effectiveThemeMode.subscribe((effectiveMode) => {
          currentTheme.subscribe((theme) => {
            themeUtils.applyTheme(theme, effectiveMode);
          });
        });
      }
    });
  });
}
