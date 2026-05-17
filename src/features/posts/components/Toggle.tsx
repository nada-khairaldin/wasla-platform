interface ToggleProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}

function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <div className="grid grid-cols-2 bg-primary-50 p-1 rounded-xl gap-1" dir="rtl">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`py-2.5 rounded-lg font-cairo text-sm font-semibold transition-all duration-200 ${
            value === opt.value
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
              : "text-primary-300 hover:text-primary-500 bg-transparent"
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
export default Toggle;