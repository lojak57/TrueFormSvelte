<script lang="ts">
  import { cn } from "$lib/utils";

  interface $$Props {
    class?: string;
  }

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div
  class={cn(
    "rounded-2xl bg-white p-6 shadow-soft border border-gray-100",
    className
  )}
  {...$$restProps}
>
  <slot />
</div>
