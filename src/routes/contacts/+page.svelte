<script lang="ts">
  import ContactList from '$lib/components/ContactList.svelte';
</script>

<div class="contacts-page">
  <h1>Contacts</h1>
  <ContactList />
</div>

<style>
  .contacts-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }
</style> 