"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const images = [
  "/images/landing/hero1.webp",
  "/images/landing/hero1.webp",
  "/images/landing/hero1.webp",
];

export default function HeroSlider() {
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

  return (
    /* Height scales: 220px mobile → 360px tablet → 500px desktop */
    <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[500px] group">
      <button
        ref={(node) => setPrevEl(node)}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10
                   w-8 h-8 md:w-11 md:h-11 flex items-center justify-center
                   border border-white/60 text-white rounded-full
                   backdrop-blur-sm bg-white/10
                   opacity-0 group-hover:opacity-100
                   hover:bg-white hover:text-black
                   transition-all duration-300 ease-in-out shadow-lg"
                   aria-label="السابق"
      >
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>

      <button
        ref={(node) => setNextEl(node)}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10
                   w-8 h-8 md:w-11 md:h-11 flex items-center justify-center
                   border border-white/60 text-white rounded-full
                   backdrop-blur-sm bg-white/10
                   opacity-0 group-hover:opacity-100
                   hover:bg-white hover:text-black
                   transition-all duration-300 ease-in-out shadow-lg"
                    aria-label="التالي"
      >
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          prevEl,
          nextEl,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-bullet",
          bulletActiveClass: "swiper-bullet-active",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-full h-full rounded-3xl md:rounded-5xl"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={src}
                alt="hero image"
                fill
                className="object-cover rounded-3xl md:rounded-5xl"
                priority={i === 0} 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
