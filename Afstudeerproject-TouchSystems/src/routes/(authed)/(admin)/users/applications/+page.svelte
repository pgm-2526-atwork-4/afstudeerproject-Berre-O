<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>

<div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">User Applications</h1>
{#each data.pending as user}
  <div>
    <span>{user.email}</span>
    <span>{user.name}</span>
    <form method="POST" action="?/approve">
      <input type="hidden" name="userId" value={user.id} />
      <button type="submit">Approve</button>
    </form>
    <form method="POST" action="?/reject">
      <input type="hidden" name="userId" value={user.id} />
      <button type="submit">Reject</button>
    </form>
  </div>
{/each}
</div>