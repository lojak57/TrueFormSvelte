<!-- Client Information Step -->
<script lang="ts">
  import { proposalActions, currentProposal } from '$lib/stores/proposalStore';
  import type { ClientInfo, ClientAddress } from '$lib/types/proposals';

  // Form data
  let clientInfo: ClientInfo = {
    company: '',
    contactName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    },
    notes: ''
  };

  // Form validation
  let errors: Record<string, string> = {};
  let touched: Record<string, boolean> = {};

  // Initialize from current proposal
  $: if ($currentProposal) {
    clientInfo = {
      company: $currentProposal.clientCompany || '',
      contactName: $currentProposal.clientContactName || '',
      email: $currentProposal.clientEmail || '',
      phone: $currentProposal.clientPhone || '',
      address: $currentProposal.clientAddress || {
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States'
      },
      notes: ''
    };
  }

  // Watch for changes and update proposal
  $: if (clientInfo) {
    updateProposal();
  }

  function updateProposal() {
    proposalActions.updateClientInfo(clientInfo);
    
    // Clear validation errors for fields that are now valid
    validateField('company', clientInfo.company);
    validateField('contactName', clientInfo.contactName);
    validateField('email', clientInfo.email);
  }

  function handleFieldChange(field: string, value: string) {
    clientInfo = { ...clientInfo, [field]: value };
    touched[field] = true;
    validateField(field, value);
  }

  function handleAddressChange(field: keyof ClientAddress, value: string) {
    clientInfo = {
      ...clientInfo,
      address: { ...clientInfo.address, [field]: value }
    };
    touched[`address.${field}`] = true;
  }

  function validateField(field: string, value: string) {
    const newErrors = { ...errors };

    switch (field) {
      case 'company':
        if (!value.trim()) {
          newErrors.company = 'Company name is required';
        } else {
          delete newErrors.company;
        }
        break;

      case 'contactName':
        if (!value.trim()) {
          newErrors.contactName = 'Contact name is required';
        } else {
          delete newErrors.contactName;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'phone':
        if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
        }
        break;
    }

    errors = newErrors;

    // Update step completion status
    const isStepValid = !newErrors.company && !newErrors.contactName && !newErrors.email && !newErrors.phone;
    proposalActions.markStepComplete(2, isStepValid);
  }

  function formatPhoneNumber(value: string) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  }

  // US States for dropdown
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Italy', 'Spain', 'Netherlands', 'Japan', 'Other'
  ];
</script>

<!-- Client Information Form -->
<div class="client-info-step space-y-8">
  <!-- Header -->
  <div>
    <h3 class="text-lg font-medium text-slate-900 mb-2">Client Information</h3>
    <p class="text-slate-600">Enter your client's contact details and business information</p>
  </div>

  <!-- Main Form -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Left Column - Primary Info -->
    <div class="space-y-6">
      <h4 class="text-md font-medium text-slate-900 border-b border-slate-200 pb-2">
        Contact Details
      </h4>

      <!-- Company Name -->
      <div class="form-group">
        <label for="company" class="form-label">
          Company Name <span class="text-red-500">*</span>
        </label>
        <input
          id="company"
          type="text"
          class="form-input"
          class:error={errors.company && touched.company}
          bind:value={clientInfo.company}
          on:blur={() => handleFieldChange('company', clientInfo.company)}
          on:input={(e) => handleFieldChange('company', e.currentTarget.value)}
          placeholder="Acme Corporation"
          required
        />
        {#if errors.company && touched.company}
          <p class="form-error">{errors.company}</p>
        {/if}
      </div>

      <!-- Contact Name -->
      <div class="form-group">
        <label for="contactName" class="form-label">
          Contact Name <span class="text-red-500">*</span>
        </label>
        <input
          id="contactName"
          type="text"
          class="form-input"
          class:error={errors.contactName && touched.contactName}
          bind:value={clientInfo.contactName}
          on:blur={() => handleFieldChange('contactName', clientInfo.contactName)}
          on:input={(e) => handleFieldChange('contactName', e.currentTarget.value)}
          placeholder="John Smith"
          required
        />
        {#if errors.contactName && touched.contactName}
          <p class="form-error">{errors.contactName}</p>
        {/if}
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">
          Email Address <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          class="form-input"
          class:error={errors.email && touched.email}
          bind:value={clientInfo.email}
          on:blur={() => handleFieldChange('email', clientInfo.email)}
          on:input={(e) => handleFieldChange('email', e.currentTarget.value)}
          placeholder="john@acmecorp.com"
          required
        />
        {#if errors.email && touched.email}
          <p class="form-error">{errors.email}</p>
        {/if}
      </div>

      <!-- Phone -->
      <div class="form-group">
        <label for="phone" class="form-label">Phone Number</label>
        <input
          id="phone"
          type="tel"
          class="form-input"
          class:error={errors.phone && touched.phone}
          bind:value={clientInfo.phone}
          on:blur={() => {
            clientInfo.phone = formatPhoneNumber(clientInfo.phone || '');
            handleFieldChange('phone', clientInfo.phone || '');
          }}
          on:input={(e) => handleFieldChange('phone', e.currentTarget.value)}
          placeholder="(555) 123-4567"
        />
        {#if errors.phone && touched.phone}
          <p class="form-error">{errors.phone}</p>
        {/if}
      </div>
    </div>

    <!-- Right Column - Address -->
    <div class="space-y-6">
      <h4 class="text-md font-medium text-slate-900 border-b border-slate-200 pb-2">
        Business Address <span class="text-sm text-slate-500 font-normal">(Optional)</span>
      </h4>

      <!-- Street Address -->
      <div class="form-group">
        <label for="street" class="form-label">Street Address</label>
        <input
          id="street"
          type="text"
          class="form-input"
          bind:value={clientInfo.address.street}
          on:input={(e) => handleAddressChange('street', e.currentTarget.value)}
          placeholder="123 Main Street"
        />
      </div>

      <!-- City, State, ZIP -->
      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="city" class="form-label">City</label>
          <input
            id="city"
            type="text"
            class="form-input"
            bind:value={clientInfo.address.city}
            on:input={(e) => handleAddressChange('city', e.currentTarget.value)}
            placeholder="New York"
          />
        </div>

        <div class="form-group">
          <label for="state" class="form-label">State/Province</label>
          {#if clientInfo.address.country === 'United States'}
            <select
              id="state"
              class="form-input"
              bind:value={clientInfo.address.state}
              on:change={(e) => handleAddressChange('state', e.currentTarget.value)}
            >
              <option value="">Select State</option>
              {#each usStates as state}
                <option value={state}>{state}</option>
              {/each}
            </select>
          {:else}
            <input
              id="state"
              type="text"
              class="form-input"
              bind:value={clientInfo.address.state}
              on:input={(e) => handleAddressChange('state', e.currentTarget.value)}
              placeholder="State/Province"
            />
          {/if}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="form-group">
          <label for="zip" class="form-label">ZIP/Postal Code</label>
          <input
            id="zip"
            type="text"
            class="form-input"
            bind:value={clientInfo.address.zip}
            on:input={(e) => handleAddressChange('zip', e.currentTarget.value)}
            placeholder="10001"
          />
        </div>

        <div class="form-group">
          <label for="country" class="form-label">Country</label>
          <select
            id="country"
            class="form-input"
            bind:value={clientInfo.address.country}
            on:change={(e) => handleAddressChange('country', e.currentTarget.value)}
          >
            {#each countries as country}
              <option value={country}>{country}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- Additional Notes -->
  <div class="pt-6 border-t border-slate-200">
    <div class="form-group">
      <label for="notes" class="form-label">Additional Notes</label>
      <textarea
        id="notes"
        rows="3"
        class="form-input"
        bind:value={clientInfo.notes}
        placeholder="Any additional information about the client or project requirements..."
      ></textarea>
      <p class="text-sm text-slate-500 mt-1">
        Optional notes that will help you reference this client later
      </p>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="flex items-center justify-between pt-6 border-t border-slate-200">
    <div class="text-sm text-slate-500">
      <span class="font-medium">Tip:</span> All required fields must be completed to continue
    </div>
    
    <div class="flex items-center space-x-3">
      <!-- Import from CRM (future feature) -->
      <button
        type="button"
        class="text-sm text-slate-500 hover:text-slate-700 underline"
        disabled
        title="Coming soon"
      >
        Import from CRM
      </button>
      
      <!-- Clear form -->
      <button
        type="button"
        class="text-sm text-slate-500 hover:text-slate-700 underline"
        on:click={() => {
          clientInfo = {
            company: '',
            contactName: '',
            email: '',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              zip: '',
              country: 'United States'
            },
            notes: ''
          };
          errors = {};
          touched = {};
        }}
      >
        Clear form
      </button>
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

  .form-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid rgb(209, 213, 219);
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    color: rgb(17, 24, 39);
    background-color: white;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-select:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    border-color: rgb(59, 130, 246);
  }

  .search-result {
    padding: 0.75rem;
    border-bottom: 1px solid rgb(229, 231, 235);
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .search-result:hover {
    background-color: rgb(243, 244, 246);
  }

  .search-result:last-child {
    border-bottom: none;
  }
</style> 