<script>
  import { fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';

  const links = [
    { name: "X", href: "https://x.com/dihologist" },
    { name: "EMAIL", href: "mailto:hello@kunalsh.com" },
    { name: "GITHUB", href: "https://github.com/kunalsmh" },
    { name: "INSTAGRAM", href: "https://instagram.com/kunalsmh" }
  ];

  let showContent = false;
  /**
	 * @type {any[]}
	 */
  let showLinks = [];

  onMount(() => {
    showContent = true;

    links.forEach((_, i) => {
      setTimeout(() => {
        showLinks = [...showLinks, i];
      }, 50 + i * 100);
    });
  });
</script>

<div class="min-h-screen text-white flex items-start justify-start p-12">
  {#if showContent}
    <div class="space-y-6 max-w-lg text-[20px]">
      <div class="w-6 h-6 bg-orange-600" in:scale={{ duration: 400 }}></div>

      <div class="space-y-1 text-wc font-normal" in:fade={{ duration: 600 }}>
        <p>Hobbyist software developer from Mumbai, India.</p>
        <p>I like airplanes, tech, photography and gaming!</p>
        <p>Open to chat about new opportunities.</p>
      </div>

      <div class="flex flex-wrap gap-2">
        {#each links as link, i (link.name)}
          {#if showLinks.includes(i)}
            <a
              in:scale={{ duration: 400 }}
              class="px-4 py-1 text-sm border border-[#5C5C5C] text-white transition-colors duration-300 hover:text-blue-500 hover:border-blue-500"
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
  {/if}
</div>
