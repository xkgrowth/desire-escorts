"use client";

const RIGHT =
  "M30.5057 2.76774C26.8157 -0.92258 20.8327 -0.92258 17.1427 2.76774L16.6367 3.27311V30L30.5057 16.1316C34.1957 12.4409 34.1957 6.45806 30.5057 2.76774Z";
const LEFT =
  "M2.73975 2.74782C6.39275 -0.91594 12.3158 -0.91594 15.9698 2.74782L16.4698 3.24956C18.9938 11.6481 18.7608 20.5341 16.4698 29.7841L2.73975 16.0151C-0.91325 12.3513 -0.91325 6.41159 2.73975 2.74782Z";

function HeartDefs({
  id,
  shimmerAnimated = false,
}: {
  id: string;
  shimmerAnimated?: boolean;
}) {
  return (
    <defs>
      <linearGradient
        id={`${id}-gr`}
        x1="25"
        y1="0"
        x2="17"
        y2="32.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F0D074" />
        <stop offset="0.57" stopColor="#F2DE9B" />
      </linearGradient>

      <linearGradient
        id={`${id}-gl`}
        x1="6.03"
        y1="0.672"
        x2="16.47"
        y2="30.224"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F0D074" />
        <stop offset="0.567" stopColor="#F2DE9B" />
      </linearGradient>

      <linearGradient
        id={`${id}-sh`}
        x1="-10"
        y1="0"
        x2="44"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.72" />
        <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        <animateTransform
          attributeName="gradientTransform"
          type="translate"
          from="-44 0"
          to="44 0"
          dur={shimmerAnimated ? "3.8s" : "5s"}
          begin={shimmerAnimated ? "0s" : "0.4s"}
          repeatCount={shimmerAnimated ? "indefinite" : "1"}
          calcMode="spline"
          keySplines="0.4 0 0.6 1"
        />
      </linearGradient>

      <linearGradient
        id={`${id}-bevel`}
        x1="0"
        y1="0"
        x2="34"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="35%" stopColor="#F2DE9B" stopOpacity="0.45" />
        <stop offset="65%" stopColor="#C8A83A" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#C8A83A" stopOpacity="0.05" />
      </linearGradient>

      <linearGradient
        id={`${id}-ring`}
        x1="0"
        y1="0"
        x2="34"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#F7D063" stopOpacity="0.55" />
        <stop offset="50%" stopColor="#F2DE9B" stopOpacity="0.20" />
        <stop offset="100%" stopColor="#C8A83A" stopOpacity="0.08" />
      </linearGradient>

      <clipPath id={`${id}-cr`}>
        <path d={RIGHT} />
      </clipPath>
      <clipPath id={`${id}-cl`}>
        <path d={LEFT} />
      </clipPath>
    </defs>
  );
}

function HeartBody({ id }: { id: string }) {
  return (
    <>
      <path d={RIGHT} fill={`url(#${id}-gr)`} />
      <path d={LEFT} fill={`url(#${id}-gl)`} />

      <rect
        x="0"
        y="0"
        width="34"
        height="30"
        fill={`url(#${id}-sh)`}
        clipPath={`url(#${id}-cr)`}
      />
      <rect
        x="0"
        y="0"
        width="34"
        height="30"
        fill={`url(#${id}-sh)`}
        clipPath={`url(#${id}-cl)`}
      />

      <path
        d={RIGHT}
        fill="none"
        stroke={`url(#${id}-bevel)`}
        strokeWidth="0.7"
      />
      <path
        d={LEFT}
        fill="none"
        stroke={`url(#${id}-bevel)`}
        strokeWidth="0.7"
      />

      <path
        d={RIGHT}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth="0.45"
      />
      <path
        d={LEFT}
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth="0.45"
      />
    </>
  );
}

export function StaticHeart({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 30) / 34}
      viewBox="0 0 34 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Heart icon"
      role="img"
      style={{
        filter:
          "drop-shadow(0 0 5px rgba(247,208,99,0.45)) drop-shadow(0 0 14px rgba(240,208,116,0.22))",
      }}
    >
      <HeartDefs id="static-heart" shimmerAnimated={false} />
      <HeartBody id="static-heart" />
    </svg>
  );
}

export function ShinyHeart({
  size = 120,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 30) / 34}
      viewBox="0 0 34 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animated-heart ${className}`}
      aria-label="Animated heart"
      role="img"
    >
      <HeartDefs id="shiny-heart" shimmerAnimated={true} />
      <HeartBody id="shiny-heart" />

      <style>{`
        .animated-heart {
          animation: heartbeat 3.2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          transform-origin: center;
          will-change: transform;
          filter: drop-shadow(0 0 5px rgba(247,208,99,0.45))
                  drop-shadow(0 0 14px rgba(240,208,116,0.22));
        }

        @keyframes heartbeat {
          0%   { transform: scale(1);    filter: drop-shadow(0 0 5px rgba(247,208,99,0.45)) drop-shadow(0 0 14px rgba(240,208,116,0.22)); }
          8%   { transform: scale(1.10); filter: drop-shadow(0 0 9px rgba(247,208,99,0.65)) drop-shadow(0 0 22px rgba(240,208,116,0.38)); }
          16%  { transform: scale(1);    filter: drop-shadow(0 0 5px rgba(247,208,99,0.45)) drop-shadow(0 0 14px rgba(240,208,116,0.22)); }
          24%  { transform: scale(1.07); filter: drop-shadow(0 0 7px rgba(247,208,99,0.55)) drop-shadow(0 0 18px rgba(240,208,116,0.30)); }
          36%  { transform: scale(1);    filter: drop-shadow(0 0 5px rgba(247,208,99,0.45)) drop-shadow(0 0 14px rgba(240,208,116,0.22)); }
          100% { transform: scale(1);    filter: drop-shadow(0 0 5px rgba(247,208,99,0.45)) drop-shadow(0 0 14px rgba(240,208,116,0.22)); }
        }
      `}</style>
    </svg>
  );
}
