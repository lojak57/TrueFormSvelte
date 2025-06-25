<script lang="ts">
  import ProjectList from "$lib/components/ProjectList.svelte";
</script>

<div class="projects-page">
  <h1>Projects</h1>
  <ProjectList />
</div>

<style>
  .projects-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #111827;
  }
</style>
