<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let company: any = {
    name: "",
    website: "",
    billing_street: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
    billing_country: "",
    notes: "",
    status: "active",
  };

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch("submit", company);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="form-group">
    <label for="name">Company Name</label>
    <input
      type="text"
      id="name"
      bind:value={company.name}
      required
      placeholder="Enter company name"
    />
  </div>

  <div class="form-group">
    <label for="website">Website</label>
    <input
      type="url"
      id="website"
      bind:value={company.website}
      placeholder="https://example.com"
    />
  </div>

  <div class="form-group">
    <label for="billing_street">Billing Address</label>
    <input
      type="text"
      id="billing_street"
      bind:value={company.billing_street}
      placeholder="Street address"
    />
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="billing_city">City</label>
      <input
        type="text"
        id="billing_city"
        bind:value={company.billing_city}
        placeholder="City"
      />
    </div>

    <div class="form-group">
      <label for="billing_state">State</label>
      <input
        type="text"
        id="billing_state"
        bind:value={company.billing_state}
        placeholder="State"
      />
    </div>

    <div class="form-group">
      <label for="billing_zip">ZIP</label>
      <input
        type="text"
        id="billing_zip"
        bind:value={company.billing_zip}
        placeholder="ZIP"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="billing_country">Country</label>
    <input
      type="text"
      id="billing_country"
      bind:value={company.billing_country}
      placeholder="Country"
    />
  </div>

  <div class="form-group">
    <label for="notes">Notes</label>
    <textarea
      id="notes"
      bind:value={company.notes}
      placeholder="Additional notes about this company"
      rows="3"
    />
  </div>

  <div class="form-group">
    <label for="status">Status</label>
    <select id="status" bind:value={company.status}>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="prospect">Prospect</option>
    </select>
  </div>

  <div class="form-actions">
    <button type="submit" class="submit">Save Company</button>
    <button
      type="button"
      class="cancel-btn"
      on:click={() => dispatch("cancel")}
    >
      Cancel
    </button>
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 1rem;
  }

  label {
    font-weight: 500;
    color: #374151;
  }

  input,
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
    background-color: #ffffff;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .submit {
    flex: 1;
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
  }

  .submit:hover {
    background-color: #2563eb;
  }

  .cancel-btn {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: 500;
  }

  .cancel-btn:hover {
    background-color: #e5e7eb;
  }
</style>
