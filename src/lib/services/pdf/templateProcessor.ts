/**
 * Template Processing Engine
 * Handles parsing and processing of template variables, conditionals, and loops
 */

export class TemplateProcessor {
  /**
   * Processes a template string with the provided data
   */
  processTemplate(template: string, data: any): string {
    let html = template;

    // Handle loops first (they can contain conditionals and variables)
    html = this.processLoops(html, data);

    // Handle conditionals (they can contain variables)
    html = this.processConditionals(html, data);

    // Replace simple variables last
    html = this.replaceVariables(html, data);

    // Clean up any remaining template artifacts
    html = this.postprocessHTML(html);

    return html;
  }

  /**
   * Replaces simple variables like {{variable.path}}
   */
  private replaceVariables(html: string, data: any): string {
    return html.replace(/{{(\w+(?:\.\w+)*)}}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value !== undefined ? String(value) : "";
    });
  }

  /**
   * Processes conditional blocks {{#if condition}}...{{/if}}
   */
  private processConditionals(html: string, data: any): string {
    // Mark false conditionals
    html = html.replace(/{{#if\s+(\w+(?:\.\w+)*)}}/g, (match, path) => {
      const value = this.getNestedValue(data, path);
      return value ? "" : "<!--IF_FALSE-->";
    });

    // Mark end conditionals
    html = html.replace(/{{\/if}}/g, "<!--END_IF-->");

    // Remove false conditional blocks
    html = html.replace(/<!--IF_FALSE-->[\s\S]*?<!--END_IF-->/g, "");
    html = html.replace(/<!--END_IF-->/g, "");

    return html;
  }

  /**
   * Processes loop blocks {{#each array}}...{{/each}}
   */
  private processLoops(html: string, data: any): string {
    // Process nested loops first to handle deeply nested structures
    let processedHtml = html;
    let loopFound = true;

    // Keep processing until no more loops are found
    while (loopFound) {
      const originalHtml = processedHtml;

      // Find and process the innermost loops first
      processedHtml = processedHtml.replace(
        /{{#each\s+(\w+(?:\.\w+)*)}}([\s\S]*?){{\/each}}/,
        (match, path, content) => {
          const array = this.getNestedValue(data, path);
          if (!Array.isArray(array) || array.length === 0) return "";

          return array
            .map((item) => this.processLoopItem(content, item))
            .join("");
        }
      );

      // Check if any loops were processed
      loopFound = processedHtml !== originalHtml;
    }

    return processedHtml;
  }

  /**
   * Processes a single item within a loop
   */
  private processLoopItem(template: string, item: any): string {
    let itemHtml = template;

    // Process nested conditionals first
    itemHtml = this.processConditionals(itemHtml, item);

    // Replace variables within the loop
    itemHtml = itemHtml.replace(/{{(\w+(?:\.\w+)*)}}/g, (match, prop) => {
      // Handle "this" keyword for simple arrays
      if (prop === "this") {
        return String(item);
      }

      // Handle nested properties and direct properties
      if (prop.includes(".")) {
        const value = this.getNestedValue(item, prop);
        return value !== undefined ? String(value) : "";
      }

      const value = item[prop];
      return value !== undefined ? String(value) : "";
    });

    return itemHtml;
  }

  /**
   * Processes nested loops within loop items
   */
  private processNestedLoops(html: string, data: any): string {
    // Similar to processLoops but for nested context
    html = html.replace(/{{#each\s+(\w+)}}/g, (match, prop) => {
      return `<!--NESTED_EACH_START:${prop}-->`;
    });

    html = html.replace(
      /<!--NESTED_EACH_START:(\w+)-->[\s\S]*?{{\/each}}/g,
      (match, prop) => {
        const array = data[prop];
        if (!Array.isArray(array)) return "";

        const template = match
          .replace(`<!--NESTED_EACH_START:${prop}-->`, "")
          .replace("{{/each}}", "");

        return array
          .map((item) => {
            let itemHtml = template;
            itemHtml = itemHtml.replace(/{{(\w+)}}/g, (itemMatch, itemProp) => {
              return item[itemProp] !== undefined ? String(item[itemProp]) : "";
            });
            itemHtml = itemHtml.replace(/{{this}}/g, String(item));
            return itemHtml;
          })
          .join("");
      }
    );

    return html;
  }

  /**
   * Gets a nested value from an object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  /**
   * Validates template syntax before processing
   */
  validateTemplate(template: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for unclosed conditionals
    const ifCount = (template.match(/{{#if/g) || []).length;
    const endIfCount = (template.match(/{{\/if}}/g) || []).length;
    if (ifCount !== endIfCount) {
      errors.push(
        `Unclosed conditional: ${ifCount} {{#if}} but ${endIfCount} {{/if}}`
      );
    }

    // Check for unclosed loops
    const eachCount = (template.match(/{{#each/g) || []).length;
    const endEachCount = (template.match(/{{\/each}}/g) || []).length;
    if (eachCount !== endEachCount) {
      errors.push(
        `Unclosed loop: ${eachCount} {{#each}} but ${endEachCount} {{/each}}`
      );
    }

    // Check for malformed variables
    const malformedVars = template
      .match(/{{[^}]*(?:}}|$)/g)
      ?.filter(
        (match) =>
          !match.endsWith("}}") || match.includes("{") || match.includes("}")
      );
    if (malformedVars?.length) {
      errors.push(`Malformed variables: ${malformedVars.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Preprocesses template to handle special cases
   */
  preprocessTemplate(template: string): string {
    // Escape HTML entities in variable content
    template = template.replace(/{{(\w+(?:\.\w+)*)}}/g, (match, path) => {
      // Mark variables that need HTML escaping
      if (path.includes("description") || path.includes("notes")) {
        return `{{ESCAPED:${path}}}`;
      }
      return match;
    });

    // Handle line breaks in descriptions
    template = template.replace(
      /{{ESCAPED:(\w+(?:\.\w+)*)}}/g,
      (match, path) => {
        return `{{${path}}}`;
      }
    );

    return template;
  }

  /**
   * Postprocesses HTML after template processing
   */
  postprocessHTML(html: string): string {
    // Clean up any remaining template artifacts and comments
    html = html.replace(/<!--[^>]*-->/g, "");
    html = html.replace(/{{[^}]*}}/g, ""); // Remove any unprocessed variables

    // Clean up multiple spaces while preserving intentional formatting
    html = html.replace(/[ \t]+/g, " ");
    html = html.replace(/\n\s*\n/g, "\n");

    // Remove empty lines and excessive whitespace around HTML tags
    html = html.replace(/>\s+</g, "><");
    html = html.replace(/^\s+|\s+$/gm, "");

    return html;
  }
}

// Export singleton instance
export const templateProcessor = new TemplateProcessor();
