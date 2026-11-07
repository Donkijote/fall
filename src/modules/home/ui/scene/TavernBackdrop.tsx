import { useId } from "react";

export function TavernBackdrop() {
  const id = useId();
  const fill = (name: string) => `url(#${id}-${name})`;

  return (
    <svg
      className="living-town-tavern-fallback"
      data-slot="living-town-tavern"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-plaster`} x2="1" y2="1">
          <stop stopColor="#b19a7b" />
          <stop offset="1" stopColor="#60504a" />
        </linearGradient>
        <linearGradient id={`${id}-roof`} x2="0.3" y2="1">
          <stop stopColor="#6d4247" />
          <stop offset="1" stopColor="#251f2b" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x2="0.3" y2="1">
          <stop stopColor="#ffe4a2" />
          <stop offset="1" stopColor="#d7802e" />
        </linearGradient>
        <pattern id={`${id}-stone`} width="45" height="30" patternUnits="userSpaceOnUse">
          <rect width="45" height="30" fill="#49403d" />
          <path
            d="M1 1h42v12H1zM-20 16h42v12h-42zM25 16h42v12H25z"
            fill="#786b5d"
            stroke="#9a8671"
            strokeWidth="0.6"
          />
        </pattern>
        <pattern id={`${id}-tiles`} width="32" height="22" patternUnits="userSpaceOnUse">
          <rect width="32" height="22" fill={fill("roof")} />
          <path d="M0 11h32M16 0v11M0 11v11M32 11v11" stroke="#241d27" strokeWidth="2" />
          <path d="M2 13h28" stroke="#a16b65" opacity="0.35" />
        </pattern>
        <pattern id={`${id}-wood`} width="14" height="70" patternUnits="userSpaceOnUse">
          <rect width="14" height="70" fill="#503725" />
          <path
            d="M3 0q4 25 0 45t0 25M10 0q-4 20 0 40t0 30"
            stroke="#a07648"
            strokeWidth="0.8"
            opacity="0.35"
          />
        </pattern>
        <radialGradient id={`${id}-light`}>
          <stop stopColor="#ffad49" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ffad49" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="living-town-tavern-art">
        <ellipse cx="282" cy="611" rx="260" ry="33" fill="#201b26" opacity="0.6" />
        <path
          d="M75 376L375 400 516 341V565L375 629 75 595Z"
          fill={fill("stone")}
          stroke="#352a29"
          strokeWidth="5"
        />
        <path d="M75 245L226 110 375 270V494L75 468Z" fill={fill("plaster")} />
        <path d="M375 270L516 208V470L375 494Z" fill="#746253" />
        <path
          d="M55 247L225 89 538 190 375 290 225 128 75 270Z"
          fill={fill("tiles")}
          stroke="#30232a"
          strokeWidth="7"
        />
        <path d="M225 89L538 190" stroke="#9d7863" strokeWidth="5" />
        <path d="M420 188V70L463 82V205Z" fill={fill("stone")} stroke="#453734" strokeWidth="4" />
        <path d="M411 66L454 53 476 64 463 82Z" fill="#a18b77" />
        <path d="M422 66L453 59 466 65 451 70Z" fill="#272129" />
        <path
          d="M77 250L225 110 375 279M225 119V474M80 286L374 311M78 445L374 473M80 275V468M374 287V495M96 297L157 431M357 318L293 449"
          fill="none"
          stroke={fill("wood")}
          strokeWidth="15"
        />
        {[125, 282].map((horizontal) => (
          <g key={horizontal}>
            <ellipse cx={horizontal + 24} cy="365" rx="65" ry="79" fill={fill("light")} />
            <path
              d={`M${horizontal} 395v-64a24 24 0 0 1 48 0v64Z`}
              fill={fill("glass")}
              stroke="#3c2a23"
              strokeWidth="7"
            />
            <path
              d={`M${horizontal + 24} 311v83m-24-53h48m-48 28h48`}
              stroke="#483225"
              strokeWidth="3"
            />
          </g>
        ))}
        <path
          d="M204 264v-56a20 20 0 0 1 40 0v60Z"
          fill={fill("glass")}
          stroke="#382923"
          strokeWidth="6"
        />
        <path d="M224 190v75m-19-35h38" stroke="#483225" strokeWidth="3" />
        <path d="M427 387v-65l38-17v64Z" fill={fill("glass")} stroke="#3c2a23" strokeWidth="6" />
        <path d="M446 315v63m-19-25l37-17" stroke="#483225" strokeWidth="3" />
        <path
          d="M192 588V493a37 37 0 0 1 74 0v101Z"
          fill={fill("wood")}
          stroke="#362923"
          strokeWidth="8"
        />
        <path d="M199 520l59 5m-59 37l59 5" stroke="#292328" strokeWidth="5" />
        <circle cx="252" cy="548" r="4" fill="#c5a168" />
        <path
          d="M45 440L367 465 528 403 509 446 365 505 42 480Z"
          fill={fill("tiles")}
          stroke="#3c2b2b"
          strokeWidth="6"
        />
        <path d="M57 478V612M363 502V635M505 448V576" stroke={fill("wood")} strokeWidth="12" />
        <path d="M188 615L286 624 303 637 172 628Z" fill="#9a8671" />
        <path d="M172 628L303 637 320 651 155 641Z" fill="#64564d" />
        {[100, 320].map((horizontal) => (
          <g key={horizontal}>
            <ellipse cx={horizontal} cy="526" rx="62" ry="70" fill={fill("light")} />
            <path d={`M${horizontal} 479v20`} stroke="#332a2b" strokeWidth="4" />
            <rect
              x={horizontal - 10}
              y="497"
              width="20"
              height="32"
              rx="3"
              fill={fill("glass")}
              stroke="#35282b"
              strokeWidth="4"
            />
            <path d={`M${horizontal - 12} 507h24m-24 16h24`} stroke="#35282b" strokeWidth="3" />
          </g>
        ))}
        <path d="M379 403h88m-18 0v16" fill="none" stroke="#35292a" strokeWidth="5" />
        <path d="M420 420h55v38h-55Z" fill={fill("wood")} stroke="#a47d4c" strokeWidth="3" />
        <path d="M439 430h14v18h-14Zm14 3h7v10h-7" fill="none" stroke="#d5a957" strokeWidth="3" />
        <path
          d="M397 577q25-12 46 0v44q-25 14-46 0Z"
          fill={fill("wood")}
          stroke="#392d29"
          strokeWidth="4"
        />
        <path
          d="M398 587q23 10 44 0m-44 23q23 10 44 0"
          fill="none"
          stroke="#3e3b39"
          strokeWidth="5"
        />
        <path d="M43 557l42 4v42l-42-4Z" fill={fill("wood")} stroke="#aa8053" strokeWidth="3" />
      </g>
    </svg>
  );
}
