<script lang="ts">
  import { onMount } from "svelte";

  // Props
  export let threshold = 0.1;
  export let rootMargin = "0px";
  export let once = true;
  export let unobserveOnIntersect = true;

  // State
  let element: HTMLElement;
  let isIntersecting = false;
  let hasIntersected = false;

  // Reactive statements
  $: isVisible = isIntersecting || (once && hasIntersected);

  onMount(() => {
    // Check if IntersectionObserver is supported
    if (!window.IntersectionObserver) {
      // Fallback for older browsers - immediately show
      isIntersecting = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;

          if (entry.isIntersecting) {
            hasIntersected = true;

            if (unobserveOnIntersect && once) {
              observer.unobserve(element);
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (element) {
      observer.observe(element);
    }

    // Cleanup function
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  });
</script>

<div bind:this={element}>
  <slot {isVisible} {isIntersecting} {hasIntersected} />
</div>
