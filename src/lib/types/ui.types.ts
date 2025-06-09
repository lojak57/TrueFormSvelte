/**
 * UI Component Types - TrueForm Application
 * 
 * Type definitions for UI components, themes, and interface elements.
 */

// ============================================================================
// COMPONENT PROPS & VARIANTS
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';

export interface CardProps {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

// ============================================================================
// FORM & INPUT TYPES
// ============================================================================

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'warning';

export interface InputProps {
  type?: InputType;
  size?: InputSize;
  state?: InputState;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  class?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: InputSize;
  state?: InputState;
  class?: string;
}

// ============================================================================
// LAYOUT & NAVIGATION TYPES
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: string | number;
  children?: NavItem[];
  isActive?: boolean;
  isDisabled?: boolean;
  requiresAuth?: boolean;
  roles?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  persistent?: boolean;
  class?: string;
}

// ============================================================================
// DATA DISPLAY TYPES
// ============================================================================

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => string;
  class?: string;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  class?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  showInfo?: boolean;
  showSizeSelector?: boolean;
  class?: string;
}

// ============================================================================
// FEEDBACK & STATUS TYPES
// ============================================================================

export type AlertType = 'info' | 'success' | 'warning' | 'error';
export type ToastType = AlertType;

export interface AlertProps {
  type: AlertType;
  title?: string;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  class?: string;
}

export interface ToastProps {
  id?: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
  class?: string;
}

// ============================================================================
// THEME & STYLING TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface BreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// ============================================================================
// ANIMATION & TRANSITION TYPES
// ============================================================================

export type TransitionType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'scale' 
  | 'flip';

export interface TransitionProps {
  type?: TransitionType;
  duration?: number;
  delay?: number;
  easing?: string;
}

// ============================================================================
// ICON & MEDIA TYPES
// ============================================================================

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps {
  name: string;
  size?: IconSize;
  color?: string;
  class?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  class?: string;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

export type ClickHandler = (event: MouseEvent) => void;
export type KeyboardHandler = (event: KeyboardEvent) => void;
export type FormSubmitHandler = (event: SubmitEvent) => void;
export type InputChangeHandler = (event: Event) => void;

// ============================================================================
// RESPONSIVE & ACCESSIBILITY TYPES
// ============================================================================

export interface ResponsiveValue<T> {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
  tabindex?: number;
} 