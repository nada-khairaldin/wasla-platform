type PersonAvatarProps = {
  initials: string;
  colorClass: string;
  size?: "sm" | "md";
  isOnline?: boolean;
};

export function PersonAvatar({
  initials,
  colorClass,
  size = "md",
  isOnline = false,
}: PersonAvatarProps) {
  // Determine dimensions based on the size prop
  const dim = size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  const dotSize = size === "md" ? "h-2.5 w-2.5" : "h-2 w-2";

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={`${dim} ${colorClass} rounded-full flex items-center justify-center text-white font-bold shrink-0 select-none`}
      >
        {initials}
      </div>
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 block ${dotSize} rounded-full ring-2 ring-white bg-emerald-500`}
        />
      )}
    </div>
  );
}

