<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface $$Props extends HTMLButtonAttributes {
    variant?: "default" | "accent" | "outline" | "ghost";
    size?: "sm" | "default" | "lg";
    class?: string;
  }

  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  let className: $$Props["class"] = undefined;
  export { className as class };

  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-800",
    accent: "bg-accent-600 text-white hover:bg-accent-700",
    outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
    ghost: "text-gray-900 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  $: variantClass = variants[variant || "default"];
  $: sizeClass = sizes[size || "default"];
</script>

<button
  class={cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
    "active:scale-95 active:shadow-inner",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantClass,
    sizeClass,
    className
  )}
  {...$$restProps}
  on:click
>
  <slot />
</button>
