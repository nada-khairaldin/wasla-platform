"use client";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  // to generate initials if avatar is not provided
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div
      dir="rtl"
      className="flex-shrink-0 w-[320px] bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-xl2 flex flex-col gap-base border-t-2 border-b-2 border-primary-300 mx-2 transition-all duration-300 hover:shadow-md"
    >
      <div className="flex items-center gap-sm">
        <div className="w-12 h-12 rounded-full bg-primary-400 flex items-center justify-center text-white font-bold text-lg border-2 border-white shadow-sm flex-shrink-0">
          {getInitials(testimonial.name)}
        </div>

        <div className="flex flex-col">
          <span className="text-base font-bold text-neutral-800 ">
            {testimonial.name}
          </span>
          <span className="text-sm text-neutral-400 ">{testimonial.role}</span>
        </div>
      </div>

      <p className="text-sm text-neutral-500 leading-relaxed text-right ">
        &quot;{testimonial.quote}&quot;
      </p>
    </div>
  );
}
