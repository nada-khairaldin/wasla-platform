import { motion } from "framer-motion";

export interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  date: Date;
}

interface ContractActivityTimelineProps {
  events: TimelineEvent[];
}

const formatTimelineDate = (date: Date) => {
  try {
    return date.toLocaleString("ar-EG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

export function ContractActivityTimeline({ events }: ContractActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <p className="text-sm font-medium text-neutral-500">
          لا توجد أي عمليات مسجلة لهذا العقد حتى الآن
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 max-h-[380px] overflow-y-auto pl-1">
      {events.map((event, index) => {
        return (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className="flex gap-3 relative pb-4 text-right items-start group"
          >
            {/* Unified Circle */}
            <div className="w-3.5 h-3.5 rounded-full bg-primary-50 border-2 border-primary-400 mt-0.5 shrink-0 z-10 group-hover:border-primary-500 group-hover:bg-primary-100 transition-colors duration-150" />
            
            {/* Connecting Vertical Line (only shown if not the last item) */}
            {index < events.length - 1 && (
              <div className="absolute top-4 right-[6.5px] w-px h-[calc(100%-8px)] bg-neutral-100" />
            )}

            {/* Text details */}
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <p className="text-xs font-bold text-neutral-800 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </p>
                <span className="text-[9px] font-semibold text-neutral-400 shrink-0">
                  {formatTimelineDate(event.date)}
                </span>
              </div>
              {event.description && (
                <p className="text-[11px] text-neutral-500 leading-relaxed pt-0.5">
                  {event.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
