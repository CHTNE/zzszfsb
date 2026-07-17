"use client";

interface TagBadgeProps {
  tag: string;
  onClick?: (tag: string) => void;
}

/** 标签徽章组件 */
export default function TagBadge({ tag, onClick }: TagBadgeProps) {
  return (
    <span
      onClick={onClick ? () => onClick(tag) : undefined}
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${onClick ? "cursor-pointer hover:opacity-80" : ""}
      `}
      style={{
        background: "var(--badge-bg)",
        color: "var(--badge-text)",
      }}
    >
      {tag}
    </span>
  );
}
