"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

function DesktopPublicNavLinks({
  links,
}: {
  links: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  return (

    <ul className="hidden md:flex items-center gap-8 lg:gap-14 list-none m-0 p-0">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <motion.li
            key={link.href}
            className="relative"

            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={link.href}
              className="relative block py-2 no-underline outline-none"
            >
              <span
                className={`block font-cairo text-[17px] font-bold transition-colors duration-300 whitespace-nowrap ${
                  isActive
                    ? "text-primary-600"
                    : "text-neutral-600 hover:text-primary-500"
                }`}
              >
                {link.label}
              </span>

          
              {isActive && (
                <motion.span
                  layoutId="activeUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary-500 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default DesktopPublicNavLinks;