<script lang="ts">
    import { backButton } from "$lib/utils";
    import { getContext } from 'svelte';
    import type { SupabaseClient } from '@supabase/supabase-js';
    
    let { data } = $props();
    let activeTab = $state('overview');
    let noteInput = $state('');
    let warningToggle = $state(data.client.software?.warning ?? false);
    let disableToggle = $state(data.client.software?.status ?? false);
    let showConfirmModal = $state(false);
    let pendingSoftwareState = $state(false);
    let isUpdating = $state(false);

    const supabase = getContext<SupabaseClient>('supabase');

    function getInitials(name: string): string {
        const names = name.trim().split(' ').filter(Boolean);
        if (names.length >= 2) {
            return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
        }
        return names[0].charAt(0).toUpperCase();
    }

    let initials = getInitials(data.client.name);

    function handleSaveNote() {
        if (!noteInput.trim()) return;
        noteInput = '';
    }

    async function updateWarning(value: boolean) {
        isUpdating = true;
        const { error } = await supabase
            .from('software')
            .update({ warning: value })
            .eq('id', data.client.id);
        
        if (error) {
            console.error('Failed to update warning:', error);
            warningToggle = !value; // Revert on error
        }
        isUpdating = false;
    }

    function handleWarningToggle() {
        warningToggle = !warningToggle;
        updateWarning(warningToggle);
    }

    function handleSoftwareToggle() {
        pendingSoftwareState = !disableToggle;
        
        if (disableToggle) {
            showConfirmModal = true;
        } else {
            confirmSoftwareChange();
        }
    }

    async function confirmSoftwareChange() {
        showConfirmModal = false;
        isUpdating = true;
        
        const { error } = await supabase
            .from('software')
            .update({ status: pendingSoftwareState })
            .eq('id', data.client.id);
        
        if (error) {
            console.error('Failed to update software status:', error);
        } else {
            disableToggle = pendingSoftwareState;
        }
        isUpdating = false;
    }

    function cancelSoftwareChange() {
        showConfirmModal = false;
    }
</script>

{#if showConfirmModal}
    <div class="modal-overlay" onclick={cancelSoftwareChange}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal__icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 class="modal__title">Software Uitschakelen</h2>
            <p class="modal__text">
                Je staat op het punt om de software voor <strong>{data.client.name}</strong> uit te schakelen. 
                Dit kan invloed hebben op hun diensten.
            </p>
            <div class="modal__actions">
                <button class="btn btn--cancel" onclick={cancelSoftwareChange}>Annuleren</button>
                <button class="btn btn--danger" onclick={confirmSoftwareChange} disabled={isUpdating}>
                    {isUpdating ? 'Bezig...' : 'Doorgaan'}
                </button>
            </div>
        </div>
    </div>
{/if}

<button use:backButton class="back-link">
    <i class="fa-solid fa-arrow-left"></i> Terug
</button>

<section class="detail-header">
    <div class="detail-header__avatar">{initials}</div>
    <div class="detail-header__info">
        <h1 class="detail-header__name">
            {data.client.name}
            <span class="badge badge--status" class:badge--active={data.client.subscriptions.status === "Payed"} class:badge--renew={data.client.subscriptions.status === "Almost up"} class:badge--inactive={data.client.subscriptions.status === "Off"}>{data.client.subscriptions.status}</span>
            <span class="badge badge--software" class:badge--active={disableToggle} class:badge--inactive={!disableToggle}>
                {disableToggle ? 'Software Aan' : 'Software Uit'}
            </span>
        </h1>
        <p class="detail-header__sub">Contact: John Doe</p>
    </div>
</section>

<nav class="tabs">
    <button class="tabs__item" class:tabs__item--active={activeTab === 'overview'} onclick={() => activeTab = 'overview'}>Overview</button>
    <button class="tabs__item" class:tabs__item--active={activeTab === 'systems'} onclick={() => activeTab = 'systems'}>Systems</button>
    <button class="tabs__item" class:tabs__item--active={activeTab === 'notes'} onclick={() => activeTab = 'notes'}>Notes</button>
</nav>

{#if activeTab === 'overview'}
    <div class="detail-content">
        <div class="detail-card">
            <h2 class="detail-card__title">Contact Information</h2>
            <div class="detail-card__grid">
                <div class="detail-card__field">
                    <span class="detail-card__label">Email</span>
                    <span class="detail-card__value">{data.client.contact.email}</span>
                </div>
                <div class="detail-card__field">
                    <span class="detail-card__label">Adres</span>
                    <span class="detail-card__value">{data.client.contact.adres}</span>
                </div>
                <div class="detail-card__field">
                    <span class="detail-card__label">Telefoon</span>
                    <span class="detail-card__value">{data.client.contact.phone}</span>
                </div>
                <div class="detail-card__field">
                    <span class="detail-card__label">KVK</span>
                    <span class="detail-card__value">{data.client.company_number}</span>
                </div>
            </div>
        </div>

        <div class="detail-card">
            <h2 class="detail-card__title">Account Information</h2>
            <div class="detail-card__grid">
                <div class="detail-card__field">
                    <span class="detail-card__label">Subscription Type</span>
                    <span class="detail-card__value detail-card__value--highlight">{data.client.subscriptions.type}</span>
                </div>
                <div class="detail-card__field">
                    <span class="detail-card__label">Software Status</span>
                    <span class="detail-card__value detail-card__value--green">{data.client.subscriptions.status}</span>
                </div>
                <div class="detail-card__field">
                    <span class="detail-card__label">Subscription Price</span>
                    <span class="detail-card__value detail-card__value--highlight"></span>
                </div>
            </div>
        </div>
    </div>

    <a href="/logs" class="btn btn--primary">Logs</a>
{/if}

{#if activeTab === 'notes'}
    <div class="detail-content detail-content--single">
        <div class="detail-card detail-card--full">
            <h2 class="detail-card__title">Notes</h2>
            {#each data.client.notes as note}
                <div class="note">
                    <div class="note__header">
                        <span class="note__date">{note.created_at}</span>
                        <span class="note__author"></span>
                    </div>
                    <p class="note__content">{note.information}</p>
                </div>
            {/each}

            <div class="note-input">
                <input
                    type="text"
                    class="note-input__field"
                    placeholder="Add a note..."
                    bind:value={noteInput}
                />
                <button class="btn btn--save" onclick={handleSaveNote}>Save Note</button>
            </div>
        </div>
    </div>

    <a href="/logs" class="btn btn--primary">Logs</a>
{/if}

{#if activeTab === 'systems'}
    <div class="detail-content detail-content--single">
        <div class="detail-card detail-card--full">
            <h2 class="detail-card__title">Software Control</h2>
            <div class="control">
                <div class="control__item">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>Warning</span>
                    <label class="toggle">
                        <input type="checkbox" checked={warningToggle} onchange={handleWarningToggle} disabled={isUpdating} />
                        <span class="toggle__slider"></span>
                    </label>
                </div>
                <div class="control__item">
                    <i class="fa-solid fa-code"></i>
                    <span>Software</span>
                    <label class="toggle">
                        <input 
                            type="checkbox" 
                            checked={disableToggle} 
                            onclick={(e) => { e.preventDefault(); handleSoftwareToggle(); }} 
                            disabled={isUpdating} 
                        />
                        <span class="toggle__slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <a href="/logs" class="btn btn--primary">Logs</a>
{/if}

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .modal {
        background: white;
        border-radius: 1rem;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .modal__icon {
        width: 60px;
        height: 60px;
        background: #fff3e0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 1.5rem;
        color: #ff9800;
    }

    .modal__title {
        margin: 0 0 0.5rem;
        font-size: 1.25rem;
        color: #333;
    }

    .modal__text {
        color: #666;
        font-size: 0.95rem;
        margin: 0 0 1.5rem;
        line-height: 1.5;
    }

    .modal__actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .btn--cancel {
        background: #f5f5f5;
        color: #666;
    }

    .btn--cancel:hover {
        background: #e0e0e0;
    }

    .btn--danger {
        background: var(--color-secondary);
        color: white;
    }

    .btn--danger:hover {
        background: color-mix(in srgb, var(--color-secondary) 90%, black 10%);
    }

    .btn--danger:disabled {
        background: #ffcdd2;
        cursor: not-allowed;
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

    .detail-header {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
        background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
        border-radius: 1rem;
        margin-bottom: 1rem;
        color: white;
    }

    .detail-header__avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.25rem;
        color: white;
    }

    .detail-header__info {
        flex: 1;
    }

    .detail-header__name {
        font-size: 1.5rem;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .detail-header__sub {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        opacity: 0.85;
    }

    .badge {
        padding: 0.2rem 0.6rem;
        border-radius: 0.3rem;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .badge--status {
        background: #4caf50;
        color: white;
    }

    .badge--active {
        background: #4caf50;
        color: white;
    }

    .badge--renew {
        background: #c7ca02;
    }

    .badge--inactive {
        background: #f44336;
        color: white;
    }

    .tabs {
        display: flex;
        gap: 0;
        margin-bottom: 1.5rem;
    }

    .tabs__item {
        padding: 0.5rem 1rem;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: #666;
        border-bottom: 2px solid transparent;
    }

    .tabs__item--active {
        color: #333;
        border-bottom: 2px solid #e91e90;
        font-weight: 600;
    }

    .tabs__item:hover {
        color: #333;
    }

    .detail-content {
        display: flex;
        gap: 2rem;
        margin-bottom: 1.5rem;
    }

    .detail-content--single {
        flex-direction: column;
    }

    .detail-card {
        flex: 1;
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        max-width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .detail-card--full {
        flex: unset;
    }

    .detail-card__title {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        margin: 0 0 1rem;
    }

    .detail-card__grid {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .detail-card__field {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .detail-card__label {
        font-size: 0.8rem;
        color: #999;
        font-weight: 500;
    }

    .detail-card__value {
        font-size: 0.95rem;
        color: #333;
    }

    .detail-card__value--highlight {
        background: color-mix(in srgb, var(--color-secondary) 10%, transparent);
        color: var(--color-secondary);
        padding: 0.3rem 0.75rem;
        border-radius: 0.4rem;
        display: inline-block;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .detail-card__value--green {
        background: #e8f5e9;
        color: #2e7d32;
        padding: 0.3rem 0.75rem;
        border-radius: 0.4rem;
        display: inline-block;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .note {
        background: #fafafa;
        border: 1px solid #eee;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
    }

    .note__header {
        display: flex;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: #999;
        margin-bottom: 0.5rem;
    }

    .note__content {
        margin: 0;
        font-size: 0.9rem;
        color: #444;
        line-height: 1.5;
    }

    .note-input {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .note-input__field {
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 0.9rem;
        outline: none;
    }

    .note-input__field:focus {
        border-color: #e91e90;
    }

    .btn {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
    }

    .btn--primary {
        background: #e91e90;
        color: white;
    }

    .btn--primary:hover {
        background: #c2185b;
    }

    .btn--save {
        background: #4caf50;
        color: white;
        align-self: flex-end;
    }

    .btn--save:hover {
        background: #388e3c;
    }

    .control {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .control__item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.95rem;
        color: #444;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        margin-left: auto;
    }

    .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle input:disabled + .toggle__slider {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .toggle__slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        border-radius: 24px;
        transition: 0.3s;
    }

    .toggle__slider::before {
        content: '';
        position: absolute;
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: 0.3s;
    }

    .toggle input:checked + .toggle__slider {
        background-color: #e91e90;
    }

    .toggle input:checked + .toggle__slider::before {
        transform: translateX(20px);
    }
</style>