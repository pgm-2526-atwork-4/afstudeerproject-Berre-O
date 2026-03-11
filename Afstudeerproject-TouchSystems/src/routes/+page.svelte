<script lang="ts">
    import { goto } from '$app/navigation';
    import { getContext } from 'svelte';
    import logo from '$lib/assets/touchsystems.png';
    import type { SupabaseClient } from '@supabase/supabase-js';

    let { data } = $props();
    
    const supabase = getContext<SupabaseClient>('supabase');

    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let loading = $state(false);
    let error = $state('');
    let message = $state('');
    let isRegister = $state(false);

    async function signInWithEmail() {
        loading = true;
        error = '';
        
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            error = authError.message;
            loading = false;
        } else {
            goto('/dashboard');
        }
    }

    async function signUpWithEmail() {
        loading = true;
        error = '';
        message = '';

        if (password !== confirmPassword) {
            error = 'Passwords do not match';
            loading = false;
            return;
        }

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (authError) {
            error = authError.message;
        } else {
            message = 'Check your email for the confirmation link!';
        }
        loading = false;
    }

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

    function toggleMode() {
        isRegister = !isRegister;
        error = '';
        message = '';
        password = '';
        confirmPassword = '';
    }
</script>

{#if data.session}
    <p>You are signed in. Redirecting...</p>
{:else}
    <div class="login">
        <div class="login__card">
            <img src={logo} alt="TouchSystems Logo" class="login__logo" />
            <h1 class="login__title">TouchSystems</h1>
            <p class="login__subtitle">{isRegister ? 'Create an account' : 'Sign in to access the dashboard'}</p>
            
            <form class="login__form" onsubmit={(e) => { e.preventDefault(); isRegister ? signUpWithEmail() : signInWithEmail(); }}>
                <input 
                    type="email" 
                    class="login__input" 
                    placeholder="Email" 
                    bind:value={email}
                    required 
                />
                <input 
                    type="password" 
                    class="login__input" 
                    placeholder="Password" 
                    bind:value={password}
                    required 
                />
                {#if isRegister}
                    <input 
                        type="password" 
                        class="login__input" 
                        placeholder="Confirm Password" 
                        bind:value={confirmPassword}
                        required 
                    />
                {/if}
                {#if error}
                    <p class="login__error">{error}</p>
                {/if}
                {#if message}
                    <p class="login__message">{message}</p>
                {/if}
                <button class="login__button login__button--primary" type="submit" disabled={loading}>
                    {loading ? (isRegister ? 'Creating account...' : 'Signing in...') : (isRegister ? 'Create account' : 'Sign in')}
                </button>
            </form>

            <p class="login__toggle">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button class="login__toggle-btn" type="button" onclick={toggleMode}>
                    {isRegister ? 'Sign in' : 'Register'}
                </button>
            </p>

            <div class="login__divider">
                <span>or</span>
            </div>

            <button class="login__button login__button--github" onclick={signInWithGitHub}>
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
        min-height: 90vh;
        background-color: #f5f5f5;
    }

    .login__card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-self: center;
        gap: 1rem;
        padding: 3rem;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
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

    .login__form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
    }

    .login__input {
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        width: 100%;
        box-sizing: border-box;
    }

    .login__input:focus {
        outline: none;
        border-color: #24292e;
    }

    .login__error {
        margin: 0;
        color: #dc3545;
        font-size: 0.875rem;
    }

    .login__message {
        margin: 0;
        color: #28a745;
        font-size: 0.875rem;
    }

    .login__button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
        width: 100%;
    }

    .login__button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .login__button--primary {
        background-color: #0066cc;
        color: white;
    }

    .login__button--primary:hover:not(:disabled) {
        background-color: #0052a3;
    }

    .login__button--github {
        background-color: #24292e;
        color: white;
    }

    .login__button--github:hover {
        background-color: #444d56;
    }

    .login__divider {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 1rem;
        color: #999;
    }

    .login__divider::before,
    .login__divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background-color: #ddd;
    }

    .login__toggle {
        margin: 0;
        color: #666;
        font-size: 0.875rem;
    }

    .login__toggle-btn {
        background: none;
        border: none;
        color: #0066cc;
        cursor: pointer;
        font-size: 0.875rem;
        padding: 0;
        text-decoration: underline;
    }

    .login__toggle-btn:hover {
        color: #0052a3;
    }
</style>