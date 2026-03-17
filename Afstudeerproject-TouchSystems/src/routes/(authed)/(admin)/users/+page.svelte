<script lang="ts">
    import { goto } from "$app/navigation";

    let { data } = $props();

    function getInitials(name: string | null): string {
        if (!name) return '?';
        const names = name.trim().split(' ').filter(Boolean);
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
        }
        return names[0].charAt(0).toUpperCase();
    }

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('nl-BE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
</script>

    <h1>Users</h1>

<section class="section section--table">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">User</th>
                <th class="table__item table__item--head">Role</th>
                <th class="table__item table__item--head">Joined</th>
            </tr>
        </thead>
        <tbody>
            {#each data.clients as user}
                <tr class="table__row table__row--clickable">
                    <td 
                    class="table__item"
                     onclick={() => goto(`/users/${user.id}`)}
                    onkeydown={(e) => e.key === 'Enter' && goto(`/users/${user.id}`)}
                    role="link"
                    tabindex="0"
                    >
                        <div class="user">
                            <div class="user__avatar">{getInitials(user.name)}</div>
                            <span class="user__name">{user.name ?? 'Unknown'}</span>
                        </div>
                    </td>
                    <td class="table__item">
                        <span class="badge" class:badge--admin={user.admin} class:badge--user={!user.admin}>
                            {user.admin ? 'Admin' : 'User'}
                        </span>
                    </td>
                    <td class="table__item">{formatDate(user.created_at)}</td>
                </tr>
            {/each}
            {#if data.clients.length === 0}
                <tr class="table__row">
                    <td class="table__item table__item--empty" colspan="4">No users found</td>
                </tr>
            {/if}
        </tbody>
    </table>
</section>

<style>
    .section {
        width: 100%;
        display: flex;
        gap: 2rem;
    }

    .section--table {
        width: 100%;
        background: var(--color-primary);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        overflow: hidden;
    }

    .table {
        text-align: left;
        border-collapse: collapse;
        width: 100%;
    }

    .table__head {
        background-color: #fcfcfd;
        border-bottom: 1px solid #eee;
    }

    .table__item {
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        font-size: 14px;
        color: #444;
    }
    
    .table__row--clickable {
        cursor: pointer;
        transition: background-color 0.2s ease;

    }


    .table__row--clickable:hover {
        background-color: #f9fafb;
    }

    .table__row--clickable:focus {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
    }

    .table__item--head {
        border-bottom: none;
        color: #333;
        font-weight: 600;
    }

    .table__item--action {
        text-align: right;
    }

    .table__item--empty {
        text-align: center;
        color: #999;
        padding: 2rem;
    }

    .user {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .user__avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.85rem;
        color: white;
    }

    .user__name {
        font-weight: 500;
    }

    .badge {
        padding: 0.25rem 0.6rem;
        border-radius: 0.3rem;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .badge--admin {
        background: #e3f2fd;
        color: #1565c0;
    }

    .badge--user {
        background: #f5f5f5;
        color: #666;
    }

    .btn-icon {
        background: none;
        border: none;
        padding: 0.5rem;
        cursor: pointer;
        color: #666;
        border-radius: 0.25rem;
        transition: all 0.2s;
    }

    .btn-icon:hover {
        background: #f0f0f0;
        color: #333;
    }

    .btn-icon--danger:hover {
        background: #ffebee;
        color: #c62828;
    }
</style>