import { cn } from "@/lib/utils";
import { Shield, Clock, Star, Heart, Award, Lock } from "lucide-react";
import { GradientTitle } from "../ui/gradient-title";

type USPItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type USPBarProps = {
  eyebrow?: string;
  title?: string;
  items?: USPItem[];
  variant?: "cards" | "minimal" | "horizontal";
  horizontalAlign?: "start" | "center";
  className?: string;
};

const defaultItems: USPItem[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Discreet",
    description: "Volledige privacy en discretie gegarandeerd",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Premium Kwaliteit",
    description: "Alleen de beste escorts, zorgvuldig geselecteerd",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "24/7 Beschikbaar",
    description: "Altijd bereikbaar voor uw wensen",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Gecertificeerd Bureau",
    description: "Erkend door het Escortkeurmerk",
  },
];

export function USPBar({
  eyebrow,
  title,
  items = defaultItems,
  variant = "cards",
  horizontalAlign = "center",
  className,
}: USPBarProps) {
  return (
    <div className={cn(className)}>
      {/* Header */}
      {(eyebrow || title) && (
        <div className="text-center mb-10">
          {eyebrow && (
            <span className="text-sm font-medium text-primary uppercase tracking-wider mb-3 block">
              {eyebrow}
            </span>
          )}
          {title && (
            <GradientTitle as="h2" size="lg">
              {title}
            </GradientTitle>
          )}
        </div>
      )}

      {/* USP Items */}
      {variant === "horizontal" ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-6 lg:gap-12",
            horizontalAlign === "start" ? "justify-start" : "justify-center"
          )}
        >
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-primary">{item.icon}</div>
              <span className="text-sm font-medium text-foreground">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-6",
            items.length === 3 && "grid-cols-1 md:grid-cols-3",
            items.length === 4 && "grid-cols-2 lg:grid-cols-4",
            items.length !== 3 &&
              items.length !== 4 &&
              "grid-cols-2 md:grid-cols-3"
          )}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col",
                variant === "cards" &&
                  "p-6 rounded-luxury bg-surface/50 border border-white/5 hover:border-primary/20 transition-colors duration-300",
                variant === "minimal" && "p-4"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary",
                  variant === "cards" && "bg-primary/10",
                  variant === "minimal" && "bg-surface"
                )}
              >
                {item.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-foreground/60">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type TrustBadgesProps = {
  className?: string;
};

export function TrustBadges({ className }: TrustBadgesProps) {
  const badges = [
    { icon: <Shield className="w-5 h-5" />, label: "SSL Beveiligd" },
    { icon: <Lock className="w-5 h-5" />, label: "Privacy Gegarandeerd" },
    { icon: <Award className="w-5 h-5" />, label: "Escortkeurmerk" },
    { icon: <Heart className="w-5 h-5" />, label: "Verified Escorts" },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6",
        className
      )}
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-foreground/50"
        >
          <div className="text-primary/60">{badge.icon}</div>
          <span className="text-sm">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

type StatsRowProps = {
  stats: { value: string; label: string }[];
  className?: string;
};

export function StatsRow({ stats, className }: StatsRowProps) {
  return (
    <div
      className={cn(
        "grid gap-8",
        stats.length === 3 && "grid-cols-3",
        stats.length === 4 && "grid-cols-2 md:grid-cols-4",
        stats.length !== 3 && stats.length !== 4 && "grid-cols-2 md:grid-cols-3",
        className
      )}
    >
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl lg:text-4xl font-heading font-bold text-gradient-gold mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-foreground/60 uppercase tracking-wider">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
