<script lang="ts">
  import { fly } from "svelte/transition";
  import {
    Settings,
    Palette,
    ShoppingBag,
    Upload,
    Type,
    Eye,
  } from "lucide-svelte";
  import IntersectionObserver from "$lib/components/ui/IntersectionObserver.svelte";
</script>

<section
  id="website-editor"
  class="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <IntersectionObserver threshold={0.1} once={true} let:isVisible>
      {#if isVisible}
        <div class="text-center mb-16" in:fly={{ y: 30, duration: 600 }}>
          <div
            class="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            in:fly={{ y: 20, duration: 600, delay: 100 }}
          >
            <Settings size={16} />
            Included with Every Site
          </div>
          <h2
            class="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            in:fly={{ y: 30, duration: 600, delay: 200 }}
          >
            Your Website, <span class="text-orange-600">Your Control</span>
          </h2>
          <p
            class="text-xl text-gray-600 max-w-4xl mx-auto mb-8"
            in:fly={{ y: 30, duration: 600, delay: 300 }}
          >
            Most agencies build your site and disappear. We give you a custom
            admin dashboard so you can update content, add products, change
            colors, and manage everything yourself—forever.
          </p>
          <p
            class="text-lg text-gray-600 max-w-3xl mx-auto"
            in:fly={{ y: 30, duration: 600, delay: 400 }}
          >
            <strong>No more waiting.</strong> No more paying for tiny changes. No
            more feeling helpless with your own website.
          </p>
        </div>

        <!-- Editor Preview Mockup -->
        <div
          class="relative mb-16"
          in:fly={{ y: 50, duration: 800, delay: 500 }}
        >
          <div
            class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-6xl mx-auto"
          >
            <!-- Mockup Header -->
            <div
              class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="flex gap-2">
                  <div class="w-3 h-3 bg-red-500 rounded-full" />
                  <div class="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div class="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <span class="text-sm text-gray-600 font-medium"
                  >your-business.com/admin</span
                >
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <Eye size={16} />
                <span>Preview Site</span>
              </div>
            </div>

            <!-- Mockup Content -->
            <div class="grid md:grid-cols-4 min-h-[400px]">
              <!-- Sidebar -->
              <div class="bg-gray-900 text-white p-6">
                <div class="mb-8">
                  <h3 class="text-lg font-semibold mb-4">Website Editor</h3>
                  <nav class="space-y-2">
                    <div
                      class="flex items-center gap-3 p-2 bg-orange-600 rounded-lg text-sm font-medium"
                    >
                      <Type size={16} />
                      Content
                    </div>
                    <div
                      class="flex items-center gap-3 p-2 text-gray-300 hover:text-white text-sm"
                    >
                      <ShoppingBag size={16} />
                      Products
                    </div>
                    <div
                      class="flex items-center gap-3 p-2 text-gray-300 hover:text-white text-sm"
                    >
                      <Palette size={16} />
                      Design
                    </div>
                    <div
                      class="flex items-center gap-3 p-2 text-gray-300 hover:text-white text-sm"
                    >
                      <Upload size={16} />
                      Media
                    </div>
                    <div
                      class="flex items-center gap-3 p-2 text-gray-300 hover:text-white text-sm"
                    >
                      <Settings size={16} />
                      Settings
                    </div>
                  </nav>
                </div>
              </div>

              <!-- Main Content Area -->
              <div class="md:col-span-3 p-6 bg-white">
                <div class="mb-6">
                  <h4 class="text-lg font-semibold text-gray-900 mb-2">
                    Edit Homepage Content
                  </h4>
                  <p class="text-gray-600 text-sm">
                    Update your homepage headline and description in real-time
                  </p>
                </div>

                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Main Headline</label
                    >
                    <div
                      class="border-2 border-orange-200 rounded-lg p-3 bg-orange-50"
                    >
                      <input
                        type="text"
                        value="Your Business Name - Professional Services"
                        class="w-full bg-transparent text-gray-900 border-none outline-none text-lg font-semibold"
                        readonly
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Description</label
                    >
                    <div class="border border-gray-200 rounded-lg p-3">
                      <textarea
                        class="w-full bg-transparent text-gray-700 border-none outline-none resize-none"
                        rows="3"
                        readonly
                        >We help businesses succeed with professional, reliable
                        service you can trust. Contact us today to see how we
                        can help your business grow.</textarea
                      >
                    </div>
                  </div>

                  <div class="flex gap-3">
                    <button
                      class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {#each [{ icon: Type, title: "Content Management", description: "Update headlines, descriptions, service pages, and blog posts with an intuitive editor.", color: "text-blue-600 bg-blue-100" }, { icon: ShoppingBag, title: "Product Catalog", description: "Add products, set prices, manage inventory, and create categories—perfect for service menus too.", color: "text-green-600 bg-green-100" }, { icon: Palette, title: "Design Controls", description: "Change colors, fonts, button styles, and layouts to match your evolving brand.", color: "text-purple-600 bg-purple-100" }, { icon: Upload, title: "Media Library", description: "Upload new photos, update your logo, manage galleries, and organize all your visual content.", color: "text-pink-600 bg-pink-100" }, { icon: Eye, title: "Live Preview", description: "See exactly how changes look before publishing. No surprises, no broken layouts.", color: "text-indigo-600 bg-indigo-100" }, { icon: Settings, title: "Site Settings", description: "Update contact info, social links, SEO settings, and integrations whenever you need.", color: "text-orange-600 bg-orange-100" }] as feature, i}
            <div in:fly={{ y: 50, duration: 600, delay: 600 + i * 100 }}>
              <div
                class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div class="flex items-center mb-4">
                  <div
                    class="w-10 h-10 rounded-lg {feature.color} flex items-center justify-center mr-4"
                  >
                    <svelte:component this={feature.icon} size={20} />
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p class="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          {/each}
        </div>

        <!-- Bottom CTA -->
        <div
          class="text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          in:fly={{ y: 40, duration: 600, delay: 1200 }}
        >
          <h3 class="text-2xl font-bold text-gray-900 mb-4">
            Most agencies charge $200+ per hour for updates
          </h3>
          <p class="text-lg text-gray-600 mb-6">
            With TrueForm, you get unlimited self-service updates at no extra
            cost.
          </p>
          <div
            class="flex items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full" />
              <span>Included forever</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full" />
              <span>No monthly fees</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full" />
              <span>Unlimited updates</span>
            </div>
          </div>
        </div>
      {/if}
    </IntersectionObserver>
  </div>
</section>

<style>
  /* Custom styles for the mockup */
  input,
  textarea {
    font-family: inherit;
  }
</style>
