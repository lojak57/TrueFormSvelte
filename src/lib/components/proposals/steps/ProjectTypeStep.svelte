<!-- Project Type & Template Selection Step -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { proposalActions, currentProposal } from '$lib/stores/proposalStore';
  import type { ProposalTemplate } from '$lib/types/proposals';

  // Local state
  let selectedProjectType: string = '';
  let availableTemplates: ProposalTemplate[] = [];
  let selectedTemplate: ProposalTemplate | null = null;
  let isLoadingTemplates = false;
  let showCustomOption = false;

  // Project types
  const projectTypes = [
    {
      id: 'website',
      title: 'Website Development',
      description: 'Custom websites, landing pages, and web applications',
      icon: '🌐',
      popular: true
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Store',
      description: 'Online stores, shopping carts, and payment integration',
      icon: '🛒',
      popular: true
    },
    {
      id: 'webapp',
      title: 'Web Application',
      description: 'Complex web apps, dashboards, and SaaS platforms',
      icon: '⚡',
      popular: false
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      description: 'iOS and Android mobile applications',
      icon: '📱',
      popular: false
    },
    {
      id: 'design',
      title: 'Design Services',
      description: 'UI/UX design, branding, and graphic design',
      icon: '🎨',
      popular: false
    },
    {
      id: 'consultation',
      title: 'Consultation',
      description: 'Technical consulting and project planning',
      icon: '💡',
      popular: false
    },
    {
      id: 'custom',
      title: 'Custom Project',
      description: 'Start from scratch with a blank proposal',
      icon: '✨',
      popular: false
    }
  ];

  onMount(() => {
    // Auto-mark this step as valid since it's the starting step
    proposalActions.markStepComplete(1, true);
  });

  // Watch for project type selection
  $: if (selectedProjectType) {
    handleProjectTypeSelection(selectedProjectType);
  }

  // Watch for template selection
  $: if (selectedTemplate) {
    handleTemplateSelection(selectedTemplate);
  }

  async function handleProjectTypeSelection(projectType: string) {
    if (projectType === 'custom') {
      showCustomOption = true;
      availableTemplates = [];
      proposalActions.markStepComplete(1, true);
      return;
    }

    showCustomOption = false;
    
    // Load templates for this project type
    await loadTemplatesForType(projectType);
  }

  async function loadTemplatesForType(projectType: string) {
    isLoadingTemplates = true;
    
    try {
      // This will be replaced with actual API call
      const mockTemplates: ProposalTemplate[] = [
        {
          id: 'website-basic',
          organizationId: 'org-1',
          name: 'Basic Website',
          description: 'Simple 5-page website with contact form',
          category: projectType,
          templateData: {
            lineItems: [
              {
                itemType: 'design',
                title: 'Website Design',
                description: 'Custom UI/UX design for 5 pages',
                quantity: 1,
                unitType: 'project',
                unitPrice: 2500,
                estimatedHours: 40,
                complexityLevel: 'simple',
                sortOrder: 1
              },
              {
                itemType: 'development',
                title: 'Frontend Development',
                description: 'Responsive website development',
                quantity: 1,
                unitType: 'project',
                unitPrice: 3500,
                estimatedHours: 50,
                complexityLevel: 'medium',
                sortOrder: 2
              }
            ],
            paymentTerms: '50% upfront, 50% on completion',
            projectTimeline: '4-6 weeks',
            defaultCurrency: 'USD'
          },
          usageCount: 25,
          isActive: true,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'user-1'
        },
        {
          id: 'website-advanced',
          organizationId: 'org-1',
          name: 'Advanced Website',
          description: 'Complex website with CMS and integrations',
          category: projectType,
          templateData: {
            lineItems: [
              {
                itemType: 'design',
                title: 'Advanced UI/UX Design',
                description: 'Custom design with advanced features',
                quantity: 1,
                unitType: 'project',
                unitPrice: 4500,
                estimatedHours: 60,
                complexityLevel: 'complex',
                sortOrder: 1
              },
              {
                itemType: 'development',
                title: 'Full-Stack Development',
                description: 'Frontend and backend development',
                quantity: 1,
                unitType: 'project',
                unitPrice: 7500,
                estimatedHours: 100,
                complexityLevel: 'complex',
                sortOrder: 2
              },
              {
                itemType: 'development',
                title: 'CMS Integration',
                description: 'Content management system setup',
                quantity: 1,
                unitType: 'project',
                unitPrice: 2000,
                estimatedHours: 25,
                complexityLevel: 'medium',
                sortOrder: 3
              }
            ],
            paymentTerms: '50% upfront, 50% on completion',
            projectTimeline: '8-12 weeks',
            defaultCurrency: 'USD'
          },
          usageCount: 15,
          isActive: true,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'user-1'
        }
      ];
      
      availableTemplates = mockTemplates;
      
    } catch (error) {
      console.error('Failed to load templates:', error);
      availableTemplates = [];
    } finally {
      isLoadingTemplates = false;
    }
  }

  function handleTemplateSelection(template: ProposalTemplate) {
    proposalActions.applyTemplate(template);
    proposalActions.markStepComplete(1, true);
  }

  function handleSkipTemplate() {
    selectedTemplate = null;
    proposalActions.markStepComplete(1, true);
  }
</script>

<!-- Project Type Selection -->
<div class="project-type-step space-y-8">
  <!-- Header -->
  <div class="text-center">
    <h3 class="text-lg font-medium text-slate-900 mb-2">What type of project are you proposing?</h3>
    <p class="text-slate-600">Choose a project type to get started with relevant templates</p>
  </div>

  <!-- Project Type Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each projectTypes as projectType}
      <button
        type="button"
        class="project-type-card relative p-6 border-2 rounded-xl transition-all duration-200 text-left hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        class:border-primary-500={selectedProjectType === projectType.id}
        class:bg-primary-50={selectedProjectType === projectType.id}
        class:border-slate-200={selectedProjectType !== projectType.id}
        class:bg-white={selectedProjectType !== projectType.id}
        on:click={() => selectedProjectType = projectType.id}
      >
        <!-- Popular badge -->
        {#if projectType.popular}
          <div class="absolute top-3 right-3 bg-primary-100 text-primary-700 px-2 py-1 rounded-md text-xs font-medium">
            Popular
          </div>
        {/if}

        <!-- Icon -->
        <div class="text-3xl mb-3">{projectType.icon}</div>
        
        <!-- Content -->
        <h4 class="font-semibold text-slate-900 mb-2">{projectType.title}</h4>
        <p class="text-sm text-slate-600">{projectType.description}</p>

        <!-- Selection indicator -->
        {#if selectedProjectType === projectType.id}
          <div class="absolute top-3 left-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Template Selection (Progressive Disclosure) -->
  {#if selectedProjectType && selectedProjectType !== 'custom'}
    <div class="template-selection mt-8 pt-8 border-t border-slate-200">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h4 class="text-lg font-medium text-slate-900">Choose a starting template</h4>
          <p class="text-slate-600 mt-1">Select a template to pre-populate your proposal, or start from scratch</p>
        </div>
        
        <button
          type="button"
          class="px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
          on:click={handleSkipTemplate}
        >
          Skip templates
        </button>
      </div>

      {#if isLoadingTemplates}
        <!-- Loading state -->
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span class="ml-3 text-slate-600">Loading templates...</span>
        </div>
      {:else if availableTemplates.length > 0}
        <!-- Templates grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {#each availableTemplates as template}
            <div
              class="template-card border-2 rounded-xl p-6 transition-all duration-200 cursor-pointer hover:shadow-lg"
              class:border-primary-500={selectedTemplate?.id === template.id}
              class:bg-primary-50={selectedTemplate?.id === template.id}
              class:border-slate-200={selectedTemplate?.id !== template.id}
              class:bg-white={selectedTemplate?.id !== template.id}
              on:click={() => selectedTemplate = template}
              on:keydown={(e) => e.key === 'Enter' && (selectedTemplate = template)}
              role="button"
              tabindex="0"
            >
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h5 class="font-semibold text-slate-900">{template.name}</h5>
                  <p class="text-sm text-slate-600 mt-1">{template.description}</p>
                </div>
                
                {#if selectedTemplate?.id === template.id}
                  <div class="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                {/if}
              </div>

              <!-- Template stats -->
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-500">Line items:</span>
                  <span class="text-slate-900">{template.templateData.lineItems.length}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Used:</span>
                  <span class="text-slate-900">{template.usageCount} times</span>
                </div>
                {#if template.templateData.lineItems.length > 0}
                  {@const totalValue = template.templateData.lineItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)}
                  <div class="flex justify-between">
                    <span class="text-slate-500">Estimated value:</span>
                    <span class="text-slate-900 font-medium">
                      ${totalValue.toLocaleString()}
                    </span>
                  </div>
                {/if}
              </div>

              <!-- Template preview -->
              <div class="mt-4 pt-4 border-t border-slate-200">
                <span class="text-xs text-slate-500 uppercase tracking-wide">Includes:</span>
                <div class="mt-2 space-y-1">
                  {#each template.templateData.lineItems.slice(0, 3) as item}
                    <div class="text-xs text-slate-600 flex items-center space-x-1">
                      <div class="w-1 h-1 bg-slate-400 rounded-full"></div>
                      <span>{item.title}</span>
                    </div>
                  {/each}
                  {#if template.templateData.lineItems.length > 3}
                    <div class="text-xs text-slate-500">
                      +{template.templateData.lineItems.length - 3} more items
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- No templates -->
        <div class="text-center py-12">
          <div class="text-slate-400 text-4xl mb-4">📄</div>
          <h5 class="text-lg font-medium text-slate-900 mb-2">No templates available</h5>
          <p class="text-slate-600 mb-4">No templates found for this project type. You can start from scratch.</p>
          <button
            type="button"
            class="btn btn-primary"
            on:click={handleSkipTemplate}
          >
            Continue without template
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Custom Project Option -->
  {#if showCustomOption}
    <div class="custom-option mt-8 pt-8 border-t border-slate-200 text-center">
      <div class="text-slate-400 text-4xl mb-4">✨</div>
      <h4 class="text-lg font-medium text-slate-900 mb-2">Custom Project</h4>
      <p class="text-slate-600 mb-6">Perfect! You'll start with a blank proposal and can add any line items you need.</p>
      
      <div class="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
        💡 <strong>Tip:</strong> You can always save your proposal as a template for future use once you're done.
      </div>
    </div>
  {/if}
</div>

<style>
  .project-type-card:hover {
    transform: translateY(-2px);
  }
  
  .template-card:hover {
    transform: translateY(-1px);
  }

  .type-option.selected {
    border-color: rgb(59, 130, 246);
    background-color: rgb(239, 246, 255);
    color: rgb(29, 78, 216);
  }

  .type-option {
    border: 2px solid rgb(226, 232, 240);
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    background-color: white;
    color: rgb(75, 85, 99);
  }

  .type-option:hover {
    border-color: rgb(203, 213, 225);
    color: rgb(55, 65, 81);
  }

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

  .option-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
    flex-shrink: 0;
  }
</style> 