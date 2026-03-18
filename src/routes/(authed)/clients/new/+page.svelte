<script lang="ts">
    import { enhance } from '$app/forms';
    import { backButton } from '$lib/utils.ts';

    let { form } = $props();
    let loading = $state(false);
    let currentStep = $state(1);
    const totalSteps = 3;

    let formData = $state({
        name: form?.data?.name ?? '',
        type: form?.data?.type ?? '',
        company_number: form?.data?.company_number ?? '',
        first_name: form?.data?.first_name ?? '',
        last_name: form?.data?.last_name ?? '',
        email: form?.data?.email ?? '',
        phone: form?.data?.phone ?? '',
        adres: form?.data?.adres ?? '',
        sub_type: form?.data?.sub_type ?? '',
        sub_price: form?.data?.sub_price ?? '',
        sub_status: form?.data?.sub_status ?? 'Payed',
        start_date: form?.data?.start_date ?? '',
        expiration_date: form?.data?.expiration_date ?? '',
        notes: form?.data?.notes ?? ''
    });

    let errors = $state<Record<string, string>>({});

    function validateStep(step: number): boolean {
        errors = {};
        
        if (step === 1) {
            if (!formData.name.trim()) {
                errors.name = 'Name is required';
            }
            if (!formData.type) {
                errors.type = 'Type is required';
            }
        }
        
        if (step === 2) {
            if (!formData.sub_type) {
                errors.sub_type = 'Subscription type is required';
            }
            if (!formData.start_date) {
                errors.start_date = 'Start date is required';
            }
            if (!formData.expiration_date) {
                errors.expiration_date = 'Expiration date is required';
            }
        }

        return Object.keys(errors).length === 0;
    }

    function validateAllSteps(): boolean {
        errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.type) {
            errors.type = 'Type is required';
        }
        
        if (!formData.sub_type) {
            errors.sub_type = 'Subscription type is required';
        }
        if (!formData.sub_price) {
            errors.sub_price = 'Subscription price is required';
        }
        if (!formData.start_date) {
            errors.start_date = 'Start date is required';
        }
        if (!formData.expiration_date) {
            errors.expiration_date = 'Expiration date is required';
        }

        return Object.keys(errors).length === 0;
    }

    function nextStep() {
        if (validateStep(currentStep)) {
            currentStep++;
        }
    }

    function prevStep() {
        currentStep--;
    }

    function handleSubmit() {
        if (!validateAllSteps()) {
            if (errors.name || errors.type) {
                currentStep = 1;
            } else if (errors.sub_type || errors.start_date || errors.expiration_date) {
                currentStep = 2;
            }
            return false;
        }
        return true;
    }
</script>

<div class="page-header">
    <button use:backButton class="btn btn--secondary">
        <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    <h1>New Client</h1>
</div>

{#if form?.error}
    <div class="alert alert--error">
        <i class="fa-solid fa-circle-exclamation"></i>
        <p>{form.error}</p>
    </div>
{/if}

<div class="wizard-container">
    <div class="step-indicator">
        <div class="step" class:active={currentStep >= 1} class:completed={currentStep > 1}>
            <div class="step__icon">{#if currentStep > 1}<i class="fa-solid fa-check"></i>{:else}1{/if}</div>
            <span class="step__label">Client & Contact</span>
        </div>
        <div class="step-indicator__line"></div>
        <div class="step" class:active={currentStep >= 2} class:completed={currentStep > 2}>
            <div class="step__icon">{#if currentStep > 2}<i class="fa-solid fa-check"></i>{:else}2{/if}</div>
            <span class="step__label">Subscription</span>
        </div>
        <div class="step-indicator__line"></div>
        <div class="step" class:active={currentStep >= 3}>
            <div class="step__icon">3</div>
            <span class="step__label">Notes</span>
        </div>
    </div>

    <form
        method="POST"
        use:enhance={({ cancel }) => {
            if (!handleSubmit()) {
                cancel();
                return;
            }
            loading = true;
            return async ({ update }) => {
                loading = false;
                await update();
            };
        }}
    >
        <input type="hidden" name="name" value={formData.name} />
        <input type="hidden" name="type" value={formData.type} />
        <input type="hidden" name="company_number" value={formData.company_number} />
        <input type="hidden" name="first_name" value={formData.first_name} />
        <input type="hidden" name="last_name" value={formData.last_name} />
        <input type="hidden" name="email" value={formData.email} />
        <input type="hidden" name="phone" value={formData.phone} />
        <input type="hidden" name="adres" value={formData.adres} />
        <input type="hidden" name="sub_type" value={formData.sub_type} />
        <input type="hidden" name="sub_price" value={formData.sub_price} />
        <input type="hidden" name="sub_status" value={formData.sub_status} />
        <input type="hidden" name="start_date" value={formData.start_date} />
        <input type="hidden" name="expiration_date" value={formData.expiration_date} />
        <input type="hidden" name="notes" value={formData.notes} />

        {#if currentStep === 1}
            <div class="step-content">
                <div class="form-grid">
                    <div class="form-section">
                        <h3 class="form-section__title">Client</h3>
                        <div class="field" class:field--error={errors.name}>
                            <label for="name">Name *</label>
                            <input type="text" id="name" placeholder="e.g. Restaurant De Tuin" bind:value={formData.name} />
                            {#if errors.name}<span class="field__error">{errors.name}</span>{/if}
                        </div>
                        <div class="field-row">
                            <div class="field" class:field--error={errors.type}>
                                <label for="type">Type *</label>
                                <select id="type" bind:value={formData.type}>
                                    <option value="" disabled>Select type</option>
                                    <option value="Restaurant">Restaurant</option>
                                    <option value="Café">Café</option>
                                    <option value="Hotel">Hotel</option>
                                    <option value="Bar">Bar</option>
                                </select>
                                {#if errors.type}<span class="field__error">{errors.type}</span>{/if}
                            </div>
                            <div class="field">
                                <label for="company_number">Company #</label>
                                <input type="text" id="company_number" placeholder="e.g. 0123456789" bind:value={formData.company_number} />
                            </div>
                        </div>
                    </div>
                    <div class="form-section">
                        <h3 class="form-section__title">Contact</h3>
                        <div class="field-row">
                            <div class="field">
                                <label for="first_name">First Name</label>
                                <input type="text" id="first_name" placeholder="e.g. Jan" bind:value={formData.first_name} />
                            </div>
                            <div class="field">
                                <label for="last_name">Last Name</label>
                                <input type="text" id="last_name" placeholder="e.g. Janssens" bind:value={formData.last_name} />
                            </div>
                        </div>
                        <div class="field-row">
                            <div class="field">
                                <label for="email">Email</label>
                                <input type="email" id="email" placeholder="e.g. info@restaurant.be" bind:value={formData.email} />
                            </div>
                            <div class="field">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" placeholder="e.g. +32 9 123 45 67" bind:value={formData.phone} />
                            </div>
                        </div>
                        <div class="field">
                            <label for="adres">Address</label>
                            <input type="text" id="adres" placeholder="e.g. Kerkstraat 1, 9000 Gent" bind:value={formData.adres} />
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        {#if currentStep === 2}
            <div class="step-content">
                <div class="form-section form-section--full">
                    <h3 class="form-section__title">Subscription Details</h3>
                    <div class="field-row">
                        <div class="field" class:field--error={errors.sub_type}>
                            <label for="sub_type">Type *</label>
                            <select id="sub_type" bind:value={formData.sub_type}>
                                <option value="" disabled>Select type</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                                <option value="Trial">Trial</option>
                            </select>
                            {#if errors.sub_type}<span class="field__error">{errors.sub_type}</span>{/if}
                        </div>
                        <div class="field">
                            <label for="price">Pricing</label>
                            <input type="text" id="price" placeholder="e.g. € 150" bind:value={formData.sub_price} />
                            {#if errors.sub_price}<span class="field__error">{errors.sub_price}</span>{/if}
                        </div>
                        <div class="field">
                            <label for="sub_status">Status</label>
                            <select id="sub_status" bind:value={formData.sub_status}>
                                <option value="Payed">Payed</option>
                                <option value="Almost up">Almost up</option>
                                <option value="Off">Off</option>
                            </select>
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="field" class:field--error={errors.start_date}>
                            <label for="start_date">Start Date *</label>
                            <input type="date" id="start_date" bind:value={formData.start_date} />
                            {#if errors.start_date}<span class="field__error">{errors.start_date}</span>{/if}
                        </div>
                        <div class="field" class:field--error={errors.expiration_date}>
                            <label for="expiration_date">Expiration Date *</label>
                            <input type="date" id="expiration_date" bind:value={formData.expiration_date} />
                            {#if errors.expiration_date}<span class="field__error">{errors.expiration_date}</span>{/if}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        {#if currentStep === 3}
            <div class="step-content">
                <div class="form-section form-section--full">
                    <h3 class="form-section__title">Additional Notes</h3>
                    <div class="field">
                        <textarea id="notes" placeholder="Any additional information about the client..." rows="6" bind:value={formData.notes}></textarea>
                    </div>
                </div>
            </div>
        {/if}

        <div class="actions">
            {#if currentStep > 1}
                <button type="button" class="btn btn--secondary" onclick={prevStep}>
                    <i class="fa-solid fa-chevron-left"></i> Previous
                </button>
            {/if}
            <div class="actions__spacer"></div>
            {#if currentStep < totalSteps}
                <button type="button" class="btn btn--primary" onclick={nextStep}>
                    Next <i class="fa-solid fa-chevron-right"></i>
                </button>
            {:else}
                <button type="submit" class="btn btn--primary" disabled={loading}>
                    {#if loading}
                        <i class="fa-solid fa-spinner fa-spin"></i> Creating...
                    {:else}
                        <i class="fa-solid fa-plus"></i> Create Client
                    {/if}
                </button>
            {/if}
        </div>
    </form>
</div>

<style>
    .page-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 1rem;
        width: fit-content;
    }

    .page-header h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .alert {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
    }

    .alert p {
        margin: 0;
    }

    .alert--error {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }

    .wizard-container {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .step-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
        color: #9ca3af;
        font-weight: 500;
        font-size: 0.75rem;
    }

    .step__icon {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 2px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8rem;
        transition: all 0.3s ease;
    }

    .step.active .step__icon {
        border-color: var(--color-secondary);
        color: var(--color-secondary);
    }

    .step.active .step__label {
        color: #333;
    }

    .step.completed .step__icon {
        background-color: var(--color-secondary);
        border-color: var(--color-secondary);
        color: white;
    }

    .step-indicator__line {
        width: 4rem;
        height: 2px;
        background-color: #e5e7eb;
        margin: 0 0.75rem;
        transform: translateY(-0.6rem);
    }

    .step-content {
        min-height: 220px;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .form-section--full {
        max-width: 500px;
        margin: 0 auto;
    }

    .form-section__title {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
        margin: 0 0 0.25rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f3f4f6;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .field--error input,
    .field--error select {
        border-color: #ef4444 !important;
    }

    .field__error {
        font-size: 0.7rem;
        color: #ef4444;
    }

    .field label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #666;
    }

    .field input,
    .field select,
    .field textarea {
        padding: 0.4rem 0.6rem;
        border: 1px solid #ddd;
        border-radius: 0.375rem;
        font-size: 0.85rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s ease;
    }

    .field input:focus,
    .field select:focus,
    .field textarea:focus {
        border-color: var(--color-secondary);
        box-shadow: 0 0 0 2px rgba(227, 9, 111, 0.1);
    }

    .field textarea {
        resize: vertical;
    }

    .field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }

    .actions__spacer {
        flex: 1;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        text-decoration: none;
        transition: background-color 0.15s ease;
    }

    .btn--primary {
        background-color: var(--color-secondary);
        color: white;
    }

    .btn--primary:hover:not(:disabled) {
        opacity: 0.9;
    }

    .btn--primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn--secondary {
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

    .btn--secondary:hover {
        color: #333;
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
    }
</style>