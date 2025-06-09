import type { 
  ProposalDraft, 
  ProposalTemplate, 
  LineItemData, 
  ProposalAnalytics,
  CreateProposalRequest,
  UpdateProposalRequest,
  ProposalSearchFilters
} from '$lib/types/proposals';
import type { Money } from '$lib/utils/money';

// API Configuration
const API_BASE = '/api/v1';
const ENDPOINTS = {
  proposals: `${API_BASE}/proposals`,
  templates: `${API_BASE}/templates`,
  analytics: `${API_BASE}/analytics`,
  pdf: `${API_BASE}/pdf`,
  drafts: `${API_BASE}/drafts`
} as const;

// Error handling
export class ProposalAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ProposalAPIError';
  }
}

// API Response wrapper
interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// HTTP client with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ProposalAPIError(
        data.error?.message || 'API request failed',
        response.status,
        data.error?.code,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ProposalAPIError) {
      throw error;
    }
    throw new ProposalAPIError(
      'Network error occurred',
      0,
      'NETWORK_ERROR',
      error
    );
  }
}

// Proposal CRUD Operations
export const proposalAPI = {
  // Create new proposal
  async create(data: CreateProposalRequest): Promise<ProposalDraft> {
    const response = await apiRequest<ProposalDraft>(ENDPOINTS.proposals, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // Get proposal by ID
  async getById(id: string): Promise<ProposalDraft> {
    const response = await apiRequest<ProposalDraft>(
      `${ENDPOINTS.proposals}/${id}`
    );
    return response.data;
  },

  // Update proposal
  async update(id: string, data: UpdateProposalRequest): Promise<ProposalDraft> {
    const response = await apiRequest<ProposalDraft>(
      `${ENDPOINTS.proposals}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  // Delete proposal
  async delete(id: string): Promise<void> {
    await apiRequest(`${ENDPOINTS.proposals}/${id}`, {
      method: 'DELETE',
    });
  },

  // List proposals with filtering and pagination
  async list(filters: ProposalSearchFilters = {}): Promise<{
    proposals: ProposalDraft[];
    total: number;
    hasMore: boolean;
  }> {
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const response = await apiRequest<ProposalDraft[]>(
      `${ENDPOINTS.proposals}?${searchParams.toString()}`
    );

    return {
      proposals: response.data,
      total: response.meta?.total || 0,
      hasMore: response.meta?.hasMore || false,
    };
  },

  // Duplicate proposal
  async duplicate(id: string, title?: string): Promise<ProposalDraft> {
    const response = await apiRequest<ProposalDraft>(
      `${ENDPOINTS.proposals}/${id}/duplicate`,
      {
        method: 'POST',
        body: JSON.stringify({ title }),
      }
    );
    return response.data;
  },

  // Convert proposal to template
  async saveAsTemplate(
    id: string,
    templateName: string,
    description?: string
  ): Promise<ProposalTemplate> {
    const response = await apiRequest<ProposalTemplate>(
      `${ENDPOINTS.proposals}/${id}/save-as-template`,
      {
        method: 'POST',
        body: JSON.stringify({ name: templateName, description }),
      }
    );
    return response.data;
  },
};

// Template Management
export const templateAPI = {
  // List templates
  async list(category?: string): Promise<ProposalTemplate[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    const response = await apiRequest<ProposalTemplate[]>(
      `${ENDPOINTS.templates}${params}`
    );
    return response.data;
  },

  // Get template by ID
  async getById(id: string): Promise<ProposalTemplate> {
    const response = await apiRequest<ProposalTemplate>(
      `${ENDPOINTS.templates}/${id}`
    );
    return response.data;
  },

  // Create new template
  async create(template: Omit<ProposalTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProposalTemplate> {
    const response = await apiRequest<ProposalTemplate>(ENDPOINTS.templates, {
      method: 'POST',
      body: JSON.stringify(template),
    });
    return response.data;
  },

  // Update template
  async update(id: string, updates: Partial<ProposalTemplate>): Promise<ProposalTemplate> {
    const response = await apiRequest<ProposalTemplate>(
      `${ENDPOINTS.templates}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    return response.data;
  },

  // Delete template
  async delete(id: string): Promise<void> {
    await apiRequest(`${ENDPOINTS.templates}/${id}`, {
      method: 'DELETE',
    });
  },

  // Record template usage
  async recordUsage(id: string): Promise<void> {
    await apiRequest(`${ENDPOINTS.templates}/${id}/usage`, {
      method: 'POST',
    });
  },
};

// Draft Management
export const draftAPI = {
  // Auto-save draft
  async autoSave(data: Partial<ProposalDraft>): Promise<ProposalDraft> {
    const response = await apiRequest<ProposalDraft>(
      `${ENDPOINTS.drafts}/auto-save`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  // Get latest draft
  async getLatest(): Promise<ProposalDraft | null> {
    try {
      const response = await apiRequest<ProposalDraft>(
        `${ENDPOINTS.drafts}/latest`
      );
      return response.data;
    } catch (error) {
      if (error instanceof ProposalAPIError && error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Clear draft
  async clear(): Promise<void> {
    await apiRequest(`${ENDPOINTS.drafts}/clear`, {
      method: 'DELETE',
    });
  },

  // Check for conflicts
  async checkConflicts(proposalId: string, lastModified: string): Promise<{
    hasConflict: boolean;
    conflictData?: ProposalDraft;
  }> {
    const response = await apiRequest<{
      hasConflict: boolean;
      conflictData?: ProposalDraft;
    }>(`${ENDPOINTS.drafts}/check-conflicts`, {
      method: 'POST',
      body: JSON.stringify({ proposalId, lastModified }),
    });
    return response.data;
  },
};

// PDF Generation
export const pdfAPI = {
  // Generate PDF
  async generate(proposalId: string, options: {
    template?: string;
    includeAttachments?: boolean;
    watermark?: string;
  } = {}): Promise<{
    url: string;
    filename: string;
    expiresAt: string;
  }> {
    const response = await apiRequest<{
      url: string;
      filename: string;
      expiresAt: string;
    }>(`${ENDPOINTS.pdf}/generate`, {
      method: 'POST',
      body: JSON.stringify({ proposalId, ...options }),
    });
    return response.data;
  },

  // Get PDF status
  async getStatus(jobId: string): Promise<{
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    url?: string;
    error?: string;
  }> {
    const response = await apiRequest<{
      status: 'pending' | 'processing' | 'completed' | 'failed';
      progress?: number;
      url?: string;
      error?: string;
    }>(`${ENDPOINTS.pdf}/status/${jobId}`);
    return response.data;
  },

  // Download PDF
  async download(url: string, filename: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ProposalAPIError(
        'Failed to download PDF',
        response.status
      );
    }
    return response.blob();
  },
};

// Analytics and Reporting
export const analyticsAPI = {
  // Get proposal analytics
  async getProposalAnalytics(timeRange: {
    startDate: string;
    endDate: string;
  }): Promise<ProposalAnalytics> {
    const params = new URLSearchParams({
      startDate: timeRange.startDate,
      endDate: timeRange.endDate,
    });
    
    const response = await apiRequest<ProposalAnalytics>(
      `${ENDPOINTS.analytics}/proposals?${params.toString()}`
    );
    return response.data;
  },

  // Get template usage analytics
  async getTemplateAnalytics(): Promise<{
    templates: Array<{
      id: string;
      name: string;
      usageCount: number;
      averageValue: Money;
      lastUsed: string;
    }>;
  }> {
    const response = await apiRequest<{
      templates: Array<{
        id: string;
        name: string;
        usageCount: number;
        averageValue: Money;
        lastUsed: string;
      }>;
    }>(`${ENDPOINTS.analytics}/templates`);
    return response.data;
  },

  // Get conversion rates
  async getConversionRates(timeRange: {
    startDate: string;
    endDate: string;
  }): Promise<{
    totalProposals: number;
    acceptedProposals: number;
    conversionRate: number;
    averageValue: Money;
    totalValue: Money;
  }> {
    const params = new URLSearchParams({
      startDate: timeRange.startDate,
      endDate: timeRange.endDate,
    });
    
    const response = await apiRequest<{
      totalProposals: number;
      acceptedProposals: number;
      conversionRate: number;
      averageValue: Money;
      totalValue: Money;
    }>(`${ENDPOINTS.analytics}/conversion-rates?${params.toString()}`);
    return response.data;
  },
};

// Real-time Updates (WebSocket)
export class ProposalRealtimeClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private proposalId: string | null = null;

  connect(proposalId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.disconnect();
      }

      this.proposalId = proposalId;
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/v1/proposals/${proposalId}/ws`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        resolve();
      };

      this.ws.onerror = (error) => {
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (this.proposalId) {
            this.connect(this.proposalId);
          }
        }, 5000);
      };
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.proposalId = null;
    this.listeners.clear();
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private handleMessage(data: { event: string; payload: any }): void {
    const listeners = this.listeners.get(data.event);
    if (listeners) {
      listeners.forEach(callback => callback(data.payload));
    }
  }

  // Send update to other clients
  sendUpdate(update: Partial<ProposalDraft>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'proposal_update',
        payload: update
      }));
    }
  }
}

// Export singleton instance
export const realtimeClient = new ProposalRealtimeClient(); 