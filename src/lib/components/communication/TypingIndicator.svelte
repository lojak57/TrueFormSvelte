<script lang="ts">
  import type { UserProfile } from "$lib/types";

  export let users: UserProfile[];

  $: displayText = formatTypingText(users);

  function formatTypingText(users: UserProfile[]): string {
    if (users.length === 0) return "";

    if (users.length === 1) {
      return `${users[0].first_name} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].first_name} and ${users[1].first_name} are typing...`;
    } else {
      return `${users[0].first_name} and ${
        users.length - 1
      } others are typing...`;
    }
  }
</script>

{#if users.length > 0}
  <div class="flex items-center space-x-3 mb-4">
    <!-- Avatar(s) -->
    <div class="flex -space-x-2">
      {#each users.slice(0, 3) as user, index}
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt={`${user.first_name} ${user.last_name}`}
          class="w-6 h-6 rounded-full border-2 border-white"
          style="z-index: {10 - index}"
        />
      {/each}
    </div>

    <!-- Typing indicator -->
    <div class="flex items-center space-x-1 text-gray-500 text-sm">
      <span>{displayText}</span>

      <!-- Animated dots -->
      <div class="flex space-x-1">
        <div
          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
          style="animation-delay: 0ms"
        />
        <div
          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
          style="animation-delay: 150ms"
        />
        <div
          class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
          style="animation-delay: 300ms"
        />
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  .animate-bounce {
    animation: bounce 1.4s infinite ease-in-out both;
  }
</style>
