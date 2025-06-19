<script lang="ts">
  import BusinessCard from "$lib/components/ui/BusinessCard.svelte";
  import type { Company } from "$lib/types.js";
  import { createEventDispatcher } from "svelte";

  export let company: Company;
  export let variant: "hero" | "compact" | "mini" = "compact";
  export let showActions: boolean = true;
  export let loading: boolean = false;

  const dispatch = createEventDispatcher();

  function getVerticalColor(verticalId?: string): string {
    const colorMap: Record<string, string> = {
      golf: "#10b981",
      oilfield: "#f59e0b",
      healthcare: "#06b6d4",
      technology: "#3b82f6",
      default: "#6366f1",
    };
    return colorMap[verticalId || "default"] || colorMap.default;
  }

  function mapStatus(
    status: string
  ): "active" | "inactive" | "pending" | "draft" {
    const statusMap: Record<
      string,
      "active" | "inactive" | "pending" | "draft"
    > = {
      active: "active",
      inactive: "inactive",
      pending: "pending",
      archived: "inactive",
      draft: "draft",
    };
    return statusMap[status] || "active";
  }

  function formatVertical(verticalId?: string): string {
    const verticalLabels: Record<string, string> = {
      golf: "Golf & Recreation",
      oilfield: "Oil & Gas",
      healthcare: "Healthcare",
      technology: "Technology",
      default: "General Business",
    };
    return verticalLabels[verticalId || "default"] || "General Business";
  }

  function getDescription(): string {
    let parts = [];

    if (company.vertical_id) {
      parts.push(formatVertical(company.vertical_id));
    }

    if (company.website) {
      parts.push(company.website.replace(/^https?:\/\//, ""));
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
      dispatch("edit", company);
    } else if (action === "view") {
      dispatch("view", company);
      window.location.href = `/admin/companies/${company.id}`;
    }
  }

  function handleClick() {
    dispatch("click", company);
    if (variant !== "hero") {
      window.location.href = `/admin/companies/${company.id}`;
    }
  }
</script>

<BusinessCard
  title={company.name}
  subtitle={formatVertical(company.vertical_id)}
  description={getDescription()}
  status={mapStatus(company.status || "active")}
  href={variant === "hero" ? undefined : `/admin/companies/${company.id}`}
  {loading}
  actions={getActions()}
  on:action={handleAction}
  on:click={handleClick}
/>
