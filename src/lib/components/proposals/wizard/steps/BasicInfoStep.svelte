<script lang="ts">
  import type { Company, Contact } from "$lib/types";
  import { createEventDispatcher } from "svelte";

  export let companies: Company[] = [];
  export let contacts: Contact[] = [];
  export let selectedCompanyId = "";
  export let selectedContactId = "";
  export let proposalTitle = "";

  const dispatch = createEventDispatcher<{
    update: {
      company_id: string;
      contact_id: string;
      title: string;
    };
  }>();

  $: filteredContacts = contacts.filter(
    (c) => c.company_id === selectedCompanyId
  );
  $: selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  function handleUpdate() {
    dispatch("update", {
      company_id: selectedCompanyId,
      contact_id: selectedContactId,
      title: proposalTitle,
    });
  }

  // Auto-update when values change
  $: if (selectedCompanyId || selectedContactId || proposalTitle) {
    handleUpdate();
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center mb-8">
    <h3 class="tf-heading-3 mb-2">Let's start with the basics</h3>
    <p class="text-gray-900">
      Choose the company and give your proposal a descriptive title
    </p>
  </div>

  <!-- Company Selection -->
  <div class="tf-card">
    <div class="tf-card-header">
      <h4 class="tf-heading-4">Select Company</h4>
      <p class="text-gray-900 text-sm">
        Choose the company this proposal is for
      </p>
    </div>
    <div class="tf-card-body">
      <select
        class="tf-input tf-select"
        bind:value={selectedCompanyId}
        required
      >
        <option value="">Choose a company...</option>
        {#each companies as company}
          <option value={company.id}>{company.name}</option>
        {/each}
      </select>

      {#if selectedCompany}
        <div class="mt-4 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fill-rule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h5 class="font-medium text-blue-900">{selectedCompany.name}</h5>
              {#if selectedCompany.website}
                <p class="text-sm text-blue-700">{selectedCompany.website}</p>
              {/if}
              {#if selectedCompany.billing_city && selectedCompany.billing_state}
                <p class="text-sm text-blue-600">
                  {selectedCompany.billing_city}, {selectedCompany.billing_state}
                </p>
              {/if}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Contact Selection (Optional) -->
  {#if selectedCompanyId && filteredContacts.length > 0}
    <div class="tf-card">
      <div class="tf-card-header">
        <h4 class="tf-heading-4">Primary Contact</h4>
        <p class="text-gray-900 text-sm">
          Select the main contact for this proposal (optional)
        </p>
      </div>
      <div class="tf-card-body">
        <select class="tf-input tf-select" bind:value={selectedContactId}>
          <option value="">No specific contact</option>
          {#each filteredContacts as contact}
            <option value={contact.id}
              >{contact.first_name} {contact.last_name}</option
            >
          {/each}
        </select>

        {#if selectedContactId}
          {@const selectedContact = filteredContacts.find(
            (c) => c.id === selectedContactId
          )}
          {#if selectedContact}
            <div class="mt-4 p-4 bg-green-50 rounded-lg">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-green-900">
                    {selectedContact.first_name}
                    {selectedContact.last_name}
                  </p>
                  {#if selectedContact.email}
                    <p class="text-sm text-green-700">
                      {selectedContact.email}
                    </p>
                  {/if}
                  {#if selectedContact.title}
                    <p class="text-sm text-green-600">
                      {selectedContact.title}
                    </p>
                  {/if}
                </div>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  {/if}

  <!-- Proposal Title -->
  <div class="tf-card">
    <div class="tf-card-header">
      <h4 class="tf-heading-4">Proposal Title</h4>
      <p class="text-gray-900 text-sm">
        Give your proposal a clear, descriptive title
      </p>
    </div>
    <div class="tf-card-body">
      <input
        type="text"
        class="tf-input"
        bind:value={proposalTitle}
        placeholder="e.g., Website Development & Digital Marketing Package"
        required
      />

      <!-- Title Suggestions -->
      {#if selectedCompany && !proposalTitle}
        <div class="mt-4">
          <p class="text-sm text-gray-900 mb-3">Suggested titles:</p>
          <div class="flex flex-wrap gap-2">
            {#each [`Website Development for ${selectedCompany.name}`, `Digital Marketing Package - ${selectedCompany.name}`, `Complete Web Solution for ${selectedCompany.name}`] as suggestion}
              <button
                class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                on:click={() => (proposalTitle = suggestion)}
              >
                {suggestion}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
