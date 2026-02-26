<script lang="ts">
	import logo from '$lib/assets/touchsystems.png';
	import '$lib/styles/_main.css';
	import { page } from '$app/stores';

	let { children } = $props();

</script>

<header class="header">
	<img src={logo} alt="TouchSystems Logo" class="logo"/>
	<h1>TouchSystems</h1>
</header>

<div class="devider">
	<aside class="aside">
		<nav class="nav">
			<ul class="list list--nav">
				<li class="list__item list__item--nav" class:active={$page.url.pathname === "/"}><a href="/">Dashboard</a></li>
				<li class="list__item list__item--nav" class:active={$page.url.pathname === "/search"}><a href="/search">Search</a></li>
				<li class="list__item list__item--nav" class:active={$page.url.pathname === "/statistics"}><a href="/statistics">Statistics</a></li>
				<li class="list__item list__item--nav" class:active={$page.url.pathname === "/logs"}><a href="/logs">Logs</a></li>
			</ul>
		</nav>
	</aside>
	
	<main class="main">
	{@render children()}
	</main>
</div>

<style>
	.header {
		display: flex;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.411);
		max-height: 7rem;
		padding: 1rem;
		z-index: 10;
		flex-shrink: 0;
	}

	.aside {
		width: 8rem;
		min-height: auto;
		display: flex;
		flex-shrink: 0;

		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
		padding-left: 1rem;
		padding-top: 1rem;

		z-index: 1;
	}

	.nav {
		display: flex;
		flex-direction: column;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.list__item--nav {
		padding: 0.25rem 1rem;
	}

	.active {
		background-color: pink;
		border-radius: 0.5rem;
	}

	.devider {
		display: flex;
		flex: 1;
		height: 100%;
	}

	.main {
		flex: 1;
		overflow: auto;
		background-color: whitesmoke;
		padding: 1rem;
	}

	.logo {
		width: 4rem;
		height: 4rem;
		margin-right: 1rem;
	}
</style>
