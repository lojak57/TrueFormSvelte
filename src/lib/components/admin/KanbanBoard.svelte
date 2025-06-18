<script lang="ts">
  import Card from "../ui/Card.svelte";
  import Button from "../ui/Button.svelte";
  import { Plus } from "lucide-svelte";

  // Mock data - would come from Supabase
  const columns = [
    {
      id: "discovery",
      title: "Discovery",
      opportunities: [
        { id: 1, company: "Acme Corp", value: 99, contact: "john@acme.com" },
        {
          id: 2,
          company: "TechStart",
          value: 199,
          contact: "sarah@techstart.com",
        },
      ],
    },
    {
      id: "proposal",
      title: "Proposal",
      opportunities: [
        { id: 3, company: "GreenCo", value: 399, contact: "mike@greenco.com" },
      ],
    },
    {
      id: "negotiation",
      title: "Negotiation",
      opportunities: [
        { id: 4, company: "FastBiz", value: 199, contact: "jane@fastbiz.com" },
      ],
    },
    {
      id: "closed_won",
      title: "Closed Won",
      opportunities: [
        { id: 5, company: "BuildIt", value: 399, contact: "tom@buildit.com" },
      ],
    },
    { id: "closed_lost", title: "Closed Lost", opportunities: [] },
  ];
</script>

<div class="flex gap-6 overflow-x-auto pb-6">
  {#each columns as column}
    <div class="flex-shrink-0 w-80">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold text-gray-900">{column.title}</h3>
        <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
          {column.opportunities.length}
        </span>
      </div>

      <div class="space-y-3">
        {#each column.opportunities as opportunity}
          <Card class="p-4 cursor-move hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-medium text-gray-900">{opportunity.company}</h4>
              <span class="text-accent-600 font-semibold"
                >${opportunity.value}</span
              >
            </div>
            <p class="text-sm text-gray-600">{opportunity.contact}</p>
          </Card>
        {/each}

        <Button
          variant="ghost"
          class="w-full justify-start text-gray-500 border-2 border-dashed border-gray-200"
        >
          <Plus size={16} class="mr-2" />
          Add opportunity
        </Button>
      </div>
    </div>
  {/each}
</div>

<div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p class="text-blue-700 text-sm">
    <strong>Note:</strong> Drag-and-drop functionality will be implemented using
    dnd-kit in the next phase.
  </p>
</div>
