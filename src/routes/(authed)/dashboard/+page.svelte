<script lang="ts">
    import { goto } from "$app/navigation";

  let { data } = $props();
</script>

<h1>Home</h1>
<section class="section section--boxes">
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--primary">
            <i class="fa-solid fa-users"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Actieve klanten</span>
            <span class="kpi-card__value">{data.stats.totalClients}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--warning">
            <i class="fa-solid fa-clock"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Bijna verlopen</span>
            <span class="kpi-card__value">{data.stats.expiringSoon.length}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--success">
            <i class="fa-solid fa-calendar-plus"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Nieuw deze maand</span>
            <span class="kpi-card__value">{data.stats.newThisMonth}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--danger">
            <i class="fa-solid fa-user-minus"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Inactieve klanten</span>
            <span class="kpi-card__value">{data.stats.inactiveClients}</span>
        </div>
    </div>
</section>

<h2 class="section__title">Bijna Verlopen</h2>

<section class="section section--table table-wrapper">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Naam</th>
                <th class="table__item table__item--head">Type</th>
                <th class="table__item table__item--head">Start Datum</th>
                <th class="table__item table__item--head">Verval Datum</th>
                <th class="table__item table__item--head">Status</th>
                <th class="table__item table__item--head">Software</th>
                <th class="table__item table__item--head">Ondernemings-Nummer</th>
            </tr>
        </thead>
        <tbody>
            {#each data.stats.expiringSoon as client (client.id)}
            <tr 
            class="table__row table__row--clickable"
            onclick={() => goto(`/search/${client.id}`)}
            onkeydown={(e) => e.key === 'Enter' && goto(`/search/${client.id}`)}
            role="link"
            tabindex="0"
            >
                <td class="table__item">{client.name}</td>
                <td class="table__item">{client.type}</td>
                <td class="table__item">{client.subscriptions?.start_date ? new Date(client.subscriptions.start_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}</td>
                <td class="table__item">{client.subscriptions?.expiration_date ? new Date(client.subscriptions.expiration_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}) : '-'}</td>
                <td class="table__item">
                    <div class="status"><span class="state state--yellow"></span>{client.subscriptions?.status}</div>
                </td>
                <td class="table__item">
                    <div class="icon" class:icon--active={client.software?.status} class:icon--inactive={!client.software?.status}><span>⏻</span>{client.software?.status ? ' Actief' : ' Niet-Actief'}</div>
                </td>
                <td class="table__item">{client.company_number}</td>
            </tr>
            {/each}
        </tbody>
    </table>
</section>

<section class="card-list">
    {#each data.stats.expiringSoon as client (client.id)}
    <div
        class="client-card"
        onclick={() => goto(`/search/${client.id}`)}
        onkeydown={(e) => e.key === 'Enter' && goto(`/search/${client.id}`)}
        role="link"
        tabindex="0"
    >
        <div class="client-card__header">
            <span class="client-card__name">{client.name}</span>
            <span class="client-card__type">{client.type}</span>
        </div>
        <div class="client-card__body">
            <div class="client-card__row">
                <span class="client-card__label">Start datum</span>
                <span>{client.subscriptions?.start_date ? new Date(client.subscriptions.start_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}</span>
            </div>
            <div class="client-card__row">
                <span class="client-card__label">Verval datum</span>
                <span>{client.subscriptions?.expiration_date ? new Date(client.subscriptions.expiration_date).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '-'}</span>
            </div>
            <div class="client-card__row">
                <span class="client-card__label">Status</span>
                <div class="status"><span class="state state--yellow"></span>{client.subscriptions?.status}</div>
            </div>
            <div class="client-card__row">
                <span class="client-card__label">Software</span>
                <div class="icon" class:icon--active={client.software?.status} class:icon--inactive={!client.software?.status}><span>⏻</span>{client.software?.status ? ' Actief' : ' Niet-Actief'}</div>
            </div>
            <div class="client-card__row">
                <span class="client-card__label">Ondernemingsnr.</span>
                <span>{client.company_number}</span>
            </div>
        </div>
    </div>
    {/each}
</section>

<style>
    .section {
        width: 100%;
        display: flex;
        gap: 2rem;
    }

    .section--boxes {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
    }

    .kpi-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .kpi-card__icon {
        width: 48px;
        height: 48px;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .kpi-card__icon--primary {
        background: color-mix(in srgb, var(--color-accent) 15%, transparent);
        color: var(--color-accent);
    }

    .kpi-card__icon--success {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .kpi-card__icon--warning {
        background: #fff3e0;
        color: #e65100;
    }

    .kpi-card__icon--danger {
        background: #fdecea;
        color: #c62828;
    }

    .kpi-card__content {
        display: flex;
        flex-direction: column;
    }

    .kpi-card__label {
        font-size: 0.8rem;
        color: #999;
        font-weight: 500;
    }

    .kpi-card__value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }

    .section--table {
        width: 100%;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        overflow: hidden;
    }

    .table {
        text-align: left;
        border-collapse: collapse;
        width: 100%;

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
    }

    .card-list {
        display: none;
        flex-direction: column;
        gap: 0.75rem;
    }

    .client-card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        padding: 1rem;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .client-card:hover {
        background-color: #f9fafb;
    }

    .client-card:focus {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
    }

    .client-card__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #f0f0f0;
    }

    .client-card__name {
        font-weight: 600;
        font-size: 0.95rem;
        color: #333;
    }

    .client-card__type {
        font-size: 0.8rem;
        color: #999;
        background: #f5f5f5;
        padding: 0.2rem 0.5rem;
        border-radius: 0.375rem;
    }

    .client-card__body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .client-card__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.85rem;
        color: #444;
    }

    .client-card__label {
        color: #999;
        font-weight: 500;
    }

    @media (max-width: 1024px) {
        .section--boxes {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .table-wrapper {
            display: none;
        }
        .card-list {
            display: flex;
        }
    }

    @media (max-width: 600px) {
        .section--boxes {
            grid-template-columns: 1fr;
        }
    }
</style>