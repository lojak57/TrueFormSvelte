<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import {
    X,
    AlertCircle,
    CheckCircle,
    Info,
    AlertTriangle,
  } from "lucide-svelte";
  import type { ErrorMessage } from "$lib/services/errorService";

  export let message: ErrorMessage;

  const dispatch = createEventDispatcher();

  function dismiss() {
    dispatch("dismiss", message.id);
  }

  function getIcon(type: ErrorMessage["type"]) {
    switch (type) {
      case "error":
        return AlertCircle;
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      default:
        return Info;
    }
  }

  function getStyles(type: ErrorMessage["type"]) {
    switch (type) {
      case "error":
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-600",
          button: "text-red-400 hover:text-red-600",
        };
      case "success":
        return {
          container: "bg-green-50 border-green-200 text-green-800",
          icon: "text-green-600",
          button: "text-green-400 hover:text-green-600",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "text-yellow-600",
          button: "text-yellow-400 hover:text-yellow-600",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "text-blue-600",
          button: "text-blue-400 hover:text-blue-600",
        };
      default:
        return {
          container: "bg-gray-50 border-gray-200 text-gray-800",
          icon: "text-gray-600",
          button: "text-gray-400 hover:text-gray-600",
        };
    }
  }

  $: icon = getIcon(message.type);
  $: styles = getStyles(message.type);
</script>

<div
  class="border rounded-lg p-4 mb-3 flex items-start gap-3 {styles.container}"
  transition:slide={{ duration: 300 }}
  role="alert"
  aria-live="polite"
>
  <div class="flex-shrink-0 mt-0.5">
    <svelte:component this={icon} size={20} class={styles.icon} />
  </div>

  <div class="flex-1 min-w-0">
    <div class="font-medium text-sm">
      {message.title}
    </div>
    <div class="text-sm mt-1 leading-relaxed">
      {message.message}
    </div>
    {#if message.timestamp}
      <div class="text-xs mt-2 opacity-75">
        {message.timestamp.toLocaleTimeString()}
      </div>
    {/if}
  </div>

  {#if message.dismissible}
    <button
      type="button"
      class="flex-shrink-0 {styles.button} transition-colors"
      on:click={dismiss}
      aria-label="Dismiss message"
    >
      <X size={16} />
    </button>
  {/if}
</div>
