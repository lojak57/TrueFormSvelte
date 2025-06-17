<script lang="ts">
  import ContactList from '$lib/components/ContactList.svelte';
  import BaseCard from '$lib/components/base/BaseCard.svelte';
  import BaseButton from '$lib/components/base/BaseButton.svelte';
</script>

<div class="container space-y-8">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-h2 mb-2">Manage Contacts</h2>
        <p class="text-muted">Organize and track your business contacts across all verticals</p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" href="/admin/contacts/import">
          Import Contacts
        </BaseButton>
        <BaseButton variant="primary" href="/admin/contacts/create">
          <span class="text-xl">+</span>
          New Contact
        </BaseButton>
      </div>
    </div>
  </BaseCard>

  <!-- Contact List -->
  <ContactList />
</div> 