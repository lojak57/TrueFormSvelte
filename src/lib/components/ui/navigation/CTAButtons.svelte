<script lang="ts">
  import Button from '../Button.svelte';
  import { Zap } from 'lucide-svelte';
</script>

<div class="hidden md:flex items-center space-x-4">
  <Button variant="outline" size="sm" class="text-sm">
    <a href="/admin/opportunities">
      Admin
    </a>
  </Button>
  <Button variant="accent" size="sm" class="text-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
    <a href="/request" class="flex items-center gap-2">
      Get Started
      <Zap size={16} />
    </a>
  </Button>
</div> 