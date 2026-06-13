"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { PostCard } from "./PostCard";
import { Post } from "../type";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MOCK_RECOMMENDED: Post[] = Array(10)
  .fill(null)
  .map((_, i) => ({
    id: i,
    title:
      i % 2 === 0
        ? "تصميم هوية بصرية لمتجر إلكتروني"
        : "مطلوب كاتب محتوى لمقالات تقنية",
    description:
      "نبحث عن محترف متخصص في بناء الهوية البصرية وشعارات المتاجر، يشمل ذلك اختيار الألوان والخطوط ودليل الاستخدام.",
    category: i % 2 === 0 ? "OFFER" : "REQUEST",
    assignedTimeCredits: i % 2 === 0 ? 5 : 12,
    serviceMode: i % 2 === 0 ? "ONLINE" : "OFFLINE",
    status: "PUBLISHED",
    userId: i + 100,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * (i + 1)).toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: i + 100,
      username: i % 2 === 0 ? "أحمد السعيد" : "سارة علي",
      email: `user${i}@example.com`,
      full_name: i % 2 === 0 ? "أحمد السعيد" : "سارة علي",
      profile_image: "https://i.pravatar.cc/150?img=" + i,
    },
  }));

export const RecommendedCarousel = () => {
  return (
    <div className="relative recommended-swiper-container group px-2 md:px-4">
      <button className="swiper-prev-btn absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-neutral-400 hover:text-secondary-500 transition-all border border-neutral-50 cursor-pointer active:scale-90">
        <ChevronRight size={26} />
      </button>

      <button className="swiper-next-btn absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-white shadow-xl rounded-full flex items-center justify-center text-neutral-400 hover:text-secondary-500 transition-all border border-neutral-50 cursor-pointer active:scale-90">
        <ChevronLeft size={26} />
      </button>

      <Swiper
        dir="rtl"
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={false}
        navigation={{
          nextEl: ".swiper-next-btn",
          prevEl: ".swiper-prev-btn",
        }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
        }}
        className="pb-14 pt-4"
      >
        {MOCK_RECOMMENDED.map((post) => (
          <SwiperSlide key={post.id} className="h-full py-2">
            <div className="custom-post-wrapper text-neutral-900">
              <PostCard post={post} isRecommended={true} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="custom-pagination flex justify-center gap-2 mt-2"></div>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #e2e8f0;
          opacity: 1;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .custom-pagination .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 6px;
          background: #efcf85 !important;
          box-shadow: 0 4px 10px rgba(251, 146, 60, 0.3);
        }
        .recommended-swiper-container .swiper-slide {
          height: auto !important;
        }

        .custom-post-wrapper {
          width: 100%;
          height: 100%;
          pointer-events: auto;
        }

        .custom-post-wrapper > div:hover {
          border-color: #efcf85 !important;
          box-shadow: 0 20px 40px rgba(239, 207, 133, 0.35) !important;
        }

        .custom-post-wrapper > div:hover .identification-arrow {
          transform: translateX(-5px);
          color: #215479 !important;
        }

        .custom-post-wrapper > div:hover .card-title {
          color: #215479 !important;
        }
      `}</style>
    </div>
  );
};
