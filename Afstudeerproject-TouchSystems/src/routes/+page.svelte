<script lang="ts">
    import { signIn } from '@auth/sveltekit/client';
    import logo from '$lib/assets/touchsystems.png';

    let { data } = $props();
</script>

{#if data.session?.user}
    <p>You are signed in. Redirecting...</p>
{:else}
    <div class="login">
        <div class="login__card">
            <img src={logo} alt="TouchSystems Logo" class="login__logo" />
            <h1 class="login__title">TouchSystems</h1>
            <p class="login__subtitle">Sign in to access the dashboard</p>
            <button class="login__button" onclick={() => signIn('github')}>
                Sign in with GitHub
            </button>
        </div>
    </div>
{/if}

<style>
    .login {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f5f5;
    }

    .login__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 3rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .login__logo {
        width: 6rem;
        height: 6rem;
    }

    .login__title {
        margin: 0;
        font-size: 2rem;
    }

    .login__subtitle {
        margin: 0;
        color: #666;
    }

    .login__button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        border: none;
        border-radius: 0.5rem;
        background-color: #24292e;
        color: white;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .login__button:hover {
        background-color: #444d56;
    }
</style>