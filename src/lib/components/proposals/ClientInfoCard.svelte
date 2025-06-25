<script lang="ts">
  import type { Company, Contact } from "$lib/types";

  export let company: Company | null;
  export let contact: Contact | null;
</script>

<div class="tf-card">
  <div class="tf-card-header">
    <h3 class="tf-card-title">Client Information</h3>
  </div>
  <div class="tf-card-body space-y-4">
    {#if company}
      <div>
        <h4 class="font-medium text-gray-900 mb-2">Company</h4>
        <div class="space-y-1">
          <p class="text-gray-600">{company.name}</p>
          {#if company.industry}
            <p class="text-sm text-gray-500">Industry: {company.industry}</p>
          {/if}
          {#if company.website}
            <p class="text-sm text-gray-500">
              Website:
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:text-blue-800"
              >
                {company.website}
              </a>
            </p>
          {/if}
        </div>
      </div>
    {/if}

    {#if contact}
      <div>
        <h4 class="font-medium text-gray-900 mb-2">Primary Contact</h4>
        <div class="space-y-1">
          <p class="text-gray-600">{contact.name}</p>
          {#if contact.title}
            <p class="text-sm text-gray-500">{contact.title}</p>
          {/if}
          {#if contact.email}
            <p class="text-sm text-gray-500">
              <a
                href="mailto:{contact.email}"
                class="text-blue-600 hover:text-blue-800"
              >
                {contact.email}
              </a>
            </p>
          {/if}
          {#if contact.phone}
            <p class="text-sm text-gray-500">
              <a
                href="tel:{contact.phone}"
                class="text-blue-600 hover:text-blue-800"
              >
                {contact.phone}
              </a>
            </p>
          {/if}
        </div>
      </div>
    {/if}

    {#if !company && !contact}
      <p class="text-gray-500 italic">No client information available</p>
    {/if}
  </div>
</div>
