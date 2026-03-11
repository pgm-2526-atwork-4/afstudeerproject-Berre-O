<script lang="ts">
    let { data } = $props();
</script>

<h1>Logs</h1>

<section class="section section--table">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Datum</th>
                <th class="table__item table__item--head">Actie</th>
                <th class="table__item table__item--head">Klant</th>
                <th class="table__item table__item--head">Gebruiker</th>
                <th class="table__item table__item--head"></th>
            </tr>
        </thead>
        <tbody>
            {#each data.logs as log}
                <tr class="table__row">
                    <td class="table__item">{new Date(log.created_at).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td class="table__item">{log.action}</td>
                    <td class="table__item">{log.Clients?.name}</td>
                    <td class="table__item">{log.profile?.name}</td>
                </tr>
            {/each}
            {#if data.logs.length < 8}
                {#each Array(8 - data.logs.length) as _}
                    <tr class="table__row">
                        <td class="table__item">&nbsp;</td>
                        <td class="table__item"></td>
                        <td class="table__item"></td>
                        <td class="table__item"></td>
                        <td class="table__item table__item--action">></td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
</section>

<nav class="pagination">
    <a
        class="pagination__link"
        class:pagination__link--disabled={data.currentPage <= 1}
        href={data.currentPage > 1 ? `?page=${data.currentPage - 1}` : '#'}
    >
        &lt;
    </a>
    {#each Array(data.totalPages) as _, i}
        <a
            class="pagination__link"
            class:pagination__link--active={data.currentPage === i + 1}
            href="?page={i + 1}"
        >
            {i + 1}
        </a>
    {/each}
    <a
        class="pagination__link"
        class:pagination__link--disabled={data.currentPage >= data.totalPages}
        href={data.currentPage < data.totalPages ? `?page=${data.currentPage + 1}` : '#'}
    >
        &gt;
    </a>
</nav>

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

    .table__item--head {
        border-bottom: none;
        color: #333;
        font-weight: 600;
    }

    .table__item--action {
        text-align: right;
    }

    .table__item--action a {
        color: #444;
        text-decoration: none;
        font-weight: 600;
    }

    .table__item--action a:hover {
        color: #000;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }

    .pagination__link {
        padding: 0.4rem 0.75rem;
        border-radius: 0.25rem;
        text-decoration: none;
        color: #333;
        font-size: 1rem;
        font-weight: 600;
    }

    .pagination__link:hover {
        background: #eee;
    }

    .pagination__link--active {
        background: #e0e0e0;
        color: #000;
    }

    .pagination__link--disabled {
        color: #ccc;
        pointer-events: none;
    }
</style>