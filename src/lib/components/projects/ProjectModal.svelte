<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    X,
    Calendar,
    DollarSign,
    Building2,
    Mail,
    Phone,
    User,
  } from "lucide-svelte";
  import type { Project, Company } from "$lib/types";

  export let project: Project | null;
  export let company: Company | undefined;
  export let isWizardSubmission = false;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("close");
  }

  function convertToOpportunity() {
    dispatch("convert", project);
  }

  function parseWizardData(description: string) {
    try {
      const lines = description.split("\n");
      const data: Record<string, string> = {};

      lines.forEach((line) => {
        if (line.includes(":")) {
          const [key, value] = line.split(":").map((s) => s.trim());
          data[key] = value;
        }
      });

      return data;
    } catch {
      return {};
    }
  }

  $: wizardData =
    isWizardSubmission && project
      ? parseWizardData(project.description || "")
      : {};
</script>

{#if project}
  <div class="modal-overlay" on:click={closeModal} on:keydown>
    <div class="modal-content" on:click|stopPropagation on:keydown>
      <div class="modal-header">
        <h2 class="modal-title">{project.name}</h2>
        <button
          class="close-button"
          on:click={closeModal}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
      </div>

      <div class="modal-body">
        {#if isWizardSubmission}
          <!-- Lead Details -->
          <div class="lead-details">
            <div class="detail-section">
              <h3 class="section-title">Lead Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <Building2 size={16} />
                  <span class="detail-label">Company:</span>
                  <span class="detail-value"
                    >{company?.name || "Unknown Company"}</span
                  >
                </div>

                {#if wizardData["Contact Name"]}
                  <div class="detail-item">
                    <User size={16} />
                    <span class="detail-label">Contact:</span>
                    <span class="detail-value"
                      >{wizardData["Contact Name"]}</span
                    >
                  </div>
                {/if}

                {#if wizardData["Email"]}
                  <div class="detail-item">
                    <Mail size={16} />
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">{wizardData["Email"]}</span>
                  </div>
                {/if}

                {#if wizardData["Phone"]}
                  <div class="detail-item">
                    <Phone size={16} />
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{wizardData["Phone"]}</span>
                  </div>
                {/if}
              </div>
            </div>

            {#if wizardData["Project Vision"] || wizardData["Website Type"] || wizardData["Budget Range"]}
              <div class="detail-section">
                <h3 class="section-title">Project Details</h3>
                <div class="detail-grid">
                  {#if wizardData["Website Type"]}
                    <div class="detail-item">
                      <span class="detail-label">Website Type:</span>
                      <span class="detail-value"
                        >{wizardData["Website Type"]}</span
                      >
                    </div>
                  {/if}

                  {#if wizardData["Budget Range"]}
                    <div class="detail-item">
                      <DollarSign size={16} />
                      <span class="detail-label">Budget:</span>
                      <span class="detail-value"
                        >{wizardData["Budget Range"]}</span
                      >
                    </div>
                  {/if}
                </div>

                {#if wizardData["Project Vision"]}
                  <div class="vision-section">
                    <h4 class="vision-title">Project Vision</h4>
                    <p class="vision-text">{wizardData["Project Vision"]}</p>
                  </div>
                {/if}
              </div>
            {/if}

            {#if wizardData["Timeline"] || wizardData["Key Features"]}
              <div class="detail-section">
                <h3 class="section-title">Requirements</h3>
                <div class="detail-grid">
                  {#if wizardData["Timeline"]}
                    <div class="detail-item">
                      <Calendar size={16} />
                      <span class="detail-label">Timeline:</span>
                      <span class="detail-value">{wizardData["Timeline"]}</span>
                    </div>
                  {/if}
                </div>

                {#if wizardData["Key Features"]}
                  <div class="features-section">
                    <h4 class="features-title">Key Features</h4>
                    <p class="features-text">{wizardData["Key Features"]}</p>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <!-- Standard Project Details -->
          <div class="project-details">
            <div class="detail-section">
              <h3 class="section-title">Project Information</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <Building2 size={16} />
                  <span class="detail-label">Company:</span>
                  <span class="detail-value"
                    >{company?.name || "Unknown Company"}</span
                  >
                </div>

                <div class="detail-item">
                  <Calendar size={16} />
                  <span class="detail-label">Created:</span>
                  <span class="detail-value"
                    >{new Date(project.created_at).toLocaleDateString()}</span
                  >
                </div>

                {#if project.start_date}
                  <div class="detail-item">
                    <Calendar size={16} />
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value"
                      >{new Date(project.start_date).toLocaleDateString()}</span
                    >
                  </div>
                {/if}

                {#if project.budget}
                  <div class="detail-item">
                    <DollarSign size={16} />
                    <span class="detail-label">Budget:</span>
                    <span class="detail-value"
                      >${project.budget.toLocaleString()}</span
                    >
                  </div>
                {/if}
              </div>
            </div>

            {#if project.description}
              <div class="detail-section">
                <h3 class="section-title">Description</h3>
                <p class="description-text">{project.description}</p>
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div class="modal-actions">
        {#if isWizardSubmission}
          <button class="convert-button" on:click={convertToOpportunity}>
            Convert to Opportunity
          </button>
        {/if}
        <button class="close-button-secondary" on:click={closeModal}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 1rem;
    max-width: 42rem;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .close-button:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-body {
    padding: 2rem;
  }

  .detail-section {
    margin-bottom: 2rem;
  }

  .detail-section:last-child {
    margin-bottom: 0;
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 1rem 0;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .detail-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .detail-label {
    font-weight: 600;
    color: #374151;
    min-width: 6rem;
  }

  .detail-value {
    color: #6b7280;
  }

  .vision-section,
  .features-section {
    margin-top: 1rem;
  }

  .vision-title,
  .features-title {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  .vision-text,
  .features-text,
  .description-text {
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border-left: 4px solid #3b82f6;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 2rem 2rem 2rem;
    border-top: 1px solid #e5e7eb;
  }

  .convert-button {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .convert-button:hover {
    background: linear-gradient(135deg, #2563eb, #1e40af);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  .close-button-secondary {
    background: #f3f4f6;
    color: #374151;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-button-secondary:hover {
    background: #e5e7eb;
    color: #1f2937;
  }

  @media (max-width: 768px) {
    .modal-content {
      max-width: none;
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }

    .modal-header,
    .modal-body,
    .modal-actions {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }

    .detail-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .detail-label {
      min-width: auto;
    }

    .modal-actions {
      flex-direction: column;
    }
  }
</style>
