<script lang="ts">
  import { fade } from "svelte/transition";
  import KanbanCard from "./KanbanCard.svelte";
  import type { TrueFormOpportunity } from "$lib/api/trueform";

  export let column: {
    id: string;
    title: string;
    color: string;
  };
  export let opportunities: TrueFormOpportunity[];
  export let onDragOver: (event: DragEvent) => void;
  export let onDrop: (columnId: string) => (event: DragEvent) => void;
  export let onDragStart: (
    opportunity: TrueFormOpportunity
  ) => (event: DragEvent) => void;
  export let isRecentOpportunity: (createdAt: string) => boolean;
</script>

<div class="flex-shrink-0 w-80">
  <div class="sticky top-0 z-10 bg-white pb-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900">{column.title}</h3>
      <span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
        {opportunities.length}
      </span>
    </div>
  </div>

  <!-- Drop Zone -->
  <div
    class="min-h-96 p-4 rounded-lg border-2 border-dashed {column.color} transition-colors"
    on:dragover={onDragOver}
    on:drop={onDrop(column.id)}
  >
    <div class="space-y-4">
      {#each opportunities as opportunity}
        <div
          class="cursor-grab active:cursor-grabbing"
          draggable="true"
          on:dragstart={onDragStart(opportunity)}
          in:fade={{ duration: 200 }}
        >
          <KanbanCard {opportunity} {isRecentOpportunity} />
        </div>
      {/each}
    </div>
  </div>
</div>
