<script lang="ts">
  import { goto } from "$app/navigation";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  let formData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    title: "",
    company_id: "",
    status: "active",
  };

  let companies: any[] = [];
  let loading = false;
  let error = "";

  // Load companies for the dropdown
  async function loadCompanies() {
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      companies = await response.json();
    } catch (err) {
      console.error("Failed to load companies:", err);
      error = "Failed to load companies";
    }
  }

  // Load companies on mount
  loadCompanies();

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email) {
      error = "Please fill in all required fields";
      return;
    }

    try {
      loading = true;
      error = "";

      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newContact = await response.json();

      // Redirect to the contacts list
      goto("/admin/contacts");
    } catch (err) {
      console.error("Failed to create contact:", err);
      error = err instanceof Error ? err.message : "Failed to create contact";
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    goto("/admin/contacts");
  }
</script>

<svelte:head>
  <title>New Contact | TrueForm Admin</title>
</svelte:head>

<div class="new-contact-page">
  <!-- Page Header -->
  <BaseCard padding="lg">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="text-h1 mb-2">Create New Contact</h1>
        <p class="text-muted">Add a new contact to your database</p>
      </div>
      <BaseButton variant="outline" on:click={handleCancel}>Cancel</BaseButton>
    </div>
  </BaseCard>

  <!-- Contact Form -->
  <BaseCard padding="lg">
    <form on:submit={handleSubmit} class="contact-form">
      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}

      <div class="form-grid">
        <div class="form-group">
          <label for="first_name">First Name *</label>
          <input
            id="first_name"
            type="text"
            bind:value={formData.first_name}
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="last_name">Last Name *</label>
          <input
            id="last_name"
            type="text"
            bind:value={formData.last_name}
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            bind:value={formData.phone}
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            type="text"
            bind:value={formData.title}
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="company_id">Company</label>
          <select
            id="company_id"
            bind:value={formData.company_id}
            class="form-input"
          >
            <option value="">Select a company...</option>
            {#each companies as company}
              <option value={company.id}>{company.name}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" bind:value={formData.status} class="form-input">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <BaseButton type="button" variant="outline" on:click={handleCancel}>
          Cancel
        </BaseButton>
        <BaseButton type="submit" variant="primary" disabled={loading}>
          {loading ? "Creating..." : "Create Contact"}
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</div>

<style>
  .new-contact-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.875rem;
  }

  .form-input {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: #111827;
    font-weight: 500;
    background-color: #ffffff;
    transition: border-color 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-100);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }

  .error-message {
    padding: 1rem;
    background-color: var(--color-error-bg);
    color: var(--color-error-text);
    border: 1px solid var(--color-error-border);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
  }

  @media (max-width: 640px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }
  }
</style>
