<script lang="ts">
  import ContactList from "$lib/components/ContactList.svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import { Users, Upload, Plus } from "lucide-svelte";
</script>

<div class="container space-y-8">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-h2 mb-2 flex items-center gap-3">
          <Users size={28} class="text-slate-600" />
          Strategic Contact Directory
        </h2>
        <p class="text-muted">
          Cultivate and maintain your network of key decision makers and influencers
        </p>
      </div>
      <div class="flex gap-3">
        <BaseButton variant="outline" href="/admin/contacts/import">
          <Upload size={16} class="mr-2" />
          Import Directory
        </BaseButton>
        <BaseButton variant="primary" href="/admin/contacts/create">
          <Plus size={16} class="mr-2" />
          Register Contact
        </BaseButton>
      </div>
    </div>
  </BaseCard>

  <!-- Contact List -->
  <ContactList />
</div>
