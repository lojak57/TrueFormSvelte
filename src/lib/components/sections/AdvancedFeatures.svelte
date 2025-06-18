<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import { Check, Zap, ArrowRight } from "lucide-svelte";
  import { ADVANCED_FEATURES_CONTENT } from "$lib/data/content";
</script>

<!-- Advanced Features Section -->
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div
          class="inline-flex items-center px-4 py-2 mb-6 bg-accent-100 rounded-full text-accent-800 text-sm font-medium"
        >
          <svelte:component
            this={ADVANCED_FEATURES_CONTENT.badge.icon}
            size={16}
            class="mr-2"
          />
          {ADVANCED_FEATURES_CONTENT.badge.text}
        </div>

        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {ADVANCED_FEATURES_CONTENT.title}
        </h2>

        <p class="text-xl text-gray-600 mb-8 leading-relaxed">
          {ADVANCED_FEATURES_CONTENT.description}
        </p>

        <div class="space-y-4 mb-8">
          {#each ADVANCED_FEATURES_CONTENT.features as feature}
            <div class="flex items-start gap-3">
              <Check size={20} class="text-green-500 mt-1" />
              <div>
                <strong class="text-gray-900">{feature.title}</strong>
                <span class="text-gray-600"> {feature.description}</span>
              </div>
            </div>
          {/each}
        </div>

        <div class="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 class="font-semibold text-gray-900 mb-3">
            What You Get vs. The Competition:
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            {#each ADVANCED_FEATURES_CONTENT.comparison.competitors as competitor}
              <div>
                <div class="text-sm font-medium text-red-600 mb-2">
                  ❌ {competitor.name}
                </div>
                <ul class="text-sm text-gray-600 space-y-1">
                  {#each competitor.issues as issue}
                    <li>• {issue}</li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
          <div class="mt-4 pt-4 border-t border-gray-200">
            <div class="text-sm font-medium text-green-600 mb-2">
              ✅ TrueForm Advantage
            </div>
            <p class="text-sm text-gray-600">
              {ADVANCED_FEATURES_CONTENT.comparison.advantage}
            </p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <Button variant="accent" size="lg">
            <a href="/request" class="flex items-center gap-2">
              See What's Possible
              <Zap size={20} />
            </a>
          </Button>
          <Button variant="outline" size="lg">
            <a href="/contact" class="flex items-center gap-2">
              Discuss Your Project
              <ArrowRight size={20} />
            </a>
          </Button>
        </div>
      </div>

      <!-- Comparison Visual -->
      <div class="relative">
        <div
          class="bg-gradient-to-br from-accent-100 to-yellow-100 rounded-2xl p-8"
        >
          <!-- TrueForm Card -->
          <div
            class="bg-white rounded-xl shadow-xl p-6 mb-6 border-2 border-green-500"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center"
              >
                <svelte:component
                  this={ADVANCED_FEATURES_CONTENT.badge.icon}
                  size={24}
                  class="text-white"
                />
              </div>
              <div>
                <div class="font-semibold text-gray-900">TrueForm</div>
                <div class="text-sm text-green-600">Enterprise Features</div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Advanced Features</span>
                <div class="w-16 h-2 bg-green-200 rounded-full">
                  <div class="w-full h-full bg-green-600 rounded-full" />
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Custom Development</span>
                <div class="w-16 h-2 bg-green-200 rounded-full">
                  <div class="w-full h-full bg-green-600 rounded-full" />
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Ongoing Support</span>
                <div class="w-16 h-2 bg-green-200 rounded-full">
                  <div class="w-full h-full bg-green-600 rounded-full" />
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Value for Money</span>
                <div class="w-16 h-2 bg-green-200 rounded-full">
                  <div class="w-full h-full bg-green-600 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <!-- Competitors -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-100 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-700 mb-2">
                Basic Builders
              </div>
              <div class="text-xs text-gray-600">Limited features</div>
              <div class="w-8 h-1 bg-red-300 rounded-full mt-2" />
            </div>
            <div class="bg-gray-100 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-700 mb-2">
                $5k+ Custom
              </div>
              <div class="text-xs text-gray-600">Basic only</div>
              <div class="w-12 h-1 bg-orange-300 rounded-full mt-2" />
            </div>
          </div>

          <div class="text-center mt-6">
            <div class="text-2xl font-bold text-accent-600 mb-2">$999</div>
            <div class="text-sm text-gray-700">
              Enterprise Features Included
            </div>
          </div>
        </div>

        <!-- Floating elements -->
        <div
          class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20"
        />
        <div
          class="absolute -bottom-8 -left-8 w-32 h-32 bg-accent-600 rounded-full opacity-10"
        />
      </div>
    </div>
  </div>
</section>
