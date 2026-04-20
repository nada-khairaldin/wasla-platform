import Image from "next/image";
import { useState } from "react";

const avatars = [
  { id: 1, src: "/images/avatars/avatar1.webp", alt: "عضو 1" },
  { id: 2, src: "/images/avatars/avatar2.webp", alt: "عضو 2" },
  { id: 3, src: "/images/avatars/avatar3.webp", alt: "عضو 3" },
];

export default function AvatarContainer() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-sm "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center pl-2">
        {avatars.map((avatar, index) => (
          <Image
            key={avatar.id}
            src={avatar.src}
            alt={avatar.alt}
            width={40}
            height={40}
            className={`relative rounded-full object-cover border-2 border-neutral-50 transition-transform duration-200 -ml-2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
        ${hovered ? "scale-105" : "scale-100"}
        ${index === 1 ? "z-10" : "z-0"}
      `}
          />
        ))}
      </div>

      <p className="font-medium text-label-1 text-neutral-400">
        انضم إلينا أكثر من 1,200 من سكان غزة هذا الشهر
      </p>
    </div>
  );
}
