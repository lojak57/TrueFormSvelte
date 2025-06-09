<script lang="ts">
  import { scale } from 'svelte/transition';
  import Card from '$lib/components/ui/Card.svelte';
  import { Star } from 'lucide-svelte';
  import { TESTIMONIALS_DATA } from '$lib/data/content';
</script>

<!-- Testimonials Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        What Our Clients Say
      </h2>
      <p class="text-xl text-gray-600">
        Join hundreds of businesses that have transformed their online presence with TrueForm
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8">
      {#each TESTIMONIALS_DATA as testimonial, i}
        <div in:scale={{ duration: 500, delay: i * 150 }}>
          <Card class="p-8 text-center hover:shadow-xl transition-all duration-300 group">
            <div class="flex justify-center mb-4">
              {#each Array(testimonial.rating) as _}
                <Star size={20} class="text-yellow-400 fill-current" />
              {/each}
            </div>
            
            <blockquote class="text-gray-700 mb-6 italic leading-relaxed">
              "{testimonial.content}"
            </blockquote>
            
            <div class="flex items-center justify-center">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                class="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div class="text-left">
                <div class="font-semibold text-gray-900">{testimonial.name}</div>
                <div class="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
              </div>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  </div>
</section> 