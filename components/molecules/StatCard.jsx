import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "primary",
  highlight = false,
}) {
  const toneStyles = {
    primary: {
      icon: "bg-primary text-white",
      accent: "bg-primary",
    },

    accent: {
      icon: "bg-accent text-[#2A2107]",
      accent: "bg-accent",
    },

    success: {
      icon: "bg-success text-white",
      accent: "bg-success",
    },
  };

  const style = toneStyles[tone] || toneStyles.primary;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-surface
        border border-line
        rounded-2xl
        p-5
        shadow-card
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-soft
        ${highlight ? "ring-1 ring-accent/20" : ""}
      `}
    >
      <div
        className={`
          absolute
          top-0
          left-0
          w-full
          h-1
          ${style.accent}
        `}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-soft font-medium">
            {label}
          </p>

          <h3 className="font-serif font-bold text-3xl text-ink mt-2 tracking-tight">
            {value}
          </h3>

          {description && (
            <p className="text-xs text-soft mt-2">
              {description}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`
              w-10 h-10
              rounded-xl
              flex items-center justify-center
              ${style.icon}
            `}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {highlight && (
        <div className="absolute bottom-4 right-5">
          <ArrowUpRight
            size={15}
            className="text-accent"
          />
        </div>
      )}
    </div>
  );
}