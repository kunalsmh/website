"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail } from "react-icons/hi";
import AsciiCat from "@/components/ascii-cat";
import DiscordBubble from "@/components/discord-bubble";

const LINKS = [
  { label: "GALLERY", href: "/gallery" },
];

const EMAIL = "hello@kunalsh.com";

const STEAM_PROFILE_URL = "https://steamcommunity.com/id/hiftiee/";
const SPOTIFY_PROFILE_URL = "https://open.spotify.com/user/hiftiee";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [showBasketFx, setShowBasketFx] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const appear = (delayClass: string) =>
    `${isReady ? `appear ${delayClass}` : "pre-appear"}`;

  return (
    <main className="min-h-screen bg-background px-8 py-16 md:px-28 md:py-[7.5rem]">
      <section className="mx-auto max-w-[1080px] md:grid md:grid-cols-[minmax(0,760px)_300px] md:items-start md:gap-6">
        <div className="max-w-[760px]">
          <div className={`${appear("appear-1")} mb-2`}>
            <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full border border-[color:var(--line)]">
              <Image
                src="/IMG_1216.png"
                alt="Kunal profile photo"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>

          <div className={`${appear("appear-2")} flex items-start gap-3`}>
            <h1 className="text-[58px] leading-[0.9] text-[color:var(--foreground)] md:text-[68px]">
              Kunal
            </h1>
            <p className="pt-2 text-[24px] leading-none text-[color:var(--muted)]">
              he/him
            </p>
          </div>

          <p
            className={`${appear("appear-3")} mt-3 max-w-[600px] text-[18px] leading-[1.3] font-normal [font-family:Georgia,serif] text-[color:var(--foreground)] md:text-[22px]`}
          >
            I like building things that probably didn&apos;t need to exist. Most
            of my free time is split between random tech experiments,{" "}
            <a
              href={STEAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[color:var(--line-strong)] underline-offset-2 transition-colors duration-200 hover:text-[#2b7bff]"
            >
              gaming
            </a>
            ,{" "}
            <a
              href={SPOTIFY_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[color:var(--line-strong)] underline-offset-2 transition-colors duration-200 hover:text-[#1DB954]"
            >
              music
            </a>
            , and{" "}
            <span className="basketball-word">
              <span
                onMouseEnter={() => setShowBasketFx(true)}
                onMouseLeave={() => setShowBasketFx(false)}
                onFocus={() => setShowBasketFx(true)}
                onBlur={() => setShowBasketFx(false)}
                className="basketball-word-trigger"
              >
                basketball
                {showBasketFx ? (
                  <>
                    <span className="basket-confetti confetti-1" aria-hidden="true">
                      🏀
                    </span>
                    <span className="basket-confetti confetti-2" aria-hidden="true">
                      🏀
                    </span>
                    <span className="basket-confetti confetti-3" aria-hidden="true">
                      🏀
                    </span>
                  </>
                ) : null}
              </span>
            </span>
            .
          </p>

          <div className={`${appear("appear-4")} mt-9 flex flex-wrap items-center gap-3`}>
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="border border-[color:var(--line-strong)] px-4 py-2 text-[14px] leading-none tracking-[0.05em] text-[color:var(--foreground)] transition-colors duration-200 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`mailto:${EMAIL}`}
              className="group relative inline-flex h-[34px] min-w-[88px] items-center justify-center border border-[color:var(--line-strong)] px-4 py-2 text-[14px] leading-none tracking-[0.05em] text-[color:var(--foreground)] transition-colors duration-200 hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)]"
              aria-label={`Email ${EMAIL}`}
              title={EMAIL}
            >
              <span className="transition-opacity duration-200 group-hover:opacity-0">
                EMAIL
              </span>
              <HiOutlineMail
                className="absolute h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className={`${appear("appear-4")} mt-5`}>
            <a
              href="https://github.com/kunalsmh"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[15px] text-[color:var(--foreground)] transition-colors duration-200 hover:text-[color:var(--muted)]"
            >
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                -&gt;
              </span>
              <span className="border-b border-[color:var(--line-strong)] pb-[2px]">
                view all projects
              </span>
            </a>
          </div>
        </div>

        <aside className={`${appear("appear-4")} mt-10 md:mt-3`}>
          <AsciiCat />
          <DiscordBubble />
        </aside>
      </section>
    </main>
  );
}
