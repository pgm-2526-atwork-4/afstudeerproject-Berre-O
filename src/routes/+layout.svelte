<script lang="ts">
    import logo from '$lib/assets/touchsystems.png';
    import '$lib/styles/_main.css';
    import { page } from '$app/stores';
    import { invalidate } from '$app/navigation';
    import { onMount, setContext } from 'svelte';
    import { createBrowserClient } from '@supabase/ssr';
    import { goto } from '$app/navigation';

    let { children, data } = $props();

    const supabase = createBrowserClient(data.supabase.url, data.supabase.anonKey);
    
    setContext('supabase', supabase);

    let isMobileMenuOpen = $state(false);

    onMount(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                invalidate('supabase:auth');
            }
        });

        return () => subscription.unsubscribe();
    });

    async function signOut() {
        await supabase.auth.signOut();
        window.location.href = '/';
    }
    function closeMobileMenu() {
        isMobileMenuOpen = false;
    }
</script>

<svelte:head>
    <meta name="theme-color" content="#ffffff" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="TouchSystems" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{#if data.session && data.profile?.status !== "rejected"}

<header class="header">
    <div class="header__left">
        {#if data.session && data.profile?.status === "approved"}
            <button class="button button--menu-toggle" onclick={() => isMobileMenuOpen = !isMobileMenuOpen}>
                <i class="fa-solid fa-bars"></i>
            </button>
        {/if}

        <div class="logo-container">
            <img
            src={logo}
            alt="TouchSystems Logo"
            class="logo"
            onclick={() => goto(`/`)}
            />
            <h1 class="header__title">Touch<span class="header__title--small">Systems</span></h1>
        </div>
    </div>

    {#if data.profile?.admin}
    <a href="/clients/new" class="button button--primary">
        <i class="fa-solid fa-plus"></i>
        <span class="button__text">Add client</span>
    </a>
    {/if}
</header>

{/if}

{#if data.session && data.profile?.status === "approved"}
<div class="devider">

    {#if isMobileMenuOpen}
        <div class="backdrop" onclick={closeMobileMenu} onkeydown={(e) => e.key === 'Escape' && closeMobileMenu()} role="button" tabindex="0"></div>
    {/if}

    <aside class="aside" class:aside--open={isMobileMenuOpen}>
        <nav class="nav">
            <ul class="list list--nav">
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/dashboard"}>
                    <a href="/dashboard" class="link link--nav" data-sveltekit-preload-data onclick={closeMobileMenu}>
                        <i class="fa-solid fa-border-all"></i> Dashboard
                    </a>
                </li>
    
                <li class="list__item list__item--nav" class:active={$page.url.pathname.startsWith("/search")}>
                    <a href="/search" class="link link--nav" data-sveltekit-preload-data onclick={closeMobileMenu}>
                        <i class="fa-solid fa-magnifying-glass"></i> Search
                    </a>
                </li>
                {#if data.profile?.admin}
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/statistics"}>
                    <a href="/statistics" class="link link--nav" data-sveltekit-preload-data onclick={closeMobileMenu}><i class="fa-solid fa-chart-line"></i>Statistics</a>
                </li>
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/logs"}>
                    <a href="/logs" class="link link--nav" data-sveltekit-preload-data onclick={closeMobileMenu}><i class="fa-solid fa-clock-rotate-left"></i>Logs</a>
                </li>
                <li class="list__item list__item--nav" class:active={$page.url.pathname.startsWith("/users")}>
                    <a href="/users" class="link link--nav" data-sveltekit-preload-data onclick={closeMobileMenu}><i class="fa-solid fa-user"></i>Users</a>
                </li>
                {/if}
            </ul>
        </nav>

        <div class="auth">
            {#if data.session}
                <button onclick={signOut} class="button button--auth"><i class="fa-solid fa-right-from-bracket"></i>Sign Out</button>   
            {/if}
        </div>
    </aside>
    
    <main class="main">
    {@render children()}
    </main>
</div>
{:else}
    {@render children()}
{/if}

<style>
    :global(body, html) {
        margin: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header {
        display: flex;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.411);
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        max-height: 7rem;
        padding: 1rem;
        z-index: 20;
        flex-shrink: 0;
        background: white;
    }

    .header__left {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .button--menu-toggle {
        display: none;
        font-size: 1rem;
        padding: 0.5rem;
        color: #333;
    }

    .header__title--small {
        font-style: normal;
        font-weight: 200;
    }

    .header__title {
        font-weight: 600;
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .logo {
        width: 4rem;
        height: 4rem;
        cursor: pointer;
    }

    .devider {
        display: flex;
        flex: 1;
        min-height: 0;
        position: relative;
    }

    .aside {
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        flex-shrink: 0;
        overflow-y: auto;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        z-index: 10;
        background: white;
        transition: transform 0.3s ease-in-out;
    }

    .nav {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0;
        margin: 0;
        list-style: none;
    }

    .link--nav {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: inherit;
        white-space: nowrap;
    }

    .list__item--nav:hover {
        background-color: var(--color-secondary);
        border-radius: 0.5rem;
    }

    .list__item--nav:hover a {
        color: var(--color-primary);
        font-weight: 400;
        font-style: normal;
    }

    .active {
        background-color: var(--color-secondary);
        border-radius: 0.5rem;
    }

    .active a {
        color: var(--color-primary);
    }

    .main {
        flex: 1;
        overflow: auto;
        background-color: var(--color-primary-accent);
        padding: 1rem;
    }

    .auth {
        border-top: 1px solid var(--color-secondary);
        width: 100%;
        margin-top: 1rem;
    }

    .button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .button--primary {
        color: var(--color-primary);
        background-color: var(--color-secondary);
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
    }

    .button--auth {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 1rem;
        width: 100%;
        color: inherit;
    }

    .fa-solid {
        font-size: 0.9rem;
    }

    .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 5;
    }

    @media (max-width: 768px) {
        .button--menu-toggle {
            display: block;
        }

        .logo {
            width: 2.5rem;
            height: 2.5rem;
        }

        .header__title {
            font-size: 1.2rem;
        }

        .logo-container {
            gap: 0.75rem;
        }

        .button__text {
            display: none;
        }

        .button--primary {
            padding: 0.75rem;
            border-radius: 50%;
        }

        .aside {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            transform: translateX(-100%);
            width: 250px;
            box-sizing: border-box;
        }

        .aside--open {
            transform: translateX(0);
        }
    }
</style>