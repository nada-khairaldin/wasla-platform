"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputProps>(function InputField(
  { id, label, type, placeholder, className = "", icon, error, ...props },
  ref,
) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-sm w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-neutral-800 text-lg block font-bold text-right"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10">
            {icon}
          </div>
        )}

        <input
          {...props}
          id={id}
          ref={ref}
          type={type === "password" ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          className={`w-full rounded-xl border-none p-4 outline-none focus:ring-1 focus:ring-neutral-100 transition-all bg-neutral-50 text-neutral-900 text-right ${
            icon ? "pr-12" : ""
          } ${error ? "ring-1 ring-error-500" : ""}  ${className}`}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-neutral-600 transition-colors"
            onClick={() => setShow(!show)}
          >
            {show ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-error-500 text-sm mt-1 text-right">{error}</p>}
    </div>
  );
});
export default InputField;
