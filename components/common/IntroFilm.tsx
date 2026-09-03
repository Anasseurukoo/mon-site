"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const KEY = "bba:intro:v07";

export function IntroFilm() {
  // Server and the client's first paint must both render "closed" — neither
  // has access to sessionStorage/the URL — or React throws a hydration
  // mismatch (server renders the Hero <section>, client renders this overlay
  // <div> instead) and is forced to discard and re-render the whole tree,
  // which briefly showed a broken/erroring page on every fresh visit.
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Deliberate exception to the "no setState in an effect body" guidance:
    // this effect's whole job is reading two external systems that do not
    // exist on the server (sessionStorage, location.search) and syncing that
    // into React state once the client is live — there is no way to know
    // whether the intro should play before this point. See the note above
    // for why the alternative (a lazy useState initializer) is broken.
    const force = new URLSearchParams(window.location.search).get("intro") === "1";
    const already = sessionStorage.getItem(KEY) === "seen";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (force || (!already && !reduceMotion)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [show]);

  const close = () => {
    sessionStorage.setItem(KEY, "seen");
    setLeaving(true);
    window.setTimeout(() => {
      setShow(false);
      setLeaving(false);
      document.documentElement.style.overflow = "";
    }, 850);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-[850ms] ${leaving ? "opacity-0" : "opacity-100"}`}
      aria-label="BuiltByAnas cinematic entrance"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/hero/japanese-identity-hero.mp4"
        poster="/assets/hero/japanese-identity-poster.jpg"
        autoPlay
        muted
        playsInline
        preload="metadata"
        onEnded={close}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.02)_48%,rgba(0,0,0,.52))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center px-5 sm:bottom-9">
        <div className="relative h-16 w-60 opacity-95 sm:h-20 sm:w-80">
          <Image
            src="/assets/brand/builtbyanas-dojo-logo-transparent.png"
            alt="BuiltByAnas Digital Dojo"
            fill
            priority
            sizes="320px"
            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,.8)]"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={close}
        className="absolute right-4 top-4 border border-white/20 bg-black/35 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-white/75 backdrop-blur-md transition hover:border-gold/60 hover:text-white sm:right-6 sm:top-6"
      >
        SKIP
      </button>
    </div>
  );
}
