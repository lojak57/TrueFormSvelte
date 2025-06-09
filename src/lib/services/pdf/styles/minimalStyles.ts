import { defaultStyles } from './defaultStyles';

/**
 * Minimal PDF Template Styles
 * Clean, minimal design with black/white color scheme
 */
export const minimalStyles = defaultStyles
  .replace(/#007acc/g, '#000000')
  .replace(/border-bottom: 2px solid #007acc/g, 'border-bottom: 1px solid #000000')
  .replace(/background: #f8f9fa/g, 'background: #ffffff'); 