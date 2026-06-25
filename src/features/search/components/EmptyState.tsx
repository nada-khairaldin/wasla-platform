import { SearchX, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface SearchEmptyStateProps {
  query?: string;
  onResetFilters?: () => void;
  hasFilters?: boolean;
}

export const SearchEmptyState = ({ query, onResetFilters, hasFilters }: SearchEmptyStateProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-4 text-center h-full"
  >
    <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-5 border border-neutral-100 shadow-sm">
      <SearchX size={36} className="text-neutral-400" />
    </div>
    <h3 className="text-neutral-900 font-bold mb-2 text-lg">
      {query ? "لا توجد نتائج مطابقة" : "ابحث في وصلة"}
    </h3>
    <p className="text-neutral-500 text-[13px] max-w-[280px] leading-relaxed mb-6">
      {query
        ? `لم نتمكن من العثور على أي نتائج مطابقة لـ "${query}". حاول استخدام كلمات مختلفة.`
        : "ابدأ البحث لاستكشاف المنشورات، الطلبات، والعروض أو ابحث عن مستخدمين."}
    </p>

    {query && hasFilters && onResetFilters && (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onResetFilters}
        className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl font-bold text-sm border border-primary-100 hover:bg-primary-100 transition-colors"
      >
        <RotateCcw size={14} />
        <span>إعادة تعيين الفلاتر</span>
      </motion.button>
    )}
  </motion.div>
);
