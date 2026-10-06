import {
  Utensils,
  Bus,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

const CATEGORY = {
  Food: {
    text: "text-catFood",
    bg: "bg-catFood/10",
    icon: Utensils,
  },

  Transportation: {
    text: "text-catTransport",
    bg: "bg-catTransport/10",
    icon: Bus,
  },

  School: {
    text: "text-catSchool",
    bg: "bg-catSchool/10",
    icon: BookOpen,
  },

  Others: {
    text: "text-catOther",
    bg: "bg-catOther/10",
    icon: MoreHorizontal,
  },
};

export function getCategory(category) {
  return CATEGORY[category] || CATEGORY.Others;
}

export default function CategoryPill({
  category,
  compact = false,
}) {
  const config = getCategory(category);
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${compact ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-xs"}
        rounded-full
        font-semibold
        ${config.bg}
        ${config.text}
        whitespace-nowrap
      `}
    >
      <Icon
        size={compact ? 11 : 12}
        strokeWidth={2.5}
      />

      {category}
    </span>
  );
}