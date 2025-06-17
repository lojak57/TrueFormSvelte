<script lang="ts">
  import BaseCard from '$lib/components/base/BaseCard.svelte';
  import BaseButton from '$lib/components/base/BaseButton.svelte';
  import BaseInput from '$lib/components/base/BaseInput.svelte';
  import { themeUtils, availableThemes, currentTheme } from '$lib/stores/theme';

  let inputValue = '';
  let emailValue = '';
  let passwordValue = '';
  let loadingCard = false;
  let loadingButton = false;

  function handleCardClick() {
    console.log('Card clicked!');
  }

  function handleButtonClick() {
    loadingButton = true;
    setTimeout(() => {
      loadingButton = false;
    }, 2000);
  }

  function toggleCardLoading() {
    loadingCard = !loadingCard;
  }

  function switchTheme(themeName: keyof typeof availableThemes) {
    themeUtils.setTheme(themeName);
  }
</script>

<svelte:head>
  <title>Design System | TrueForm</title>
  <meta name="description" content="TrueForm Design System showcase - components, tokens, and patterns." />
</svelte:head>

<div class="container mx-auto py-8 space-y-12">
  <header class="text-center space-y-4">
    <h1 class="text-hero font-heading font-bold text-primary">TrueForm Design System</h1>
    <p class="text-lg text-muted max-w-2xl mx-auto">
      A comprehensive design system built for multi-vertical platforms. 
      Consistent, accessible, and white-label ready.
    </p>
  </header>

  <!-- Theme Switcher -->
  <section class="space-y-6">
    <h2 class="text-h2 font-heading font-semibold">Theme Switcher</h2>
    <div class="flex gap-4 flex-wrap">
      <BaseButton on:click={() => switchTheme('default')}>Default Theme</BaseButton>
      <BaseButton variant="secondary" on:click={() => switchTheme('golf')}>Golf Theme</BaseButton>
      <BaseButton variant="outline" on:click={() => switchTheme('oilfield')}>Oilfield Theme</BaseButton>
    </div>
  </section>

  <!-- Design Tokens -->
  <section class="space-y-6">
    <h2 class="text-h2 font-heading font-semibold">Design Tokens</h2>
    
    <!-- Colors -->
    <div class="space-y-4">
      <h3 class="text-h3 font-heading font-medium">Colors</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-primary);"></div>
          <p class="text-sm font-medium">Primary</p>
        </div>
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-accent);"></div>
          <p class="text-sm font-medium">Accent</p>
        </div>
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-info);"></div>
          <p class="text-sm font-medium">Info</p>
        </div>
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-warn);"></div>
          <p class="text-sm font-medium">Warning</p>
        </div>
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-error);"></div>
          <p class="text-sm font-medium">Error</p>
        </div>
        <div class="space-y-2">
          <div class="w-full h-16 rounded-lg" style="background-color: var(--color-success);"></div>
          <p class="text-sm font-medium">Success</p>
        </div>
      </div>
    </div>

    <!-- Typography -->
    <div class="space-y-4">
      <h3 class="text-h3 font-heading font-medium">Typography</h3>
      <div class="space-y-3">
        <div class="text-hero font-heading font-bold">Hero Text (48px)</div>
        <div class="text-h1 font-heading font-semibold">Heading 1 (36px)</div>
        <div class="text-h2 font-heading font-semibold">Heading 2 (30px)</div>
        <div class="text-h3 font-heading font-medium">Heading 3 (24px)</div>
        <div class="text-h4 font-heading font-medium">Heading 4 (20px)</div>
        <div class="text-body">Body text (16px) - The quick brown fox jumps over the lazy dog.</div>
        <div class="text-caption text-muted">Caption text (14px) - Additional information</div>
      </div>
    </div>
  </section>

  <!-- Base Components -->
  <section class="space-y-8">
    <h2 class="text-h2 font-heading font-semibold">Base Components</h2>

    <!-- Cards -->
    <div class="space-y-6">
      <h3 class="text-h3 font-heading font-medium">Cards</h3>
      <div class="grid md:grid-cols-3 gap-6">
        <BaseCard variant="hero" accent="var(--color-primary)" on:click={handleCardClick}>
          <div class="space-y-3">
            <h4 class="text-h4 font-heading font-semibold">Hero Card</h4>
            <p class="text-muted">Large card perfect for featured content and primary actions.</p>
            <div class="flex gap-2">
              <BaseButton size="sm">Action</BaseButton>
              <BaseButton variant="ghost" size="sm">Secondary</BaseButton>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="compact" accent="var(--color-accent)" loading={loadingCard}>
          <div class="space-y-3">
            <h4 class="text-h4 font-heading font-semibold">Compact Card</h4>
            <p class="text-muted">Medium-sized card for content lists and grids.</p>
            <BaseButton size="sm" on:click={toggleCardLoading}>
              {loadingCard ? 'Loading...' : 'Toggle Loading'}
            </BaseButton>
          </div>
        </BaseCard>

        <BaseCard variant="mini" accent="var(--color-info)" clickable={false}>
          <div class="space-y-2">
            <h4 class="text-h5 font-heading font-semibold">Mini Card</h4>
            <p class="text-sm text-muted">Small card for compact layouts.</p>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Buttons -->
    <div class="space-y-6">
      <h3 class="text-h3 font-heading font-medium">Buttons</h3>
      
      <!-- Button Variants -->
      <div class="space-y-4">
        <h4 class="text-h5 font-heading font-medium">Variants</h4>
        <div class="flex gap-4 flex-wrap">
          <BaseButton on:click={handleButtonClick} loading={loadingButton}>Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="outline">Outline</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
        </div>
      </div>

      <!-- Button Sizes -->
      <div class="space-y-4">
        <h4 class="text-h5 font-heading font-medium">Sizes</h4>
        <div class="flex gap-4 items-center flex-wrap">
          <BaseButton size="sm">Small</BaseButton>
          <BaseButton size="md">Medium</BaseButton>
          <BaseButton size="lg">Large</BaseButton>
        </div>
      </div>

      <!-- Button States -->
      <div class="space-y-4">
        <h4 class="text-h5 font-heading font-medium">States</h4>
        <div class="flex gap-4 flex-wrap">
          <BaseButton>Normal</BaseButton>
          <BaseButton loading>Loading</BaseButton>
          <BaseButton disabled>Disabled</BaseButton>
          <BaseButton fullWidth>Full Width</BaseButton>
        </div>
      </div>
    </div>

    <!-- Inputs -->
    <div class="space-y-6">
      <h3 class="text-h3 font-heading font-medium">Form Inputs</h3>
      
      <div class="grid md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <BaseInput
            label="Full Name"
            bind:value={inputValue}
            placeholder="Enter your name"
            hint="This will be displayed on your profile"
          />
          
          <BaseInput
            type="email"
            label="Email Address"
            bind:value={emailValue}
            placeholder="you@example.com"
            required
            success={emailValue.includes('@') ? 'Valid email format' : ''}
            error={emailValue && !emailValue.includes('@') ? 'Please enter a valid email' : ''}
          />
          
          <BaseInput
            type="password"
            label="Password"
            bind:value={passwordValue}
            placeholder="Enter password"
            required
            floating={false}
          />
        </div>

        <div class="space-y-4">
          <BaseInput
            label="Company Name"
            size="lg"
            placeholder="Your company"
          />
          
          <BaseInput
            label="Phone Number"
            type="tel"
            size="sm"
            placeholder="+1 (555) 123-4567"
          />
          
          <BaseInput
            label="Website URL"
            type="url"
            placeholder="https://example.com"
            disabled
            value="https://trueform.dev"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Animations -->
  <section class="space-y-6">
    <h2 class="text-h2 font-heading font-semibold">Animations</h2>
    
    <div class="grid md:grid-cols-3 gap-6">
      <BaseCard variant="compact" class="card-hover">
        <div class="space-y-3">
          <h4 class="text-h4 font-heading font-semibold">Hover Effects</h4>
          <p class="text-muted">Hover over this card to see the accent bar animation.</p>
        </div>
      </BaseCard>

      <BaseCard variant="compact" clickable={false}>
        <div class="space-y-3">
          <h4 class="text-h4 font-heading font-semibold">Loading States</h4>
          <div class="space-y-2">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="compact" clickable={false}>
        <div class="space-y-3">
          <h4 class="text-h4 font-heading font-semibold">Micro-interactions</h4>
          <BaseButton class="btn-press">Press Me</BaseButton>
        </div>
      </BaseCard>
    </div>
  </section>

  <!-- Responsive Grid -->
  <section class="space-y-6">
    <h2 class="text-h2 font-heading font-semibold">Responsive Grid</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each Array(8) as _, i}
        <BaseCard variant="mini" accent="var(--color-accent)">
          <div class="text-center">
            <h5 class="text-h6 font-heading font-semibold">Item {i + 1}</h5>
            <p class="text-sm text-muted">Grid item</p>
          </div>
        </BaseCard>
      {/each}
    </div>
  </section>
</div>

<style>
  /* Custom styles for demo */
  :global(.btn-press) {
    transition: transform var(--duration-150) var(--ease-in-out);
  }
  
  :global(.btn-press:active) {
    transform: scale(0.95);
  }
</style> 