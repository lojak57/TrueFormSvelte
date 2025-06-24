/**
 * Utility functions for consistent status styling across the application
 */

// Status color mappings for different entity types
export const STATUS_COLORS = {
  // General status colors
  active: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  inactive: {
    text: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  },
  pending: {
    text: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500'
  },
  blocked: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  
  // Project-specific statuses
  'in-progress': {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  completed: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  cancelled: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  
  // Proposal statuses
  draft: {
    text: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  },
  sent: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  viewed: {
    text: 'text-purple-700',
    bg: 'bg-purple-100',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  },
  accepted: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  rejected: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  
  // Contact interaction statuses
  cold: {
    text: 'text-blue-700',
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  warm: {
    text: 'text-yellow-700',
    bg: 'bg-yellow-100',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500'
  },
  hot: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  qualified: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-200',
    dot: 'bg-green-500'
  }
} as const;

export type StatusType = keyof typeof STATUS_COLORS;

/**
 * Get status styles for a given status string
 */
export function getStatusStyles(
  status: string,
  variant: 'badge' | 'dot' | 'text' = 'badge'
): string {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as StatusType;
  const colors = STATUS_COLORS[normalizedStatus] || STATUS_COLORS.inactive;

  switch (variant) {
    case 'badge':
      return `${colors.text} ${colors.bg} ${colors.border} px-2 py-1 rounded-full text-xs font-medium border`;
    case 'dot':
      return `${colors.dot} w-2 h-2 rounded-full`;
    case 'text':
      return colors.text;
    default:
      return colors.text;
  }
}

/**
 * Get priority styles (high, medium, low)
 */
export function getPriorityStyles(
  priority: 'high' | 'medium' | 'low',
  variant: 'badge' | 'dot' | 'text' = 'badge'
): string {
  const priorityColors = {
    high: STATUS_COLORS.hot,
    medium: STATUS_COLORS.warm,
    low: STATUS_COLORS.cold
  };

  const colors = priorityColors[priority] || priorityColors.medium;

  switch (variant) {
    case 'badge':
      return `${colors.text} ${colors.bg} ${colors.border} px-2 py-1 rounded-full text-xs font-medium border`;
    case 'dot':
      return `${colors.dot} w-2 h-2 rounded-full`;
    case 'text':
      return colors.text;
    default:
      return colors.text;
  }
}

/**
 * Get health/quality styles (good, warning, error)
 */
export function getHealthStyles(
  health: 'good' | 'warning' | 'error',
  variant: 'badge' | 'dot' | 'text' = 'badge'
): string {
  const healthColors = {
    good: STATUS_COLORS.active,
    warning: STATUS_COLORS.pending,
    error: STATUS_COLORS.blocked
  };

  const colors = healthColors[health] || healthColors.warning;

  switch (variant) {
    case 'badge':
      return `${colors.text} ${colors.bg} ${colors.border} px-2 py-1 rounded-full text-xs font-medium border`;
    case 'dot':
      return `${colors.dot} w-2 h-2 rounded-full`;
    case 'text':
      return colors.text;
    default:
      return colors.text;
  }
}

/**
 * Convert status to display label
 */
export function getStatusLabel(status: string): string {
  return status
    .split(/[-_\s]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get all available statuses for a given category
 */
export function getAvailableStatuses(category: 'project' | 'proposal' | 'contact' | 'general'): StatusType[] {
  switch (category) {
    case 'project':
      return ['active', 'in-progress', 'completed', 'cancelled', 'pending'];
    case 'proposal':
      return ['draft', 'sent', 'viewed', 'accepted', 'rejected'];
    case 'contact':
      return ['cold', 'warm', 'hot', 'qualified'];
    case 'general':
    default:
      return ['active', 'inactive', 'pending', 'blocked'];
  }
}