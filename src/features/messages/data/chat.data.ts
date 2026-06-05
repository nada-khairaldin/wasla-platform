import type { PersonFolder } from "../chat.types";

export const MOCK_PERSONS: PersonFolder[] = [
  {
    personId: "p1",
    personName: "محمد علي",
    initials: "ع م",
    avatarColor: "bg-primary-500", 
    isOnline: true,
    rooms: [
      {
        id: "r1",
        postTitle: "تعديل ألوان الشعار",
        lastMessage: "متى يمكننا البدء؟",
        lastMessageTime: "10:30 ص",
        status: "online",
        unreadCount: 0,
        messages: [
          {
            id: "m1",
            sender: "other",
            text: "السلام عليكم هل بمكنك مساعدتي في تعديل ألوان الشعار الحالي؟ احتاج لكون أكثر حيوية",
            timestamp: "10:10 ص",
            status: "read", 
          },
          {
            id: "m2",
            sender: "me",
            text: "أهلا بك محمد بالتأكيد! يمكننا تجربة لوحة ألوان متدرجة حديثة. هل لديك أمثلة معينة أعجبتك؟",
            timestamp: "10:15 ص",
            status: "read", 
          },
          {
            id: "m3",
            sender: "other",
            text: "نعم سأرسل لك بعض النماذج الآن.. هل يمكننا البدء؟",
            timestamp: "10:28 ص",
            status: "read", 
          },
        ],
      },
      {
        id: "r2",
        postTitle: " تعلم بايثون",
        lastMessage: "كم من الوقت؟",
        lastMessageTime: "أمس",
        status: "online",
        unreadCount: 2,
        messages: [
          {
            id: "m4",
            sender: "other",
            text: "مرحباً، كم من الوقت تحتاج لإنهاء المشروع؟",
            timestamp: "أمس 3:00 م",
            status: "read",
          },
          {
            id: "m5",
            sender: "other",
            text: "كم من الوقت؟",
            timestamp: "أمس 3:02 م",
            status: "read",
          },
        ],
      },
    ],
  },
  {
    personId: "p2",
    personName: "احمد حسن",
    initials: "اح",
    avatarColor: "bg-amber-500", 
    isOnline: false,
    rooms: [
      {
        id: "r3",
        postTitle: "تعليم محادثة باللغة الانجليزية",
        lastMessage: "متى يمكننا البدء؟",
        lastMessageTime: "الاثنين",
        status: "online",
        unreadCount: 1,
        messages: [
          {
            id: "m6",
            sender: "other",
            text: "هل يمكنك مساعدتي في تعلم المحادثة اليومية؟",
            timestamp: "الاثنين 9:00 ص",
            status: "read",
          },
        ],
      },
    ],
  },
  {
    personId: "p3",
    personName: "احمد محمود",
    initials: "ام",
    avatarColor: "bg-emerald-500", 
    isOnline: false,
    rooms: [
      {
        id: "r4",
        postTitle: "تصميم هوية بصرية",
        lastMessage: "العفو، يسعدني جداً أن التصميم نال إعجابك!",
        lastMessageTime: "السبت",
        status: "offline",
        unreadCount: 0,
        messages: [
          {
            id: "m7",
            sender: "me",
            text: "تم الانتهاء من الهوية البصرية، يمكنك مراجعتها الآن.",
            timestamp: "السبت 2:00 م",
            status: "read", 
          },
          {
            id: "m8",
            sender: "other",
            text: "شكراً جزيلاً، العمل رائع!",
            timestamp: "السبت 2:30 م",
            status: "read",
          },
          {
            id: "m9",
            sender: "me",
            text: "العفو، يسعدني جداً أن التصميم نال إعجابك!",
            timestamp: "السبت 2:35 م",
            status: "delivered", 
          },
          {
            id: "m10",
            sender: "me",
            text: "أخبرني إذا كنت بحاجة لتعديل الملفات المصدرية المرفقة.",
            timestamp: "السبت 2:36 م",
            status: "sent",
          },
        ],
      },
    ],
  },
];