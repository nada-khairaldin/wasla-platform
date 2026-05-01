"use client";

type Size = "sm" | "md" | "lg";
type Variant = "filled" | "outline";

const sizeClasses: Record<Size, string> = {
  sm: "p-base text-label-1 font-bold h-sm w-[144px] ",
  md: "px-4 text-label-2 h-md font-bold",
  lg: "p-xl text-label-1 h-lg min-w-[188px] font-bold ",
};

const variantClasses: Record<Variant, string> = {
  filled: "bg-primary-500 text-white active:bg-primary-700",
  outline: "border border-primary-500 text-primary-500 active:bg-primary-100",
};

function Button({
  type = "button",
  children,
  size = "sm",
  variant = "filled",
  onClick,
  disabled = false,
  loading = false,
  className = "",
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  size?: Size;
  variant?: Variant;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      type = {type}
      className={`
        rounded-3xl text-center  transition-all duration-200 flex items-center justify-center hover:-translate-y-[5px]
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
