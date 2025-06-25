<script lang="ts">
  import DashboardLayout from "$lib/components/layout/DashboardLayout.svelte";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import DemoStatsGrid from "$lib/components/demo/DemoStatsGrid.svelte";
  import CompanyCardsDemo from "$lib/components/demo/CompanyCardsDemo.svelte";
  import ContactCardsDemo from "$lib/components/demo/ContactCardsDemo.svelte";
  import ProjectCardsDemo from "$lib/components/demo/ProjectCardsDemo.svelte";
  import {
    sampleCompanies,
    sampleContacts,
    sampleProjects,
    headerActions,
  } from "$lib/data/demoData";

  function handleEdit(event: CustomEvent) {
    console.log("Edit clicked:", event.detail);
    alert(
      `Edit ${
        event.detail.name ||
        event.detail.first_name + " " + event.detail.last_name
      }`
    );
  }

  // Listen for edit events
  if (typeof document !== "undefined") {
    document.addEventListener("edit", handleEdit as EventListener);
  }
</script>

<DashboardLayout
  title="Business Components Demo"
  subtitle="Showcasing TrueForm's enhanced business components with multi-vertical support"
  actions={headerActions}
>
  <!-- Hero Section -->
  <section class="demo-section">
    <BaseCard variant="hero">
      <div class="hero-content">
        <h2 class="section-title">Multi-Vertical Platform</h2>
        <p class="section-description">
          TrueForm serves as a comprehensive website launcher platform across
          multiple industries. Our design system adapts to different verticals
          while maintaining consistency and usability.
        </p>
        <DemoStatsGrid
          companiesCount={sampleCompanies.length}
          contactsCount={sampleContacts.length}
          projectsCount={sampleProjects.length}
        />
      </div>
    </BaseCard>
  </section>

  <CompanyCardsDemo companies={sampleCompanies} />
  <ContactCardsDemo contacts={sampleContacts} />
  <ProjectCardsDemo projects={sampleProjects} />
</DashboardLayout>

<style>
  .demo-section {
    margin-bottom: var(--space-12);
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    font-weight: var(--font-bold);
    color: var(--color-text);
    margin: 0 0 var(--space-3) 0;
  }

  .section-description {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-6) 0;
    line-height: var(--leading-relaxed);
  }

  /* Hero Content */
  .hero-content {
    text-align: center;
    padding: var(--space-8);
  }
</style>
