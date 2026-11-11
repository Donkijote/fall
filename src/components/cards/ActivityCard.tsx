import { cn } from "cn";
import gsap from "gsap";
import { useId, useImperativeHandle, useRef, useState } from "react";
import type { ComponentProps } from "react";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { frameClassName } from "../surfaces/surfaceStyles";
import { CardBorderGlint } from "./CardBorderGlint";

gsap.registerPlugin(useGSAP);

const sparks = Array.from({ length: 14 }, (_, index) => index);

export type ActivityCardProps = Omit<ComponentProps<"button">, "children" | "title"> & {
  title: string;
  description?: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  caption?: string;
  selected?: boolean;
  unavailable?: boolean;
};

export function ActivityCard({
  ref,
  title,
  description,
  imageUrl,
  imageWidth,
  imageHeight,
  caption,
  selected = false,
  unavailable = false,
  disabled = false,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  "aria-describedby": describedBy,
  ...props
}: ActivityCardProps) {
  const reducedMotion = useReducedMotion();
  const descriptionId = useId();
  const captionId = useId();
  const root = useRef<HTMLButtonElement>(null);
  const controller = useRef<((active: boolean) => void) | null>(null);
  const latest = useRef(selected && !disabled);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [failedImage, setFailedImage] = useState<string>();
  const active = !disabled && (selected || hovered || focused);

  useImperativeHandle(ref, () => root.current!);

  useGSAP(
    () => {
      if (!window.matchMedia || !root.current) return;
      const media = gsap.matchMedia();
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const card = root.current!;
          const scaleLayer = card.querySelector(".game-activity-scale");
          const motionLayer = card.querySelector(".game-activity-motion");
          const effects = card.querySelector(".game-activity-effects");
          const rim = card.querySelector(".game-activity-rim");
          const glint = card.querySelector("[data-card-border-glint]");
          const image = card.querySelector("img");
          const shimmer = card.querySelector(".game-activity-shimmer");
          const particles = card.querySelectorAll(".game-activity-spark");
          const random = gsap.utils.random;
          const moving = context.conditions?.motion && !reducedMotion && !disabled;
          const ambience = gsap.timeline({ paused: true });
          let borderSweep: gsap.core.Tween | undefined;
          let stopTrackingPointer: (() => void) | undefined;

          if (moving) {
            gsap.set([scaleLayer, motionLayer], { transformPerspective: 1000 });
            // Separate periods keep the axes from turning around together.
            const sway = { ease: "sine.inOut", repeat: -1, yoyo: true };
            gsap
              .fromTo(
                motionLayer,
                { x: random(-3, -1.5), rotationY: random(-4, -2) },
                { ...sway, x: random(1.5, 3), rotationY: random(2, 4), duration: random(5, 7) },
              )
              .progress(random(0, 1));
            gsap
              .fromTo(
                motionLayer,
                { y: random(-5, -2.5), rotationX: random(-3.5, -1.5) },
                { ...sway, y: random(2, 4), rotationX: random(1.5, 3.5), duration: random(6, 8) },
              )
              .progress(random(0, 1));
            gsap
              .fromTo(
                motionLayer,
                { z: random(-10, -5), rotationZ: random(-0.8, -0.3) },
                { ...sway, z: random(4, 10), rotationZ: random(0.3, 0.8), duration: random(7, 10) },
              )
              .progress(random(0, 1));

            const startAngle = random(0, 360);
            borderSweep = gsap.fromTo(
              glint,
              { "--glint-angle": `${startAngle}deg` },
              {
                "--glint-angle": `${startAngle + 360}deg`,
                duration: random(7, 10),
                ease: "none",
                repeat: -1,
              },
            );

            const tiltX = gsap.quickTo(scaleLayer, "rotationX", {
              duration: 0.45,
              ease: "power2.out",
            });
            const tiltY = gsap.quickTo(scaleLayer, "rotationY", {
              duration: 0.45,
              ease: "power2.out",
            });
            const trackPointer = (event: PointerEvent) => {
              if (event.pointerType === "touch") return;
              const bounds = card.getBoundingClientRect();
              const x = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
              const y = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);
              tiltX(2.5 - 5 * y);
              tiltY(6 * x - 3);
            };
            const resetTilt = () => {
              tiltX(0);
              tiltY(0);
            };
            card.addEventListener("pointermove", trackPointer);
            card.addEventListener("pointerleave", resetTilt);
            card.addEventListener("pointercancel", resetTilt);
            stopTrackingPointer = () => {
              card.removeEventListener("pointermove", trackPointer);
              card.removeEventListener("pointerleave", resetTilt);
              card.removeEventListener("pointercancel", resetTilt);
            };

            ambience.fromTo(
              rim,
              { opacity: 0.3 },
              {
                opacity: 0.65,
                duration: random(2, 3.5),
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
              },
              0,
            );
            if (image)
              ambience.to(
                image,
                {
                  scale: 1.06,
                  xPercent: () => random([-1, 1]) * random(0.6, 1.3),
                  yPercent: () => random([-1, 1]) * random(0.5, 1.1),
                  duration: random(7, 11),
                  ease: "sine.inOut",
                  repeat: -1,
                  yoyo: true,
                  repeatRefresh: true,
                },
                0,
              );
            ambience.fromTo(
              shimmer,
              { xPercent: -45, opacity: 0 },
              {
                xPercent: 45,
                keyframes: { opacity: [0, 0.45, 0] },
                duration: random(6, 9),
                repeat: -1,
                repeatDelay: random(2, 4),
                ease: "sine.inOut",
              },
              0,
            );
            particles.forEach((particle) => {
              gsap.set(particle, { left: `${random(5, 95)}%` });
              ambience.fromTo(
                particle,
                { y: 0, x: 0, opacity: 0, scale: random(0.7, 1.25) },
                {
                  y: () => -card.clientHeight * random(0.72, 1.1),
                  x: () => random(-28, 28),
                  scale: 0.2,
                  keyframes: { opacity: [0, 1, 0.72, 0] },
                  duration: random(3.2, 5.8),
                  repeat: -1,
                  repeatRefresh: true,
                  ease: "none",
                  immediateRender: false,
                },
                random(0, 2.6),
              );
            });
          } else {
            gsap.set([scaleLayer, motionLayer], { clearProps: "transform" });
            gsap.set([rim, glint], { opacity: 0 });
          }

          controller.current = (isActive) => {
            context.add(() => {
              const scale = isActive ? 1.05 : 0.94;
              if (!moving) {
                gsap.set(scaleLayer, { scale });
                gsap.set(effects, { opacity: 0 });
                return;
              }
              if (isActive) ambience.play();
              gsap.to(scaleLayer, {
                scale,
                z: isActive ? 5 : 0,
                duration: 0.55,
                ease: "power2.out",
                overwrite: "auto",
              });
              borderSweep?.timeScale(isActive ? 1.4 : 1);
              gsap.to(glint, {
                opacity: isActive ? 1 : 0.16,
                duration: 0.4,
                overwrite: "auto",
              });
              gsap.to(effects, {
                opacity: isActive ? 1 : 0,
                duration: 0.85,
                overwrite: "auto",
                onComplete: () => {
                  if (!isActive) ambience.pause();
                },
              });
              gsap.to(rim, { visibility: isActive ? "visible" : "hidden", duration: 0 });
            });
          };
          controller.current(latest.current);
          return () => {
            stopTrackingPointer?.();
            controller.current = null;
          };
        },
      );
      return () => media.revert();
    },
    {
      scope: root,
      dependencies: [disabled, imageUrl, failedImage, reducedMotion],
      revertOnUpdate: true,
    },
  );

  useGSAP(
    () => {
      latest.current = active;
      controller.current?.(active);
    },
    { dependencies: [active], scope: root },
  );

  return (
    <button
      aria-pressed={selected}
      {...props}
      ref={root}
      type="button"
      disabled={disabled}
      className={cn(
        "game-activity-card group relative isolate grid aspect-2/3 w-full cursor-pointer rounded-md bg-transparent p-0 text-center select-none [-webkit-touch-callout:none] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold disabled:cursor-default disabled:opacity-65",
        className,
      )}
      aria-describedby={
        [description ? descriptionId : undefined, caption ? captionId : undefined, describedBy]
          .filter(Boolean)
          .join(" ") || undefined
      }
      data-selected={selected}
      data-unavailable={unavailable}
      data-active={active}
      data-slot="game-activity-card"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHovered(false);
        onPointerLeave?.(event);
      }}
      onFocus={(event) => {
        setFocused(event.currentTarget.matches(":focus-visible"));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    >
      <span className="game-activity-scale absolute inset-0 rounded-[inherit]">
        <span
          className={cn(
            frameClassName,
            "game-activity-motion absolute inset-0 rounded-[inherit] bg-card shadow-lg shadow-artwork-shadow/40 group-data-[active=true]:border-gold group-data-[active=true]:shadow-[0_0_24px_color-mix(in_oklch,var(--gold)_45%,transparent)] motion-reduce:group-data-[active=true]:ring-1 motion-reduce:group-data-[active=true]:ring-gold",
          )}
        >
          <span
            className="game-activity-rim pointer-events-none invisible absolute -inset-px rounded-[inherit] shadow-[0_0_14px_var(--gold),0_0_3px_var(--gold)]"
            aria-hidden="true"
          />
          <span
            className="game-activity-art absolute inset-0 block overflow-hidden rounded-[inherit] bg-muted"
            data-image-failed={failedImage === imageUrl}
          >
            {failedImage !== imageUrl && (
              <img
                className={cn(
                  "pointer-events-none block size-full scale-[1.035] object-cover",
                  unavailable && "brightness-75 grayscale",
                )}
                src={imageUrl}
                width={imageWidth}
                height={imageHeight}
                alt=""
                draggable={false}
                decoding="async"
                onError={() => setFailedImage(imageUrl)}
              />
            )}
            <span
              className="game-activity-effects pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-0"
              aria-hidden="true"
            >
              <span className="game-activity-shimmer absolute -inset-x-[80%] -inset-y-[30%] bg-[linear-gradient(115deg,transparent_40%,color-mix(in_oklch,var(--gold)_12%,transparent)_49%,transparent_58%)] opacity-0" />
              {sparks.map((spark) => (
                <span
                  key={spark}
                  className={cn(
                    "game-activity-spark absolute -bottom-[4%] rounded-full bg-artwork-foreground opacity-0 shadow-[0_0_4px_1px_var(--gold),0_0_11px_var(--gold)]",
                    spark % 4 === 0 ? "h-2 w-[2px]" : "size-1",
                  )}
                />
              ))}
            </span>
            {caption && (
              <span
                id={captionId}
                className="game-activity-caption absolute inset-x-2 top-2.5 mx-auto w-fit max-w-[calc(100%-1rem)] rounded-sm bg-artwork-shadow/90 px-2 py-1 text-[clamp(0.75rem,1.05vw,1rem)] text-artwork-foreground compact-landscape:text-xs"
              >
                {caption}
              </span>
            )}
            <span className="game-activity-title absolute inset-x-2 bottom-[9%] artwork-title text-[clamp(1rem,1.85vw,1.85rem)] portrait:text-[clamp(1rem,4.4vw,1.6rem)] compact-landscape:text-[clamp(0.85rem,2vw,1.1rem)]">
              {title}
            </span>
          </span>
          <CardBorderGlint active={active} />
        </span>
      </span>
      {description && (
        <span id={descriptionId} className="sr-only">
          {description}
        </span>
      )}
    </button>
  );
}
