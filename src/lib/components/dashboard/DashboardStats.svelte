<script lang="ts">
  import {
    Building2,
    Users,
    Briefcase,
    FileText,
    DollarSign,
    TrendingUp,
  } from "lucide-svelte";

  export let stats: {
    companies: number;
    contacts: number;
    projects: number;
    proposals: number;
    totalRevenue: number;
    activeDeals: number;
  };

  $: statCards = [
    {
      title: "Companies",
      value: stats.companies,
      icon: Building2,
      color: "primary",
      trend: "+12%",
    },
    {
      title: "Contacts",
      value: stats.contacts,
      icon: Users,
      color: "success",
      trend: "+8%",
    },
    {
      title: "Active Deals",
      value: stats.activeDeals,
      icon: TrendingUp,
      color: "warning",
      trend: "+23%",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: Briefcase,
      color: "info",
      trend: "+5%",
    },
    {
      title: "Proposals",
      value: stats.proposals,
      icon: FileText,
      color: "secondary",
      trend: "+15%",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "success",
      trend: "+32%",
      isHighlight: true,
    },
  ];
</script>

<div class="stats-grid">
  {#each statCards as stat}
    <div class="stat-card {stat.isHighlight ? 'highlight' : ''}">
      <div class="stat-header">
        <div class="stat-icon bg-{stat.color}-100">
          <svelte:component
            this={stat.icon}
            size={24}
            class="text-{stat.color}-600"
          />
        </div>
        <span class="stat-trend text-green-600">{stat.trend}</span>
      </div>
      <div class="stat-content">
        <h3 class="stat-value">{stat.value}</h3>
        <p class="stat-label">{stat.title}</p>
      </div>
    </div>
  {/each}
</div>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .stat-card.highlight {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .highlight .stat-icon {
    background: rgba(255, 255, 255, 0.2) !important;
  }

  .highlight .stat-icon :global(svg) {
    color: white !important;
  }

  .stat-trend {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .highlight .stat-trend {
    color: white !important;
    opacity: 0.9;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .highlight .stat-label {
    color: rgba(255, 255, 255, 0.9);
  }

  /* Color utilities */
  :global(.bg-primary-100) {
    background-color: #dbeafe;
  }
  :global(.text-primary-600) {
    color: #2563eb;
  }
  :global(.bg-success-100) {
    background-color: #d1fae5;
  }
  :global(.text-success-600) {
    color: #059669;
  }
  :global(.bg-warning-100) {
    background-color: #fef3c7;
  }
  :global(.text-warning-600) {
    color: #d97706;
  }
  :global(.bg-info-100) {
    background-color: #e0e7ff;
  }
  :global(.text-info-600) {
    color: #4f46e5;
  }
  :global(.bg-secondary-100) {
    background-color: #f3f4f6;
  }
  :global(.text-secondary-600) {
    color: #4b5563;
  }
</style>
