/* 
  GET /api/posts
  {
    "posts": [
      {
        "id": "uuid-123",
        "title": "عنوان المنشور",
        "description": "تفاصيل العمل...",
        "type": "طلب" | "عرض",
        "category": "البرمجة" | "التصميم" | ...الخ,
        "hours": 15,
        "isOnline": true,
        "location": "Gaza" (اختياري),
        "author": {
           "id": "user-456",
           "name": "اسم الشخص",
           "image": "url_to_image",
           "time": "منذ ساعة"
        }
      }
    ],
    "totalCount": 100
  }
*/