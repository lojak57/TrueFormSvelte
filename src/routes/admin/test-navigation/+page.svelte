<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { goto } from '$app/navigation';
  import { FileText, Users, BarChart3, Settings } from 'lucide-svelte';

  function testRoute(route: string) {
    window.open(route, '_blank');
  }

  const navigationTests = [
    {
      category: 'Main Navigation',
      tests: [
        { name: 'Dashboard', route: '/admin/dashboard', description: 'Main admin dashboard' },
        { name: 'Opportunities', route: '/admin/opportunities', description: 'Kanban board view' },
        { name: 'Proposals', route: '/admin/proposals', description: 'Proposals list' },
        { name: 'Create Proposal', route: '/admin/proposals/create', description: 'Proposal wizard' },
        { name: 'Settings', route: '/admin/settings', description: 'Admin settings' },
        { name: 'Invoices', route: '/admin/invoices', description: 'Invoice management' }
      ]
    },
    {
      category: 'Proposal Creation Flows',
      tests: [
        { name: 'New Proposal (Direct)', route: '/admin/proposals/create', description: 'Direct proposal creation' },
        { name: 'From Opportunity', route: '/admin/proposals/create?from=opportunity', description: 'Create from opportunity' },
        { name: 'With Template', route: '/admin/proposals/create?templateId=test', description: 'Create with template' },
        { name: 'With Opportunity ID', route: '/admin/proposals/create?opportunityId=test123', description: 'Create with specific opportunity' }
      ]
    },
    {
      category: 'API Endpoints',
      tests: [
        { name: 'Proposals API', route: '/api/proposals', description: 'REST API for proposals' },
        { name: 'Templates API', route: '/api/templates', description: 'Templates endpoint' },
        { name: 'Analytics API', route: '/api/analytics', description: 'Analytics data' }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Navigation Test | True-Form Admin</title>
</svelte:head>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-semibold text-gray-900 mb-2">🧪 Navigation & Routing Test</h1>
    <p class="text-gray-600">Test all navigation routes and button functionality</p>
  </div>

  {#each navigationTests as testGroup}
    <Card class="p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        {#if testGroup.category === 'Main Navigation'}
          <BarChart3 class="mr-2" size={24} />
        {:else if testGroup.category === 'Proposal Creation Flows'}
          <FileText class="mr-2" size={24} />
        {:else}
          <Settings class="mr-2" size={24} />
        {/if}
        {testGroup.category}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each testGroup.tests as test}
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-2">{test.name}</h3>
            <p class="text-sm text-gray-600 mb-3">{test.description}</p>
            <div class="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                on:click={() => testRoute(test.route)}
              >
                Open in New Tab
              </Button>
              <Button 
                variant="accent" 
                size="sm" 
                on:click={() => goto(test.route)}
              >
                Navigate
              </Button>
            </div>
            <div class="mt-2 text-xs text-gray-500 font-mono">
              {test.route}
            </div>
          </div>
        {/each}
      </div>
    </Card>
  {/each}

  <!-- Component Tests -->
  <Card class="p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">🧩 Component Integration Tests</h2>
    
    <div class="space-y-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="font-medium mb-2">Quick Actions Component</h3>
        <div class="flex space-x-2">
          <Button variant="accent" on:click={() => goto('/admin/proposals/create')}>
            <FileText size={16} class="mr-2" />
            New Proposal
          </Button>
          <Button variant="outline" on:click={() => goto('/admin/proposals/create?from=opportunity')}>
            <Users size={16} class="mr-2" />
            From Opportunity
          </Button>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="font-medium mb-2">Floating Action Button (Kanban Style)</h3>
        <div class="relative">
          <button
            class="bg-accent-600 hover:bg-accent-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            on:click={() => goto('/admin/proposals/create')}
          >
            <FileText size={20} />
            <span class="text-sm font-medium">Quick Proposal</span>
          </button>
        </div>
      </div>
    </div>
  </Card>

  <!-- Quick Statistics -->
  <Card class="p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">📊 Navigation Stats</h2>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">
          {navigationTests.reduce((sum, group) => sum + group.tests.length, 0)}
        </div>
        <div class="text-sm text-gray-600">Total Routes</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">5</div>
        <div class="text-sm text-gray-600">Main Nav Items</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-600">4</div>
        <div class="text-sm text-gray-600">Creation Flows</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-orange-600">3</div>
        <div class="text-sm text-gray-600">API Endpoints</div>
      </div>
    </div>
  </Card>
</div> 