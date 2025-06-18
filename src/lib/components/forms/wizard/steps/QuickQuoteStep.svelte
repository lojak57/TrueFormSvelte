<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let selectedPath = "";

  const pathOptions = [
    {
      id: "express_quote",
      title: "Express Quote",
      subtitle: "Get a quick estimate",
      description:
        "Simple website with core features - get pricing in 60 seconds",
      icon: "⚡",
      time: "1 minute",
      features: [
        "Professional design",
        "Mobile responsive",
        "Contact forms",
        "SEO basics",
      ],
      price: "Starting at $999",
      color: "#10b981",
    },
    {
      id: "custom_solution",
      title: "Custom Solution",
      subtitle: "Detailed consultation",
      description:
        "Complex project with specific requirements - personalized approach",
      icon: "🎯",
      time: "3-4 minutes",
      features: [
        "Advanced features",
        "Custom design",
        "E-commerce",
        "Integrations",
      ],
      price: "Custom pricing",
      color: "#3b82f6",
    },
  ];

  function selectPath(path: string) {
    selectedPath = path;
    setTimeout(() => {
      dispatch("complete", { value: path });
    }, 300);
  }
</script>

<div class="quick-quote-step" in:fade={{ duration: 300 }}>
  <div class="intro-text">
    <h2>How can we help you today?</h2>
    <p>Choose the path that best fits your needs</p>
  </div>

  <div class="path-options">
    {#each pathOptions as option (option.id)}
      <button
        class="path-option"
        class:selected={selectedPath === option.id}
        style="border-color: {selectedPath === option.id
          ? option.color
          : '#e5e7eb'}"
        on:click={() => selectPath(option.id)}
      >
        <div class="option-header">
          <div
            class="option-icon"
            style="background-color: {option.color}20; color: {option.color}"
          >
            {option.icon}
          </div>
          <div class="option-meta">
            <span class="time-badge">{option.time}</span>
          </div>
        </div>

        <div class="option-content">
          <h3 class="option-title">{option.title}</h3>
          <p class="option-subtitle">{option.subtitle}</p>
          <p class="option-description">{option.description}</p>

          <div class="features-list">
            {#each option.features as feature}
              <div class="feature-item">
                <span class="feature-check">✓</span>
                <span class="feature-text">{feature}</span>
              </div>
            {/each}
          </div>

          <div class="price-info" style="color: {option.color}">
            {option.price}
          </div>
        </div>

        <div class="option-arrow" style="color: {option.color}">→</div>
      </button>
    {/each}
  </div>

  <div class="help-text">
    <p>
      💡 Don't worry - you can always upgrade or customize your solution later
    </p>
  </div>
</div>

<style>
  .quick-quote-step {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 700px;
    margin: 0 auto;
  }

  .intro-text {
    text-align: center;
  }

  .intro-text h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
  }

  .intro-text p {
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0;
  }

  .path-options {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .path-option {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    border: 2px solid #e5e7eb;
    border-radius: 1.5rem;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
    position: relative;
  }

  .path-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .path-option.selected {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  .option-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .option-icon {
    width: 60px;
    height: 60px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: bold;
  }

  .time-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .option-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }

  .option-subtitle {
    font-size: 1rem;
    font-weight: 500;
    color: #6b7280;
    margin: 0;
  }

  .option-description {
    font-size: 0.9rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .feature-check {
    color: #10b981;
    font-weight: bold;
    font-size: 0.8rem;
  }

  .feature-text {
    font-size: 0.85rem;
    color: #374151;
  }

  .price-info {
    font-size: 1.125rem;
    font-weight: 700;
    margin-top: 0.5rem;
  }

  .option-arrow {
    font-size: 2rem;
    font-weight: bold;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .path-option:hover .option-arrow {
    transform: translateX(4px);
  }

  .help-text {
    text-align: center;
    color: #6b7280;
    font-size: 0.9rem;
  }

  .help-text p {
    margin: 0;
  }

  @media (max-width: 640px) {
    .path-option {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
      padding: 1.5rem;
    }

    .option-header {
      flex-direction: row;
      justify-content: center;
    }

    .option-icon {
      width: 50px;
      height: 50px;
      font-size: 1.5rem;
    }

    .option-title {
      font-size: 1.25rem;
    }

    .features-list {
      align-items: center;
    }

    .option-arrow {
      font-size: 1.5rem;
    }
  }
</style>
