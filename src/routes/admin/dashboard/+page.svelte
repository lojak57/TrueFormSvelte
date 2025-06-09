<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { Plus, Users, FileText, DollarSign, TrendingUp, Zap } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  // Mock data - would come from Supabase in real app
  const stats = [
    { title: 'Total Leads', value: '24', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Opportunities', value: '8', change: '+3', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Monthly Revenue', value: '$3,200', change: '+18%', icon: DollarSign, color: 'text-accent-600' },
    { title: 'Proposals Sent', value: '12', change: '+5', icon: FileText, color: 'text-purple-600' },
  ];

  function createProposal() {
    goto('/admin/proposals/create');
  }

  function createOpportunity() {
    goto('/admin/opportunities');
  }

  function viewProposals() {
    goto('/admin/proposals');
  }
</script>

<svelte:head>
  <title>Dashboard | True-Form Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Quick Actions -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Create Proposal -->
    <Card class="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow cursor-pointer" on:click={createProposal}>
      <div class="flex items-center">
        <div class="p-3 bg-blue-100 rounded-lg">
          <FileText class="text-blue-600" size={24} />
        </div>
        <div class="ml-4 flex-1">
          <h3 class="font-semibold text-gray-900">Create Proposal</h3>
          <p class="text-sm text-gray-600">AI-powered proposal generation</p>
        </div>
        <div class="p-2 bg-blue-50 rounded-full">
          <Plus class="text-blue-600" size={16} />
        </div>
      </div>
    </Card>

    <!-- Add Opportunity -->
    <Card class="p-6 border-l-4 border-l-green-500 hover:shadow-lg transition-shadow cursor-pointer" on:click={createOpportunity}>
      <div class="flex items-center">
        <div class="p-3 bg-green-100 rounded-lg">
          <Users class="text-green-600" size={24} />
        </div>
        <div class="ml-4 flex-1">
          <h3 class="font-semibold text-gray-900">Add Opportunity</h3>
          <p class="text-sm text-gray-600">New lead or project</p>
        </div>
        <div class="p-2 bg-green-50 rounded-full">
          <Plus class="text-green-600" size={16} />
        </div>
      </div>
    </Card>

    <!-- View All Proposals -->
    <Card class="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow cursor-pointer" on:click={viewProposals}>
      <div class="flex items-center">
        <div class="p-3 bg-purple-100 rounded-lg">
          <Zap class="text-purple-600" size={24} />
        </div>
        <div class="ml-4 flex-1">
          <h3 class="font-semibold text-gray-900">Proposals</h3>
          <p class="text-sm text-gray-600">12 active proposals</p>
        </div>
        <div class="p-2 bg-purple-50 rounded-full">
          <TrendingUp class="text-purple-600" size={16} />
        </div>
      </div>
    </Card>
  </div>

  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Welcome to your True-Form admin dashboard</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each stats as stat}
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{stat.title}</p>
              <p class="text-3xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              <p class="text-sm text-green-600 mt-1">{stat.change}</p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <svelte:component this={stat.icon} size={24} class={stat.color} />
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Charts Row -->
    <div class="grid lg:grid-cols-2 gap-6">
      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Lead Pipeline</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Chart.js pipeline chart would go here</p>
        </div>
      </Card>

      <Card class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div class="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p class="text-gray-500">Chart.js revenue chart would go here</p>
        </div>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">New lead from contact form</p>
            <p class="text-sm text-gray-600">Acme Corp submitted a website request</p>
          </div>
          <span class="text-sm text-gray-500">2 hours ago</span>
        </div>
        
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">Proposal sent</p>
            <p class="text-sm text-gray-600">Standard package proposal for TechStart</p>
          </div>
          <span class="text-sm text-gray-500">5 hours ago</span>
        </div>
        
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div class="w-2 h-2 bg-accent-500 rounded-full"></div>
          <div class="flex-1">
            <p class="font-medium text-gray-900">Payment received</p>
            <p class="text-sm text-gray-600">$199 payment for Standard plan</p>
          </div>
          <span class="text-sm text-gray-500">1 day ago</span>
        </div>
      </div>
    </Card>
  </div>
</div> 