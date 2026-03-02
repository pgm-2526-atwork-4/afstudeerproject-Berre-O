<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let { data } = $props();
    let searchValue = $state(data.query ?? '');
    let activeFilter = $state<string | null>(null);
    let typeFilter = $state<string | null>(null);
    let typeDropdownOpen = $state(false);
    let debounceTimer: ReturnType<typeof setTimeout>;
    let mapContainer: HTMLDivElement;

    const types = [...new Set(data.items.map(i => i.category))];

    $effect(() => {
        // reactive filtered items
    });

    function getFilteredItems() {
        let items = data.items;
        if (activeFilter === 'active') items = items.filter(i => i.status === 'Actief');
        if (activeFilter === 'inactive') items = items.filter(i => i.status === 'Niet-Actief');
        if (typeFilter) items = items.filter(i => i.category === typeFilter);
        return items;
    }

    function handleInput(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        searchValue = value;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const params = new URLSearchParams($page.url.searchParams);
            if (value) {
                params.set('q', value);
            } else {
                params.delete('q');
            }
            goto(`?${params.toString()}`, { keepFocus: true });
        }, 300);
    }

    function toggleActive() {
        if (activeFilter === 'active') activeFilter = null;
        else activeFilter = 'active';
    }

    function toggleInactive() {
        if (activeFilter === 'inactive') activeFilter = null;
        else activeFilter = 'inactive';
    }

    function selectType(type: string | null) {
        typeFilter = type;
        typeDropdownOpen = false;
    }

    function getIcon(category: string) {
        switch (category) {
            case 'Restaurant': return 'fa-utensils';
            case 'Café': return 'fa-mug-hot';
            case 'Bar': return 'fa-martini-glass';
            case 'Hotel': return 'fa-hotel';
            default: return 'fa-store';
        }
    }

    onMount(async () => {
        const L = await import('leaflet');

        const map = L.map(mapContainer).setView([51.1, 3.71], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add markers for items that have coordinates
        data.items.forEach((item) => {
            if (item.lat && item.lng) {
                L.marker([item.lat, item.lng])
                    .addTo(map)
                    .bindPopup(`<strong>${item.name}</strong><br>${item.category}`);
            }
        });
    });
</script>

<h1>Zoeken</h1>

<div class="search-layout">
    <div class="search-layout__left">
        <div class="search-bar">
            <input
                type="text"
                class="search-bar__input"
                placeholder="Zoeken..."
                value={searchValue}
                oninput={handleInput}
            />
            <button class="search-bar__btn">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>

        <div class="filters">
            <button
                class="filter"
                class:filter--active={activeFilter === 'active'}
                onclick={toggleActive}
            >
                Actief
            </button>
            <div class="filter-dropdown">
                <button
                    class="filter"
                    class:filter--active={typeFilter !== null}
                    onclick={() => typeDropdownOpen = !typeDropdownOpen}
                >
                    Type <i class="fa-solid fa-chevron-down"></i>
                </button>
                {#if typeDropdownOpen}
                    <div class="filter-dropdown__menu">
                        <button class="filter-dropdown__item" onclick={() => selectType(null)}>Alle</button>
                        {#each types as type}
                            <button class="filter-dropdown__item" class:filter-dropdown__item--active={typeFilter === type} onclick={() => selectType(type)}>{type}</button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <ul class="results">
            {#each getFilteredItems() as item (item.id)}
                <li class="results__item">
                    <div class="results__info">
                        <span class="results__name">{item.name}</span>
                        <span class="results__status" class:results__status--active={item.status === 'Actief'} class:results__status--inactive={item.status === 'Niet-Actief'}>
                            <i class="fa-regular fa-clock"></i>
                            {item.status}
                        </span>
                    </div>
                    <i class="fa-solid {getIcon(item.category)} results__icon"></i>
                </li>
            {/each}
        </ul>
    </div>

    <div class="search-layout__right">
        <div class="map" bind:this={mapContainer}></div>
    </div>
</div>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<style>
    .search-layout {
        display: flex;
        gap: 2rem;
        height: calc(70vh);
    }

    .search-layout__left {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 35%;
        min-width: 300px;
    }

    .search-layout__right {
        flex: 1;
    }

    .search-bar {
        display: flex;
        align-items: center;
        background: var(--color-primary);
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .search-bar__input {
        flex: 1;
        border: none;
        outline: none;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        background: transparent;
    }

    .search-bar__btn {
        background: none;
        border: none;
        padding: 0.75rem 1rem;
        cursor: pointer;
        color: #333;
        font-size: 1.1rem;
    }

    .filters {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .filter {
        padding: 0.4rem 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        background: white;
        cursor: pointer;
        font-size: 0.9rem;
        color: #333;
        display: flex;
        align-items: center;
        gap: 0.4rem;
    }

    .filter--active {
        background: #e8f5e9;
        border-color: #4caf50;
        color: #2e7d32;
    }

    .filter-dropdown {
        position: relative;
    }

    .filter-dropdown__menu {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 0.25rem;
        background: white;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10;
        min-width: 120px;
        overflow: hidden;
    }

    .filter-dropdown__item {
        display: block;
        width: 100%;
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .filter-dropdown__item:hover {
        background: #f5f5f5;
    }

    .filter-dropdown__item--active {
        background: #e8f5e9;
        font-weight: 600;
    }

    .results {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .results__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        background: white;
    }

    .results__item:first-child {
        border-top: 1px solid #eee;
    }

    .results__info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .results__name {
        font-weight: 600;
        font-size: 1rem;
        color: #333;
    }

    .results__status {
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .results__status--active {
        color: #4caf50;
    }

    .results__status--inactive {
        color: #f44336;
    }

    .results__icon {
        font-size: 1.5rem;
        color: #333;
    }

    .map {
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
</style>