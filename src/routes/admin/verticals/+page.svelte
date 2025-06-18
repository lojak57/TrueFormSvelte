<script lang="ts">
  import VerticalList from "$lib/components/VerticalList.svelte";
</script>

<div class="admin-verticals">
  <div class="page-header">
    <div class="header-content">
      <div>
        <h2>Manage Verticals</h2>
        <p>Organize your business by industry verticals</p>
      </div>
      <div class="quick-actions">
        <button class="new-vertical-btn">
          <span>+</span>
          New Vertical
        </button>
      </div>
    </div>
  </div>

  <div class="page-content">
    <VerticalList />
  </div>
</div>

<style>
  .admin-verticals {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
  }

  .header-content p {
    margin: 0;
    color: #64748b;
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
  }

  .new-vertical-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f59e0b;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .new-vertical-btn:hover {
    background-color: #d97706;
  }

  .new-vertical-btn span {
    font-size: 1.25rem;
  }

  .page-content {
    background-color: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
</style>
