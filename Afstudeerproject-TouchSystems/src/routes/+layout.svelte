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
</script>

<header class="header">
    <div class="logo-container">
        <img
        src={logo}
        alt="TouchSystems Logo"
        class="logo"
        onclick={() => goto(`/`)}
        />
        <h1 class="header__title">Touch<span class="header__title--small">Systems</span></h1>
    </div>

    {#if data.profile?.admin}
    <a href="/clients/new" class="button button--primary"><i class="fa-solid fa-plus"></i> Add client</a>
    {/if}
</header>

{#if data.session}

<div class="devider">
    <aside class="aside">
        <nav class="nav">
            <ul class="list list--nav">
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/dashboard"}>
                    <a href="/dashboard" class="link link--nav" data-sveltekit-preload-data>
                        <i class="fa-solid fa-border-all"></i> Dashboard
                    </a>
                </li>
    
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/search"}>
                    <a href="/search" class="link link--nav" data-sveltekit-preload-data>
                        <i class="fa-solid fa-magnifying-glass"></i> Search
                    </a>
                </li>
                {#if data.profile?.admin}
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/statistics"}><a href="/statistics" class="link link--nav" data-sveltekit-preload-data><i class="fa-solid fa-chart-line"></i>Statistics</a></li>
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/logs"}><a href="/logs" class="link link--nav" data-sveltekit-preload-data><i class="fa-solid fa-clock-rotate-left"></i>Logs</a></li>
                <li class="list__item list__item--nav" class:active={$page.url.pathname === "/users"}><a href="/users" class="link link--nav" data-sveltekit-preload-data><i class="fa-solid fa-user"></i>Users</a></li>
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
    .header {
        display: flex;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.411);
		align-items: center;
        justify-content: space-between;
		gap: 2rem;
        max-height: 7rem;
        padding: 1rem;
        z-index: 10;
        flex-shrink: 0;
    }

	.header__title--small {
		font-style: normal;
		font-weight: 200;
	}

	.header__title {
		font-weight: 600;
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

        z-index: 1;
    }

    .nav {
        display: flex;
        flex-direction: column;
    }

	.link--nav {
		display: flex;
		gap: 0.5rem;
		align-items: center;
        padding: 0.5rem 1rem;
	}

    .list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

	.list__item--nav:hover {
		background-color: var(--color-secondary);
		border-radius: 0.5rem;
		a {
			color: var(--color-primary);
			font-weight: 400;
			font-style: normal;
		}
	}

    .active {
        background-color: var(--color-secondary);
        border-radius: 0.5rem;
        a {
        color: var(--color-primary);
        }
    }

    .devider {
        display: flex;
        flex: 1;
        min-height: 0;
    }

    .main {
        flex: 1;
        overflow: auto;
        background-color: var(--color-primary-accent);
        padding: 1rem;
    }

    .logo {
		margin-left: 1rem;
        width: 5rem;
        height: 5rem;
        margin-right: 1rem;
        cursor: pointer;
    }

    .logo-container {
        padding-left: 0.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

	.auth {
		border-top: 1px solid var(--color-secondary);
		width: 100%;
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
    }

	.button--auth {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 1rem;
	}
</style>
