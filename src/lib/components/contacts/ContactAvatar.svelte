<script lang="ts">
  export let firstName: string;
  export let lastName: string;
  export let size: "small" | "medium" | "large" = "medium";

  function getInitials(first: string, last: string): string {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  $: initials = getInitials(firstName, lastName);
  $: sizeClass = `avatar-${size}`;
</script>

<div class="avatar {sizeClass}">
  {initials}
</div>

<style>
  .avatar {
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .avatar-small {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .avatar-medium {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }

  .avatar-large {
    width: 64px;
    height: 64px;
    font-size: 1.25rem;
  }
</style>
