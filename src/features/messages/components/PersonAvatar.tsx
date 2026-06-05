type PersonAvatarProps = {
  initials: string;
  colorClass: string;
  size?: "sm" | "md";
};

export function PersonAvatar({
  initials,
  colorClass,
  size = "md",
}: PersonAvatarProps) {
  // Determine dimensions based on the size prop
  const dim = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";

  return (
    <div
      className={`${dim} ${colorClass} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}
    >
      {initials}
    </div>
  );
}
