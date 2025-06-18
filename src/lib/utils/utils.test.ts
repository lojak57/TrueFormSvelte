import { describe, expect, it } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  generateId,
  titleCase,
  truncate,
} from "../utils";

describe("Utility Functions", () => {
  describe("cn (className merger)", () => {
    it("merges basic class names", () => {
      const result = cn("text-red-500", "bg-blue-500");
      expect(result).toContain("text-red-500");
      expect(result).toContain("bg-blue-500");
    });

    it("handles conditional classes", () => {
      const isActive = true;
      const result = cn("base-class", isActive && "active-class");
      expect(result).toContain("base-class");
      expect(result).toContain("active-class");
    });

    it("handles conflicting Tailwind classes", () => {
      const result = cn("text-red-500", "text-blue-500");
      // Should keep the last one due to tailwind-merge
      expect(result).toContain("text-blue-500");
      expect(result).not.toContain("text-red-500");
    });
  });

  describe("formatCurrency", () => {
    it("formats USD currency by default", () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe("$1,234.56");
    });

    it("formats different currencies", () => {
      const result = formatCurrency(1234.56, "EUR");
      expect(result).toBe("€1,234.56");
    });

    it("handles zero values", () => {
      const result = formatCurrency(0);
      expect(result).toBe("$0.00");
    });

    it("handles negative values", () => {
      const result = formatCurrency(-123.45);
      expect(result).toBe("-$123.45");
    });
  });

  describe("formatDate", () => {
    it("formats date strings", () => {
      const result = formatDate(new Date(2024, 0, 15));
      expect(result).toBe("Jan 15, 2024");
    });

    it("formats Date objects", () => {
      const date = new Date(2024, 0, 15);
      const result = formatDate(date);
      expect(result).toBe("Jan 15, 2024");
    });

    it("accepts custom format options", () => {
      const result = formatDate(new Date(2024, 0, 15), {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      expect(result).toBe("January 15, 2024");
    });
  });

  describe("generateId", () => {
    it("generates a random ID", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
    });

    it("generates ID with prefix", () => {
      const result = generateId("user");
      expect(result).toMatch(/^user-[a-z0-9]+$/);
    });

    it("handles empty prefix", () => {
      const result = generateId("");
      expect(result).not.toMatch(/^-/);
    });
  });

  describe("truncate", () => {
    it("truncates long text", () => {
      const longText = "This is a very long text that needs to be truncated";
      const result = truncate(longText, 20);

      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toMatch(/\.\.\.$/);
    });

    it("returns original text if within limit", () => {
      const shortText = "Short text";
      const result = truncate(shortText, 20);

      expect(result).toBe(shortText);
      expect(result).not.toMatch(/\.\.\.$/);
    });

    it("handles exact length match", () => {
      const text = "Exactly twenty chars";
      const result = truncate(text, 20);

      expect(result).toBe(text);
      expect(result).not.toMatch(/\.\.\.$/);
    });

    it("handles empty string", () => {
      const result = truncate("", 10);
      expect(result).toBe("");
    });
  });

  describe("titleCase", () => {
    it("converts to title case", () => {
      const result = titleCase("hello world");
      expect(result).toBe("Hello World");
    });

    it("handles mixed case input", () => {
      const result = titleCase("hELLo WoRLD");
      expect(result).toBe("Hello World");
    });

    it("handles single word", () => {
      const result = titleCase("hello");
      expect(result).toBe("Hello");
    });

    it("handles empty string", () => {
      const result = titleCase("");
      expect(result).toBe("");
    });

    it("handles special characters", () => {
      const result = titleCase("hello-world test_case");
      expect(result).toBe("Hello-world Test_case");
    });
  });
});
