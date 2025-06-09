<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { Plus, FileText, Zap, Users, BarChart3, Filter } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  // Mock data - replace with actual proposal data
  let proposals = [
    {
      id: '1',
      title: 'E-commerce Website for TechStart',
      clientCompany: 'TechStart Inc.',
      status: 'draft',
      value: 15000,
      createdAt: '2024-01-15',
      lastModified: '2024-01-16'
    },
    {
      id: '2',
      title: 'Corporate Website Redesign',
      clientCompany: 'GreenCo',
      status: 'sent',
      value: 8500,
      createdAt: '2024-01-10',
      lastModified: '2024-01-12'
    }
  ];

  function getStatusColor(status: string) {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  function createProposal() {
    goto('/admin/proposals/create');
  }

  function createFromOpportunity() {
    // Navigate to opportunity selection flow
    goto('/admin/proposals/create?from=opportunity');
  }

  function viewProposal(id: string) {
    goto(`/admin/proposals/${id}`);
  }
</script>

<svelte:head>
  <title>Proposals | True-Form Admin</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-semibold text-gray-900 mb-2">Proposals</h1>
      <p class="text-gray-600">Create and manage client proposals with AI-powered generation</p>
    </div>
    
    <div class="flex items-center space-x-3">
      <Button variant="outline" on:click={createFromOpportunity}>
        <Users size={20} class="mr-2" />
        From Opportunity
      </Button>
      <Button variant="accent" on:click={createProposal}>
        <Plus size={20} class="mr-2" />
        New Proposal
      </Button>
    </div>
  </div>

  <!-- Quick Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card class="p-6">
      <div class="flex items-center">
        <div class="p-3 bg-blue-100 rounded-lg">
          <FileText class="text-blue-600" size={24} />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Proposals</p>
          <p class="text-2xl font-semibold text-gray-900">{proposals.length}</p>
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center">
        <div class="p-3 bg-green-100 rounded-lg">
          <Zap class="text-green-600" size={24} />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">This Month</p>
          <p class="text-2xl font-semibold text-gray-900">
            {proposals.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center">
        <div class="p-3 bg-purple-100 rounded-lg">
          <BarChart3 class="text-purple-600" size={24} />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Value</p>
          <p class="text-2xl font-semibold text-gray-900">
            {formatCurrency(proposals.reduce((sum, p) => sum + p.value, 0))}
          </p>
        </div>
      </div>
    </Card>

    <Card class="p-6">
      <div class="flex items-center">
        <div class="p-3 bg-orange-100 rounded-lg">
          <Users class="text-orange-600" size={24} />
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Acceptance Rate</p>
          <p class="text-2xl font-semibold text-gray-900">
            {Math.round((proposals.filter(p => p.status === 'accepted').length / proposals.length) * 100) || 0}%
          </p>
        </div>
      </div>
    </Card>
  </div>

  <!-- Actions Bar -->
  <div class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
    <div class="flex items-center space-x-4">
      <Button variant="outline" size="sm">
        <Filter size={16} class="mr-2" />
        Filter
      </Button>
      <select class="text-sm border border-gray-300 rounded-md px-3 py-2">
        <option>All Statuses</option>
        <option>Draft</option>
        <option>Sent</option>
        <option>Viewed</option>
        <option>Accepted</option>
        <option>Declined</option>
      </select>
    </div>
    
    <div class="text-sm text-gray-600">
      {proposals.length} proposals
    </div>
  </div>

  <!-- Proposals List -->
  {#if proposals.length > 0}
    <div class="space-y-4">
      {#each proposals as proposal}
        <Card class="p-6 hover:shadow-lg transition-shadow cursor-pointer" on:click={() => viewProposal(proposal.id)}>
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                <span class="px-2 py-1 text-xs font-medium rounded-full {getStatusColor(proposal.status)}">
                  {proposal.status}
                </span>
              </div>
              
              <p class="text-sm text-gray-600 mb-2">{proposal.clientCompany}</p>
              
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created: {new Date(proposal.createdAt).toLocaleDateString()}</span>
                <span>Modified: {new Date(proposal.lastModified).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div class="text-right">
              <div class="text-2xl font-bold text-green-600 mb-1">
                {formatCurrency(proposal.value)}
              </div>
              <Button variant="outline" size="sm" on:click={(e) => {
                e.stopPropagation();
                viewProposal(proposal.id);
              }}>
                View Details
              </Button>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Empty State -->
    <Card class="p-12 text-center">
      <div class="flex flex-col items-center">
        <div class="p-4 bg-gray-100 rounded-full mb-4">
          <FileText size={48} class="text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No proposals yet</h3>
        <p class="text-gray-600 mb-6 max-w-md">
          Create your first proposal using our AI-powered generator. You can start from scratch or create from an existing opportunity.
        </p>
        <div class="flex items-center space-x-3">
          <Button variant="outline" on:click={createFromOpportunity}>
            <Users size={20} class="mr-2" />
            From Opportunity
          </Button>
          <Button variant="accent" on:click={createProposal}>
            <Plus size={20} class="mr-2" />
            Create New Proposal
          </Button>
        </div>
      </div>
    </Card>
  {/if}

  <!-- Quick Help -->
  <Card class="p-6 bg-blue-50 border-blue-200">
    <div class="flex items-start space-x-3">
      <div class="p-2 bg-blue-100 rounded-lg">
        <Zap class="text-blue-600" size={20} />
      </div>
      <div>
        <h4 class="font-semibold text-blue-900 mb-2">AI-Powered Proposal Generation</h4>
        <p class="text-blue-800 text-sm mb-3">
          Our advanced proposal generator uses AI to create professional, customized proposals in minutes.
        </p>
        <ul class="text-blue-800 text-sm space-y-1">
          <li>• Smart templates based on project type</li>
          <li>• Automated pricing calculations</li>
          <li>• Professional PDF generation</li>
          <li>• Client tracking and analytics</li>
        </ul>
      </div>
    </div>
  </Card>
</div> 