<script lang="ts">
	import '../style.css';
    import { page } from '$app/stores';
    let { children } = $props();
</script>

<header>
    {#if $page.url.pathname === '/glossario'}
        <a href="/#documenti" class="nav">Documenti</a>
        <a href="/glossario" class="nav extra">Glossario</a>
    {:else}
        <a href="#documenti" class="nav extra">Documenti</a>
        <a href="/glossario" class="nav">Glossario</a>
    {/if}
	<h1 id="logo">
		<a href="https://codehex16.github.io/">
			<img src="./images/logo_extended_nobg.webp" alt="Logo di CodeHex16" width="200px" />
		</a>
	</h1>
	<a href="/#chi-siamo" class="nav extra">Chi siamo</a>
	<a href="/#contatti" class="nav extra">Contatti</a>
	<a href="https://github.com/CodeHex16/" class="nav"
		><img id="githublogo" src="images/github.svg" alt="github link" /></a
	>
</header>


{@render children()}
