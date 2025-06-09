<!-- Project Details Step -->
<script lang="ts">
  import { proposalActions, currentProposal } from '$lib/stores/proposalStore';

  // Form data
  let projectData = {
    title: '',
    description: '',
    projectTimeline: '',
    notes: ''
  };

  // Form validation
  let errors: Record<string, string> = {};
  let touched: Record<string, boolean> = {};

  // Initialize from current proposal
  $: if ($currentProposal) {
    projectData = {
      title: $currentProposal.title || '',
      description: $currentProposal.description || '',
      projectTimeline: $currentProposal.projectTimeline || '',
      notes: $currentProposal.notes || ''
    };
  }

  // Watch for changes and update proposal
  $: if (projectData) {
    updateProposal();
  }

  function updateProposal() {
    proposalActions.updateProposal(projectData);
    
    // Validate required fields
    validateField('title', projectData.title);
  }

  function handleFieldChange(field: string, value: string) {
    projectData = { ...projectData, [field]: value };
    touched[field] = true;
    validateField(field, value);
  }

  function validateField(field: string, value: string) {
    const newErrors = { ...errors };

    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Project title is required';
        } else if (value.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        } else if (value.length > 255) {
          newErrors.title = 'Title must be less than 255 characters';
        } else {
          delete newErrors.title;
        }
        break;

      case 'description':
        if (value && value.length > 2000) {
          newErrors.description = 'Description must be less than 2000 characters';
        } else {
          delete newErrors.description;
        }
        break;
    }

    errors = newErrors;

    // Update step completion status
    const isStepValid = !newErrors.title && !newErrors.description;
    proposalActions.markStepComplete(3, isStepValid);
  }

  // Title suggestions based on project type
  const titleSuggestions = [
    'Website Development Project',
    'E-commerce Store Development',
    'Custom Web Application',
    'Mobile App Development',
    'UI/UX Design Services',
    'Digital Marketing Solution',
    'System Integration Project'
  ];

  // Timeline options
  const timelineOptions = [
    '1-2 weeks',
    '2-4 weeks',
    '4-6 weeks',
    '6-8 weeks',
    '8-12 weeks',
    '3-6 months',
    'Custom timeline'
  ];

  function insertTitleSuggestion(suggestion: string) {
    handleFieldChange('title', suggestion);
  }
</script>

<!-- Project Details Form -->
<div class="project-details-step space-y-8">
  <!-- Header -->
  <div>
    <h3 class="text-lg font-medium text-slate-900 mb-2">Project Details</h3>
    <p class="text-slate-600">Define your project scope and requirements</p>
  </div>

  <!-- Main Form -->
  <div class="space-y-8">
    <!-- Project Title -->
    <div class="form-group">
      <label for="title" class="form-label">
        Project Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        type="text"
        class="form-input"
        class:error={errors.title && touched.title}
        bind:value={projectData.title}
        on:blur={() => handleFieldChange('title', projectData.title)}
        on:input={(e) => handleFieldChange('title', e.currentTarget.value)}
        placeholder="Enter a descriptive project title..."
        required
      />
      {#if errors.title && touched.title}
        <p class="form-error">{errors.title}</p>
      {:else}
        <p class="form-help">This will be the main heading of your proposal</p>
      {/if}

      <!-- Title Suggestions -->
      {#if !projectData.title.trim()}
        <div class="mt-3">
          <p class="text-sm text-slate-600 mb-2">Quick suggestions:</p>
          <div class="flex flex-wrap gap-2">
            {#each titleSuggestions as suggestion}
              <button
                type="button"
                class="suggestion-pill text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
                on:click={() => insertTitleSuggestion(suggestion)}
              >
                {suggestion}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Project Description -->
    <div class="form-group">
      <label for="description" class="form-label">
        Project Description
      </label>
      <textarea
        id="description"
        rows="6"
        class="form-input"
        class:error={errors.description && touched.description}
        bind:value={projectData.description}
        on:blur={() => handleFieldChange('description', projectData.description)}
        on:input={(e) => handleFieldChange('description', e.currentTarget.value)}
        placeholder="Describe the project scope, objectives, and key deliverables..."
      ></textarea>
      {#if errors.description && touched.description}
        <p class="form-error">{errors.description}</p>
      {:else}
        <p class="form-help">
          Provide details about what you'll deliver and any specific requirements
          ({projectData.description.length}/2000 characters)
        </p>
      {/if}
    </div>

    <!-- Project Timeline -->
    <div class="form-group">
      <label for="timeline" class="form-label">
        Estimated Timeline
      </label>
      <div class="space-y-3">
        <!-- Quick options -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          {#each timelineOptions.slice(0, -1) as option}
            <button
              type="button"
              class="timeline-option p-2 text-sm border border-slate-300 rounded-lg hover:border-slate-400 transition-colors"
              class:selected={projectData.projectTimeline === option}
              on:click={() => handleFieldChange('projectTimeline', option)}
            >
              {option}
            </button>
          {/each}
        </div>
        
        <!-- Custom input -->
        <input
          id="timeline"
          type="text"
          class="form-input"
          bind:value={projectData.projectTimeline}
          on:input={(e) => handleFieldChange('projectTimeline', e.currentTarget.value)}
          placeholder="e.g., 6-8 weeks, By end of quarter, etc."
        />
      </div>
      <p class="form-help">How long do you estimate this project will take?</p>
    </div>

    <!-- Additional Notes -->
    <div class="form-group">
      <label for="notes" class="form-label">
        Additional Notes
      </label>
      <textarea
        id="notes"
        rows="4"
        class="form-input"
        bind:value={projectData.notes}
        on:input={(e) => handleFieldChange('notes', e.currentTarget.value)}
        placeholder="Any additional information, special requirements, or assumptions..."
      ></textarea>
      <p class="form-help">
        Optional notes that will appear in the proposal (e.g., assumptions, constraints, special requirements)
      </p>
    </div>
  </div>

  <!-- Tips Section -->
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
    <div class="flex items-start space-x-3">
      <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="text-sm text-blue-800">
        <h4 class="font-medium mb-2">💡 Writing effective project descriptions</h4>
        <ul class="space-y-1 text-sm">
          <li>• Focus on outcomes and benefits for the client</li>
          <li>• Be specific about what you'll deliver</li>
          <li>• Mention key technologies or approaches if relevant</li>
          <li>• Include any post-launch support or training</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
    outline: none;
  }

  .btn:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  .btn-primary {
    background-color: rgb(37, 99, 235);
    color: white;
  }

  .btn-primary:hover {
    background-color: rgb(29, 78, 216);
  }

  .btn-secondary {
    background-color: white;
    color: rgb(55, 65, 81);
    border: 1px solid rgb(209, 213, 219);
  }

  .btn-secondary:hover {
    background-color: rgb(249, 250, 251);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(55, 65, 81);
    margin-bottom: 0.25rem;
  }

  .form-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: rgb(17, 24, 39);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-input::placeholder {
    color: rgb(156, 163, 175);
  }

  .form-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    border-color: rgb(59, 130, 246);
  }

  .form-input.error {
    border-color: rgb(252, 165, 165);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
    border-color: rgb(239, 68, 68);
  }

  .form-error {
    font-size: 0.875rem;
    color: rgb(220, 38, 38);
    margin-top: 0.25rem;
  }

  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: rgb(17, 24, 39);
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    border-color: rgb(59, 130, 246);
  }

  .suggestion-pill:hover {
    transform: translateY(-1px);
  }

  .timeline-option.selected {
    background-color: rgb(239, 246, 255);
    border-color: rgb(59, 130, 246);
    color: rgb(29, 78, 216);
  }
</style> 