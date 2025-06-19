<script lang="ts">
  import { conversationalWizard } from "../conversationalWizardStore";
  import TextInputStep from "../../ui/TextInputStep.svelte";
  import InlineReassurance from "../reassurance/InlineReassurance.svelte";
  import { fade, fly } from "svelte/transition";

  let currentField = 0;
  let formData = {
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessWebsite: "",
  };

  // Subscribe to store data
  $: if ($conversationalWizard.data) {
    formData = {
      name: $conversationalWizard.data.name || "",
      email: $conversationalWizard.data.email || "",
      phone: $conversationalWizard.data.phone || "",
      businessName: $conversationalWizard.data.businessName || "",
      businessWebsite: $conversationalWizard.data.businessWebsite || "",
    };
  }

  const fields = [
    {
      key: "name",
      title: "What's your name?",
      placeholder: "John Smith",
      inputType: "text",
      autocomplete: "name",
      starterPrompts: [],
      reassurance: "Just your first name is fine too!",
    },
    {
      key: "email",
      title: "What's your email?",
      placeholder: "john@company.com",
      inputType: "email",
      autocomplete: "email",
      starterPrompts: [],
      reassurance: "We'll only use this to send you important updates.",
    },
    {
      key: "phone",
      title: "Phone number? (Optional)",
      placeholder: "(555) 123-4567",
      inputType: "tel",
      autocomplete: "tel",
      skipLabel: "Skip this",
      starterPrompts: [],
      reassurance: "In case we need to reach you quickly.",
    },
    {
      key: "businessName",
      title: "What's your business called?",
      placeholder: "Acme Corp",
      inputType: "text",
      autocomplete: "organization",
      starterPrompts: [
        "We're still figuring out the name",
        "It's a personal project",
        "We're rebranding soon",
      ],
      reassurance: "No business yet? Just put your project name.",
    },
    {
      key: "businessWebsite",
      title: "Current website? (Optional)",
      placeholder: "www.example.com",
      inputType: "text",
      autocomplete: "url",
      skipLabel: "We don't have one yet",
      starterPrompts: [
        "We're starting fresh",
        "It's embarrassingly outdated",
        "Check our social media instead",
      ],
      reassurance: "This helps us understand where you're starting from.",
    },
  ];

  function handleFieldComplete(event: CustomEvent) {
    const { value } = event.detail;
    const field = fields[currentField];

    // Update store
    conversationalWizard.updateData({ [field.key]: value });

    // Move to next field or complete step
    if (currentField < fields.length - 1) {
      currentField++;
    } else {
      conversationalWizard.nextStep();
    }
  }

  function goBack() {
    if (currentField > 0) {
      currentField--;
    }
  }
</script>

<div class="step-container" in:fade={{ duration: 400, delay: 100 }}>
  {#key currentField}
    <div in:fly={{ x: 50, duration: 500 }} out:fly={{ x: -50, duration: 300 }}>
      <h2 class="step-title" in:fly={{ y: 20, duration: 400, delay: 200 }}>
        {fields[currentField].title}
      </h2>

      <div class="input-wrapper" in:fly={{ y: 30, duration: 500, delay: 300 }}>
        <TextInputStep
          value={formData[fields[currentField].key]}
          placeholder={fields[currentField].placeholder}
          inputType={fields[currentField].inputType}
          autocomplete={fields[currentField].autocomplete}
          skipLabel={fields[currentField].skipLabel}
          starterPrompts={fields[currentField].starterPrompts}
          on:complete={handleFieldComplete}
        />

        {#if fields[currentField].reassurance}
          <InlineReassurance
            text={fields[currentField].reassurance}
            delay={1200}
          />
        {/if}
      </div>

      {#if currentField > 0}
        <button
          on:click={goBack}
          class="back-button"
          in:fade={{ duration: 300, delay: 500 }}
        >
          ← Back
        </button>
      {/if}
    </div>
  {/key}
</div>

<style>
  .step-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    height: auto;
    min-height: auto;
  }

  .step-title {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2rem;
    line-height: 1.2;
  }

  .input-wrapper {
    margin-bottom: 2rem;
  }

  .back-button {
    color: #6b7280;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }

  .back-button:hover {
    color: #374151;
    background-color: #f3f4f6;
  }

  @media (max-width: 640px) {
    .step-container {
      padding: 1rem;
    }

    .step-title {
      font-size: 1.5rem;
    }
  }
</style>
