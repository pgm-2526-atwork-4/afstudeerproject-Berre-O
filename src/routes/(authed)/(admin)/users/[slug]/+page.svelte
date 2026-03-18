<script lang="ts">
    import { backButton } from "$lib/utils";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";

    let { data } = $props();
    let isAdmin = $state(data.profile.admin ?? false);
    let isUpdating = $state(false);
    let showDeleteModal = $state(false);
    let showToast = $state(false);
    let toastMessage = $state('');

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
            month: 'long',
            year: 'numeric'
        });
    }

    function formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleDateString('nl-BE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

{#if showDeleteModal}
    <div class="modal-overlay" onclick={() => showDeleteModal = false}>
        <div class="modal" onclick={(e) => e.stopPropagation()}>
            <div class="modal__icon modal__icon--danger">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h2 class="modal__title">Delete User</h2>
            <p class="modal__text">
                Are you sure you want to delete <strong>{data.profile.name}</strong>? 
                This action cannot be undone.
            </p>
            <div class="modal__actions">
                <button class="btn btn--cancel" onclick={() => showDeleteModal = false}>Cancel</button>
                <form 
                    method="POST" 
                    action="?/deleteUser"
                    use:enhance={() => {
                        isUpdating = true;
                        return async ({ result }) => {
                            isUpdating = false;
                            if (result.type === 'success') {
                                showDeleteModal = false;
                                toastMessage = 'User successfully deleted';
                                showToast = true;
                                
                                setTimeout(() => {
                                    showToast = false;
                                    goto('/users');
                                }, 3000);
                            }
                        };
                    }}
                >
                    <button type="submit" class="btn btn--danger" disabled={isUpdating}>
                        {isUpdating ? 'Deleting...' : 'Delete User'}
                    </button>
                </form>
            </div>
        </div>
    </div>
{/if}

{#if showToast}
    <div class="toast toast--success">
        <i class="fa-solid fa-check-circle"></i>
        {toastMessage}
    </div>
{/if}

<button use:backButton class="back-link">
    <i class="fa-solid fa-arrow-left"></i> Back to Users
</button>

<section class="detail-header">
    <div class="detail-header__avatar">{getInitials(data.profile.name)}</div>
    <div class="detail-header__info">
        <h1 class="detail-header__name">
            {data.profile.name ?? 'Unknown User'}
            <span class="badge" class:badge--admin={isAdmin} class:badge--user={!isAdmin}>
                {isAdmin ? 'Admin' : 'User'}
            </span>
        </h1>
        <p class="detail-header__sub">Member since {formatDate(data.profile.created_at)}</p>
    </div>
    <div class="detail-header__actions">
        <button class="btn btn--danger-outline" onclick={() => showDeleteModal = true}>
            <i class="fa-solid fa-trash"></i> Delete
        </button>
    </div>
</section>

<div class="detail-content">
    <div class="detail-card">
        <h2 class="detail-card__title">User Information</h2>
        <div class="detail-card__grid">
            <div class="detail-card__field">
                <span class="detail-card__label">Full Name</span>
                <span class="detail-card__value">{data.profile.name ?? 'Not set'}</span>
            </div>
            <div class="detail-card__field">
                <span class="detail-card__label">User ID</span>
                <span class="detail-card__value">{data.profile.id}</span>
            </div>
            <div class="detail-card__field">
                <span class="detail-card__label">Created At</span>
                <span class="detail-card__value">{formatDateTime(data.profile.created_at)}</span>
            </div>
        </div>
    </div>

    <div class="detail-card">
        <h2 class="detail-card__title">Permissions</h2>
        <div class="control">
            <div class="control__item">
                <div class="control__info">
                    <i class="fa-solid fa-shield-halved"></i>
                    <div>
                        <span class="control__label">Administrator</span>
                        <span class="control__desc">Grant full access to all features</span>
                    </div>
                </div>
                <form 
                    method="POST" 
                    action="?/updateAdmin"
                    use:enhance={() => {
                        isUpdating = true;
                        return async ({ result }) => {
                            isUpdating = false;
                            if (result.type !== 'success') {
                                isAdmin = !isAdmin;
                            }
                        };
                    }}
                >
                    <input type="hidden" name="admin" value={isAdmin.toString()} />
                    <label class="toggle">
                        <input 
                            type="checkbox" 
                            bind:checked={isAdmin} 
                            onchange={(e) => e.currentTarget.form?.requestSubmit()} 
                            disabled={isUpdating}
                        />
                        <span class="toggle__slider"></span>
                    </label>
                </form>
            </div>
        </div>
    </div>
</div>

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
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 1.5rem;
    }

    .modal__icon--danger {
        background: #ffebee;
        color: #c62828;
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
        margin-bottom: 1.5rem;
        color: white;
    }

    .detail-header__avatar {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.5rem;
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

    .detail-header__actions {
        display: flex;
        gap: 0.5rem;
    }

    .badge {
        padding: 0.25rem 0.6rem;
        border-radius: 0.3rem;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .badge--admin {
        background: rgba(255, 255, 255, 0.9);
        color: #1565c0;
    }

    .badge--user {
        background: rgba(255, 255, 255, 0.3);
        color: white;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.25rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.2s;
    }

    .btn--cancel {
        background: #f5f5f5;
        color: #666;
    }

    .btn--cancel:hover {
        background: #e0e0e0;
    }

    .btn--danger {
        background: #c62828;
        color: white;
    }

    .btn--danger:hover {
        background: #b71c1c;
    }

    .btn--danger:disabled {
        background: #ffcdd2;
        cursor: not-allowed;
    }

    .btn--danger-outline {
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.4);
    }

    .btn--danger-outline:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    .detail-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .detail-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
        gap: 1rem;
    }

    .detail-card__field {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
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

    .control {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .control__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }

    .control__info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #444;
    }

    .control__info i {
        font-size: 1.25rem;
        color: #666;
    }

    .control__label {
        display: block;
        font-weight: 500;
        font-size: 0.95rem;
    }

    .control__desc {
        display: block;
        font-size: 0.8rem;
        color: #999;
    }

    .toggle {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
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

    .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    font-size: 0.95rem;
    font-weight: 500;
    animation: slideUp 0.3s ease;
}

.toast--success {
    border-left: 4px solid #4caf50;
    color: #2e7d32;
}

.toast--success i {
    color: #4caf50;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}
</style>