<script lang="ts">
    import { backButton } from "$lib/utils";
    import { enhance } from "$app/forms";

    let { data } = $props();
    let isSubmitting = $state(false);
    let showSuccessMessage = $state(false);

    const formData = $state({
        name: data.client.name,
        email: data.client.contact.email,
        phone: data.client.contact.phone,
        adres: data.client.contact.adres,
        company_number: data.client.company_number,
        subscription_type: data.client.subscriptions?.type ?? '',
        subscription_status: data.client.subscriptions?.status ?? 'Off',
        subscription_pricing: data.client.subscriptions?.pricing ?? '',
    });
</script>

<button use:backButton class="back-link">
    <i class="fa-solid fa-arrow-left"></i> Terug
</button>

<div class="edit-container">
    <div class="edit-header">
        <h1>Klant bijwerken</h1>
        <p class="edit-header__sub">Informatie van {data.client.name} bijwerken</p>
    </div>

    {#if showSuccessMessage}
        <div class="alert alert--success">
            <i class="fa-solid fa-check-circle"></i>
            Klantinformatie succesvol bijgewerkt
        </div>
    {/if}

    <form
        method="POST"
        action="?/updateClient"
        class="edit-form"
        use:enhance={() => {
            isSubmitting = true;
            return async ({ result }) => {
                isSubmitting = false;
                if (result.type === 'success') {
                    showSuccessMessage = true;
                    setTimeout(() => (showSuccessMessage = false), 3000);
                }
            };
        }}
    >
        <div class="form-group">
            <label for="name" class="form-label">Bedrijfsnaam *</label>
            <input
                type="text"
                id="name"
                name="name"
                class="form-input"
                bind:value={formData.name}
                required
            />
        </div>

        <div class="form-group">
            <label for="company_number" class="form-label">Ondernemings-Nummer *</label>
            <input
                type="text"
                id="company_number"
                name="company_number"
                class="form-input"
                bind:value={formData.company_number}
                required
            />
        </div>

        <div class="form-group">
            <label for="email" class="form-label">E-mail *</label>
            <input
                type="email"
                id="email"
                name="email"
                class="form-input"
                bind:value={formData.email}
                required
            />
        </div>

        <div class="form-group">
            <label for="phone" class="form-label">Telefoon *</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                class="form-input"
                bind:value={formData.phone}
                required
            />
        </div>

        <div class="form-group">
            <label for="adres" class="form-label">Adres *</label>
            <textarea
                id="adres"
                name="adres"
                class="form-input form-textarea"
                bind:value={formData.adres}
                required
                rows="3"
            ></textarea>
        </div>

        <div class="form-section">
            <h3 class="form-section__title">Abonnement informatie</h3>
            
            <div class="form-group">
                <label for="subscription_type" class="form-label">Abonnement Type *</label>
                <input
                    type="text"
                    id="subscription_type"
                    name="subscription_type"
                    class="form-input"
                    bind:value={formData.subscription_type}
                    placeholder="e.g., Monthly, Yearly"
                    required
                />
            </div>

            <div class="form-group">
                <label for="subscription_status" class="form-label">Abonnement Status *</label>
                <select
                    id="subscription_status"
                    name="subscription_status"
                    class="form-input"
                    bind:value={formData.subscription_status}
                    required
                >
                    <option value="Off">Uit</option>
                    <option value="Payed">Betaald</option>
                    <option value="Almost up">Niet-betaald</option>
                </select>
            </div>

            <div class="form-group">
                <label for="subscription_pricing" class="form-label">Abonnement Prijs (€) *</label>
                <input
                    type="number"
                    id="subscription_pricing"
                    name="subscription_pricing"
                    class="form-input"
                    bind:value={formData.subscription_pricing}
                    step="0.01"
                    min="0"
                    required
                />
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn--primary" disabled={isSubmitting}>
                {isSubmitting ? 'Opslaan...' : 'Wijzigingen opslaan'}
            </button>
        </div>
    </form>
</div>

<style>
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

    .edit-container {
        max-width: 600px;
        margin: 0 auto;
    }

    .edit-header {
        margin-bottom: 2rem;
    }

    .edit-header h1 {
        font-size: 1.75rem;
        margin: 0 0 0.5rem;
        color: #333;
    }

    .edit-header__sub {
        color: #666;
        font-size: 0.95rem;
        margin: 0;
    }

    .alert {
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .alert--success {
        background: #e8f5e9;
        color: #2e7d32;
        border-left: 4px solid #4caf50;
    }

    .alert--success i {
        color: #4caf50;
    }

    .edit-form {
        background: white;
        border-radius: 0.75rem;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group:last-of-type {
        margin-bottom: 2rem;
    }

    .form-label {
        display: block;
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
    }

    .form-input {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 0.95rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
        box-sizing: border-box;
    }

    .form-input:focus {
        border-color: #e91e90;
        box-shadow: 0 0 0 3px rgba(233, 30, 144, 0.1);
    }

    .form-textarea {
        resize: vertical;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-start;
    }

    .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        text-decoration: none;
        transition: background-color 0.2s;
    }

    .btn--primary {
        background: #e91e90;
        color: white;
    }

    .btn--primary:hover {
        background: #c2185b;
    }

    .btn--primary:disabled {
        background: #f48fb1;
        cursor: not-allowed;
    }

    .form-section {
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid #eee;
    }

    .form-section__title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #333;
        margin: 0 0 1.5rem;
    }

    select.form-input {
        cursor: pointer;
    }

    select.form-input:focus {
        border-color: #e91e90;
        box-shadow: 0 0 0 3px rgba(233, 30, 144, 0.1);
    }
</style>