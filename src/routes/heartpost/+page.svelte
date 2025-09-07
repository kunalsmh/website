<svelte:head>
	<title>Digital mailbox but 10x more inconvenient</title>
	<meta name="description" content="A small letterbox with a screen that displays short messages" />
</svelte:head>

<script>
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	const links = [
		{ name: 'VIEW CODE', href: 'https://github.com/orgs/heartpost/repositories' },
		{ name: 'SEND A TIP', href: 'https://github.com/sponsors/kunalsmh' }
	];

	let showBox = false;
	let showText = false;
	let showLinks = false;

	onMount(() => {
		setTimeout(() => {
			showBox = true;

			setTimeout(() => {
				showText = true;

				setTimeout(() => {
					showLinks = true;
				}, 300);
			}, 400);
		}, 100);
	});
</script>

<div class="flex min-h-screen items-start justify-start p-12 text-white">
	<div class="max-w-lg space-y-6 text-[20px]">
		{#if showBox}
			<div class="flex items-center space-x-4" in:scale={{ duration: 400 }}>
				<!-- Orange box -->
				<div class="h-6 w-6 bg-orange-600"></div>
				
				<!-- Breadcrumb -->
				<nav class="text-sm opacity-70">
					<a href="/" class="hover:text-blue-500">Home</a> / <span>Heartpost</span>
				</nav>
			</div>
		{/if}

		{#if showText}
			<div class="text-wc space-y-1 font-normal" in:fade={{ duration: 400 }}>
				<p>Heartpost is a small physical letterbox that uses WiFi to display short messages on its screen. The project itself isn’t technically complex, but it carries an important story.</p>
                <br>
                <p>My mom works at a job where phones aren’t allowed, which makes it hard for us to talk. I built this device so that the messages I send will appear on a little screen inside the letterbox. This way, we always feel connected.</p>
                <br>
                <p>After all, there’s only about a year left before I leave her and move out for university.</p>
                <br>
                <p class="text-xs opacity-50">Inspired by Owen. I waited for it to launch, but it never did - so I made my own!</p>
			</div>
		{/if}

		<div class="flex flex-wrap gap-2">
			{#each links as link, i (link.name)}
				{#if showLinks}
					<a
						in:scale={{ duration: 300, delay: i * 100 }}
						class="border border-[#5C5C5C] px-4 py-1 text-sm text-white transition-colors duration-300 hover:border-blue-500 hover:text-blue-500"
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
					>
						{link.name}
					</a>
				{/if}
			{/each}
		</div>
	</div>
</div>

