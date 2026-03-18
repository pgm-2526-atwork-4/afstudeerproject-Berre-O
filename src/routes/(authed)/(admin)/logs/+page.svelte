<script lang="ts">
    let { data } = $props();
    let searchValue = $state('');
    let selectedUser = $state<string | null>(null);

    const uniqueUsers = $derived([...new Set(data.logs.map(log => log.profile?.name).filter(Boolean))]);

    const filteredLogs = $derived(
        data.logs.filter(log => {
            const matchesSearch = 
                searchValue === '' ||
                log.action?.toLowerCase().includes(searchValue.toLowerCase()) ||
                log.Clients?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                log.profile?.name?.toLowerCase().includes(searchValue.toLowerCase());

            const matchesUser = 
                selectedUser === null ||
                log.profile?.name === selectedUser;

            return matchesSearch && matchesUser;
        })
    );
</script>

<div class="logs-header">
    <h1>Logs</h1>
    
    <div class="filters">
        <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
                type="text"
                placeholder="Zoeken in acties, klanten, gebruikers..."
                bind:value={searchValue}
                class="search-input"
            />
        </div>

        <select bind:value={selectedUser} class="user-filter">
            <option value={null}>Alle gebruikers</option>
            {#each uniqueUsers as user}
                <option value={user}>{user}</option>
            {/each}
        </select>
    </div>
</div>

<section class="section section--table">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Datum</th>
                <th class="table__item table__item--head">Actie</th>
                <th class="table__item table__item--head">Klant</th>
                <th class="table__item table__item--head">Gebruiker</th>
            </tr>
        </thead>
        <tbody>
            {#each filteredLogs as log}
                <tr class="table__row">
                    <td class="table__item">{new Date(log.created_at).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td class="table__item">{log.action}</td>
                    <td class="table__item">{log.Clients?.name}</td>
                    <td class="table__item">{log.profile?.name}</td>
                </tr>
            {/each}
            {#if filteredLogs.length < 8}
                {#each Array(8 - filteredLogs.length) as _}
                    <tr class="table__row">
                        <td class="table__item">&nbsp;</td>
                        <td class="table__item"></td>
                        <td class="table__item"></td>
                        <td class="table__item"></td>
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
<i class="fa-solid fa-chevron-left"></i>
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
    <i class="fa-solid fa-chevron-right"></i>
    </a>
</nav>

<style>
    th, td {
        width: 25%;
    }

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

    .logs-header {
    margin-bottom: 1.5rem;
}

.logs-header h1 {
    margin-bottom: 1rem;
}

.filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
}

.search-box i {
    color: #999;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.95rem;
    background: transparent;
}

.user-filter {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
    font-size: 0.95rem;
    cursor: pointer;
    min-width: 200px;
}

.user-filter:hover {
    border-color: #999;
}
</style>