
import { Contract } from "../contract.types";

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: "1",
    title: "تصليح عطل كهربائي في المنزل",
    seekerName: "أحمد خالد",
    providerName: "محمد أحمد",
    serviceType: "صيانة كهربائية", 
    deliveryType: "أوفلاين",       
    status: "active",
    stats: {
      completedHours: 2,
      totalHours: 5,
      endDate: "25 مايو 2026",
      remainingHours: 3,
    },
    workSessions: [
      { id: "ws1", date: "12 مايو 2026", hours: 1, notes: "إصلاح لوحة المفاتيح الرئيسية", status: "مؤكدة" },
      { id: "ws2", date: "10 مايو 2026", hours: 1, notes: "فحص التمديدات الداخلية", status: "مؤكدة" },
      { id: "ws3", date: "02 مايو 2026", hours: 1, notes: "تغيير خطوط الإضاءة", status: "غير مؤكدة" },
    ],
    operationLogs: [
      {
        id: "l1",
        title: "تأكيد جلسة العمل 2",
        byLine: "بواسطة العميل، 14 مايو 2026. 02:30 م",
        description: "قام العميل بالموافقة على الجلسة المسجلة (1 ساعة)",
      },
      {
        id: "l2",
        title: "إضافة جلسة عمل جديدة",
        byLine: "بواسطتك، 14 مايو 2026. 02:00 ص",
      },
      {
        id: "l3",
        title: "قبول العقد",
        byLine: "بواسطة العميل، 10 مايو 2026. 04:30 م",
      },
    ],
  },
  {
    id: "2",
    title: "تطوير تطبيق متجر إلكتروني",
    seekerName: "سارة علي",
    providerName: "أحمد محمد",
    serviceType: "تطوير ويب",
    deliveryType: "أونلاين",
    status: "active",
    stats: {
      completedHours: 10,
      totalHours: 30,
      endDate: "15 يونيو 2026",
      remainingHours: 20,
    },
  },
  {
    id: "3",
    title: "حملة تسويقية لمتجر محلي",
    seekerName: "منى حسن",
    providerName: "خالد عبدالله",
    serviceType: "تسويق رقمي",
    deliveryType: "أونلاين",
    status: "active",
    stats: {
      completedHours: 4,
      totalHours: 12,
      endDate: "01 يونيو 2026",
      remainingHours: 8,
    },
  },
  {
    id: "4",
    title: "جلسة استشارية لتطوير الأعمال",
    seekerName: "ريم الأحمد",
    providerName: "فيصل العمر",
    serviceType: "استشارات تجارية",
    deliveryType: "أوفلاين",
    status: "active",
    stats: {
      completedHours: 1,
      totalHours: 3,
      endDate: "28 مايو 2026",
      remainingHours: 2,
    },
  },
  {
   id: "5",
    title: "تصميم واجهات مستخدم لتطبيق موبايل",
    seekerName: "عمر الزهراني",
    providerName: "نورة السالم",
    serviceType: "تصميم واجهات (UI/UX)",
    deliveryType: "أونلاين",
    status: "pending", // عقد قيد الانتظار
    stats: {
      completedHours: 0,
      totalHours: 15,
      endDate: "10 يونيو 2026", // تاريخ إجباري
      remainingHours: 15,
    },
  },
  {
    id: "6",
    title: "تدريب على مهارات المحادثة الإنجليزية",
    seekerName: "لمى العتيبي",
    providerName: "هاني الشمري",
    serviceType: "تعليم ولغات",
    deliveryType: "أونلاين",
    status: "pending", // عقد قيد الانتظار
    stats: {
      completedHours: 0,
      totalHours: 8,
      endDate: "05 يونيو 2026", // تاريخ إجباري
      remainingHours: 8,
    },
  },
];

