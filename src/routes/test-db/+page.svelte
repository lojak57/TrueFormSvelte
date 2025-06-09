<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  
  let connectionStatus = 'Testing...';
  let organizations = [];
  let trueformOpportunities = [];
  let baseformOpportunities = [];
  let loading = true;
  
  onMount(async () => {
    try {
      // Test basic connection and get organizations
      const { data: orgs, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (orgError) {
        connectionStatus = `Error: ${orgError.message}`;
        loading = false;
        return;
      }
      
      organizations = orgs || [];
      
      // Get TrueForm opportunities
      const { data: tfOpps, error: tfError } = await supabase
        .from('opportunities')
        .select('*')
        .limit(10);
      
      if (!tfError) {
        trueformOpportunities = tfOpps || [];
      }
      
      // Get Baseform opportunities
      const { data: bfOpps, error: bfError } = await supabase
        .from('baseform_opportunities')
        .select('*')
        .limit(10);
      
      if (!bfError) {
        baseformOpportunities = bfOpps || [];
      }
      
      connectionStatus = 'Connected successfully!';
      loading = false;
      
    } catch (err) {
      connectionStatus = `Connection failed: ${err}`;
      loading = false;
    }
  });
  
  function getOrgTypeColor(orgType) {
    switch(orgType) {
      case 'platform': return 'bg-purple-100 text-purple-800';
      case 'vertical': return 'bg-blue-100 text-blue-800';
      case 'branch': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
  
  function getIndentLevel(path) {
    return (path.split('.').length - 1) * 20;
  }
</script>

<svelte:head>
  <title>Database Test | True-Form</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-6">
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">🚀 TrueForm Multi-Vertical Database</h1>
      
      <!-- Connection Status -->
      <div class="mb-8 p-4 rounded-lg {connectionStatus.includes('Error') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}">
        <h2 class="text-lg font-semibold mb-2">Connection Status</h2>
        <p class="text-sm {connectionStatus.includes('Error') ? 'text-red-700' : 'text-green-700'}">{connectionStatus}</p>
      </div>
      
      {#if loading}
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading database information...</p>
        </div>
      {:else}
        <!-- Organizational Hierarchy -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">🏢 Organizational Hierarchy</h2>
          <div class="bg-gray-50 rounded-lg p-6">
            {#each organizations as org}
              <div class="mb-3 p-3 bg-white rounded-lg shadow-sm" style="margin-left: {getIndentLevel(org.path)}px">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="px-2 py-1 text-xs font-medium rounded-full {getOrgTypeColor(org.org_type)}">
                      {org.org_type}
                    </span>
                    <span class="font-semibold text-gray-900">{org.name}</span>
                  </div>
                  <span class="text-xs text-gray-500">{org.id.slice(0, 8)}...</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Multi-Vertical Pipeline Overview -->
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <!-- TrueForm Pipeline -->
          <div class="bg-blue-50 rounded-lg p-6">
            <h3 class="text-xl font-bold text-blue-900 mb-4">🎯 TrueForm Opportunities</h3>
            <div class="space-y-3">
              {#if trueformOpportunities.length === 0}
                <div class="text-center py-8 text-blue-600">
                  <p class="text-lg font-medium">No TrueForm opportunities yet</p>
                  <p class="text-sm">Ready for new website development leads!</p>
                </div>
              {:else}
                {#each trueformOpportunities as opp}
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-semibold text-gray-900">{opp.name}</h4>
                        <p class="text-sm text-gray-600">{opp.company || 'No company'}</p>
                        <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                          {opp.status}
                        </span>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-green-600">${opp.value || 0}</p>
                        <p class="text-xs text-gray-500">{opp.probability || 0}% prob</p>
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
          
          <!-- Baseform Pipeline -->
          <div class="bg-green-50 rounded-lg p-6">
            <h3 class="text-xl font-bold text-green-900 mb-4">🛍️ Baseform Opportunities</h3>
            <div class="space-y-3">
              {#if baseformOpportunities.length === 0}
                <div class="text-center py-8 text-green-600">
                  <p class="text-lg font-medium">No Baseform opportunities yet</p>
                  <p class="text-sm">Ready for new e-commerce leads!</p>
                </div>
              {:else}
                {#each baseformOpportunities as opp}
                  <div class="bg-white p-4 rounded-lg shadow-sm">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-semibold text-gray-900">{opp.title}</h4>
                        <p class="text-sm text-gray-600">{opp.customer_name}</p>
                        <span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                          {opp.stage}
                        </span>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-green-600">${opp.amount || 0}</p>
                        <p class="text-xs text-gray-500">{opp.plan_tier}</p>
                      </div>
                    </div>
                  </div>
                {/each}
              {/if}
            </div>
          </div>
        </div>
        
        <!-- Architecture Summary -->
        <div class="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">🏗️ Multi-Vertical Architecture</h3>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">🏢</span>
              </div>
              <h4 class="font-semibold text-gray-900">Platform Level</h4>
              <p class="text-sm text-gray-600">Pillar Apps - Main organization</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">🎯</span>
              </div>
              <h4 class="font-semibold text-gray-900">TrueForm Vertical</h4>
              <p class="text-sm text-gray-600">Website development pipeline</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-2xl">🛍️</span>
              </div>
              <h4 class="font-semibold text-gray-900">Baseform Branch</h4>
              <p class="text-sm text-gray-600">E-commerce solutions pipeline</p>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-white rounded-lg">
            <h5 class="font-semibold text-gray-900 mb-2">Key Features:</h5>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>✅ Separate opportunity pipelines for each vertical</li>
              <li>✅ Hierarchical organization structure</li>
              <li>✅ Shared admin dashboard with vertical-specific views</li>
              <li>✅ Scalable for additional verticals</li>
              <li>✅ Real-time data synchronization</li>
            </ul>
          </div>
        </div>
        
        <!-- Database Tables Summary -->
        <div class="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Database Tables</h3>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Core Tables:</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• organizations ({organizations.length} records)</li>
                <li>• opportunities ({trueformOpportunities.length} TrueForm)</li>
                <li>• baseform_opportunities ({baseformOpportunities.length} Baseform)</li>
                <li>• users, profiles, memberships</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Supporting Tables:</h4>
              <ul class="space-y-1 text-gray-600">
                <li>• brand_kits, proposals, invoices</li>
                <li>• activities, documents, tags</li>
                <li>• products, fabrics, categories</li>
                <li>• website_color_palettes, mood_images</li>
              </ul>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div> 