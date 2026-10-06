export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  icon: Icon,
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-accent text-[#2A2107] hover:brightness-95 active:scale-[0.98] shadow-sm",

    secondary:
      "bg-white border border-line text-ink hover:bg-bg active:scale-[0.98]",

    danger:
      "bg-transparent border border-line text-danger hover:bg-dangerBg",

    ghost:
      "bg-transparent text-soft hover:bg-bg hover:text-ink",

    dark:
      "bg-primary text-white hover:bg-[#233E45]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}