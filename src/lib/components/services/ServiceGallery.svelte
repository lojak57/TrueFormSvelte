<script lang="ts">
  import { fly, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import type { ServiceGalleryItem } from "$lib/types/service.types";
  import { X } from "lucide-svelte";

  export let gallery: ServiceGalleryItem[];
  export let title: string = "See It In Action";
  export let description: string =
    "Real examples of what we've built for businesses like yours.";

  let selectedImage: ServiceGalleryItem | null = null;
  let imageLoadStates: boolean[] = gallery.map(() => false);

  function openModal(item: ServiceGalleryItem) {
    selectedImage = item;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    selectedImage = null;
    document.body.style.overflow = "auto";
  }

  function handleImageLoad(index: number) {
    imageLoadStates[index] = true;
  }
</script>

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.1} once={true} let:isVisible>
      {#if isVisible}
        <!-- Header -->
        <div class="text-center mb-16" in:fly={{ y: 30, duration: 600 }}>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each gallery as item, i}
            <div
              class="group cursor-pointer"
              in:fly={{ y: 50, duration: 600, delay: 200 + i * 100 }}
              on:click={() => openModal(item)}
              on:keydown={(e) => e.key === "Enter" && openModal(item)}
              role="button"
              tabindex="0"
            >
              <div
                class="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
              >
                <!-- Loading Placeholder -->
                {#if !imageLoadStates[i]}
                  <div
                    class="w-full aspect-[4/3] bg-gray-200 animate-pulse flex items-center justify-center"
                  >
                    <div
                      class="w-8 h-8 border-2 border-accent-300 border-t-accent-600 rounded-full animate-spin"
                    />
                  </div>
                {/if}

                <!-- Lazy Loaded Image -->
                <IntersectionObserver
                  threshold={0.1}
                  once={true}
                  let:isVisible={imageVisible}
                >
                  {#if imageVisible}
                    <img
                      src={item.src}
                      alt={item.alt}
                      class="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-110 {imageLoadStates[
                        i
                      ]
                        ? 'opacity-100'
                        : 'opacity-0'}"
                      loading="lazy"
                      on:load={() => handleImageLoad(i)}
                    />
                  {/if}
                </IntersectionObserver>

                <!-- Overlay -->
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div class="absolute bottom-4 left-4 right-4 text-white">
                    {#if item.title}
                      <h3 class="font-semibold text-lg mb-1">{item.title}</h3>
                    {/if}
                    {#if item.description}
                      <p class="text-sm opacity-90">{item.description}</p>
                    {/if}
                  </div>
                </div>

                <!-- Click indicator -->
                <div
                  class="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <svg
                    class="w-4 h-4 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>

<!-- Modal -->
{#if selectedImage}
  <div
    class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
    in:scale={{ duration: 300, easing: quintOut }}
    out:scale={{ duration: 200, easing: quintOut }}
    on:click={closeModal}
    on:keydown={(e) => e.key === "Escape" && closeModal()}
    role="dialog"
    tabindex="-1"
  >
    <div class="relative max-w-4xl max-h-[90vh] w-full">
      <!-- Close Button -->
      <button
        class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        on:click={closeModal}
      >
        <X size={32} />
      </button>

      <!-- Image -->
      <img
        src={selectedImage.src}
        alt={selectedImage.alt}
        class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        on:click|stopPropagation
      />

      <!-- Image Info -->
      {#if selectedImage.title || selectedImage.description}
        <div
          class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6 rounded-b-lg"
        >
          {#if selectedImage.title}
            <h3 class="text-xl font-semibold mb-2">{selectedImage.title}</h3>
          {/if}
          {#if selectedImage.description}
            <p class="text-gray-200">{selectedImage.description}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
