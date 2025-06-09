<script lang="ts">
  import TrueFormKanban from '$lib/components/admin/TrueFormKanban.svelte';
</script>

<svelte:head>
  <title>TrueForm Opportunities | True-Form Admin</title>
</svelte:head>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-semibold text-gray-900 mb-2">TrueForm Opportunities</h1>
    <p class="text-gray-600">Manage your website development pipeline with drag-and-drop Kanban board</p>
  </div>

  <TrueFormKanban />
</div> 