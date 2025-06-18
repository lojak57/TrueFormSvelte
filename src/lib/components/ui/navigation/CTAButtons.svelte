<script lang="ts">
  import Button from "../Button.svelte";
  import { Zap } from "lucide-svelte";
</script>

<div class="hidden md:flex items-center space-x-4">
  <Button
    variant="accent"
    size="sm"
    class="text-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
    on:click={() => (window.location.href = "/request?start=true")}
  >
    <div class="flex items-center gap-2">
      Get Started
      <Zap size={16} />
    </div>
  </Button>
</div>
