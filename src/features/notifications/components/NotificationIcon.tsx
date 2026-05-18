import { FileText, CheckCircle, MessageCircle, Star, Briefcase } from "lucide-react";
import { Notification } from "../NotificationTypes ";

interface NotificationIconProps {
  iconType: Notification["iconType"];
}

const iconConfig = {
  contract: {
    Icon: FileText,
    bg: "bg-[#e9eef2]",
    color: "text-[#215479]",
  },
  offer: {
    Icon: CheckCircle,
    bg: "bg-[#e6f4ee]",
    color: "text-[#079455]",
  },
  message: {
    Icon: MessageCircle,
    bg: "bg-[#e9eef2]",
    color: "text-[#215479]",
  },
  rating: {
    Icon: Star,
    bg: "bg-[#fef4e6]",
    color: "text-[#f79009]",
  },
  session: {
    Icon: Briefcase,
    bg: "bg-[#e9eef2]",
    color: "text-[#215479]",
  },
} as const;

export function NotificationIcon({ iconType }: NotificationIconProps) {
  const { Icon, bg, color } = iconConfig[iconType];

  return (
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}
    >
      <Icon size={20} className={color} strokeWidth={1.8} />
    </div>
  );
}