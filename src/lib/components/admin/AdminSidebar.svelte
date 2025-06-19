<script lang="ts">
  import { page } from "$app/stores";
  import {
    Home,
    Building2,
    Users,
    FolderOpen,
    FileText,
    Receipt,
    Target,
    Settings,
    LogOut,
  } from "lucide-svelte";

  const navigationItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/companies", icon: Building2, label: "Companies" },
    { href: "/admin/contacts", icon: Users, label: "Contacts" },
    { href: "/admin/projects", icon: FolderOpen, label: "Projects" },
    { href: "/admin/proposals", icon: FileText, label: "Proposals" },
    { href: "/admin/invoices", icon: Receipt, label: "Invoices" },
    { href: "/admin/opportunities", icon: Target, label: "Opportunities" },
    { href: "/admin/verticals", icon: Building2, label: "Verticals" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  $: currentPath = $page.url.pathname;
</script>

<aside class="admin-sidebar">
  <!-- Logo Section -->
  <div class="sidebar-header">
    <a href="/admin/dashboard" class="logo-link">
      <div class="logo">
        <img src="/logo.svg" alt="TrueForm" class="logo-image" />
      </div>
      <div class="logo-text">
        <div class="company-name">TrueForm</div>
        <div class="company-tagline">CRM</div>
      </div>
    </a>
  </div>

  <!-- Navigation -->
  <nav class="sidebar-nav">
    <ul class="nav-list">
      {#each navigationItems as item}
        <li class="nav-item">
          <a
            href={item.href}
            class="nav-link {currentPath === item.href ? 'active' : ''}"
          >
            <svelte:component this={item.icon} size={20} class="nav-icon" />
            <span class="nav-label">{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <!-- Footer Actions -->
  <div class="sidebar-footer">
    <a href="https://true-form-apps.com" target="_blank" class="footer-link">
      View Marketing Site
    </a>
    <a href="/auth/signout" class="footer-link signout">
      <LogOut size={16} />
      Sign Out
    </a>
  </div>
</aside>

<style>
  .admin-sidebar {
    width: 260px;
    height: 100vh;
    background: white;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 50;
  }

  .sidebar-header {
    padding: 1.5rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
  }

  .logo {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .logo-text {
    flex: 1;
  }

  .company-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;
  }

  .company-tagline {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin: 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s ease;
    border-left: 3px solid transparent;
  }

  .nav-link:hover {
    background-color: #f9fafb;
    color: #374151;
  }

  .nav-link.active {
    background-color: #eff6ff;
    color: #2563eb;
    border-left-color: #2563eb;
  }

  .nav-icon {
    flex-shrink: 0;
  }

  .nav-label {
    flex: 1;
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 0.375rem;
    transition: all 0.15s ease;
  }

  .footer-link:hover {
    background-color: #f9fafb;
    color: #374151;
  }

  .footer-link.signout {
    color: #dc2626;
  }

  .footer-link.signout:hover {
    background-color: #fef2f2;
    color: #b91c1c;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .admin-sidebar {
      width: 240px;
    }
  }

  @media (max-width: 768px) {
    .admin-sidebar {
      width: 220px;
      transform: translateX(-100%);
      transition: transform 0.2s ease;
    }

    .admin-sidebar.open {
      transform: translateX(0);
    }
  }
</style>
