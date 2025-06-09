import { defaultStyles } from './defaultStyles';

/**
 * Modern PDF Template Styles
 * Contemporary design with modern colors and typography
 */
export const modernStyles = defaultStyles
  .replace(/#007acc/g, '#6366f1')
  .replace(/Helvetica/g, 'Inter, -apple-system, BlinkMacSystemFont')
  .replace(/Arial/g, 'system-ui'); 