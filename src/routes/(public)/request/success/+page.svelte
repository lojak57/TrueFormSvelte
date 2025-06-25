<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { fade, scale } from "svelte/transition";
  import Button from "$lib/components/ui/Button.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import {
    CheckCircle,
    ArrowRight,
    Phone,
    Mail,
    Calendar,
  } from "lucide-svelte";

  let opportunityId = "";
  let isLoading = true;

  onMount(() => {
    // Get opportunity ID from URL params
    opportunityId = $page.url.searchParams.get("id") || "";

    if (!opportunityId) {
      // If no ID, redirect to home
      goto("/");
      return;
    }

    isLoading = false;
  });
</script>

<svelte:head>
  <title>Request Submitted Successfully | True-Form</title>
  <meta
    name="description"
    content="Thank you for your website request. We'll be in touch soon to discuss your project."
  />
</svelte:head>

{#if !isLoading}
  <div class="min-h-screen bg-gray-50 py-12 px-6">
    <div class="max-w-4xl mx-auto">
      <!-- Success Header -->
      <div class="text-center mb-12" in:fade={{ delay: 200, duration: 600 }}>
        <div class="mb-6" in:scale={{ delay: 400, duration: 600 }}>
          <CheckCircle size={80} class="text-green-500 mx-auto mb-4" />
        </div>
        <h1 class="text-4xl font-semibold text-gray-900 mb-4">
          Request Submitted Successfully!
        </h1>
        <p class="text-xl text-gray-600">
          Thank you for choosing True-Form. We've received your website request
          and will be in touch soon.
        </p>
      </div>

      <!-- Request Details -->
      <div
        class="grid md:grid-cols-2 gap-8 mb-12"
        in:fade={{ delay: 600, duration: 600 }}
      >
        <!-- What Happens Next -->
        <Card class="p-8">
          <h2
            class="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2"
          >
            <Calendar class="text-accent-600" size={24} />
            What Happens Next
          </h2>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              >
                1
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Initial Review</h3>
                <p class="text-gray-600 text-sm">
                  Our team will review your requirements within 2-4 hours during
                  business hours.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              >
                2
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">Discovery Call</h3>
                <p class="text-gray-600 text-sm">
                  We'll schedule a 30-minute call to discuss your project in
                  detail.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              >
                3
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">
                  Custom Proposal
                </h3>
                <p class="text-gray-600 text-sm">
                  You'll receive a detailed proposal with timeline,
                  deliverables, and pricing.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div
                class="w-8 h-8 bg-accent-600 text-white rounded-full flex items-center justify-center text-sm font-semibold"
              >
                4
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 mb-1">
                  Project Kickoff
                </h3>
                <p class="text-gray-600 text-sm">
                  Once approved, we'll begin your website development
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <!-- Contact Information -->
        <Card class="p-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">
            Need Immediate Assistance?
          </h2>

          <div class="space-y-4">
            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone class="text-accent-600" size={20} />
              <div>
                <p class="font-semibold text-gray-900">Call Us</p>
                <p class="text-gray-600 text-sm">(720) 993-6562</p>
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail class="text-accent-600" size={20} />
              <div>
                <p class="font-semibold text-gray-900">Email Support</p>
                <p class="text-gray-600 text-sm">
                  mitch.mechelay@true-form-apps.com
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 p-4 bg-accent-50 rounded-lg">
            <p class="text-sm text-accent-800">
              <strong>Reference ID:</strong>
              {opportunityId.slice(0, 8).toUpperCase()}
            </p>
            <p class="text-xs text-accent-600 mt-1">
              Please reference this ID in any correspondence about your project.
            </p>
          </div>
        </Card>
      </div>

      <!-- Call to Action -->
      <div class="text-center" in:fade={{ delay: 800, duration: 600 }}>
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">
            While You Wait...
          </h2>
          <p class="text-gray-600 mb-6">
            Check out our portfolio and see how we've helped other businesses
            transform their online presence.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" class="px-6">
              <a href="/portfolio" class="flex items-center gap-2">
                View Our Portfolio
                <ArrowRight size={20} />
              </a>
            </Button>

            <Button variant="outline" size="lg" class="px-6">
              <a href="/"> Return to Homepage </a>
            </Button>
          </div>
        </div>

        <!-- Social Proof -->
        <div class="text-center">
          <p class="text-gray-500 text-sm mb-4">
            Join 200+ businesses that have transformed their online presence
            with True-Form
          </p>
          <div class="flex justify-center items-center space-x-2">
            {#each Array(5) as _, i}
              <span class="text-yellow-400 text-lg">⭐</span>
            {/each}
            <span class="text-sm text-gray-600 ml-2"
              >4.9/5 based on 127 reviews</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"
      />
      <p class="text-gray-600">Loading...</p>
    </div>
  </div>
{/if}
