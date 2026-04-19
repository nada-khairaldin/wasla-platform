"use client";

import { useState } from "react";
import TestimonialCard, { Testimonial } from "./TestimonialCard";

interface ScrollingCarouselProps {
  testimonials: Testimonial[];
}

export default function ScrollingCarousel({
  testimonials = [],
}: ScrollingCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!testimonials || testimonials.length === 0) return null;

  const doubled = [...testimonials, ...testimonials];
  const duration = testimonials.length * 8;

  return (
    <div className="w-full overflow-hidden py-10" dir="ltr">
      <div
        className="flex gap-6 w-max"
        style={{
          animation: `carousel-scroll ${duration}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          cursor: "pointer",
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} testimonial={t} />
        ))}
      </div>

      <style>{`
        @keyframes carousel-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}