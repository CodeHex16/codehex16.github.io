<script lang="ts">
	import { navigating } from '$app/stores';
	import { type PersonaGruppo, type DocData } from '$lib/types';
	import type { PageData } from '$lib/types';
	const persone: PersonaGruppo[] = [
		{
			nome: 'Matteo Bazzan',
			github: 'bazz333',
			mail: 'matteo.bazzan.1@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/81026315?v=4&size=96'
		},
		{
			nome: 'Luca Ribon',
			github: 'lucaribon',
			mail: 'luca.ribon@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/64131696?v=4&size=96'
		},
		{
			nome: 'Filippo Sabbadin',
			github: 'fliposab',
			mail: 'filippo.sabbadin.4@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/102372402?v=4&size=96'
		},
		{
			nome: 'Francesco Fragonas',
			github: 'FraFra0304',
			mail: 'francesco.fragonas@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/74560538?v=4&size=96'
		},
		{
			nome: 'Gabriele Magnelli',
			github: 'GabryMagno',
			mail: 'gabrieleisacco.magnelli@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/153952005?s=64&v=4'
		},
		{
			nome: 'Yi Hao Zhuo',
			github: 'Whyle',
			mail: 'yihao.zhuo@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/18526088?s=96&v=4'
		},
		{
			nome: 'Luca Rossi',
			github: 'faffabucco',
			mail: 'luca.rossi.24@studenti.unipd.it',
			avatar: 'https://avatars.githubusercontent.com/u/185925303?s=96&v=4'
		}
	];

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>CodeHex16</title>
</svelte:head>
<main>
	<article id="documenti">
		<h2>Documenti 📑</h2>
		{#if $navigating}
			<p>Caricamento...</p>
		{:else}
			<h3>Verbali</h3>
			<div id="verbali">
				<div id="interni">
					<h4>Interni</h4>
					<ul class="link-file">
						{#each data.verbali_interni as verbale}
							<li>
								<a href="/docs/{verbale.path}" target="_blank" class="file-link">{verbale.nome}</a>
								{#if verbale.data != ''}
									<span class="file-date">{verbale.data}</span>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
				<div id="esterni">
					<h4>Esterni</h4>
					<ul class="link-file"></ul>
				</div>
			</div>
			<h3>Candidatura</h3>
			<div id="candidatura">
				<ul class="link-file"></ul>
			</div>
			<h3><abbr title="Requirements and Technology Baseline">RTB</abbr></h3>
			<div id="rtb">
				<ul class="link-file"></ul>
			</div>
		{/if}
	</article>
	<article id="chi-siamo">
		<h2>Chi siamo</h2>
		<p>
			Siamo <strong>CodeHex16</strong>, il gruppo 16 del Progetto di SWE dell'Università degli Studi
			di Padova
		</p>
		<hr />
		<div id="persone">
			{#each persone as persona}
				<div class="persona">
					<img src={persona.avatar} alt="Foto profilo {persona.nome}" />
					<div>
						<a class="github_account" href="https://github.com/{persona.github}">{persona.nome}</a>
						<a href="mailto:{persona.mail}" class="mail">{persona.mail}</a>
					</div>
				</div>
			{/each}
		</div>
	</article>
	<article id="contatti">
		<h2>Contatti</h2>
		<p>
			Per contattarci scrivere a
			<a href="mailto:unipd.codehex16@gmail.com">unipd.codehex16@gmail.com</a>
		</p>
	</article>
</main>
