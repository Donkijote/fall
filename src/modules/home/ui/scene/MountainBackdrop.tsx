import { useId } from "react";

import { mountainFrame, mountainLayers, mountainPoints } from "./mountainModel";

export function MountainBackdrop() {
  const gradientId = useId();

  return (
    <svg
      className="living-town-mountains"
      data-slot="living-town-mountains"
      viewBox={`0 0 ${mountainFrame.width} ${mountainFrame.height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {mountainLayers.map((layer) => (
          <linearGradient
            key={layer.id}
            id={`${gradientId}-${layer.id}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={mountainFrame.height}
          >
            <stop stopColor={layer.top} />
            <stop offset="1" stopColor={layer.bottom} />
          </linearGradient>
        ))}
      </defs>
      {mountainLayers.map((layer) => (
        <g key={layer.id} data-mountain-layer={layer.id}>
          <polygon points={mountainPoints(layer.ridge)} fill={`url(#${gradientId}-${layer.id})`} />
          {layer.facets.map((facet, index) => (
            <polygon
              key={index}
              points={mountainPoints(facet.points)}
              fill={facet.color}
              opacity={facet.opacity}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
