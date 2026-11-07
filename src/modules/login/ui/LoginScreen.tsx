import gsap from "gsap";
import { ArrowRight, CircleDot, Club, LockKeyhole, Mail, Shield, Swords, Wine } from "lucide-react";
import { useId, useRef } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HOME_PATH } from "@/routes/Routes";

import { useGSAP } from "@gsap/react";

import { LoginAtmosphere } from "./LoginAtmosphere";
import { ProviderIcon } from "./ProviderIcon";
import "./login.css";

export function LoginScreen() {
  const formId = useId();
  const navigate = useNavigate();
  const screenRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!window.matchMedia) return;
      const motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power2.out", clearProps: "opacity,transform" } })
          .from(".login-intro > *", { opacity: 0, y: 18, duration: 0.85, stagger: 0.09 })
          .from(".login-card", { opacity: 0, y: 24, duration: 1 }, 0.15);
      });
      return () => motion.revert();
    },
    { scope: screenRef },
  );

  return (
    <main
      ref={screenRef}
      className="login-screen h-dvh scroll-py-2 overflow-x-hidden overflow-y-auto overscroll-contain motion-reduce:**:transition-none"
    >
      <div className="login-stage relative isolate flex min-h-full items-center justify-center px-4 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-6 max-xl:landscape:px-6 max-xl:landscape:py-2">
        <LoginAtmosphere />
        <div className="relative z-10 grid w-full max-w-md items-center gap-6 sm:max-w-lg sm:gap-8 lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-20 max-xl:landscape:max-w-6xl max-xl:landscape:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] max-xl:landscape:gap-6 max-sm:landscape:grid-cols-1">
          <section
            aria-labelledby="login-title"
            className="login-intro min-w-0 space-y-3 sm:space-y-5 lg:space-y-7 max-xl:landscape:space-y-4 max-sm:landscape:hidden"
          >
            <p className="flex items-center gap-2 text-[0.625rem] font-semibold tracking-[0.2em] text-primary uppercase sm:gap-3 sm:text-xs sm:tracking-[0.24em] max-xl:landscape:gap-2 max-xl:landscape:text-[0.625rem] max-xl:landscape:tracking-[0.16em]">
              <span
                className="h-px w-6 shrink-0 bg-primary sm:w-10 max-xl:landscape:w-6"
                aria-hidden="true"
              />
              The classic. Reimagined.
            </p>
            <h1
              id="login-title"
              className="font-heading text-3xl leading-[1.15] font-bold lg:text-5xl xl:text-6xl 2xl:text-7xl sm:portrait:text-5xl max-xl:landscape:text-2xl"
            >
              Every hand.
              <br />
              <span className="login-title-gradient inline-block bg-linear-to-r from-primary from-10% to-[#ff6a00] bg-clip-text text-transparent forced-colors:bg-none forced-colors:text-primary">
                A new story.
              </span>
            </h1>
            <p className="hidden max-w-md border-l border-primary/60 pl-4 text-sm leading-relaxed lg:block lg:pl-5 lg:text-base xl:text-lg max-xl:landscape:pl-3 max-xl:landscape:text-sm sm:landscape:block">
              Beyond the mist, a new challenge awaits.
              <span className="max-xl:landscape:hidden">
                {" "}
                Outwit your rivals, claim the table, and let every hand write your legend.
              </span>
            </p>
            <div className="hidden flex-wrap items-center gap-3 text-sm lg:flex max-xl:landscape:hidden">
              <span className="flex shrink-0 -space-x-2" aria-hidden="true">
                {[
                  { Icon: CircleDot, name: "Coins" },
                  { Icon: Wine, name: "Cups" },
                  { Icon: Swords, name: "Swords" },
                  { Icon: Club, name: "Clubs" },
                ].map(({ Icon, name }) => (
                  <span
                    key={name}
                    className="login-suit-symbol flex size-10 items-center justify-center rounded-full border border-primary/30 bg-card text-primary shadow-sm"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                ))}
              </span>
              <p>
                <span className="font-semibold">40 cards.</span> Countless possibilities.
              </p>
            </div>
          </section>

          <Card className="login-card relative w-full min-w-0 shadow-2xl [--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(5)] xl:[--card-spacing:--spacing(6)] max-xl:landscape:[--card-spacing:clamp(1rem,calc(12dvh-1.5rem),2rem)]">
            <CardHeader className="justify-items-center gap-2 pt-0 text-center sm:gap-3 xl:pt-2 max-xl:landscape:flex max-xl:landscape:items-center max-xl:landscape:justify-center max-xl:landscape:gap-3">
              <span className="mb-1 flex size-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary sm:size-12 xl:size-16 max-xl:landscape:mb-0 max-xl:landscape:size-[clamp(2rem,10dvh,2.75rem)] max-xl:landscape:shrink-0">
                <Shield className="size-5 fill-primary/15 sm:size-6 xl:size-7" aria-hidden="true" />
              </span>
              <h2 className="font-heading text-2xl font-bold sm:text-3xl max-xl:landscape:text-2xl">
                The Fall
              </h2>
              <p className="hidden text-xs tracking-[0.12em] text-muted-foreground uppercase sm:block max-xl:landscape:hidden">
                Your seat at the table awaits
              </p>
            </CardHeader>

            <CardContent className="grid grid-cols-1 max-xl:landscape:grid-cols-[repeat(auto-fit,minmax(min(100%,13rem),1fr))] max-xl:landscape:gap-6">
              <form
                aria-label="Login preview"
                className="grid grid-cols-1 gap-4 sm:gap-5 max-xl:landscape:gap-[clamp(1rem,calc(8dvh-0.5rem),2rem)]"
                noValidate
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="min-w-0 space-y-2">
                  <Label htmlFor={`${formId}-email`}>Email address</Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={`${formId}-email`}
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-11 pl-11 sm:h-12 md:text-base lg:text-sm max-xl:landscape:h-[clamp(2.75rem,12dvh,3.25rem)] max-xl:landscape:text-base"
                    />
                  </div>
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor={`${formId}-password`}>Password</Label>
                    <Button type="button" variant="link" size="xs" className="h-6 px-0">
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <LockKeyhole
                      className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={`${formId}-password`}
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="h-11 pl-11 sm:h-12 md:text-base lg:text-sm max-xl:landscape:h-[clamp(2.75rem,12dvh,3.25rem)] max-xl:landscape:text-base"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  className="h-11 w-full font-semibold sm:h-12 max-xl:landscape:h-[clamp(2.75rem,12dvh,3.25rem)]"
                  onClick={() => navigate(HOME_PATH)}
                >
                  Take your seat
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Button>
              </form>

              <div className="login-alternatives flow-root min-w-0 max-xl:landscape:flex max-xl:landscape:flex-col max-xl:landscape:justify-center max-xl:landscape:rounded-2xl max-xl:landscape:bg-muted/30 max-xl:landscape:p-4">
                <div className="my-4 flex items-center gap-4 sm:my-5 xl:my-7 max-xl:landscape:mt-0 max-xl:landscape:mb-3 max-xl:landscape:justify-center">
                  <Separator className="flex-1 max-xl:landscape:hidden" />
                  <span className="shrink-0 text-xs text-muted-foreground">Or continue with</span>
                  <Separator className="flex-1 max-xl:landscape:hidden" />
                </div>
                <div
                  className="flex justify-center gap-4 max-xl:landscape:grid max-xl:landscape:grid-cols-[repeat(2,auto)] max-xl:landscape:gap-4"
                  role="group"
                  aria-label="Social sign-in preview"
                >
                  {(["google", "apple", "microsoft", "facebook"] as const).map((provider) => {
                    const name = provider.charAt(0).toUpperCase() + provider.slice(1);
                    return (
                      <Button
                        key={provider}
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        className="size-11 rounded-full text-muted-foreground xl:size-12 max-xl:landscape:size-[clamp(2.75rem,12dvh,3.5rem)]"
                        aria-label={`Continue with ${name}`}
                        title={`Continue with ${name}`}
                      >
                        <ProviderIcon provider={provider} />
                      </Button>
                    );
                  })}
                </div>
                <CardFooter className="mt-4 flex-col px-0 text-center sm:mt-5 xl:mt-6 max-xl:landscape:mt-4">
                  <p className="text-sm text-muted-foreground max-xl:landscape:flex max-xl:landscape:flex-col max-xl:landscape:items-center">
                    New to the table?{" "}
                    <Button type="button" variant="link" className="h-6 px-0 py-0">
                      Create account
                    </Button>
                  </p>
                </CardFooter>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
