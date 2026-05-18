import { Notification } from "../NotificationTypes ";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    category: "contracts",
    title: "تم ارسال طلب عقد جديد من سارة علي",
    description: "خدمة تصميم نموذج اولي لتطبيق جوال",
    time: "منذ 15 دقيقة",
    isRead: false,
    iconType: "contract",
  },
  {
    id: "2",
    category: "sessions",
    title: "تم قبول عرض السعر الخاص بك",
    description: "مشروع تطوير واجهة المستخدم - شركة حلول الرقمية",
    time: "منذ ساعة",
    isRead: false,
    iconType: "offer",
  },
  {
    id: "3",
    category: "messages",
    title: "لديك رسالة جديدة من أحمد محمد",
    description: "بخصوص مشروع الهوية البصرية وتعديلات الشعار الأخير",
    time: "منذ ساعتين",
    isRead: true,
    iconType: "message",
  },
  {
    id: "4",
    category: "ratings",
    title: "لقد حصلت على تقييم جديد 5 نجوم",
    description: "من العميل: خالد عبدالله - مشروع تصميم الموقع",
    time: "منذ 5 ساعات",
    isRead: true,
    iconType: "rating",
  },
  {
    id: "5",
    category: "contracts",
    title: "تم توقيع العقد",
    description: "جلسة عمل استشارية في هندسة البرمجيات",
    time: "منذ يوم",
    isRead: true,
    iconType: "session",
  },
];