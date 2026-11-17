import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";

import emblem from "@/assets/branding/wingfoot.svg";
import { ActionButton, BronzeArrow } from "@/components";
import { Icon } from "@/components/icons/Icon";
import { HOME_PATH } from "@/routes/Routes";

import { creditsInventory } from "../domain/inventory";
import { CreditEntries, CreditLink, NoticeText } from "./components/content/CreditEntries";
import { CreditSection } from "./components/content/CreditSection";
import { SoftwareCredits } from "./components/content/SoftwareCredits";
import { CreditsBackdrop } from "./components/layout/CreditsBackdrop";

export function CreditsScreen() {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const previous = document.title;
    document.title = "Credits & licenses · Fall";
    title.current?.focus({ preventScroll: true });
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main
      aria-labelledby="credits-title"
      className="relative isolate flex h-dvh min-h-0 flex-col overflow-hidden bg-artwork-shadow text-artwork-foreground"
    >
      <CreditsBackdrop />
      <header className="relative z-10 shrink-0 px-[max(1rem,var(--safe-area-left))] pt-[max(1rem,var(--safe-area-top))] pb-3 sm:px-[max(2rem,var(--safe-area-left))]">
        <ActionButton
          tone="outline"
          nativeButton={false}
          role="link"
          render={<Link to={`${HOME_PATH}?settings=true`} state={{ focusCredits: true }} />}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Settings
        </ActionButton>
      </header>
      <div
        role="region"
        aria-label="Credits content"
        tabIndex={0}
        className="relative z-0 min-h-0 flex-1 [scrollbar-color:var(--gold)_var(--artwork-shadow)] overflow-y-auto overscroll-contain pr-[max(1.25rem,var(--safe-area-right))] pb-[max(3rem,var(--safe-area-bottom))] pl-[max(1.25rem,var(--safe-area-left))] outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-ring"
      >
        <div className="mx-auto w-full max-w-2xl py-6 text-center sm:py-10">
          <h1
            id="credits-title"
            ref={title}
            tabIndex={-1}
            className="artwork-title text-2xl outline-none sm:text-3xl"
          >
            Credits & licenses
          </h1>
          <div className="my-7 flex items-center justify-center gap-4 sm:my-10 sm:gap-6">
            <Icon icon={emblem} className="size-8 text-gold sm:size-12" />
            <span className="artwork-title text-6xl sm:text-8xl">Fall</span>
          </div>
          <CreditSection title="Created by">
            <p className="text-3xl sm:text-4xl">{creditsInventory.project.creator}</p>
            <CreditLink href={creditsInventory.project.source}>Fall project</CreditLink>
          </CreditSection>
          <CreditSection title="Artwork & sound">
            <CreditEntries entries={creditsInventory.artwork} />
          </CreditSection>
          <CreditSection title="Icons">
            <p className="mb-10 leading-relaxed">
              Icons from <CreditLink href="https://game-icons.net">Game-icons.net</CreditLink>. Fall
              applies its own colors. The Help icon uses project-drawn geometry.
            </p>
            <CreditEntries entries={creditsInventory.icons} />
          </CreditSection>
          <CreditSection title="Typography">
            <CreditEntries entries={creditsInventory.fonts} fullNotices />
          </CreditSection>
          <CreditSection title="Open-source software">
            <SoftwareCredits />
          </CreditSection>
          <CreditSection title="Legal notices">
            <h3 className="text-xl font-normal">Fall software · MIT License</h3>
            <NoticeText>{creditsInventory.project.notice}</NoticeText>
            <p className="mt-6 text-sm leading-relaxed">
              The software license applies to the project code. Third-party assets and dependencies
              retain their respective terms, listed above.
            </p>
          </CreditSection>
          <BronzeArrow tone="faded" className="mx-auto h-0.5 w-full" />
          <p className="pt-10 text-xl italic">With thanks to our players</p>
        </div>
      </div>
    </main>
  );
}
