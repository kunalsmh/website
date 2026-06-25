"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { SiDiscord, SiInstagram, SiX } from "react-icons/si";

const PREFIX = "my socials:";
const INITIAL_DELAY = 3000;
const TYPING_DURATION = 1400;
const CHAR_MS = 38;

const SOCIALS: Array<{ label: string; href: string; icon: IconType }> = [
  { label: "X", href: "https://x.com/kunalsmh", icon: SiX },
  {
    label: "Instagram",
    href: "https://instagram.com/kunalsmh",
    icon: SiInstagram,
  },
  { label: "Discord", href: "https://discord.gg/hiftie", icon: SiDiscord },
];

export default function DiscordBubble() {
  const [visible, setVisible] = useState(false);
  const [typing, setTyping] = useState(true);
  const [text, setText] = useState("");
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), INITIAL_DELAY);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => setTyping(false), TYPING_DURATION);
    return () => window.clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (typing || !visible) return;
    if (text.length >= PREFIX.length) {
      const timer = window.setTimeout(() => setShowIcons(true), 180);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setText(PREFIX.slice(0, text.length + 1));
    }, CHAR_MS);

    return () => window.clearTimeout(timer);
  }, [typing, visible, text]);

  if (!visible) return null;

  return (
    <div className="cat-chat" aria-live="polite">
      <p className="cat-chat-tail" aria-hidden="true">
        ^
      </p>
      <div className="cat-chat-box">
        {typing ? (
          <span className="cat-chat-typing" aria-label="typing">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        ) : (
          <div className="cat-chat-content">
            <span className="cat-chat-text">
              {text}
              {!showIcons && text.length < PREFIX.length ? (
                <span className="cat-chat-cursor">_</span>
              ) : null}
            </span>
            {showIcons ? (
              <span className="cat-chat-icons">
                {SOCIALS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="cat-chat-icon"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
