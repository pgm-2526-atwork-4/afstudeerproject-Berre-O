<script lang="ts">
    import { enhance } from '$app/forms';
    import { backButton } from '$lib/utils.ts';

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

<button use:backButton class="back-link">
    <i class="fa-solid fa-arrow-left"></i> Terug naar gebruikers
</button>

<h1>Registraties</h1>

<section class="section section--table table-wrapper">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Gebruiker</th>
                <th class="table__item table__item--head">Email</th>
                <th class="table__item table__item--head">Aangemaakt op</th>
                <th class="table__item table__item--head table__item--action">Acties</th>
            </tr>
        </thead>
        <tbody>
            {#each data.pending as user (user.id)}
                <tr class="table__row">
                    <td class="table__item">
                        <div class="user">
                            <div class="user__avatar">{getInitials(user.name)}</div>
                            <span class="user__name">{user.name ?? '—'}</span>
                        </div>
                    </td>
                    <td class="table__item">{user.email}</td>
                    <td class="table__item">{formatDate(user.created_at)}</td>
                    <td class="table__item table__item--action">
                        <div class="actions">
                            <form method="POST" action="?/approve" use:enhance>
                                <input type="hidden" name="userId" value={user.id} />
                                <button type="submit" class="btn btn--approve">
                                    <i class="fa-solid fa-check"></i>
                                    Goedkeuren
                                </button>
                            </form>
                            <form method="POST" action="?/reject" use:enhance>
                                <input type="hidden" name="userId" value={user.id} />
                                <button type="submit" class="btn btn--reject">
                                    <i class="fa-solid fa-xmark"></i>
                                    Weigeren
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
            {:else}
                <tr class="table__row">
                    <td class="table__item table__item--empty" colspan="4">
                        <i class="fa-solid fa-circle-check"></i>
                        Geen openstaande registraties
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<section class="card-list">
    {#each data.pending as user (user.id)}
        <div class="reg-card">
            <div class="reg-card__header">
                <div class="user">
                    <div class="user__avatar">{getInitials(user.name)}</div>
                    <div class="user__info">
                        <span class="user__name">{user.name ?? '—'}</span>
                        <span class="user__email">{user.email}</span>
                    </div>
                </div>
                <span class="reg-card__date">{formatDate(user.created_at)}</span>
            </div>
            <div class="reg-card__actions">
                <form method="POST" action="?/approve" use:enhance>
                    <input type="hidden" name="userId" value={user.id} />
                    <button type="submit" class="btn btn--approve btn--full">
                        <i class="fa-solid fa-check"></i>
                        Goedkeuren
                    </button>
                </form>
                <form method="POST" action="?/reject" use:enhance>
                    <input type="hidden" name="userId" value={user.id} />
                    <button type="submit" class="btn btn--reject btn--full">
                        <i class="fa-solid fa-xmark"></i>
                        Weigeren
                    </button>
                </form>
            </div>
        </div>
    {:else}
        <div class="card-list__empty">
            <i class="fa-solid fa-circle-check"></i>
            <p>Geen openstaande registraties</p>
        </div>
    {/each}
</section>

<style>

    .section {
        width: 100%;
        display: flex;
        gap: 2rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .back-link:hover {
        color: #333;
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

    .table__item--head {
        border-bottom: none;
        color: #333;
        font-weight: 600;
    }

    .table__item--action {
        text-align: right;
        width: 1%;
        white-space: nowrap;
    }

    .table__item--empty {
        text-align: center;
        color: #999;
        padding: 2rem;
    }

    .table__item--empty i {
        display: block;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: #2e7d32;
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

    .user__info {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
    }

    .user__email {
        font-size: 0.78rem;
        color: #999;
    }

    .actions {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
    }

    .btn {
        padding: 0.25rem 0.6rem;
        border-radius: 0.3rem;
        border: none;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        transition: opacity 0.15s ease;
    }

    .btn:hover {
        opacity: 0.85;
    }

    .btn--approve {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .btn--reject {
        background: #fdecea;
        color: #c62828;
    }

    .btn--full {
        width: 100%;
        padding: 0.6rem;
        font-size: 0.85rem;
    }

    .card-list {
        display: none;
        flex-direction: column;
        gap: 0.75rem;
    }

    .card-list__empty {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        padding: 2rem;
        text-align: center;
        color: #999;
    }

    .card-list__empty i {
        font-size: 1.5rem;
        color: #2e7d32;
        margin-bottom: 0.5rem;
        display: block;
    }

    .card-list__empty p {
        margin: 0;
        font-size: 0.9rem;
    }

    .reg-card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        padding: 1rem;
    }

    .reg-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #f0f0f0;
    }

    .reg-card__date {
        font-size: 0.78rem;
        color: #999;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .reg-card__actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
    }

    .reg-card__actions form {
        display: contents;
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