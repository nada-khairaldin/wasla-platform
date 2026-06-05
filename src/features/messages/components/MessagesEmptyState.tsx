import { EnvelopeIllustration } from "./EnvelopeIllustration";

type MessagesEmptyStateProps = {
  onBrowseServices?: () => void;
};

export function MessagesEmptyState({
  onBrowseServices,
}: MessagesEmptyStateProps) {
  return (
    <div
      className="min-h-screen bg-white flex flex-col px-4 md:px-8 lg:px-16 py-8"
      dir="rtl"
    >
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-neutral-900 text-right">
        الرسائل
      </h1>

      {/* Centered empty state content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <EnvelopeIllustration />

        <p className="text-sm font-medium text-neutral-400">
          لا توجد محادثات بعد
        </p>

        <button
          type="button"
          onClick={onBrowseServices}
          className="px-16 py-3.5 rounded-2xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 active:scale-[0.98] transition-all shadow-sm"
        >
          تصفح المنشورات
        </button>
      </div>
    </div>
  );
}
