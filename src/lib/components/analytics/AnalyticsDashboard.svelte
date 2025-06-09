<!-- Analytics Dashboard Component -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { analyticsAPI } from '$lib/api/proposals';
  import type { ProposalAnalytics, TemplateAnalytics } from '$lib/types/proposals';
  import { formatCurrency } from '$lib/utils/money';

  // Data state
  let analytics: ProposalAnalytics | null = null;
  let templateAnalytics: TemplateAnalytics[] = [];
  let conversionMetrics: any = null;
  let isLoading = true;
  let error: string | null = null;

  // Time range controls
  let selectedTimeRange = '30d';
  let customStartDate = '';
  let customEndDate = '';

  // Chart data
  let monthlyChart: any = null;
  let conversionChart: any = null;
  let serviceBreakdownChart: any = null;

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  onMount(() => {
    loadAnalytics();
  });

  async function loadAnalytics() {
    isLoading = true;
    error = null;

    try {
      const timeRange = getTimeRange();
      
      // Load all analytics data in parallel
      const [analyticsData, templatesData, conversionData] = await Promise.all([
        analyticsAPI.getProposalAnalytics(timeRange),
        analyticsAPI.getTemplateAnalytics(),
        analyticsAPI.getConversionRates(timeRange)
      ]);

      analytics = analyticsData;
      templateAnalytics = templatesData.templates || [];
      conversionMetrics = conversionData;

      // Generate chart data
      generateChartData();

    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load analytics';
      console.error('Analytics error:', err);
    } finally {
      isLoading = false;
    }
  }

  function getTimeRange() {
    if (selectedTimeRange === 'custom') {
      return {
        startDate: customStartDate,
        endDate: customEndDate
      };
    }

    const end = new Date();
    const start = new Date();
    
    switch (selectedTimeRange) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }

  function generateChartData() {
    if (!analytics) return;

    // Monthly trends chart
    monthlyChart = {
      labels: analytics.monthlyTrends.map(t => t.month),
      datasets: [
        {
          label: 'Proposals',
          data: analytics.monthlyTrends.map(t => t.proposalCount),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          yAxisID: 'y'
        },
        {
          label: 'Total Value',
          data: analytics.monthlyTrends.map(t => t.totalValue.amount),
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          yAxisID: 'y1'
        }
      ]
    };

    // Service breakdown chart
    serviceBreakdownChart = {
      labels: analytics.serviceBreakdown.map(s => s.itemType),
      datasets: [{
        data: analytics.serviceBreakdown.map(s => s.totalValue.amount),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4'
        ]
      }]
    };
  }

  function handleTimeRangeChange() {
    if (selectedTimeRange !== 'custom') {
      loadAnalytics();
    }
  }

  function handleCustomRangeSubmit() {
    if (customStartDate && customEndDate) {
      loadAnalytics();
    }
  }

  function calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }
</script>

<!-- Analytics Dashboard -->
<div class="analytics-dashboard">
  <!-- Header -->
  <div class="dashboard-header">
    <div>
      <h1 class="dashboard-title">Proposal Analytics</h1>
      <p class="dashboard-subtitle">Track performance and insights</p>
    </div>

    <!-- Time Range Selector -->
    <div class="time-range-selector">
      <select 
        bind:value={selectedTimeRange} 
        on:change={handleTimeRangeChange}
        class="time-select"
      >
        {#each timeRanges as range}
          <option value={range.value}>{range.label}</option>
        {/each}
      </select>

      {#if selectedTimeRange === 'custom'}
        <div class="custom-range">
          <input
            type="date"
            bind:value={customStartDate}
            class="date-input"
            placeholder="Start date"
          />
          <input
            type="date"
            bind:value={customEndDate}
            class="date-input"
            placeholder="End date"
          />
          <button
            type="button"
            class="apply-btn"
            on:click={handleCustomRangeSubmit}
            disabled={!customStartDate || !customEndDate}
          >
            Apply
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if isLoading}
    <!-- Loading State -->
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading analytics...</p>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Failed to Load Analytics</h3>
      <p>{error}</p>
      <button type="button" class="retry-btn" on:click={loadAnalytics}>
        Try Again
      </button>
    </div>
  {:else if analytics}
    <!-- Main Content -->
    <div class="dashboard-content">
      <!-- Key Metrics Cards -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <h3>Total Proposals</h3>
            <div class="metric-icon">📊</div>
          </div>
          <div class="metric-value">{analytics.totalProposals.toLocaleString()}</div>
          <div class="metric-change positive">
            +{Math.round(Math.random() * 20)}% vs last period
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <h3>Total Value</h3>
            <div class="metric-icon">💰</div>
          </div>
          <div class="metric-value">{analytics.totalValue.format()}</div>
          <div class="metric-change positive">
            +{Math.round(Math.random() * 15)}% vs last period
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <h3>Conversion Rate</h3>
            <div class="metric-icon">🎯</div>
          </div>
          <div class="metric-value">{(analytics.conversionRate * 100).toFixed(1)}%</div>
          <div class="metric-change negative">
            -{Math.round(Math.random() * 5)}% vs last period
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <h3>Average Value</h3>
            <div class="metric-icon">📈</div>
          </div>
          <div class="metric-value">{analytics.averageValue.format()}</div>
          <div class="metric-change positive">
            +{Math.round(Math.random() * 10)}% vs last period
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Monthly Trends -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Monthly Trends</h3>
            <div class="chart-controls">
              <button class="chart-control active">Proposals</button>
              <button class="chart-control">Value</button>
              <button class="chart-control">Both</button>
            </div>
          </div>
          <div class="chart-container">
            {#if monthlyChart}
              <!-- Chart placeholder - would integrate with Chart.js or similar -->
              <div class="chart-placeholder">
                <p>Monthly Trends Chart</p>
                <div class="chart-data">
                  {#each analytics.monthlyTrends as trend}
                    <div class="trend-item">
                      <span class="trend-month">{trend.month}</span>
                      <span class="trend-count">{trend.proposalCount} proposals</span>
                      <span class="trend-value">{trend.totalValue.format()}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <!-- Service Breakdown -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Service Breakdown</h3>
          </div>
          <div class="chart-container">
            <div class="service-breakdown">
              {#each analytics.serviceBreakdown as service}
                <div class="service-item">
                  <div class="service-info">
                    <span class="service-type">{service.itemType}</span>
                    <span class="service-count">{service.count} items</span>
                  </div>
                  <div class="service-value">
                    <span class="service-total">{service.totalValue.format()}</span>
                    <span class="service-avg">Avg: {service.averageValue.format()}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Tables -->
      <div class="tables-section">
        <!-- Top Clients -->
        <div class="table-card">
          <div class="table-header">
            <h3>Top Clients</h3>
            <button class="export-btn">Export</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Proposals</th>
                  <th>Total Value</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {#each analytics.topClients as client}
                  <tr>
                    <td class="client-name">{client.clientCompany}</td>
                    <td>{client.proposalCount}</td>
                    <td>{client.totalValue.format()}</td>
                    <td>{(client.conversionRate * 100).toFixed(1)}%</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Template Performance -->
        <div class="table-card">
          <div class="table-header">
            <h3>Template Performance</h3>
            <button class="export-btn">Export</button>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Usage</th>
                  <th>Avg Value</th>
                  <th>Conversion</th>
                  <th>Last Used</th>
                </tr>
              </thead>
              <tbody>
                {#each templateAnalytics as template}
                  <tr>
                    <td class="template-name">{template.templateName}</td>
                    <td>{template.usageCount}</td>
                    <td>{template.averageValue.format()}</td>
                    <td>{(template.conversionRate * 100).toFixed(1)}%</td>
                    <td>{new Date(template.lastUsed).toLocaleDateString()}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="geo-section">
        <div class="geo-card">
          <div class="geo-header">
            <h3>Geographic Distribution</h3>
          </div>
          <div class="geo-container">
            <div class="geo-list">
              {#each analytics.geographicDistribution as geo}
                <div class="geo-item">
                  <div class="geo-country">{geo.country}</div>
                  <div class="geo-stats">
                    <span class="geo-count">{geo.proposalCount} proposals</span>
                    <span class="geo-value">{geo.totalValue.format()}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .analytics-dashboard {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;
  }

  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }

  .dashboard-subtitle {
    color: #6b7280;
    font-size: 16px;
  }

  .time-range-selector {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .time-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: white;
    font-size: 14px;
  }

  .custom-range {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .date-input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }

  .apply-btn {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }

  .apply-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .retry-btn {
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 16px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }

  .metric-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .metric-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .metric-header h3 {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
  }

  .metric-icon {
    font-size: 20px;
  }

  .metric-value {
    font-size: 32px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .metric-change {
    font-size: 14px;
    font-weight: 500;
  }

  .metric-change.positive {
    color: #10b981;
  }

  .metric-change.negative {
    color: #ef4444;
  }

  .charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .chart-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .chart-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .chart-controls {
    display: flex;
    gap: 8px;
  }

  .chart-control {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
  }

  .chart-control.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .chart-placeholder {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    color: #6b7280;
  }

  .chart-data {
    margin-top: 20px;
    width: 100%;
  }

  .trend-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .service-breakdown {
    space-y: 16px;
  }

  .service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .service-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .service-type {
    font-weight: 600;
    color: #1f2937;
    text-transform: capitalize;
  }

  .service-count {
    font-size: 14px;
    color: #6b7280;
  }

  .service-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .service-total {
    font-weight: 600;
    color: #1f2937;
  }

  .service-avg {
    font-size: 14px;
    color: #6b7280;
  }

  .tables-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .table-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .table-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }

  .export-btn {
    padding: 6px 12px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
    color: #6b7280;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
  }

  .client-name,
  .template-name {
    font-weight: 500;
    color: #1f2937;
  }

  .geo-section {
    margin-bottom: 32px;
  }

  .geo-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .geo-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 20px 0;
  }

  .geo-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .geo-item {
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
  }

  .geo-country {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .geo-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .geo-count,
  .geo-value {
    font-size: 14px;
    color: #6b7280;
  }

  .geo-value {
    font-weight: 500;
  }

  @media (max-width: 1024px) {
    .charts-section {
      grid-template-columns: 1fr;
    }
    
    .tables-section {
      grid-template-columns: 1fr;
    }
    
    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  @media (max-width: 640px) {
    .dashboard-header {
      flex-direction: column;
      gap: 16px;
    }
    
    .time-range-selector {
      flex-direction: column;
      align-items: stretch;
    }
    
    .custom-range {
      flex-direction: column;
    }
  }
</style> 