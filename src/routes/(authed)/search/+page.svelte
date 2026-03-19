<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type L from 'leaflet';

    let { data } = $props();
    let searchValue = $state('');
    let activeFilter = $state<string | null>(null);
    let typeFilter = $state<string | null>(null);
    let typeDropdownOpen = $state(false);
    let showMap = $state(false);
    let mapContainer: HTMLDivElement;
    let map: L.Map | null = null;
    let leaflet: typeof L | null = null;

    const types = $derived([...new Set(data.clients.map((c) => c.type).filter(Boolean))]);

    function getFilteredItems() {
        let items = data.clients;

        if (searchValue) {
            const query = searchValue.toLowerCase();
            items = items.filter(
                (item) =>
                    item.name?.toLowerCase().includes(query) ||
                    item.type?.toLowerCase().includes(query)
            );
        }

        if (activeFilter === 'active') items = items.filter((i) => i.software?.status === true);
        if (activeFilter === 'inactive') items = items.filter((i) => i.software?.status === false);
        if (typeFilter) items = items.filter((i) => i.type === typeFilter);

        return items;
    }

    function handleInput(e: Event) {
        searchValue = (e.target as HTMLInputElement).value;
    }

    function toggleActive() {
        activeFilter = activeFilter === 'active' ? null : 'active';
    }

    function selectType(type: string | null) {
        typeFilter = type;
        typeDropdownOpen = false;
    }

    function getIcon(type: string | null | undefined) {
        switch (type) {
            case 'Restaurant': return 'fa-utensils';
            case 'Café': return 'fa-mug-hot';
            case 'Bar': return 'fa-martini-glass';
            case 'Hotel': return 'fa-hotel';
            default: return 'fa-store';
        }
    }

    function createIcon(active: boolean) {
        const color = active ? '#4caf50' : '#f44336';
        return leaflet!.divIcon({
            className: '',
            html: `<div style="
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: ${color};
                border: 2.5px solid white;
                box-shadow: 0 1px 4px rgba(0,0,0,0.35);
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -10]
        });
    }

    function updateMapMarkers() {
        if (!map || !leaflet) return;

        const filtered = getFilteredItems();
        map.eachLayer((layer) => {
            if (layer instanceof leaflet!.Marker) {
                map!.removeLayer(layer);
            }
        });

        const bounds: [number, number][] = [];

        filtered.forEach((client) => {
            if (!client.lat || !client.lng) return;

            const active = client.software?.status === true;
            const marker = leaflet!.marker([client.lat, client.lng], {
                icon: createIcon(active)
            });

            marker.bindPopup(`
                <div onclick="window.location.href='/search/${client.id}'" style="font-family: sans-serif; min-width: 120px; cursor: pointer;">
                    <strong style="font-size: 0.9rem;">${client.name}</strong><br/>
                    <span style="font-size: 0.8rem; color: ${active ? '#4caf50' : '#f44336'};">
                        ${active ? '● Actief' : '● Niet-Actief'}
                    </span><br/>
                    <span style="font-size: 0.75rem; color: #888;">${client.type ?? ''}</span>
                </div>
            `);

            marker.on('mouseover', () => marker.openPopup());
            marker.on('mouseleave', () => marker.closePopup());
            marker.on('click', () => goto(`/search/${client.id}`));
            marker.addTo(map!);
            bounds.push([client.lat, client.lng]);
        });

        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
    }

    onMount(async () => {
        leaflet = await import('leaflet');
        map = leaflet.map(mapContainer).setView([51.1, 3.71], 13);

        leaflet
            .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            })
            .addTo(map);

        updateMapMarkers();
    });

    $effect(() => {
        if (map && leaflet) {
            updateMapMarkers();
        }
    });

    $effect(() => {
        if (map) {
            setTimeout(() => map!.invalidateSize(), 10);
        }
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<h1>Search</h1>

<div class="search-layout">
    <div class="search-layout__left" class:search-layout__left--map={showMap}>
        <div class="search-top">
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

            <button
                class="map-toggle"
                onclick={() => {
                    showMap = !showMap;
                    setTimeout(() => map?.invalidateSize(), 50);
                }}
                aria-label={showMap ? 'Lijst tonen' : 'Kaart tonen'}
            >
                <i class="fa-solid {showMap ? 'fa-list' : 'fa-map-location-dot'}"></i>
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
                    onclick={() => (typeDropdownOpen = !typeDropdownOpen)}
                >
                    Type <i class="fa-solid fa-chevron-down"></i>
                </button>
                {#if typeDropdownOpen}
                    <div class="filter-dropdown__menu">
                        <button class="filter-dropdown__item" onclick={() => selectType(null)}>Alle</button>
                        {#each types as type}
                            <button
                                class="filter-dropdown__item"
                                class:filter-dropdown__item--active={typeFilter === type}
                                onclick={() => selectType(type)}
                            >{type}</button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <ul class="results" class:results--hidden={showMap}>
            {#each getFilteredItems() as item (item.id)}
                <li class="results__item">
                    <div
                        class="results__div results__div--clickable"
                        onclick={() => goto(`/search/${item.id}`)}
                        onkeydown={(e) => e.key === 'Enter' && goto(`/search/${item.id}`)}
                        role="link"
                        tabindex="0"
                    >
                        <div class="results__info">
                            <span class="results__name">{item.name}</span>
                            <span
                                class="results__status"
                                class:results__status--active={item.software?.status === true}
                                class:results__status--inactive={item.software?.status === false}
                            >
                                <i class="fa-regular fa-clock"></i>
                                {item.software?.status ? 'Actief' : 'Niet-Actief'}
                            </span>
                        </div>
                        <i class="fa-solid {getIcon(item.type)} results__icon"></i>
                    </div>
                </li>
            {:else}
                <li class="results__item results__item--empty">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    Geen resultaten gevonden
                </li>
            {/each}
        </ul>
    </div>
<div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
    .search-layout {
        display: flex;
        gap: 2rem;
        height: 70vh;
    }

    .search-layout__left {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 35%;
        min-width: 300px;
        overflow: hidden;
    }

    .map-container {
        flex: 1;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .search-top {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .search-bar {
        flex: 1;
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

    .map-toggle {
        display: none;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        background: white;
        cursor: pointer;
        font-size: 1rem;
        color: #333;
        flex-shrink: 0;
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
        border-radius: 0.5rem;
        overflow-x: hidden;
        flex: 1;
    }

    .results__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        background: white;
    }

    .results__item:first-child {
        border-top: 1px solid #eee;
    }

    .results__item--empty {
        padding: 2rem;
        justify-content: center;
        gap: 0.5rem;
        color: #999;
        font-size: 0.9rem;
        border-top: 1px solid #eee;
    }

    .results__div {
        display: flex;
        width: 100%;
        padding: 1rem;
        background: transparent;
        justify-content: space-between;
        align-items: center;
    }

    .results__div--clickable {
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .results__div--clickable:hover {
        background-color: #f9fafb;
    }

    .results__div--clickable:focus {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
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

    .results__status--active { color: #4caf50; }
    .results__status--inactive { color: #f44336; }

    .results__icon {
        font-size: 1.5rem;
        color: #333;
    }

@media (max-width: 768px) {
    .search-layout {
        flex-direction: column;
        height: auto;
    }

    .search-layout__left {
        width: 100%;
        min-width: unset;
        overflow: hidden;
        max-height: 70vh;
    }

    .map-container {
        display: none;
    }

    .map-toggle {
        display: none;
    }

    .results--hidden {
        display: flex;
    }
}
</style>