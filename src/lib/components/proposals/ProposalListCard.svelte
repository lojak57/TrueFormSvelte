<script lang="ts">
  import type { Proposal } from "$lib/types";
  import {
    formatCurrency,
    formatDate,
    getStatusColor,
    getStatusGradient,
    getStatusDot,
  } from "$lib/utils/proposalHelpers";
  import { Building2, FileText, Calendar, ChevronRight } from "lucide-svelte";

  export let proposal: Proposal;
</script>

<div
  class="group relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
>
  <a href="/admin/proposals/{proposal.id}" class="block">
    <!-- Card Header with Status Indicator -->
    <div class="relative">
      <!-- Status accent bar -->
      <div
        class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r {getStatusGradient(
          proposal.status
        )}"
      />

      <div class="p-6 pb-4">
        <div class="flex items-start justify-between gap-4">
          <!-- Main proposal info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <h3
                class="text-xl font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors"
              >
                {proposal.title}
              </h3>
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {getStatusColor(
                  proposal.status
                )} flex-shrink-0"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full {getStatusDot(
                    proposal.status
                  )} mr-1.5"
                />
                {proposal.status}
              </span>
            </div>

            <!-- Company info with icon -->
            <div class="flex items-center text-sm text-gray-600 mb-3">
              <div
                class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5"
              >
                <Building2 size={16} class="text-slate-500" />
                <span class="font-medium">
                  Company #{proposal.company_id?.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <!-- Total value - prominent display -->
          <div class="text-right flex-shrink-0">
            <div class="text-3xl font-bold text-blue-600">
              {formatCurrency(proposal.total_amount || 0)}
            </div>
            <div class="text-sm text-gray-500 font-medium">Total Value</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card Body -->
    <div class="px-6 pb-4">
      <!-- Services preview -->
      {#if proposal.line_items && proposal.line_items.length > 0}
        <div class="mb-4">
          <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <FileText size={16} class="text-slate-600" />
            <span class="font-medium">
              {proposal.line_items.length} Services
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each proposal.line_items.slice(0, 3) as item}
              <span
                class="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
              >
                {item.description}
              </span>
            {/each}
            {#if proposal.line_items.length > 3}
              <span
                class="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
              >
                +{proposal.line_items.length - 3} more
              </span>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Footer with dates and action -->
      <div
        class="flex items-center justify-between pt-3 border-t border-gray-100"
      >
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>Created {formatDate(proposal.created_at)}</span>
          </div>
          {#if proposal.sent_at}
            <div class="flex items-center gap-1.5">
              <span class="w-1 h-1 rounded-full bg-gray-400" />
              <span>Sent {formatDate(proposal.sent_at)}</span>
            </div>
          {/if}
        </div>

        <div
          class="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700"
        >
          <span>View Details</span>
          <ChevronRight
            size={16}
            class="ml-1 transform group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </div>
  </a>
</div>
