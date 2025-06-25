<script lang="ts">
  import { goto } from "$app/navigation";
  import CompanyForm from "$lib/components/CompanyForm.svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  let errorMessage = "";
  let isSubmitting = false;

  async function handleSubmit(event: CustomEvent) {
    const companyData = event.detail;
    errorMessage = "";
    isSubmitting = true;

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle specific error cases
        if (
          errorData.code === "23505" &&
          errorData.details?.includes("tf_companies_name_key")
        ) {
          throw new Error(
            `A company named "${companyData.name}" already exists. Please choose a different name.`
          );
        }

        throw new Error(
          errorData.details || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const newCompany = await response.json();

      // Redirect to the new company's detail page
      goto(`/admin/companies/${newCompany.id}`);
    } catch (error) {
      console.error("Failed to create company:", error);
      errorMessage =
        error instanceof Error ? error.message : "Failed to create company";
    } finally {
      isSubmitting = false;
    }
  }

  function handleCancel() {
    goto("/admin/companies");
  }
</script>

<svelte:head>
  <title>New Company | TrueForm Admin</title>
</svelte:head>

<div class="new-company-page">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-h1 mb-2">Create New Company</h1>
        <p class="text-muted">Add a new client company to your portfolio</p>
      </div>
      <BaseButton variant="outline" on:click={handleCancel}>Cancel</BaseButton>
    </div>
  </BaseCard>

  <!-- Company Form -->
  <BaseCard padding="lg">
    {#if errorMessage}
      <div class="error-message">
        <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        {errorMessage}
      </div>
    {/if}

    <CompanyForm on:submit={handleSubmit} on:cancel={handleCancel} />
  </BaseCard>
</div>

<style>
  .new-company-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #dc2626;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .error-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }
</style>
