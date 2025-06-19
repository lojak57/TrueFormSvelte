<script lang="ts">
  import DashboardLayout from "$lib/components/layout/DashboardLayout.svelte";
  import {
    CompanyCard,
    ContactCard,
    ProjectCard,
  } from "$lib/components/business/index.js";
  import BaseCard from "$lib/components/base/BaseCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import type { Company, Contact, Project } from "$lib/types.js";

  // Sample data
  const sampleCompanies: Company[] = [
    {
      id: "1",
      name: "Pillar Apps",
      website: "https://pillarapps.com",
      vertical_id: "technology",
      billing_street: "123 Tech Street",
      billing_city: "Austin",
      billing_state: "TX",
      billing_zip: "78701",
      billing_country: "USA",
      notes:
        "Sister organization focused on mobile app development and digital solutions.",
      status: "active",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Green Valley Golf Club",
      website: "https://greenvalleygolf.com",
      vertical_id: "golf",
      billing_city: "Scottsdale",
      billing_state: "AZ",
      status: "active",
      created_at: "2024-02-01T14:30:00Z",
    },
    {
      id: "3",
      name: "Lone Star Energy",
      vertical_id: "oilfield",
      billing_city: "Houston",
      billing_state: "TX",
      status: "pending",
      created_at: "2024-02-15T09:15:00Z",
    },
    {
      id: "4",
      name: "MedTech Solutions",
      website: "https://medtechsolutions.com",
      vertical_id: "healthcare",
      billing_city: "Boston",
      billing_state: "MA",
      status: "active",
      created_at: "2024-01-20T16:45:00Z",
    },
  ];

  const sampleContacts: Contact[] = [
    {
      id: "1",
      company_id: "1",
      first_name: "Trent",
      last_name: "Mechelay",
      email: "trent@pillarapps.com",
      phone: "+1-512-555-0123",
      title: "CEO",
      notes: "Visionary leader driving innovation in mobile technology.",
      status: "active",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      company_id: "2",
      first_name: "Sarah",
      last_name: "Johnson",
      email: "sarah@greenvalleygolf.com",
      phone: "+1-480-555-0456",
      title: "General Manager",
      status: "active",
      created_at: "2024-02-01T14:30:00Z",
      updated_at: "2024-02-01T14:30:00Z",
    },
    {
      id: "3",
      company_id: "3",
      first_name: "Mike",
      last_name: "Rodriguez",
      email: "mike@lonestarenergy.com",
      phone: "+1-713-555-0789",
      title: "Operations Director",
      status: "active",
      created_at: "2024-02-15T09:15:00Z",
      updated_at: "2024-02-15T09:15:00Z",
    },
    {
      id: "4",
      company_id: "4",
      first_name: "Dr. Emily",
      last_name: "Chen",
      email: "emily@medtechsolutions.com",
      title: "Chief Technology Officer",
      status: "active",
      created_at: "2024-01-20T16:45:00Z",
      updated_at: "2024-01-20T16:45:00Z",
    },
  ];

  const sampleProjects: Project[] = [
    {
      id: "1",
      company_id: "1",
      name: "Mobile CRM Platform",
      description:
        "Development of a comprehensive mobile CRM solution with real-time synchronization and offline capabilities.",
      project_type: "custom_development",
      status: "active",
      start_date: "2024-01-15",
      end_date: "2024-06-15",
      budget: 150000,
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      company_id: "2",
      name: "Golf Club Website Launch",
      description:
        "Complete website redesign with booking system, member portal, and event management.",
      project_type: "website_launch",
      status: "active",
      start_date: "2024-02-01",
      end_date: "2024-04-01",
      budget: 25000,
      created_at: "2024-02-01T14:30:00Z",
    },
    {
      id: "3",
      company_id: "3",
      name: "Operations Dashboard Demo",
      description:
        "Interactive frontend demo showcasing real-time drilling data and equipment monitoring.",
      project_type: "frontend_demo",
      status: "planning",
      start_date: "2024-03-01",
      budget: 35000,
      created_at: "2024-02-15T09:15:00Z",
    },
    {
      id: "4",
      company_id: "4",
      name: "Healthcare Platform Integration",
      description:
        "Integration with existing EHR systems and compliance with HIPAA requirements.",
      project_type: "platform_integration",
      status: "completed",
      start_date: "2024-01-01",
      end_date: "2024-02-28",
      budget: 75000,
      created_at: "2024-01-20T16:45:00Z",
    },
  ];

  // Demo actions
  const headerActions = [
    {
      label: "Add Company",
      variant: "primary" as const,
      onClick: () => alert("Add Company clicked!"),
    },
    {
      label: "Import Data",
      variant: "outline" as const,
      onClick: () => alert("Import Data clicked!"),
    },
  ];

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
    document.addEventListener("edit", handleEdit);
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
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{sampleCompanies.length}</div>
            <div class="stat-label">Companies</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{sampleContacts.length}</div>
            <div class="stat-label">Contacts</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{sampleProjects.length}</div>
            <div class="stat-label">Projects</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">12</div>
            <div class="stat-label">Verticals</div>
          </div>
        </div>
      </div>
    </BaseCard>
  </section>

  <!-- Company Cards Section -->
  <section class="demo-section">
    <h2 class="section-title">Company Cards</h2>
    <p class="section-description">
      Company cards with vertical-specific styling and multiple display
      variants.
    </p>

    <!-- Hero Variant -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Hero Variant</h3>
      <div class="hero-demo">
        <CompanyCard company={sampleCompanies[0]} variant="hero" />
      </div>
    </div>

    <!-- Compact Grid -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Compact Grid</h3>
      <div class="compact-grid">
        {#each sampleCompanies as company}
          <CompanyCard {company} variant="compact" />
        {/each}
      </div>
    </div>

    <!-- Mini List -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Mini List</h3>
      <div class="mini-list">
        {#each sampleCompanies as company}
          <CompanyCard {company} variant="mini" />
        {/each}
      </div>
    </div>
  </section>

  <!-- Contact Cards Section -->
  <section class="demo-section">
    <h2 class="section-title">Contact Cards</h2>
    <p class="section-description">
      Contact cards with avatar generation and communication actions.
    </p>

    <!-- Hero Variant -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Hero Variant</h3>
      <div class="hero-demo">
        <ContactCard contact={sampleContacts[0]} variant="hero" />
      </div>
    </div>

    <!-- Compact Grid -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Compact Grid</h3>
      <div class="compact-grid">
        {#each sampleContacts as contact}
          <ContactCard {contact} variant="compact" />
        {/each}
      </div>
    </div>

    <!-- Mini List -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Mini List</h3>
      <div class="mini-list">
        {#each sampleContacts as contact}
          <ContactCard {contact} variant="mini" />
        {/each}
      </div>
    </div>
  </section>

  <!-- Project Cards Section -->
  <section class="demo-section">
    <h2 class="section-title">Project Cards</h2>
    <p class="section-description">
      Project cards with type-specific styling, status indicators, and budget
      information.
    </p>

    <!-- Hero Variant -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Hero Variant</h3>
      <div class="hero-demo">
        <ProjectCard project={sampleProjects[0]} variant="hero" />
      </div>
    </div>

    <!-- Compact Grid -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Compact Grid</h3>
      <div class="compact-grid">
        {#each sampleProjects as project}
          <ProjectCard {project} variant="compact" />
        {/each}
      </div>
    </div>

    <!-- Mini List -->
    <div class="demo-subsection">
      <h3 class="subsection-title">Mini List</h3>
      <div class="mini-list">
        {#each sampleProjects as project}
          <ProjectCard {project} variant="mini" />
        {/each}
      </div>
    </div>
  </section>

  <!-- Mixed Layout Section -->
  <section class="demo-section">
    <h2 class="section-title">Mixed Layout Example</h2>
    <p class="section-description">
      Real-world dashboard layout combining different card variants.
    </p>

    <div class="mixed-layout">
      <!-- Featured Company -->
      <div class="featured-section">
        <CompanyCard company={sampleCompanies[0]} variant="hero" />
      </div>

      <!-- Quick Stats -->
      <div class="stats-section">
        <BaseCard variant="compact">
          <h3 class="stats-title">Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">📊</div>
              <div class="activity-text">New project started</div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">👤</div>
              <div class="activity-text">Contact added</div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">🏢</div>
              <div class="activity-text">Company updated</div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Contacts -->
      <div class="contacts-section">
        <h3 class="section-subtitle">Recent Contacts</h3>
        <div class="contact-mini-list">
          {#each sampleContacts.slice(0, 3) as contact}
            <ContactCard {contact} variant="mini" showActions={false} />
          {/each}
        </div>
      </div>

      <!-- Active Projects -->
      <div class="projects-section">
        <h3 class="section-subtitle">Active Projects</h3>
        <div class="project-compact-grid">
          {#each sampleProjects.filter((p) => p.status === "active") as project}
            <ProjectCard {project} variant="compact" />
          {/each}
        </div>
      </div>
    </div>
  </section>
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

  .demo-subsection {
    margin-bottom: var(--space-8);
  }

  .subsection-title {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-4) 0;
  }

  .section-subtitle {
    font-family: var(--font-heading);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-3) 0;
  }

  /* Hero Content */
  .hero-content {
    text-align: center;
    padding: var(--space-8);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: var(--space-6);
    margin-top: var(--space-8);
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    font-family: var(--font-heading);
    font-size: var(--text-h1);
    font-weight: var(--font-bold);
    color: var(--color-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    margin-top: var(--space-1);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Layout Grids */
  .hero-demo {
    max-width: 800px;
  }

  .compact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .mini-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    max-width: 400px;
  }

  /* Mixed Layout */
  .mixed-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto;
    gap: var(--space-6);
    grid-template-areas:
      "featured stats"
      "contacts projects";
  }

  .featured-section {
    grid-area: featured;
  }

  .stats-section {
    grid-area: stats;
  }

  .contacts-section {
    grid-area: contacts;
  }

  .projects-section {
    grid-area: projects;
  }

  .stats-title {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--color-text);
    margin: 0 0 var(--space-4) 0;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .activity-icon {
    font-size: var(--text-lg);
  }

  .activity-text {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .contact-mini-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .project-compact-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .mixed-layout {
      grid-template-columns: 1fr;
      grid-template-areas:
        "featured"
        "stats"
        "contacts"
        "projects";
    }

    .compact-grid {
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    .compact-grid {
      grid-template-columns: 1fr;
    }

    .hero-content {
      padding: var(--space-6);
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .hero-content {
      padding: var(--space-4);
    }

    .demo-section {
      margin-bottom: var(--space-8);
    }
  }
</style>
