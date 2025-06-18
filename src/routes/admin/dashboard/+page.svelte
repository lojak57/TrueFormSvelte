<script lang="ts">
  import { onMount } from "svelte";
  import ModernCard from "$lib/components/ui/ModernCard.svelte";
  import StatsCard from "$lib/components/ui/StatsCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";

  let stats = {
    companies: 0,
    contacts: 0,
    projects: 0,
    verticals: 0,
  };

  let loading = true;

  onMount(async () => {
    // Load dashboard statistics
    try {
      const [companiesRes, contactsRes, projectsRes, verticalsRes] =
        await Promise.all([
          fetch("/api/companies"),
          fetch("/api/contacts"),
          fetch("/api/projects"),
          fetch("/api/verticals"),
        ]);

      if (companiesRes.ok) {
        const companies = await companiesRes.json();
        stats.companies = companies.length;
      }

      if (contactsRes.ok) {
        const contacts = await contactsRes.json();
        stats.contacts = contacts.length;
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        stats.projects = projects.length;
      }

      if (verticalsRes.ok) {
        const verticals = await verticalsRes.json();
        stats.verticals = verticals.length;
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      loading = false;
    }
  });
</script>

<div class="modern-dashboard">
  <!-- Welcome Section -->
  <section class="welcome-section">
    <ModernCard variant="feature" size="lg">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1 class="dashboard-title">Welcome to TrueForm</h1>
          <p class="dashboard-subtitle">
            Professional website development platform. Manage clients across
            golf, oilfield, healthcare, and technology industries from this
            unified dashboard.
          </p>
        </div>
        <div class="welcome-visual">
          <div class="visual-grid">
            <div class="visual-item">🏢</div>
            <div class="visual-item">🚀</div>
            <div class="visual-item">📈</div>
          </div>
        </div>
      </div>
    </ModernCard>
  </section>

  <!-- Stats Grid -->
  <section class="stats-section">
    <h2 class="section-title">Overview</h2>
    <div class="stats-grid">
      <StatsCard
        title="Companies"
        value={stats.companies.toString()}
        icon="🏢"
        href="/admin/companies"
        {loading}
        trend="up"
        change={12.5}
        changeLabel="vs last month"
      />

      <StatsCard
        title="Contacts"
        value={stats.contacts.toString()}
        icon="👥"
        href="/admin/contacts"
        {loading}
        trend="up"
        change={8.3}
        changeLabel="vs last month"
      />

      <StatsCard
        title="Active Projects"
        value={stats.projects.toString()}
        icon="🚀"
        href="/admin/projects"
        {loading}
        trend="up"
        change={15.7}
        changeLabel="vs last month"
      />

      <StatsCard
        title="Verticals"
        value={stats.verticals.toString()}
        icon="📈"
        href="/admin/verticals"
        {loading}
        trend="neutral"
        change={0}
        changeLabel="vs last month"
      />
    </div>
  </section>

  <!-- Quick Actions -->
  <section class="actions-section">
    <h2 class="section-title">Quick Actions</h2>
    <ModernCard variant="elevated" size="lg">
      <div class="actions-grid">
        <a href="/admin/companies/create" class="action-card">
          <div class="action-icon">🏢</div>
          <div class="action-content">
            <h3 class="action-title">New Company</h3>
            <p class="action-desc">Add a new client company</p>
          </div>
        </a>

        <a href="/admin/contacts/create" class="action-card">
          <div class="action-icon">👤</div>
          <div class="action-content">
            <h3 class="action-title">New Contact</h3>
            <p class="action-desc">Add a contact person</p>
          </div>
        </a>

        <a href="/admin/projects/create" class="action-card">
          <div class="action-icon">🚀</div>
          <div class="action-content">
            <h3 class="action-title">New Project</h3>
            <p class="action-desc">Start a new project</p>
          </div>
        </a>

        <a href="/admin/proposals/new" class="action-card">
          <div class="action-icon">📋</div>
          <div class="action-content">
            <h3 class="action-title">New Proposal</h3>
            <p class="action-desc">Create a proposal</p>
          </div>
        </a>
      </div>
    </ModernCard>
  </section>
</div>

<style>
  .modern-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 48px;
  }

  .welcome-section {
    margin-bottom: 16px;
  }

  .welcome-content {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .welcome-text {
    flex: 1;
  }

  .dashboard-title {
    font-size: 32px;
    font-weight: 800;
    color: rgb(17, 24, 39);
    margin: 0 0 12px 0;
    line-height: 1.2;
  }

  .dashboard-subtitle {
    font-size: 18px;
    color: rgb(107, 114, 128);
    margin: 0;
    line-height: 1.6;
  }

  .welcome-visual {
    flex-shrink: 0;
  }

  .visual-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .visual-item {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: rgb(248, 250, 252);
    border-radius: 12px;
    border: 1px solid rgb(243, 244, 246);
  }

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: rgb(17, 24, 39);
    margin: 0 0 24px 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-radius: 12px;
    background: rgb(248, 250, 252);
    border: 1px solid rgb(243, 244, 246);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .action-card:hover {
    background: rgb(243, 244, 246);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .action-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: white;
    border-radius: 8px;
    border: 1px solid rgb(229, 231, 235);
    flex-shrink: 0;
  }

  .action-content {
    flex: 1;
  }

  .action-title {
    font-size: 16px;
    font-weight: 600;
    color: rgb(17, 24, 39);
    margin: 0 0 4px 0;
  }

  .action-desc {
    font-size: 14px;
    color: rgb(107, 114, 128);
    margin: 0;
  }

  /* Dark mode */
  :global(.dark) .dashboard-title {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .dashboard-subtitle {
    color: rgb(156, 163, 175);
  }

  :global(.dark) .section-title {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .visual-item {
    background: rgb(31, 41, 55);
    border-color: rgb(55, 65, 81);
  }

  :global(.dark) .action-card {
    background: rgb(31, 41, 55);
    border-color: rgb(55, 65, 81);
  }

  :global(.dark) .action-card:hover {
    background: rgb(55, 65, 81);
  }

  :global(.dark) .action-icon {
    background: rgb(17, 24, 39);
    border-color: rgb(75, 85, 99);
  }

  :global(.dark) .action-title {
    color: rgb(243, 244, 246);
  }

  :global(.dark) .action-desc {
    color: rgb(156, 163, 175);
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .modern-dashboard {
      padding: 24px 16px;
      gap: 32px;
    }

    .welcome-content {
      flex-direction: column;
      text-align: center;
      gap: 24px;
    }

    .dashboard-title {
      font-size: 28px;
    }

    .dashboard-subtitle {
      font-size: 16px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .actions-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .visual-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .visual-item {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }
  }
</style>
