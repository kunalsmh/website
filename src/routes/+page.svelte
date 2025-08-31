<script>
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	const links = [
		{ name: 'X', href: 'https://x.com/dihologist' },
		{ name: 'EMAIL', href: 'mailto:hello@kunalsh.com' },
		{ name: 'GITHUB', href: 'https://github.com/kunalsmh' },
		{ name: 'YOUTUBE', href: 'https://youtube.com/@hiftie' }
	];

	let showBox = false;
	let showText = false;
	let showLinks = false;

	/**
	 * @type {{ data: { discord_status: string; }; } | null}
	 */
	let presence = null;

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

		main();
	});

	const USER_ID = '853147823066578946';
	const API_URL = `http://localhost:4001/v1/users/${USER_ID}`;

	async function main() {
		try {
			const res = await fetch(API_URL);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			presence = data;
			console.log('Your presence data:', JSON.stringify(data, null, 2));
		} catch (err) {
			console.error('Error fetching presence:', err);
		}
	}
</script>

<div class="flex min-h-screen items-start justify-start p-12 text-white">
	<div class="max-w-lg space-y-6 text-[20px]">
		{#if showBox}
			<div class="h-6 w-6 bg-orange-600" in:scale={{ duration: 400 }}></div>
		{/if}

		{#if showText}
			<div class="text-wc space-y-1 font-normal" in:fade={{ duration: 400 }}>
				<p>
					I break
					<a
						href="https://github.com/kunalsmh"
						class="cursor-pointer no-underline transition-colors duration-300 hover:text-blue-500"
						target="_blank"
						rel="noopener noreferrer"
					>
						things
					</a>
					until they work
					{#if presence && presence.data.discord_status === 'online'}
						<span class="group relative ml-2 inline-flex size-3">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
							></span>
							<span class="relative inline-flex size-3 rounded-full bg-green-500"></span>

							<!-- Tooltip -->
							<span
								class="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
							>
								Currently Online
							</span>
						</span>
					{:else if presence && presence.data.discord_status === 'dnd'}
						<span class="group relative ml-2 inline-flex size-3">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
							></span>
							<span class="relative inline-flex size-3 rounded-full bg-red-500"></span>

							<!-- Tooltip -->
							<span
								class="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
							>
								Currently on DND
							</span>
						</span>
					{/if}
				</p>
				<p>
					Currently making
					<a
						href="https://github.com/heartpost"
						class="cursor-pointer text-blue-500 no-underline transition-colors duration-300"
						target="_blank"
						rel="noopener noreferrer"
					>
						@heartpost
					</a>
					and
					<a
						href="https://github.com/heartpost"
						class="cursor-pointer text-blue-500 no-underline transition-colors duration-300"
						target="_blank"
						rel="noopener noreferrer"
					>
						@drips.fit
					</a>
				</p>
				<p>Always down to talk ideas or cool projects</p>
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
