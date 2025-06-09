<script lang="ts">
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { Settings } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Settings | True-Form Admin</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
    <p class="text-gray-600">Manage your organization and preferences</p>
  </div>

  <div class="grid lg:grid-cols-2 gap-6">
    <Card class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Organization Profile</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
          <input type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Your Organization" />
        </div>
        <Button variant="accent">Save Changes</Button>
      </div>
    </Card>

    <Card class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Theme Settings</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
          <input type="color" class="w-full h-10 border border-gray-300 rounded-lg" value="#22c55e" />
        </div>
        <Button variant="accent">Update Theme</Button>
      </div>
    </Card>
  </div>
</div> 