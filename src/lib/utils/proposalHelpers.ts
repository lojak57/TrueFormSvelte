export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "sent":
      return "bg-blue-100 text-blue-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusBadgeClass(status: string): string {
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
    status
  )}`;
}

export function getStatusGradient(status: string): string {
  switch (status) {
    case "draft":
      return "from-gray-400 to-gray-500";
    case "sent":
      return "from-blue-400 to-blue-600";
    case "accepted":
      return "from-green-400 to-green-600";
    case "rejected":
      return "from-red-400 to-red-600";
    default:
      return "from-gray-400 to-gray-500";
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case "draft":
      return "bg-gray-500";
    case "sent":
      return "bg-blue-500";
    case "accepted":
      return "bg-green-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
