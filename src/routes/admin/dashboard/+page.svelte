<script lang="ts">
  import { onMount } from "svelte";
  import ModernCard from "$lib/components/ui/ModernCard.svelte";
  import StatsCard from "$lib/components/ui/StatsCard.svelte";
  import BaseButton from "$lib/components/base/BaseButton.svelte";
  import {
    Building2,
    Users,
    Rocket,
    TrendingUp,
    Plus,
    FileText,
  } from "lucide-svelte";

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
          <h1 class="dashboard-title">Command Intelligence Center</h1>
          <p class="dashboard-subtitle">
            Your personal operations nexus. Monitor client portfolios, oversee
            project progression, and orchestrate business intelligence across
            all verticals with precision and elegance.
          </p>
        </div>
        <div class="welcome-visual">
          <div class="visual-grid">
            <div class="visual-item">
              <Building2 size={28} class="text-white/70" />
            </div>
            <div class="visual-item">
              <Rocket size={28} class="text-white/70" />
            </div>
            <div class="visual-item">
              <TrendingUp size={28} class="text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </ModernCard>
  </section>

  <!-- Intelligence Overview -->
  <section class="stats-section">
    <h2 class="section-title">Intelligence Overview</h2>
    <div class="stats-grid">
      <StatsCard
        title="Client Organizations"
        value={stats.companies.toString()}
        icon={Building2}
        href="/admin/companies"
        {loading}
        trend="up"
        change={12.5}
        changeLabel="portfolio growth"
      />

      <StatsCard
        title="Strategic Contacts"
        value={stats.contacts.toString()}
        icon={Users}
        href="/admin/contacts"
        {loading}
        trend="up"
        change={8.3}
        changeLabel="network expansion"
      />

      <StatsCard
        title="Active Initiatives"
        value={stats.projects.toString()}
        icon={Rocket}
        href="/admin/projects"
        {loading}
        trend="up"
        change={15.7}
        changeLabel="project acceleration"
      />

      <StatsCard
        title="Market Verticals"
        value={stats.verticals.toString()}
        icon={TrendingUp}
        href="/admin/verticals"
        {loading}
        trend="neutral"
        change={0}
        changeLabel="sector coverage"
      />
    </div>
  </section>

  <!-- Executive Actions -->
  <section class="actions-section">
    <h2 class="section-title">Executive Actions</h2>
    <ModernCard variant="elevated" size="lg">
      <div class="actions-grid">
        <a href="/admin/companies/create" class="action-card">
          <div class="action-icon">
            <Building2 size={24} class="text-white/70" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Onboard Organization</h3>
            <p class="action-desc">Register new client entity</p>
          </div>
        </a>

        <a href="/admin/contacts/create" class="action-card">
          <div class="action-icon">
            <Users size={24} class="text-white/70" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Register Contact</h3>
            <p class="action-desc">Add strategic personnel</p>
          </div>
        </a>

        <a href="/admin/projects/create" class="action-card">
          <div class="action-icon">
            <Rocket size={24} class="text-white/70" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Launch Initiative</h3>
            <p class="action-desc">Commence new project</p>
          </div>
        </a>

        <a href="/admin/proposals/new" class="action-card">
          <div class="action-icon">
            <FileText size={24} class="text-white/70" />
          </div>
          <div class="action-content">
            <h3 class="action-title">Draft Proposal</h3>
            <p class="action-desc">Craft strategic offering</p>
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
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
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
    font-weight: 700;
    color: rgb(15, 23, 42);
    margin: 0 0 12px 0;
    line-height: 1.2;
    letter-spacing: -0.025em;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dashboard-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    line-height: 1.6;
    font-weight: 400;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .visual-item:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(71, 85, 105, 0.1);
  }

  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: rgb(15, 23, 42);
    margin: 0 0 24px 0;
    letter-spacing: -0.01em;
    position: relative;
    padding-bottom: 8px;
  }

  .section-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #475569 0%, #94a3b8 100%);
    border-radius: 1px;
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
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.2);
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }

  .action-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(148, 163, 184, 0.1) 50%,
      transparent 100%
    );
    transition: left 0.5s ease;
  }

  .action-card:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(71, 85, 105, 0.15);
    border-color: rgba(148, 163, 184, 0.3);
  }

  .action-card:hover::before {
    left: 100%;
  }

  .action-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    flex-shrink: 0;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .action-card:hover .action-icon {
    background: white;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(71, 85, 105, 0.1);
  }

  .action-content {
    flex: 1;
  }

  .action-title {
    font-size: 16px;
    font-weight: 600;
    color: rgb(15, 23, 42);
    margin: 0 0 4px 0;
    letter-spacing: -0.01em;
  }

  .action-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-weight: 400;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
