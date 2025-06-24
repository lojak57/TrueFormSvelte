<script lang="ts">
  import { fly } from "svelte/transition";
  import { Quote, Star } from "lucide-svelte";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
  import type { ServiceTestimonial } from "$lib/types/service.types";

  export let testimonial: ServiceTestimonial;
</script>

<section class="py-20 bg-gradient-to-br from-accent-50 to-blue-50">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.3} once={true} let:isVisible>
      {#if isVisible}
        <div
          class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
          in:fly={{ y: 50, duration: 800 }}
        >
          <!-- Quote Icon -->
          <div class="absolute -top-6 left-8">
            <div
              class="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Quote size={24} class="text-white" />
            </div>
          </div>

          <!-- Stars -->
          <div
            class="flex justify-center mb-6"
            in:fly={{ y: 20, duration: 600, delay: 200 }}
          >
            {#each Array(5) as _, i}
              <Star size={20} class="text-yellow-400 fill-current" />
            {/each}
          </div>

          <!-- Quote -->
          <blockquote
            class="text-2xl md:text-3xl font-medium text-gray-900 text-center mb-8 leading-relaxed"
            in:fly={{ y: 30, duration: 600, delay: 400 }}
          >
            "{testimonial.quote}"
          </blockquote>

          <!-- Author -->
          <div
            class="flex items-center justify-center"
            in:fly={{ y: 20, duration: 600, delay: 600 }}
          >
            {#if testimonial.avatar}
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                class="w-16 h-16 rounded-full object-cover mr-4 shadow-lg"
                loading="lazy"
              />
            {:else}
              <div
                class="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full mr-4 flex items-center justify-center shadow-lg"
              >
                <span class="text-white font-bold text-xl">
                  {testimonial.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
            {/if}

            <div class="text-center">
              <div class="font-semibold text-lg text-gray-900">
                {testimonial.author}
              </div>
              <div class="text-accent-600 font-medium">{testimonial.role}</div>
              <div class="text-gray-600">{testimonial.company}</div>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute top-8 right-8 w-20 h-20 bg-accent-100 rounded-full opacity-50 -z-10"
          />
          <div
            class="absolute bottom-8 left-8 w-16 h-16 bg-yellow-100 rounded-full opacity-50 -z-10"
          />
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>
