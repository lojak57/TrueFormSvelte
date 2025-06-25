<script lang="ts">
  import ContactList from "$lib/components/ContactList.svelte";
  import CRMHeader from "$lib/components/ui/CRMHeader.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import { Users, Upload, Plus } from "lucide-svelte";
</script>

<div class="contacts-page">
  <CRMHeader
    title="Strategic Contact Directory"
    subtitle="Cultivate and maintain your network of key decision makers and influencers"
    icon={Users}
  >
    <div slot="actions" class="header-actions">
      <BaseButton
        variant="outline"
        href="/admin/contacts/import"
        class="action-button"
      >
        <Upload size={16} class="mr-2" />
        Import Directory
      </BaseButton>
      <BaseButton
        variant="primary"
        href="/admin/contacts/create"
        class="action-button"
      >
        <Plus size={16} class="mr-2" />
        Register Contact
      </BaseButton>
    </div>
  </CRMHeader>

  <div class="page-content">
    <ContactList />
  </div>
</div>

<style>
  .contacts-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  :global(.action-button) {
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  :global(.action-button:hover) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(71, 85, 105, 0.15);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .page-content {
      padding: 16px;
    }

    .header-actions {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    :global(.action-button) {
      width: 100%;
      justify-content: center;
    }
  }
</style>
