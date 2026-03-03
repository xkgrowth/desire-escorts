import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";

type PricingTier = {
  duration: string;
  price: string;
  priceNote?: string;
  description?: string;
  features?: string[];
  highlighted?: boolean;
  highlightLabel?: string;
};

type PricingTableProps = {
  tiers: PricingTier[];
  currency?: string;
  disclaimer?: string;
  variant?: "table" | "cards";
  className?: string;
};

export function PricingTable({
  tiers,
  currency = "€",
  disclaimer,
  variant = "table",
  className,
}: PricingTableProps) {
  if (variant === "cards") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, index) => (
            <div
              key={`${tier.duration}-${index}`}
              className={cn(
                "relative rounded-luxury p-6 transition-all",
                tier.highlighted
                  ? "bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary/30 shadow-glow"
                  : "card-surface"
              )}
            >
              {tier.highlighted && tier.highlightLabel && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider">
                    {tier.highlightLabel}
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  {tier.duration}
                </h3>

                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-sm text-foreground/60">{currency}</span>
                  <span className="text-3xl font-heading font-bold text-primary">
                    {tier.price}
                  </span>
                </div>

                {tier.priceNote && (
                  <p className="text-xs text-foreground/50 mb-4">
                    {tier.priceNote}
                  </p>
                )}

                {tier.description && (
                  <p className="text-sm text-foreground/70 mb-4">
                    {tier.description}
                  </p>
                )}

                {tier.features && tier.features.length > 0 && (
                  <ul className="space-y-2 text-left">
                    {tier.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-foreground/70"
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {disclaimer && (
          <div className="flex items-start gap-2 p-4 rounded-lg bg-surface/50 border border-border">
            <Info className="w-4 h-4 text-foreground/40 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/60">{disclaimer}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-sm font-medium text-foreground/60">
                Duur
              </th>
              <th className="text-right py-4 px-4 text-sm font-medium text-foreground/60">
                Tarief
              </th>
              <th className="text-left py-4 px-4 text-sm font-medium text-foreground/60 hidden sm:table-cell">
                Omschrijving
              </th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr
                key={`${tier.duration}-${index}`}
                className={cn(
                  "border-b border-border/50 transition-colors",
                  tier.highlighted && "bg-primary/5"
                )}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-foreground">
                      {tier.duration}
                    </span>
                    {tier.highlighted && tier.highlightLabel && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {tier.highlightLabel}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-heading font-bold text-lg text-primary">
                      {currency}
                      {tier.price}
                    </span>
                    {tier.priceNote && (
                      <span className="text-xs text-foreground/50">
                        {tier.priceNote}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-foreground/70 hidden sm:table-cell">
                  {tier.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {disclaimer && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-surface/50 border border-border">
          <Info className="w-4 h-4 text-foreground/40 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/60">{disclaimer}</p>
        </div>
      )}
    </div>
  );
}

type PricingFeature = {
  label: string;
  included: boolean;
  note?: string;
};

type PricingComparisonProps = {
  title?: string;
  features: PricingFeature[];
  className?: string;
};

export function PricingFeatures({
  title = "Inclusief",
  features,
  className,
}: PricingComparisonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-heading font-bold text-foreground">
          {title}
        </h3>
      )}
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                feature.included
                  ? "bg-green-500/20 text-green-500"
                  : "bg-foreground/10 text-foreground/30"
              )}
            >
              {feature.included ? (
                <Check className="w-3 h-3" />
              ) : (
                <span className="w-2 h-0.5 bg-current rounded-full" />
              )}
            </div>
            <div>
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-foreground" : "text-foreground/50"
                )}
              >
                {feature.label}
              </span>
              {feature.note && (
                <span className="text-xs text-foreground/40 ml-1">
                  ({feature.note})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PaymentMethod = {
  name: string;
  icon?: React.ReactNode;
};

type PaymentMethodsProps = {
  methods: PaymentMethod[];
  title?: string;
  className?: string;
};

export function PaymentMethods({
  methods,
  title = "Betaalmethoden",
  className,
}: PaymentMethodsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h4 className="text-sm font-medium text-foreground/60">{title}</h4>
      )}
      <div className="flex flex-wrap gap-3">
        {methods.map((method, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border"
          >
            {method.icon}
            <span className="text-sm text-foreground/80">{method.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
