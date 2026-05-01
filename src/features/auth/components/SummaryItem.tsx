import { Check} from "lucide-react";
function SummaryItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center gap-sm w-full">
      <div className="w-[24px] h-[24px] md:w-[28px] md:h-[27px] bg-success-50 text-success-500 rounded-full flex items-center justify-center  flex-shrink-0">
        <Check size={14} strokeWidth={4} />
      </div>


      <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] bg-success-50 text-primary-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>


      <div
        className="flex-1  bg-white flex items-center justify-start px-xl py-base rounded-[12px]  shadow-sm"
        style={{
          boxShadow:
            "8px 5px 20px rgba(158, 158, 158, 0.1), 31px 21px 37px rgba(158, 158, 158, 0.08)",
        }}
      >
        <div className="flex items-center gap-1">
          <span className="text-neutral-800 text-[12px] font-bold">{label}:</span>
          <span className="text-neutral-400 font-bold text-[14px]">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SummaryItem
