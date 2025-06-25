<script lang="ts">
  export let type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search" = "text";
  export let value: string | number = "";
  export let label: string = "";
  export let placeholder: string = "";
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let error: string = "";
  export let success: string = "";
  export let hint: string = "";
  export let size: "sm" | "md" | "lg" = "md";
  export let fullWidth: boolean = true;
  export let floating: boolean = true;
  export let id: string = "";

  // Generate unique ID if not provided (optimized - no Math.random in reactive statement)
  let inputId =
    id ||
    `input-${
      crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).substr(2, 9)
    }`;
  $: if (id && id !== inputId) inputId = id;

  // Determine if label should be floating
  $: hasValue = value !== "" && value !== null && value !== undefined;
  $: shouldFloat = floating && (hasValue || placeholder);

  // Optimized CSS classes using derived store pattern
  $: inputClasses = [
    "base-input",
    `size-${size}`,
    error && "error",
    success && "success",
    disabled && "disabled",
    readonly && "readonly",
    fullWidth && "full-width",
    floating && "floating",
    shouldFloat && "has-value",
  ]
    .filter(Boolean)
    .join(" ");

  $: containerClasses = [
    "input-container",
    floating && "floating-container",
    fullWidth && "full-width",
  ]
    .filter(Boolean)
    .join(" ");

  $: ariaDescribedBy = error
    ? `${inputId}-error`
    : success
    ? `${inputId}-success`
    : hint
    ? `${inputId}-hint`
    : undefined;
</script>

<div class={containerClasses}>
  {#if label && !floating}
    <label for={inputId} class="input-label">
      {label}
      {#if required}
        <span class="required-indicator" aria-label="required">*</span>
      {/if}
    </label>
  {/if}

  <div class="input-wrapper">
    <!-- Single consolidated input element -->
    {#if type === "text"}
      <input
        type="text"
        bind:value
        {placeholder}
        {required}
        {disabled}
        {readonly}
        id={inputId}
        class={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        on:input
        on:change
        on:focus
        on:blur
        on:keydown
        on:keyup
      />
    {:else if type === "email"}
      <input
        type="email"
        bind:value
        {placeholder}
        {required}
        {disabled}
        {readonly}
        id={inputId}
        class={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        on:input
        on:change
        on:focus
        on:blur
        on:keydown
        on:keyup
      />
    {:else if type === "password"}
      <input
        type="password"
        bind:value
        {placeholder}
        {required}
        {disabled}
        {readonly}
        id={inputId}
        class={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        on:input
        on:change
        on:focus
        on:blur
        on:keydown
        on:keyup
      />
    {:else if type === "tel"}
      <input
        type="tel"
        bind:value
        {placeholder}
        {required}
        {disabled}
        {readonly}
        id={inputId}
        class={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        on:input
        on:change
        on:focus
        on:blur
        on:keydown
        on:keyup
      />
    {:else}
      <input
        type="text"
        bind:value
        {placeholder}
        {required}
        {disabled}
        {readonly}
        id={inputId}
        class={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={ariaDescribedBy}
        on:input
        on:change
        on:focus
        on:blur
        on:keydown
        on:keyup
      />
    {/if}

    {#if label && floating}
      <label for={inputId} class="floating-label">
        {label}
        {#if required}
          <span class="required-indicator" aria-label="required">*</span>
        {/if}
      </label>
    {/if}

    <!-- Status icons -->
    {#if error}
      <div class="status-icon error-icon" aria-hidden="true">⚠️</div>
    {:else if success}
      <div class="status-icon success-icon" aria-hidden="true">✅</div>
    {/if}
  </div>

  <!-- Error message -->
  {#if error}
    <div id="{inputId}-error" class="input-message error-message" role="alert">
      {error}
    </div>
  {/if}

  <!-- Success message -->
  {#if success}
    <div id="{inputId}-success" class="input-message success-message">
      {success}
    </div>
  {/if}

  <!-- Hint text -->
  {#if hint}
    <div id="{inputId}-hint" class="input-message hint-message">
      {hint}
    </div>
  {/if}
</div>

<style>
  /* CSS Custom Properties */
  .input-container {
    --color-primary: #3b82f6;
    --color-error: #ef4444;
    --color-success: #10b981;
    --color-text: #1f2937;
    --color-text-subtle: #6b7280;
    --color-surface: #ffffff;
    --color-border: #d1d5db;
    --color-border-focus: #3b82f6;
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --transition-all: all 0.2s ease-in-out;
  }

  /* Container */
  .input-container {
    position: relative;
    width: 100%;
  }

  .full-width {
    width: 100%;
  }

  /* Input wrapper */
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  /* Base input styles */
  .base-input {
    width: 100%;
    border: 2px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-base);
    transition: var(--transition-all);
    outline: none;
  }

  /* Size variants */
  .size-sm {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
  }

  .size-md {
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-base);
  }

  .size-lg {
    padding: var(--space-4) var(--space-5);
    font-size: var(--text-lg);
  }

  /* Focus state */
  .base-input:focus {
    border-color: var(--color-border-focus);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Error state */
  .error {
    border-color: var(--color-error);
  }

  .error:focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  /* Success state */
  .success {
    border-color: var(--color-success);
  }

  .success:focus {
    border-color: var(--color-success);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  /* Disabled state */
  .disabled {
    background-color: #f9fafb;
    border-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  /* Readonly state */
  .readonly {
    background-color: #f9fafb;
    cursor: default;
  }

  /* Placeholder */
  .base-input::placeholder {
    color: var(--color-text-subtle);
  }

  /* Labels */
  .input-label {
    display: block;
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }

  /* Floating label */
  .floating-label {
    position: absolute;
    left: var(--space-4);
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--text-base);
    color: var(--color-text-subtle);
    pointer-events: none;
    transition: var(--transition-all);
    background-color: var(--color-surface);
    padding: 0 var(--space-1);
  }

  .floating-container .size-sm + .floating-label {
    left: var(--space-3);
    font-size: var(--text-sm);
  }

  .floating-container .size-lg + .floating-label {
    left: var(--space-5);
    font-size: var(--text-lg);
  }

  /* Floating label active state */
  .base-input:focus + .floating-label,
  .has-value + .floating-label {
    top: 0;
    transform: translateY(-50%);
    font-size: var(--text-sm);
    color: var(--color-primary);
  }

  .error:focus + .floating-label,
  .error.has-value + .floating-label {
    color: var(--color-error);
  }

  .success:focus + .floating-label,
  .success.has-value + .floating-label {
    color: var(--color-success);
  }

  /* Status icons */
  .status-icon {
    position: absolute;
    right: var(--space-3);
    font-size: var(--text-base);
    pointer-events: none;
  }

  /* Messages */
  .input-message {
    margin-top: var(--space-1);
    font-size: var(--text-sm);
  }

  .error-message {
    color: var(--color-error);
  }

  .success-message {
    color: var(--color-success);
  }

  .hint-message {
    color: var(--color-text-subtle);
  }

  /* Required indicator */
  .required-indicator {
    color: var(--color-error);
    margin-left: var(--space-1);
  }

  /* Dark mode support */
  :global(.dark) .input-container {
    --color-surface: #1f2937;
    --color-text: #f9fafb;
    --color-text-subtle: #9ca3af;
    --color-border: #374151;
  }

  :global(.dark) .disabled {
    background-color: #374151;
    border-color: #4b5563;
    color: #6b7280;
  }

  :global(.dark) .readonly {
    background-color: #374151;
  }

  :global(.dark) .floating-label {
    background-color: var(--color-surface);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .base-input,
    .floating-label {
      transition: none;
    }
  }

  /* Mobile adjustments */
  @media (max-width: 640px) {
    .size-lg {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-base);
    }
  }
</style>
