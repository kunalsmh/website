<script>
  import { fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';

  const links = [
    { name: "X", href: "https://x.com/dihologist" },
    { name: "EMAIL", href: "mailto:hello@kunalsh.com" },
    { name: "GITHUB", href: "https://github.com/kunalsmh" },
    { name: "YOUTUBE", href: "https://youtube.com/hiftie" }
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
        }, 300); // delay before links start popping
      }, 400); // delay before text fades in
    }, 100); // initial small delay
  });
</script>

<div class="min-h-screen text-white flex items-start justify-start p-12">
  <div class="space-y-6 max-w-lg text-[20px]">

    {#if showBox}
      <div class="w-6 h-6 bg-orange-600" in:scale={{ duration: 400 }}></div>
    {/if}

    {#if showText}
      <div class="space-y-1 text-wc font-normal" in:fade={{ duration: 400 }}>
        <p>
          Hobbyist software 
          <a
            href="https://github.com/kunalsmh"
            class="hover:text-blue-500 transition-colors duration-300 cursor-pointer no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            developer
          </a> and 
          <a
            href="https://youtube.com/@hiftie"
            class="hover:text-blue-500 transition-colors duration-300 cursor-pointer no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            videographer
          </a>.
        </p>
        <p>I like coding, travelling, airplanes and gaming!</p>
        <p>Open to talk about new opportunities.</p>
      </div>
    {/if}

    <div class="flex flex-wrap gap-2">
      {#each links as link, i (link.name)}
        {#if showLinks}
          <a
            in:scale={{ duration: 300, delay: i * 100 }}
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
</div>