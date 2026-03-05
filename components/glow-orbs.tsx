type GlowOrbsProps = {
  middleCount?: number;
};

export function GlowOrbs({ middleCount = 4 }: GlowOrbsProps) {
  const safeMiddleCount = Math.max(0, middleCount);
  const middleOrbs = Array.from({ length: safeMiddleCount }, (_, index) => {
    const top = ((index + 1) / (safeMiddleCount + 1)) * 100;
    const isLeft = index % 2 === 0;

    return {
      id: `middle-orb-${index}`,
      top,
      isLeft,
      size: index % 2 === 0 ? 450 : 400,
    };
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Top-left orb */}
      <div
        className="absolute rounded-full"
        style={{
          top: "-80px",
          left: "-60px",
          width: "480px",
          height: "480px",
          background: "#F7D063",
          opacity: 0.085,
          filter: "blur(80px)",
        }}
      />

      {/* Middle orbs - alternating left/right */}
      {middleOrbs.map((orb, index) => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            top: `${orb.top}%`,
            [orb.isLeft ? "left" : "right"]: "0px",
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            transform: `translateY(-50%) translateX(${orb.isLeft ? "-35%" : "35%"})`,
            background: index % 2 === 0 ? "#F7D063" : "#F2DE9B",
            opacity: 0.065,
            filter: "blur(75px)",
          }}
        />
      ))}

      {/* Bottom-right orb */}
      <div
        className="absolute rounded-full"
        style={{
          bottom: "-80px",
          right: "-80px",
          width: "550px",
          height: "550px",
          background: "#F2DE9B",
          opacity: 0.09,
          filter: "blur(85px)",
        }}
      />
    </div>
  );
}
