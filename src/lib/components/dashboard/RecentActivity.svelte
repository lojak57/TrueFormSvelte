<script lang="ts">
  import { formatDistanceToNow } from "date-fns";
  import {
    FileText,
    Trophy,
    UserPlus,
    MessageSquare,
    DollarSign,
  } from "lucide-svelte";

  export let activities: Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    icon: string;
  }> = [];

  const iconMap: Record<string, any> = {
    FileText,
    Trophy,
    UserPlus,
    MessageSquare,
    DollarSign,
  };

  function getIcon(iconName: string) {
    return iconMap[iconName] || FileText;
  }

  function getIconColor(type: string) {
    const colorMap: Record<string, string> = {
      proposal_sent: "text-blue-600 bg-blue-100",
      deal_won: "text-green-600 bg-green-100",
      contact_added: "text-purple-600 bg-purple-100",
      message_received: "text-yellow-600 bg-yellow-100",
      payment_received: "text-green-600 bg-green-100",
    };
    return colorMap[type] || "text-gray-600 bg-gray-100";
  }
</script>

<div class="activity-container">
  <h3 class="activity-title">Recent Activity</h3>

  {#if activities.length === 0}
    <div class="empty-state">
      <p>No recent activity</p>
    </div>
  {:else}
    <div class="activity-list">
      {#each activities as activity}
        <div class="activity-item">
          <div class="icon-wrapper {getIconColor(activity.type)}">
            <svelte:component this={getIcon(activity.icon)} size={16} />
          </div>
          <div class="activity-content">
            <p class="activity-description">{activity.description}</p>
            <span class="activity-time">
              {formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <button class="view-all-button"> View All Activity </button>
</div>

<style>
  .activity-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .activity-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #111827;
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 0.875rem;
  }

  .activity-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    margin-bottom: 1rem;
  }

  .activity-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
    min-width: 0;
  }

  .activity-description {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
    line-height: 1.5;
  }

  .activity-time {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.25rem;
    display: block;
  }

  .view-all-button {
    margin-top: auto;
    padding: 0.75rem;
    width: 100%;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .view-all-button:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
</style>
