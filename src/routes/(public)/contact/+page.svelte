<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import {
    Mail,
    Phone,
    MapPin,
    Clock,
    MessageCircle,
    Send,
  } from "lucide-svelte";

  let formData = {
    name: "",
    email: "",
    company: "",
    message: "",
    urgency: "normal",
  };

  let isSubmitting = false;
  let submitMessage = "";

  async function handleSubmit() {
    isSubmitting = true;
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    submitMessage = "Thank you! We'll get back to you within 24 hours.";
    formData = {
      name: "",
      email: "",
      company: "",
      message: "",
      urgency: "normal",
    };
    isSubmitting = false;
  }

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      detail: "(720) 993-6562",
      description: "Speak directly with our team",
      action: "tel:+17209936562",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Mail,
      title: "Email Us",
      detail: "mitch.mechelay@true-form-apps.com",
      description: "Send us a detailed message",
      action: "mailto:mitch.mechelay@true-form-apps.com",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      detail: "Available 9AM-5PM PST",
      description: "Get instant answers",
      action: "#",
      color: "text-purple-600 bg-purple-100",
    },
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM PST" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM PST" },
    { day: "Sunday", hours: "Closed" },
  ];
</script>

<svelte:head>
  <title>Contact TrueForm | Let's Build Something Amazing Together</title>
  <meta
    name="description"
    content="Get in touch with TrueForm's expert team. Call, email, or send us a message to start your website project today."
  />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <!-- Hero Section -->
  <section
    class="relative bg-gradient-to-br from-gray-900 via-gray-800 to-accent-900 text-white py-20"
  >
    <div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div in:fade={{ delay: 200, duration: 600 }}>
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Let's Build Something
          <span
            class="bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent"
          >
            Amazing Together
          </span>
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Ready to transform your business with a professional website? We're
          here to help every step of the way.
        </p>
      </div>
    </div>
  </section>

  <!-- Contact Methods -->
  <section class="py-16 -mt-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-6">
        {#each contactMethods as method, i}
          <div in:fly={{ y: 50, duration: 600, delay: i * 150 }}>
            <Card
              class="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div
                class="w-16 h-16 {method.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
              >
                <svelte:component this={method.icon} size={32} />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {method.title}
              </h3>
              <p class="text-gray-600 mb-2">{method.description}</p>
              <a
                href={method.action}
                class="text-lg font-semibold text-accent-600 hover:text-accent-700 transition-colors duration-200"
              >
                {method.detail}
              </a>
            </Card>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <Card class="p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              Send Us a Message
            </h2>

            {#if submitMessage}
              <div
                class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                in:fade
              >
                <p class="text-green-700">{submitMessage}</p>
              </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    bind:value={formData.name}
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    bind:value={formData.email}
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label
                  for="company"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company Name
                </label>
                <input
                  id="company"
                  type="text"
                  bind:value={formData.company}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  placeholder="Your Company"
                />
              </div>

              <div>
                <label
                  for="urgency"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Project Urgency
                </label>
                <select
                  id="urgency"
                  bind:value={formData.urgency}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                >
                  <option value="normal">Normal Timeline (2-4 weeks)</option>
                  <option value="urgent">Urgent (1-2 weeks)</option>
                  <option value="rush">Rush Job (ASAP)</option>
                </select>
              </div>

              <div>
                <label
                  for="message"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  bind:value={formData.message}
                  required
                  rows="6"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-colors duration-200"
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                class="w-full"
                disabled={isSubmitting}
              >
                {#if isSubmitting}
                  <div class="flex items-center gap-2">
                    <div
                      class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                    />
                    Sending...
                  </div>
                {:else}
                  <div class="flex items-center gap-2">
                    <Send size={20} />
                    Send Message
                  </div>
                {/if}
              </Button>
            </form>
          </Card>
        </div>

        <!-- Contact Information -->
        <div class="space-y-8">
          <!-- Office Info -->
          <Card class="p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">
              Get in Touch
            </h3>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <MapPin size={20} class="text-accent-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Our Office</p>
                  <p class="text-gray-600">
                    San Francisco, CA<br />Remote-First Team
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Phone size={20} class="text-accent-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Phone</p>
                  <a
                    href="tel:+17209936562"
                    class="text-accent-600 hover:text-accent-700"
                    >(720) 993-6562</a
                  >
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <Mail size={20} class="text-accent-600" />
                </div>
                <div>
                  <p class="font-medium text-gray-900">Email</p>
                  <a
                    href="mailto:mitch.mechelay@true-form-apps.com"
                    class="text-accent-600 hover:text-accent-700"
                    >mitch.mechelay@true-form-apps.com</a
                  >
                </div>
              </div>
            </div>
          </Card>

          <!-- Office Hours -->
          <Card class="p-8">
            <h3
              class="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2"
            >
              <Clock size={24} class="text-accent-600" />
              Office Hours
            </h3>
            <div class="space-y-3">
              {#each officeHours as schedule}
                <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900">{schedule.day}</span>
                  <span class="text-gray-600">{schedule.hours}</span>
                </div>
              {/each}
            </div>
            <div class="mt-6 p-4 bg-accent-50 rounded-lg">
              <p class="text-sm text-accent-800">
                <strong>Need immediate help?</strong> We offer 24/7 emergency support
                for critical issues on active projects.
              </p>
            </div>
          </Card>

          <!-- Quick Start -->
          <Card
            class="p-8 bg-gradient-to-br from-accent-50 to-yellow-50 border-accent-200"
          >
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Ready to Start?
            </h3>
            <p class="text-gray-700 mb-6">
              Skip the contact form and jump straight into planning your new
              website.
            </p>
            <Button variant="accent" size="lg" class="w-full">
              <a href="/request" class="flex items-center gap-2">
                Start Your Project
                <Send size={20} />
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="py-16 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p class="text-lg text-gray-600">Quick answers to common questions</p>
      </div>

      <div class="space-y-6">
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            How quickly can you deliver my website?
          </h3>
          <p class="text-gray-600">
            Most websites are completed within 3-5 business days. Rush jobs can
            be delivered in 24-48 hours for an additional fee.
          </p>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            Do you offer revisions?
          </h3>
          <p class="text-gray-600">
            Yes! All packages include 2 rounds of revisions. Additional
            revisions are available for a small fee.
          </p>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            What if I need help after launch?
          </h3>
          <p class="text-gray-600">
            We provide 30 days of free support after launch, plus ongoing
            maintenance packages for long-term peace of mind.
          </p>
        </Card>

        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            Can you work with my existing brand?
          </h3>
          <p class="text-gray-600">
            Absolutely! We can work with your existing brand guidelines, logos,
            and color schemes to create a cohesive online presence.
          </p>
        </Card>
      </div>
    </div>
  </section>
</div>
