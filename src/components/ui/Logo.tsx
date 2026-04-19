import Image from "next/image";
import Link from "next/link";

function Logo({ isFooter = false }: { isFooter?: boolean }) {
  return (
    <Link href="/">
      <div
        className={
          isFooter
            ? "relative w-14 h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 bg-white rounded-2xl flex items-center justify-center p-2 md:p-3"
            : ""
        }
      >
        <Image
          src="/images/common/logo.svg"
          alt="Wasla Logo"
          width={60}
          height={70}
          className={
            isFooter
              ? "object-contain translate-x-1 hover:-rotate-10 hover:scale-120 transition-transform duration-300"
              : ""
          }
        />
      </div>
    </Link>
  );
}

export default Logo;
