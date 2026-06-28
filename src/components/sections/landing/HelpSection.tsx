"use client";
import { useState } from "react";
import {
  Wrench,
  Laptop,
  GraduationCap,
  Languages,
  X,
  LogIn,
  Sprout,
  BriefcaseMedical,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "../../ui/Button";
import { useQuery } from "@tanstack/react-query";
import { skillsService } from "@/src/features/skills/services/skillsService";
import { useMemo } from "react";
import { Code, Palette, Lightbulb } from "lucide-react";

const INITIAL_CATEGORIES = [
  { id: 1, name: "إصلاح منزلي", icon: <Wrench size={32} /> },
  { id: 2, name: "دعم تقني", icon: <Laptop size={32} /> },
  { id: 3, name: "تعليم", icon: <GraduationCap size={32} /> },
  { id: 4, name: "رعاية صحية", icon: <BriefcaseMedical size={32} /> },
  { id: 5, name: "ترجمة", icon: <Languages size={32} /> },
  { id: 6, name: "زراعة", icon: <Sprout size={32} /> },
  { id: 7, name: "برمجة", icon: <Code size={32} /> },
  { id: 8, name: "تصميم", icon: <Palette size={32} /> },
];

const getIconForCategory = (name: string) => {
  const normalized = name.trim();
  const iconMap: Record<string, React.ReactNode> = {
    "إصلاح منزلي": <Wrench size={32} />,
    "دعم تقني": <Laptop size={32} />,
    "تعليم": <GraduationCap size={32} />,
    "رعاية صحية": <BriefcaseMedical size={32} />,
    "ترجمة": <Languages size={32} />,
    "زراعة": <Sprout size={32} />,
    "برمجة": <Code size={32} />,
    "تصميم": <Palette size={32} />,
  };
  
  for (const [key, icon] of Object.entries(iconMap)) {
    if (normalized.includes(key)) return icon;
  }
  return <Lightbulb size={32} />;
};

const motivationalMessage =
  "هذا المجال مليء بالمبدعين المستعدين لتبادل خبراتهم معك. انضم إلينا الآن وابدأ رحلة تبادل المعرفة!";

const CategorySection = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const { data: backendSkills = [], isLoading } = useQuery({
    queryKey: ["skills", "landing"],
    queryFn: async () => {
      const { data, error } = await skillsService.getSkills();
      if (error) throw new Error(error);
      return data?.skills || [];
    },
    enabled: showAll,
    staleTime: 1000 * 60 * 10,
  });

  const mergedCategories = useMemo(() => {
    const map = new Map<string, { id: string | number; name: string; icon: React.ReactNode }>();
    
    INITIAL_CATEGORIES.forEach(cat => {
      map.set(cat.name, cat);
    });
    
    if (backendSkills && backendSkills.length > 0) {
      backendSkills.forEach(skill => {
        if (!map.has(skill.name)) {
          map.set(skill.name, {
            id: skill.id || `be-${skill.name}`,
            name: skill.name,
            icon: getIconForCategory(skill.name),
          });
        }
      });
    }
    
    return Array.from(map.values());
  }, [backendSkills]);

  return (
    <section className="py-xl4 px-base md:px-xl8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h4 font-bold text-primary-500 mb-4">
            بماذا تحتاج المساعدة؟
          </h2>
          <p className="text-gray-600">آلاف المهارات متاحة للتبادل اليوم.</p>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowAll(true)}
            className="group flex items-center gap-sm text-neutral-500 hover:text-primary-600 font-bold transition-all"
            aria-label="عرض جميع الخدمات والمهارات المتاحة"
          >
            <span>عرض جميع الفئات</span>
            <ChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-xl">
          {INITIAL_CATEGORIES.slice(0, 6).map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCat(cat.name)}
              className="group relative p-xl rounded-3xl bg-neutral-50 flex flex-col items-center justify-center gap-base border-2 border-transparent hover:border-primary-400 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="text-primary-500 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="text-primary-500 font-bold text-sm md:text-body-1 text-center">
                {cat.name}
              </span>

              <div className="absolute bottom-0 h-1 w-0 bg-primary-500 group-hover:w-full transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showAll && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-base md:p-xl3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAll(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white rounded-[2.5rem] p-6 md:p-10 w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
              >
                <div className="flex justify-between items-center mb-xl2 px-xs">
                  <h3 className="text-2xl font-black text-primary-400">
                    جميع فئات المساعدة
                  </h3>
                  <button
                    onClick={() => setShowAll(false)}
                    className="p-xs bg-slate-100 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="إغلاق جميع الفئات"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-xs relative min-h-[200px]">
                  {isLoading && backendSkills.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-base">
                    {mergedCategories.map((cat) => (
                      <motion.div
                        key={cat.name}
                        layout
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedCat(cat.name);
                          setShowAll(false);
                        }}
                        className="group p-6 rounded-2xl bg-slate-50 flex flex-col items-center gap-sm border-2 border-transparent hover:border-primary-400 hover:bg-white transition-all cursor-pointer"
                      >
                        <div className="text-primary-500">{cat.icon}</div>
                        <span className="font-bold text-primary-500 text-sm text-center">
                          {cat.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedCat && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-base">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCat(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                  duration: 0.5,
                }}
                className="bg-white rounded-[3rem] p-10 md:p-16 w-full max-w-[700px] shadow-2xl relative z-10 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedCat(null)}
                  className="absolute top-6 left-6 p-2 bg-slate-100 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="إغلاق تفاصيل الفئة المختارة"
                >
                  <X size={24} />
                </button>
                <div className="flex flex-col items-center text-center space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-extrabold text-primary-400 leading-tight">
                      خطوتك الأولى في
                      <span className="text-primary-500">
                        {` " ${selectedCat}" `}
                      </span>
                      تبدأ هنا
                    </h3>
                    <p className="text-neutral-600 text-lg leading-relaxed">
                      {motivationalMessage}
                    </p>
                  </div>
                  <Link href="/signup" className="w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="filled"
                        size="lg"
                        className="w-full rounded-xl gap-sm"
                        aria-label={`انضم إلينا الآن مجاناً لبدء تبادل المهارات في فئة ${selectedCat}`}
                      >
                        <LogIn size={26} /> انضم إلينا الآن مجاناً
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySection;
