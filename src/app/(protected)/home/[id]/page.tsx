"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, Clock, Layers, Monitor, Bookmark, MessageCircle, Star } from "lucide-react";
import Button from "@/src/components/ui/Button"; 
import DetailItem from "@/src/features/posts/components/DetailItem";


const MOCK_POST_DETAILS = {
  id: "1",
  title: "تصميم شعارات احترافية وجذابة بهوية بصرية متكاملة",
  description: `أقدم خدمة تصميم شعارات مبتكرة واحترافية للشركات والأفراد. الشعار هو وجه علامتك التجارية، وأنا هنا لأضمن أن يعكس هويتك ورؤيتك بشكل فريد ومميز.

أعتمد في عملي على المراحل التالية لضمان الجودة:
- بحث مكثف حول مجال عملك ومنافسيك لبناء فكرة فريدة.
- تقديم مفاهيم أولية للشعار (تتراوح بين 3-5 خيارات متنوعة).
- تعديلات مرنة على المفهوم المختار للوصول للنتيجة المثالية.
- تسليم الملفات النهائية بجميع الصيغ وبأعلى دقة ممكنة (AI, SVG, PDF, PNG).

دعنا نعمل معاً لخلق شعار يبقى في الأذهان ويترك أثراً قوياً!`,
  provider: {
    id: "auth-123",
    name: "أحمد السلمان",
    rating: 9.7,
    time: "نشط منذ دقيقتين"
  },
  details: {
    hours: 12,
    category: "التصميم",
    serviceType: "عن بعد",
  },
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    console.log(`جاري جلب تفاصيل المنشور: ${params?.id}`);
  }, [params?.id]);

  const post = MOCK_POST_DETAILS;

  return (
    <main className="min-h-screen bg-white font-cairo pb-20" dir="rtl">
      <section className="bg-primary-700 text-white pt-8 pb-16 px-4 md:px-10 rounded-b-[40px] shadow-sm relative overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          
          <div className="flex items-center justify-between mb-10">
            <button 
              onClick={() => router.push("/home")}
              className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-white/15 transition-all active:scale-95 shadow-sm"
            >
              <ArrowRight size={16} />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 border backdrop-blur-sm shadow-sm active:scale-90
                ${isSaved 
                  ? "bg-secondary-400 border-secondary-400 text-primary-900" 
                  : "bg-white/10 border-white/10 text-white hover:bg-white/20"}`}
            >
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>

          <span className="inline-block px-3 py-1 bg-secondary-400/20 text-secondary-300 border border-secondary-400/20 rounded-lg text-xs font-black tracking-wide mb-4">
            {post.details.category}
          </span>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight max-w-[900px]">
            {post.title}
          </h1>

        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 md:px-10 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
              <div className="w-1 h-5 bg-primary-600 rounded-full" />
              <h3 className="font-bold text-neutral-800 text-base md:text-lg">وصف الخدمة بالتفصيل</h3>
            </div>
          
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line text-justify">
              {post.description}
            </p>
          </div>

         
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 p-6 rounded-[24px] border border-neutral-200/40 space-y-4">
              <h3 className="font-bold text-neutral-800 text-sm">محددات الخدمة الزمنية والميدانية</h3>
              <div className="flex gap-3 flex-wrap">
                <DetailItem icon={<Clock size={18} className="text-primary-600" />} label="الوقت المتوقع" value={`${post.details.hours} ساعة`} />
                <DetailItem icon={<Layers size={18} className="text-primary-600" />} label="المجال الرئيسي" value={post.details.category} />
                <DetailItem icon={<Monitor size={18} className="text-primary-600" />} label="طريقة تقديمها" value={post.details.serviceType} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-md shadow-neutral-100/20 space-y-4">
              <h3 className="font-bold text-neutral-400 text-xs tracking-wider">مقدم الخدمة</h3>
              
              <div 
                onClick={() => router.push(`/profile/${post.provider.id}`)}
                className="flex items-center justify-between bg-neutral-50/60 p-3.5 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-900 text-white font-black flex items-center justify-center text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {post.provider.name[0]}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-black text-primary-900 text-base group-hover:text-primary-600 transition-colors">{post.provider.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100 shadow-inner">
                  <Star size={13} fill="currentColor" />
                  <span className="text-xs font-black font-cairo">{post.provider.rating}</span>
                </div>
              </div>
            </div>


            <Button 
              onClick={() => router.push(`/messages?post=${post.id}`)}
              variant="filled" 
              className="w-full py-4 rounded-xl font-bold text-base shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform"
            >
              <MessageCircle size={18} />
              <span>تواصل الآن لإنشاء العقد</span>
            </Button>

          </div>

        </div>
      </section>
    </main>
  );
}