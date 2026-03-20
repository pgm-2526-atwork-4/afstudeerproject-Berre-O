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

    function navigateToUser(user: any) {
        if (user.status === "approved" || user.status === "rejected") {
            goto(`/users/${user.id}`);
        } else {
            goto(`/users/applications`);
        }
    }
</script>

<h1>Users</h1>

<section class="section section--table table-wrapper">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Gebruiker</th>
                <th class="table__item table__item--head">Rol</th>
                <th class="table__item table__item--head">Status</th>
                <th class="table__item table__item--head">Aangemaakt</th>
            </tr>
        </thead>
        <tbody>
            {#each data.clients as user}
                <tr
                    class="table__row table__row--clickable"
                    onclick={() => navigateToUser(user)}
                    onkeydown={(e) => e.key === 'Enter' && navigateToUser(user)}
                    role="link"
                    tabindex="0"
                >
                    <td class="table__item">
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
                    <td class="table__item">
                        <span class="badge" class:badge--admin={user.status === 'approved'} class:badge--user={user.status === 'pending'}>
                            {user.status}
                        </span>
                    </td>
                    <td class="table__item">{formatDate(user.created_at)}</td>
                </tr>
            {/each}
            {#if data.clients.length === 0}
                <tr class="table__row">
                    <td class="table__item table__item--empty" colspan="4">Geen gebruikers gevonden</td>
                </tr>
            {/if}
        </tbody>
    </table>
</section>

<section class="card-list">
    {#each data.clients as user}
        <div
            class="user-card"
            onclick={() => navigateToUser(user)}
            onkeydown={(e) => e.key === 'Enter' && navigateToUser(user)}
            role="link"
            tabindex="0"
        >
            <div class="user-card__header">
                <div class="user">
                    <div class="user__avatar">{getInitials(user.name)}</div>
                    <span class="user__name">{user.name ?? 'Niet-gekend'}</span>
                </div>
                <div class="user-card__badges">
                    <span class="badge" class:badge--admin={user.admin} class:badge--user={!user.admin}>
                        {user.admin ? 'Admin' : 'User'}
                    </span>
                    <span class="badge" class:badge--admin={user.status === 'approved'} class:badge--user={user.status === 'pending'}>
                        {user.status}
                    </span>
                </div>
            </div>
            <div class="user-card__footer">
                <span class="user-card__label">Aangemaakt</span>
                <span class="user-card__date">{formatDate(user.created_at)}</span>
            </div>
        </div>
    {/each}
    {#if data.clients.length === 0}
        <p class="card-list__empty">Geen gebruikers gevonden</p>
    {/if}
</section>

<div class="btn__wrapper">
    <a href="/users/applications" class="btn btn--primary">Aanvragen</a>
</div>

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
        flex-shrink: 0;
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

    .btn {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .btn--primary {
        color: var(--color-primary);
        background-color: var(--color-secondary);
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
    }

    .btn__wrapper {
        display: flex;
        padding: 1rem 0;
    }

    .card-list {
        display: none;
        flex-direction: column;
        gap: 0.75rem;
    }

    .card-list__empty {
        text-align: center;
        color: #999;
        font-size: 0.9rem;
        padding: 2rem 0;
    }

    .user-card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        padding: 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .user-card:hover {
        background-color: #f9fafb;
    }

    .user-card:focus {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
    }

    .user-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #f0f0f0;
    }

    .user-card__badges {
        display: flex;
        gap: 0.4rem;
        flex-shrink: 0;
    }

    .user-card__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        color: #444;
    }

    .user-card__label {
        color: #999;
        font-weight: 500;
    }

    .user-card__date {
        color: #444;
    }

    @media (max-width: 768px) {
        .table-wrapper {
            display: none;
        }

        .card-list {
            display: flex;
        }
    }
</style>