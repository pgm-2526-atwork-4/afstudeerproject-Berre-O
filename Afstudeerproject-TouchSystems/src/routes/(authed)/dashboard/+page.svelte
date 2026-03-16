<script lang="ts">
    import { goto } from "$app/navigation";

  let { data } = $props();
</script>

<h1>Home</h1>
<section class="section section--boxes">
    <div class="box">
        <i class="fa-solid fa-users"></i>
        <div class="box__text">
            <h2>Actieve klanten</h2>
            <p>{data.stats.totalClients}</p>
        </div>
    </div>
    <div class="box">
        <i class="fa-solid fa-clock"></i>
        <div class="box__text">
            <h2>Bijna verlopen</h2>
            <p>{data.stats.expiringSoon}</p>
        </div>
    </div>
    <div class="box">
        <i class="fa-solid fa-calendar-plus"></i>
        <div class="box__text">
            <h2>Nieuw deze maand</h2>
            <p>{data.stats.newThisMonth}</p>
        </div>
    </div>
</section>

<section class="section section--table">
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
            {#each data.clients as client (client.id)}
            <tr 
            class="table__row table__row--clickable"
            onclick={() => goto(`/search/${client.id}`)}
            onkeydown={(e) => e.key === 'Enter' && goto(`/search/${client.id}`)}
            role="link"
            tabindex="0"
            >
                <td class="table__item">{client.name}</td>
                <td class="table__item">{client.type}</td>
                <td class="table__item">{client.subscriptions?.start_date}</td>
                <td class="table__item">{client.subscriptions?.expiration_date}</td>
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

<style>
    .section {
        width: 100%;
        display: flex;
        gap: 2rem;
    }

    .box {
        background-color: white;
        padding: 1rem;
        border-radius: 1rem;
        width: 20rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

        p {
            font-size: 1.5rem;
            font-weight: 600;
        }

        i {
            font-size: 4rem;
            color: black;
        }
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
            background-color: #f9fafb; /* Light grey highlight on hover */
        }

        .table__row--clickable:focus {
            outline: 2px solid #2563eb;
            outline-offset: -2px;
        }
    }

    .section--table {
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }
</style>
