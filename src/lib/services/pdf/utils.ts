/**
 * Utility functions for PDF generation
 */

import QRCode from "qrcode";
import type { QRCodeOptions } from "./types";

export class PDFUtils {
  /**
   * Formats a number as currency
   */
  static formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  /**
   * Formats a date string for display
   */
  static formatDate(
    date: string,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return new Date(date).toLocaleDateString(
      "en-US",
      options || defaultOptions
    );
  }

  /**
   * Generates a QR code as a data URL
   */
  static async generateQRCode(
    data: string,
    options?: Partial<QRCodeOptions>
  ): Promise<string> {
    const defaultOptions = {
      type: "image/png" as const,
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#1e40af",
        light: "#FFFFFF",
      },
      width: 200,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(data, mergedOptions as any);
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return "";
    }
  }

  /**
   * Calculates proposal expiry date
   */
  static calculateExpiryDate(
    createdAt: string,
    validityDays: number = 30
  ): Date {
    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + validityDays);
    return expiryDate;
  }

  /**
   * Generates a unique proposal number from ID
   */
  static generateProposalNumber(id: string): string {
    return id.slice(-8).toUpperCase();
  }

  /**
   * Sanitizes text for HTML display
   */
  static sanitizeHTML(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Converts line breaks to HTML breaks
   */
  static nl2br(text: string): string {
    return text.replace(/\n/g, "<br>");
  }

  /**
   * Truncates text to specified length
   */
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  /**
   * Validates email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generates filename for PDF
   */
  static generateFilename(companyName: string, proposalId: string): string {
    const sanitizedCompanyName = companyName
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const proposalNumber = this.generateProposalNumber(proposalId);

    return `proposal-${sanitizedCompanyName}-${proposalNumber}.html`;
  }

  /**
   * Loads CSS from file
   */
  static async loadCSS(filePath: string): Promise<string> {
    try {
      const response = await fetch(filePath);
      if (!response.ok)
        throw new Error(`Failed to load CSS: ${response.statusText}`);
      return await response.text();
    } catch (error) {
      console.error("Error loading CSS:", error);
      return "";
    }
  }

  /**
   * Merges CSS styles
   */
  static mergeCSS(...cssStrings: string[]): string {
    return cssStrings.filter(Boolean).join("\n\n");
  }

  /**
   * Generates CSS custom properties from theme
   */
  static generateCSSCustomProperties(theme: Record<string, string>): string {
    const properties = Object.entries(theme)
      .map(
        ([key, value]) =>
          `  --${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`
      )
      .join("\n");

    return `:root {\n${properties}\n}`;
  }

  /**
   * Debounces a function call
   */
  static debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  /**
   * Deep clones an object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
    if (obj instanceof Array)
      return obj.map((item) => this.deepClone(item)) as unknown as T;
    if (typeof obj === "object") {
      const clonedObj = {} as T;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
  }

  /**
   * Measures text width for layout calculations
   */
  static measureTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;

    context.font = font;
    return context.measureText(text).width;
  }

  /**
   * Converts RGB to hex color
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  /**
   * Converts hex to RGB color
   */
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
}
