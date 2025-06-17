<script lang="ts">
  import '$lib/styles/globals.css';
  import '$lib/styles/animations.css';
  import { page } from '$app/stores';
  import { userSession } from '$lib/stores/user';
  import { goto } from '$app/navigation';
  
  // Admin navigation items
  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/opportunities', label: 'Opportunities', icon: '🎯' },
    { href: '/admin/proposals', label: 'Proposals', icon: '📋' },
    { href: '/admin/companies', label: 'Companies', icon: '🏢' },
    { href: '/admin/contacts', label: 'Contacts', icon: '👥' },
    { href: '/admin/projects', label: 'Projects', icon: '🚀' },
    { href: '/admin/verticals', label: 'Verticals', icon: '📈' },
    { href: '/admin/invoices', label: 'Invoices', icon: '💰' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' }
  ];

  async function handleSignOut() {
    // Clear session and redirect
    await fetch('/auth/signout', { method: 'POST' });
    goto('/login');
  }
</script>

<div class="admin-layout">
  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>TrueForm Admin</h2>
      <p class="user-info">
        {$userSession?.email || 'Admin User'}
      </p>
    </div>

    <nav class="sidebar-nav">
      {#each navItems as item}
        <a 
          href={item.href} 
          class="nav-item"
          class:active={$page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/admin/dashboard')}
        >
          <span class="nav-icon">{item.icon}</span>
          <span class="nav-label">{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="sidebar-footer">
      <button on:click={handleSignOut} class="sign-out-btn">
        <span>🚪</span>
        Sign Out
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <header class="admin-header">
      <div class="header-content">
        <h1 class="page-title">
          {#if $page.url.pathname === '/admin/dashboard'}
            Dashboard
          {:else if $page.url.pathname.includes('/companies')}
            Companies
          {:else if $page.url.pathname.includes('/contacts')}
            Contacts
          {:else if $page.url.pathname.includes('/projects')}
            Projects
          {:else if $page.url.pathname.includes('/verticals')}
            Verticals
          {:else if $page.url.pathname.includes('/opportunities')}
            Opportunities
          {:else if $page.url.pathname.includes('/proposals')}
            Proposals
          {:else if $page.url.pathname.includes('/invoices')}
            Invoices
          {:else if $page.url.pathname.includes('/settings')}
            Settings
          {:else}
            Admin
          {/if}
        </h1>
        
        <div class="header-actions">
          <a href="/" class="view-site-btn">
            View Site
          </a>
        </div>
      </div>
    </header>

    <div class="content">
      <slot />
    </div>
  </main>
</div>

<style>
  .admin-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f8fafc;
  }

  /* Sidebar */
  .sidebar {
    width: 280px;
    background-color: #1e293b;
    color: white;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 2rem 1.5rem 1rem;
    border-bottom: 1px solid #334155;
  }

  .sidebar-header h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #f1f5f9;
  }

  .user-info {
    margin: 0;
    font-size: 0.875rem;
    color: #94a3b8;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: #cbd5e1;
    text-decoration: none;
    transition: all 0.2s;
  }

  .nav-item:hover {
    background-color: #334155;
    color: #f1f5f9;
  }

  .nav-item.active {
    background-color: #3b82f6;
    color: white;
  }

  .nav-icon {
    font-size: 1.25rem;
  }

  .nav-label {
    font-weight: 500;
  }

  .sidebar-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #334155;
  }

  .sign-out-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: none;
    border: 1px solid #475569;
    color: #cbd5e1;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .sign-out-btn:hover {
    background-color: #475569;
    color: #f1f5f9;
  }

  /* Main Content */
  .main-content {
    flex: 1;
    margin-left: 280px;
    display: flex;
    flex-direction: column;
  }

  .admin-header {
    background-color: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    margin: 0;
    font-size: 1.875rem;
    font-weight: 600;
    color: #1e293b;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .view-site-btn {
    padding: 0.5rem 1rem;
    background-color: #f1f5f9;
    color: #475569;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .view-site-btn:hover {
    background-color: #e2e8f0;
  }

  .content {
    flex: 1;
    padding: 2rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 100%;
      position: relative;
      height: auto;
    }

    .main-content {
      margin-left: 0;
    }
  }
</style> 