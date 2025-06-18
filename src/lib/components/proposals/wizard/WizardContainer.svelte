<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { SERVICE_TEMPLATES } from "$lib/data/serviceTemplates";
  import type { Company, Contact, LineItem, ServiceTemplate } from "$lib/types";

  // Import wizard components
  import WizardProgress from "./WizardProgress.svelte";
  import WizardNavigation from "./WizardNavigation.svelte";
  import BasicInfoStep from "./steps/BasicInfoStep.svelte";
  import ServiceSelectionStep from "./steps/ServiceSelectionStep.svelte";
  import PricingStep from "./steps/PricingStep.svelte";
  import ReviewStep from "./steps/ReviewStep.svelte";

  // Wizard configuration
  const STEP_TITLES = [
    "Basic Information",
    "Select Services",
    "Pricing & Terms",
    "Review & Create",
  ];

  // State management
  let currentStep = 1;
  let isSubmitting = false;
  let error = "";

  // Data
  let companies: Company[] = [];
  let contacts: Contact[] = [];

  // Proposal data
  let proposalData = {
    company_id: "",
    contact_id: "",
    title: "",
    tax_rate: 7.5,
    notes: "",
  };

  let selectedServices: ServiceTemplate[] = [];
  let lineItems: LineItem[] = [];

  // Computed values
  $: subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0);
  $: tax = subtotal * (proposalData.tax_rate / 100);
  $: total = subtotal + tax;
  $: selectedCompany = companies.find((c) => c.id === proposalData.company_id);
  $: selectedContact = contacts.find((c) => c.id === proposalData.contact_id);

  // Validation
  $: canProceedFromStep1 = proposalData.title && proposalData.company_id;
  $: canProceedFromStep2 = lineItems.length > 0;
  $: canProceedFromStep3 = lineItems.length > 0;
  $: canProceedFromStep4 =
    lineItems.length > 0 && proposalData.title && proposalData.company_id;

  $: canProceed =
    (currentStep === 1 && canProceedFromStep1) ||
    (currentStep === 2 && canProceedFromStep2) ||
    (currentStep === 3 && canProceedFromStep3) ||
    (currentStep === 4 && canProceedFromStep4);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      const [companiesRes, contactsRes] = await Promise.all([
        fetch("/api/companies"),
        fetch("/api/contacts"),
      ]);

      if (companiesRes.ok) companies = await companiesRes.json();
      if (contactsRes.ok) contacts = await contactsRes.json();
    } catch (err) {
      console.error("Error loading data:", err);
      error = "Failed to load companies and contacts";
    }
  }

  // Step navigation
  function nextStep() {
    if (canProceed && currentStep < STEP_TITLES.length) {
      currentStep++;
    }
  }

  function previousStep() {
    if (currentStep > 1) {
      currentStep--;
    }
  }

  // Event handlers
  function handleBasicInfoUpdate(event: CustomEvent) {
    const { company_id, contact_id, title } = event.detail;
    proposalData = { ...proposalData, company_id, contact_id, title };
  }

  function handleServicesUpdate(event: CustomEvent<ServiceTemplate[]>) {
    selectedServices = event.detail;
    updateLineItemsFromServices();
  }

  function handleAddCustomItem(event: CustomEvent) {
    const customItem = event.detail;
    const newLineItem: LineItem = {
      id: crypto.randomUUID(),
      name: customItem.name,
      description: customItem.description,
      quantity: customItem.quantity,
      unitPrice: customItem.unitPrice,
      total: customItem.quantity * customItem.unitPrice,
    };
    lineItems = [...lineItems, newLineItem];
  }

  function updateLineItemsFromServices() {
    // Convert selected services to line items
    const serviceLineItems: LineItem[] = selectedServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      quantity: 1,
      unitPrice: service.basePrice,
      total: service.basePrice,
    }));

    // Keep existing custom items (items not in service templates)
    const customItems = lineItems.filter(
      (item) => !SERVICE_TEMPLATES.some((service) => service.id === item.id)
    );

    lineItems = [...serviceLineItems, ...customItems];
  }

  function handleLineItemUpdate(event: CustomEvent) {
    const { id, updates } = event.detail;
    lineItems = lineItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.total = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    });
  }

  function handleLineItemRemove(event: CustomEvent<string>) {
    const itemId = event.detail;
    lineItems = lineItems.filter((item) => item.id !== itemId);

    // Also remove from selected services if it's a service
    selectedServices = selectedServices.filter(
      (service) => service.id !== itemId
    );
  }

  function handleTaxRateUpdate(event: CustomEvent<number>) {
    proposalData.tax_rate = event.detail;
  }

  function handleNotesUpdate(event: CustomEvent<string>) {
    proposalData.notes = event.detail;
  }

  async function createProposal() {
    if (!canProceedFromStep4) {
      error = "Please fill in all required fields";
      return;
    }

    isSubmitting = true;
    error = "";

    try {
      const proposalPayload = {
        title: proposalData.title,
        company_id: proposalData.company_id,
        contact_id: proposalData.contact_id || undefined,
        line_items: lineItems.map(({ id, total, ...item }) => item),
        tax_rate: proposalData.tax_rate,
        notes: proposalData.notes,
      };

      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proposalPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create proposal");
      }

      const result = await response.json();

      // Success! Redirect to the proposals list page
      goto("/admin/proposals");
    } catch (err) {
      console.error("Error creating proposal:", err);
      error = err instanceof Error ? err.message : "Failed to create proposal";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="min-h-screen bg-gray-50">
  <div class="tf-container py-8">
    <!-- Progress -->
    <WizardProgress
      {currentStep}
      totalSteps={STEP_TITLES.length}
      stepTitles={STEP_TITLES}
    />

    <!-- Error Display -->
    {#if error}
      <div class="mb-6 tf-animate-fade-in">
        <div class="tf-card border-red-200 bg-red-50">
          <div class="tf-card-body">
            <div class="flex items-center gap-3">
              <svg
                class="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div>
                <h4 class="font-medium text-red-900">Error</h4>
                <p class="text-red-700 text-sm">{error}</p>
              </div>
              <button
                class="ml-auto tf-btn tf-btn-ghost tf-btn-sm text-red-600"
                on:click={() => (error = "")}
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Step Content -->
    <div class="tf-animate-fade-in">
      {#if currentStep === 1}
        <BasicInfoStep
          {companies}
          {contacts}
          selectedCompanyId={proposalData.company_id}
          selectedContactId={proposalData.contact_id}
          proposalTitle={proposalData.title}
          on:update={handleBasicInfoUpdate}
        />
      {:else if currentStep === 2}
        <ServiceSelectionStep
          {selectedServices}
          customLineItems={lineItems.filter(
            (item) => !SERVICE_TEMPLATES.some((s) => s.id === item.id)
          )}
          on:updateServices={handleServicesUpdate}
          on:addCustomItem={handleAddCustomItem}
        />
      {:else if currentStep === 3}
        <PricingStep
          {lineItems}
          taxRate={proposalData.tax_rate}
          notes={proposalData.notes}
          on:updateLineItem={handleLineItemUpdate}
          on:removeLineItem={handleLineItemRemove}
          on:updateTaxRate={handleTaxRateUpdate}
          on:updateNotes={handleNotesUpdate}
        />
      {:else if currentStep === 4}
        <ReviewStep
          company={selectedCompany}
          contact={selectedContact}
          proposalTitle={proposalData.title}
          {lineItems}
          {subtotal}
          taxRate={proposalData.tax_rate}
          {tax}
          {total}
          notes={proposalData.notes}
        />
      {/if}
    </div>

    <!-- Navigation -->
    <WizardNavigation
      {currentStep}
      totalSteps={STEP_TITLES.length}
      {canProceed}
      {isSubmitting}
      on:previous={previousStep}
      on:next={nextStep}
      on:submit={createProposal}
    />
  </div>
</div>
