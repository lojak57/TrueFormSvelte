<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  // Stripe integration will be implemented here
  let loading = false;
</script>

<svelte:head>
  <title>Checkout | True-Form</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-6">
  <div class="max-w-2xl mx-auto">
    <Card class="p-8">
      <h1 class="text-3xl font-semibold text-gray-900 mb-6">Complete Your Order</h1>
      
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-blue-700">
          <strong>Note:</strong> Stripe Elements integration will be implemented here for secure payment processing.
        </p>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-center py-3 border-b">
          <span class="font-medium">Standard Website Package</span>
          <span class="font-semibold">$199</span>
        </div>
        
        <div class="flex justify-between items-center py-3 border-b">
          <span class="font-medium">Total</span>
          <span class="text-xl font-bold text-accent-600">$199</span>
        </div>
      </div>

      <Button variant="accent" size="lg" class="w-full mt-8" disabled={loading}>
        {loading ? 'Processing...' : 'Complete Payment'}
      </Button>
    </Card>
  </div>
</div> 