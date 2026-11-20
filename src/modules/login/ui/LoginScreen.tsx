import { cn } from "cn";
import gsap from "gsap";
import { useId, useRef } from "react";
import { useNavigate } from "react-router";

import appEmblem from "@/assets/branding/wingfoot.svg";
import mailIcon from "@/assets/lobby/card-hall/icons/envelope.svg";
import coinSuit from "@/assets/lobby/card-hall/icons/two-coins.svg";
import swordSuit from "@/assets/login/icons/crossed-swords.svg";
import cupSuit from "@/assets/login/icons/jeweled-chalice.svg";
import passwordIcon from "@/assets/login/icons/padlock.svg";
import seatIcon from "@/assets/login/icons/plain-arrow.svg";
import clubSuit from "@/assets/login/icons/wood-club.svg";
import { ActionButton, ArrowDivider, BronzeArrow, FramedCard, TextInput } from "@/components";
import { Icon } from "@/components/icons/Icon";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";
import { HOME_PATH } from "@/routes/Routes";

import { useGSAP } from "@gsap/react";

import { LoginAtmosphere } from "./LoginAtmosphere";
import { ProviderIcon } from "./ProviderIcon";

const suitIcons = [coinSuit, cupSuit, swordSuit, clubSuit];

const credentialInputClass = "h-[clamp(2.75rem,12dvh,3.25rem)] text-base xl:h-12 xl:text-sm";

const staticButtonClass = "transition-none active:not-aria-[haspopup]:translate-y-0";
const cardLinkClass = cn(staticButtonClass, "h-6 px-0 text-foreground");

export function LoginScreen() {
  const reducedMotion = useReducedMotion();
  const formId = useId();
  const navigate = useNavigate();
  const screenRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia || reducedMotion) return;
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power2.out", clearProps: "opacity,transform" } })
          .from(".login-intro > *", { opacity: 0, y: 18, duration: 0.85, stagger: 0.09 })
          .from(cardRef.current, { opacity: 0, y: 24, duration: 1 }, 0.15);
      });
      return () => motion.revert();
    },
    { scope: screenRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <main
      ref={screenRef}
      className="login-screen h-dvh scroll-pt-[calc(var(--safe-area-top)+0.5rem)] scroll-pb-[calc(var(--safe-area-bottom)+0.5rem)] overflow-x-hidden overflow-y-auto overscroll-contain bg-artwork-shadow before:pointer-events-none before:fixed before:inset-x-0 before:top-px before:z-20 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-gold/65 before:to-transparent after:pointer-events-none after:fixed after:inset-x-0 after:bottom-px after:z-20 after:h-0.5 after:bg-linear-to-r after:from-transparent after:via-gold/65 after:to-transparent"
    >
      <div className="login-stage relative isolate flex min-h-full items-center justify-center pt-[calc(var(--login-y)+var(--safe-area-top))] pr-[calc(var(--login-x)+var(--safe-area-right))] pb-[calc(var(--login-y)+var(--safe-area-bottom))] pl-[calc(var(--login-x)+var(--safe-area-left))] [--login-x:1.5rem] [--login-y:0.5rem] xl:[--login-x:2.5rem] xl:[--login-y:1.5rem]">
        <LoginAtmosphere />
        <div className="relative z-10 grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(0,3fr)] items-center gap-6 xl:max-w-5xl xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-20">
          <section
            aria-labelledby="login-title"
            className="login-intro min-w-0 space-y-4 text-artwork-foreground [text-shadow:0_1px_4px_var(--artwork-shadow)] xl:space-y-7"
          >
            <p className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.16em] text-gold uppercase xl:gap-3 xl:text-xs xl:tracking-[0.24em]">
              <BronzeArrow className="w-6 shrink-0 xl:w-10" />
              The classic. Reimagined.
            </p>
            <h1
              id="login-title"
              className="text-2xl leading-[1.15] [text-shadow:none] xl:text-6xl 2xl:text-7xl"
            >
              Every hand
              <br />{" "}
              <span className="login-title-gradient inline-block bg-linear-to-r from-primary from-10% to-orange-500 bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-[CanvasText]">
                A new story.
              </span>
            </h1>
            <p className="relative max-w-md pl-3 text-sm xl:pl-5 xl:text-lg">
              <BronzeArrow direction="down" className="absolute inset-y-0 left-0" />
              Beyond the mist, a new challenge awaits.
              <span className="hidden xl:inline">
                {" "}
                Outwit your rivals, claim the table, and let every hand write your legend.
              </span>
            </p>
            <div className="hidden flex-wrap items-center gap-3 text-sm xl:flex">
              <span className="flex shrink-0 -space-x-2" aria-hidden="true">
                {suitIcons.map((icon) => (
                  <span
                    key={icon}
                    className="login-suit-symbol flex size-10 items-center justify-center rounded-full border border-gold/55 bg-artwork-shadow text-artwork-foreground shadow-sm"
                  >
                    <Icon icon={icon} className="size-5" />
                  </span>
                ))}
              </span>
              <p>
                <span className="font-semibold">40 cards.</span> Countless possibilities.
              </p>
            </div>
          </section>

          <FramedCard
            ref={cardRef}
            className="login-card relative w-full min-w-0 [--card-spacing:clamp(1rem,calc(12dvh-1.5rem),2rem)] xl:[--card-spacing:--spacing(6)]"
          >
            <CardHeader className="flex items-center justify-center justify-items-center gap-3 pt-0 text-center xl:grid xl:pt-2">
              <span className="mb-0 flex size-[clamp(2rem,10dvh,2.75rem)] shrink-0 items-center justify-center rounded-full border border-gold/60 bg-linear-to-b from-secondary to-card text-muted-foreground shadow-sm xl:mb-1 xl:size-16">
                <Icon icon={appEmblem} className="size-5 sm:size-6 xl:size-8" />
              </span>
              <h2 className="text-2xl xl:text-3xl">The Fall</h2>
            </CardHeader>

            <CardContent className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-6 xl:grid-cols-1">
              <form
                aria-label="Login preview"
                className="grid grid-cols-1 gap-[clamp(1rem,calc(8dvh-0.5rem),2rem)] xl:gap-5"
                noValidate
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="min-w-0 space-y-2">
                  <Label htmlFor={`${formId}-email`}>Email address</Label>
                  <TextInput
                    id={`${formId}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    leadingIcon={<Icon icon={mailIcon} className="size-4" />}
                    className={credentialInputClass}
                  />
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`${formId}-password`}>Password</Label>
                    <Button type="button" variant="link" size="xs" className={cardLinkClass}>
                      Forgot password?
                    </Button>
                  </div>
                  <TextInput
                    id={`${formId}-password`}
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    leadingIcon={<Icon icon={passwordIcon} className="size-4" />}
                    className={credentialInputClass}
                  />
                </div>

                <ActionButton
                  type="button"
                  tone="primary"
                  className="h-[clamp(2.75rem,12dvh,3.25rem)] w-full xl:min-h-12"
                  onClick={() => navigate(HOME_PATH)}
                >
                  Take your seat
                  <Icon icon={seatIcon} className="size-4 -rotate-90" />
                </ActionButton>
              </form>

              <div className="login-alternatives flex min-w-0 flex-col justify-center rounded-md bg-muted/30 p-4 xl:flow-root xl:bg-transparent xl:p-0">
                <ArrowDivider className="mt-0 mb-3 justify-center xl:my-7 [&>span[aria-hidden]]:hidden xl:[&>span[aria-hidden]]:block">
                  <span className="shrink-0 text-xs text-muted-foreground">Or continue with</span>
                </ArrowDivider>
                <div
                  className="grid grid-cols-[repeat(2,auto)] justify-center gap-4 xl:flex"
                  role="group"
                  aria-label="Social sign-in preview"
                >
                  {(["google", "apple", "microsoft", "facebook"] as const).map((provider) => {
                    const name = provider.charAt(0).toUpperCase() + provider.slice(1);
                    return (
                      <ActionButton
                        key={provider}
                        type="button"
                        tone="outline"
                        iconOnly
                        className={cn(
                          staticButtonClass,
                          "text-muted-foreground size-[clamp(2.75rem,12dvh,3.5rem)] xl:size-12",
                        )}
                        aria-label={`Continue with ${name}`}
                        title={`Continue with ${name}`}
                      >
                        <ProviderIcon provider={provider} />
                      </ActionButton>
                    );
                  })}
                </div>
                <CardFooter className="mt-4 flex-col px-0 text-center xl:mt-6">
                  <p className="flex flex-col items-center text-sm text-muted-foreground xl:block">
                    New to the table?{" "}
                    <Button type="button" variant="link" className={cardLinkClass}>
                      Create account
                    </Button>
                  </p>
                </CardFooter>
              </div>
            </CardContent>
          </FramedCard>
        </div>
      </div>
    </main>
  );
}
