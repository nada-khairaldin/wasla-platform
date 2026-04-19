import { BadgeCheck, TriangleAlert } from "lucide-react";

function ChallengeAndSolutionSection() {
  return (
    <section className="py-xl4 md:py-xl4 px-base sm:px-xl2 md:px-xl4 bg-neutral-50 flex flex-col items-center gap-xl2 md:gap-xl4 mt-xl3 mb-xl3">
      <div className="text-center max-w-2xl space-y-sm md:space-y-md">
        <h2 className="font-bold text-h4 sm:text-h3 md:text-h2 text-primary-500">
          لماذا بنك الوقت في غزة؟
        </h2>
        <p className="text-body-3 sm:text-body-2 md:text-body-1 text-neutral-600">
          بعد الحرب في غزة، حين تضيق الموارد، يصبح الوقت عملة، &quot;وصلة&quot; تربط
          المهارات لتصنع فرصًا من لا شيء.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-xl2 lg:gap-xl3 w-full max-w-7xl lg:px-xl8">
        <div className="flex-1 flex flex-col p-lg md:p-xl lg:p-xl3 gap-md md:gap-4xl rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-center rounded-2xl w-xl2 h-xl2 bg-secondary-500/10">
            <TriangleAlert className="text-secondary-500" size={24} />
          </div>
          <div className="space-y-2">
            <h5 className="text-h6 md:text-h5 font-bold text-primary-500">
              التحدي
            </h5>
            <p className="text-body-3 md:text-body-1 text-neutral-500 leading-relaxed">
              يواجه كثيرون صعوبة في الوصول إلى فرص عمل أو موارد مالية رغم
              امتلاكهم مهاراتٍ قيّمة، وقد زادت آثار الحرب من تعقيد هذه الفرص.
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-lg md:p-xl lg:p-xl3 gap-md md:gap-4xl rounded-2xl border-2 border-primary-500 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="flex items-center justify-center rounded-2xl w-xl2 h-xl2 bg-primary-500">
            <BadgeCheck className="text-white" size={24} />
          </div>
          <div className="space-y-2">
            <h5 className="text-h6 md:text-h5 font-bold text-primary-500">
              حل وصلة
            </h5>
            <p className="text-body-3 md:text-body-1 text-neutral-500 leading-relaxed">
              توفّر &quot;وصلة&quot; بيئة لتبادل المهارات بدل الدفع؛ تقدّم ما تتقنه وتحصل
              على ما تحتاجه، حيث يصبح وقتك ذا قيمة حقيقية في دعم المجتمع وتعزيز
              صموده.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChallengeAndSolutionSection;
