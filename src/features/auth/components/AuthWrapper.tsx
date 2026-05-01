import Image from "next/image";
import Logo from "../../../components/ui/Logo";
interface AuthWrapperProp {
  children: React.ReactNode;
  src: string;
  alt: string;
}
function AuthWrapper({ children, src, alt }: AuthWrapperProp) {
  return (
    <div className="flex min-h-screen lg:pr-xl">
      <div className="flex flex-col w-full p-base md:p-xl3 justify-center items-center lg:w-1/2 lg:items-stretch lg:rounded-l-[50px] lg:rounded-t-[50px] z-10  lg:-ml-[50px] bg-white ">
        <div className="mb-xl6 self-start">
          <Logo />
        </div>
        <div className="w-full max-w-[600px] lg:max-w-none mx-auto ">
        {children}
        </div>
      </div>
      <div className="relative hidden lg:block lg:flex-1 ">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default AuthWrapper;
