<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Project, CreateProjectDTO, UpdateProjectDTO } from "$lib/types";

  export let project: Project | null = null;
  export let companyId: string | undefined;

  let name = project?.name ?? "";
  let description = project?.description ?? "";
  let error: string | null = null;

  const dispatch = createEventDispatcher<{
    submit: CreateProjectDTO | UpdateProjectDTO;
    cancel: void;
  }>();

  function handleSubmit() {
    if (!name.trim()) {
      error = "Project name is required";
      return;
    }

    if (!companyId) {
      error = "Company ID is required";
      return;
    }

    const dto = {
      name: name.trim(),
      description: description.trim() || undefined,
      company_id: companyId,
    };

    dispatch("submit", dto);
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <div class="form-group">
    <label for="name">Project Name</label>
    <input
      type="text"
      id="name"
      bind:value={name}
      required
      placeholder="Enter project name"
    />
  </div>

  <div class="form-group">
    <label for="description">Description</label>
    <textarea
      id="description"
      bind:value={description}
      placeholder="Enter project description"
      rows="3"
    />
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <div class="actions">
    <button type="submit">{project ? "Update" : "Create"} Project</button>
    <button type="button" class="cancel" on:click={() => dispatch("cancel")}>
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

  label {
    font-weight: 500;
  }

  input,
  textarea {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    font-family: inherit;
  }

  input:focus,
  textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  button:not(.cancel) {
    background-color: #2563eb;
    color: white;
    border: none;
  }

  button:not(.cancel):hover {
    background-color: #1d4ed8;
  }

  .cancel {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .cancel:hover {
    background-color: #e5e7eb;
  }

  .error {
    color: #dc2626;
  }
</style>
