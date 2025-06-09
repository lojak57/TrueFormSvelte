<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import { Receipt } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Invoices | True-Form Admin</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-semibold text-gray-900 mb-2">Invoices</h1>
    <p class="text-gray-600">Track payments and billing</p>
  </div>

  <Card class="p-8 text-center">
    <Receipt size={48} class="mx-auto text-gray-400 mb-4" />
    <h3 class="text-lg font-semibold text-gray-900 mb-2">No invoices yet</h3>
    <p class="text-gray-600">Invoices will appear here when customers make payments</p>
  </Card>
</div> 