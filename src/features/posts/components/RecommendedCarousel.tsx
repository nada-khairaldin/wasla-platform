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

interface RecommendedCarouselProps {
  posts: Post[];
}

export const RecommendedCarousel = ({ posts }: RecommendedCarouselProps) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative recommended-swiper-container group px-2 md:px-4">
      {/* Mobile Native Scroll Snap (Visible only on mobile) */}
      <div 
        className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 hide-scrollbar" 
        dir="rtl"
      >
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="w-[85vw] flex-shrink-0 snap-center snap-always h-auto"
          >
            <div className="custom-post-wrapper text-neutral-900 h-full">
              <PostCard post={post} isRecommended={true} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Swiper Carousel (Visible only on md and up) */}
      <div className="hidden md:block">
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
            640: { slidesPerView: 1, slidesPerGroup: 1 },
            1024: { slidesPerView: 2, slidesPerGroup: 2 },
          }}
          className="pb-14 pt-4"
        >
          {posts.map((post) => (
            <SwiperSlide key={post.id} className="h-full py-2">
              <div className="custom-post-wrapper text-neutral-900">
                <PostCard post={post} isRecommended={true} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-pagination flex justify-center gap-2 mt-2"></div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
