<script lang="ts">
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import logo from '$lib/assets/touchsystems.png';
    import type { SupabaseClient } from '@supabase/supabase-js';

    let { data } = $props();
    
    const supabase = getContext<SupabaseClient>('supabase');

    async function signInWithGitHub() {
        const { data: authData, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Error signing in:', error);
        }
    }
</script>

{#if data.session}
    <p>You are signed in. Redirecting...</p>
{:else}
    <div class="login">
        <div class="login__card">
            <img src={logo} alt="TouchSystems Logo" class="login__logo" />
            <h1 class="login__title">TouchSystems</h1>
            <p class="login__subtitle">Sign in to access the dashboard</p>
            <button class="login__button" onclick={signInWithGitHub}>
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