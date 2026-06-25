import { AlertCircle, RefreshCw } from "lucide-react";

export const SearchErrorState = ({
  message = "حدث خطأ أثناء البحث",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle size={32} className="text-red-500" />
    </div>
    <h3 className="text-red-600 font-bold mb-2">تعذر إكمال البحث</h3>
    <p className="text-red-400/80 text-sm mb-6 max-w-[250px]">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold active:scale-95"
      >
        <RefreshCw size={16} />
        إعادة المحاولة
      </button>
    )}
  </div>
);
