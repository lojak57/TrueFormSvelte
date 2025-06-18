<script lang="ts">
  import BusinessCard from "$lib/components/ui/BusinessCard.svelte";
  import type { Project } from "$lib/types.js";
  import { createEventDispatcher } from "svelte";

  export let project: Project;
  export let variant: "hero" | "compact" | "mini" = "compact";
  export let showActions: boolean = true;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function getStatusColor(status: string): string {
    const statusColors: Record<string, string> = {
      active: "#10b981",
      completed: "#06b6d4",
      on_hold: "#f59e0b",
      cancelled: "#ef4444",
      planning: "#8b5cf6",
    };
    return statusColors[status] || statusColors.active;
  }

  function mapStatus(
    status: string
  ): "active" | "inactive" | "pending" | "draft" {
    const statusMap: Record<
      string,
      "active" | "inactive" | "pending" | "draft"
    > = {
      active: "active",
      completed: "active",
      on_hold: "pending",
      cancelled: "inactive",
      planning: "draft",
    };
    return statusMap[status] || "active";
  }

  function formatProjectType(type?: string): string {
    const typeLabels: Record<string, string> = {
      website_launch: "Website Launch",
      frontend_demo: "Frontend Demo",
      custom_development: "Custom Development",
      platform_integration: "Platform Integration",
    };
    return typeLabels[type || ""] || type || "General Project";
  }

  function formatCurrency(amount?: number): string {
    if (!amount) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString?: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getDescription(): string {
    if (project.description) return project.description;

    let parts = [];
    if (project.project_type) {
      parts.push(formatProjectType(project.project_type));
    }
    if (project.end_date) {
      parts.push(`Due ${formatDate(project.end_date)}`);
    }
    return parts.join(" • ");
  }

  function getActions() {
    if (!showActions) return [];

    return [
      { label: "Edit", action: "edit", variant: "secondary" as const },
      { label: "View", action: "view", variant: "primary" as const },
    ];
  }

  function handleAction(event: CustomEvent) {
    const { action } = event.detail;

    if (action === "edit") {
      dispatch("edit", project);
    } else if (action === "view") {
      dispatch("view", project);
      // Also handle navigation for backward compatibility
      window.location.href = `/admin/projects/${project.id}`;
    }
  }

  function handleClick() {
    dispatch("click", project);
    if (variant !== "hero") {
      window.location.href = `/admin/projects/${project.id}`;
    }
  }
</script>

<BusinessCard
  title={project.name}
  subtitle={formatProjectType(project.project_type)}
  description={getDescription()}
  status={mapStatus(project.status)}
  value={formatCurrency(project.budget)}
  valueLabel="Budget"
  href={variant === "hero" ? undefined : `/admin/projects/${project.id}`}
  {loading}
  actions={getActions()}
  on:action={handleAction}
  on:click={handleClick}
/>
