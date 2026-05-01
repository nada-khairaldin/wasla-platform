import { Mail, ArrowRight, RotateCcw } from "lucide-react";
import Logo from "../../../components/ui/Logo";
import InputField from "../../../features/auth/components/InputField";
import Button from "../../../components/ui/Button";

function ForgotPassword() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-xl overflow-hidden">
      <div className="absolute top-xl2 right-xl2">
        <Logo />
      </div>

      <div className="bg-primary-50 w-full max-w-[600px] rounded-3xl p-xl2 md:p-xl3 flex flex-col items-center shadow-sm z-10">
        <div className="bg-white/70 p-4 rounded-full shadow-inner mb-6">
          <RotateCcw className="w-8 h-8 text-neutral-400" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          هل نسيت كلمة المرور؟
        </h1>
        <p className="text-neutral-600 text-center text-sm mb-8 leading-relaxed">
          أدخل بريدك الإلكتروني وسأرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة
          بك
        </p>

        <div className="w-full mb-6">
          <div className="relative">
            <InputField
              id="email"
              type="email"
              label="البريد الإلكتروني"
              icon = {  <Mail />}
              placeholder="أدخل بريدك الإلكتروني"
              className="bg-white/70 "
            />
          
          </div>
        </div>

        <Button size="lg" variant="filled" className="w-full mb-xl">
          <RotateCcw className="w-5 h-5 ml-2 ml-sm" />
          أرسل رابط كلمة المرور
        </Button>

        <a
          href="/login"
          className=" flex items-center gap-2 text-primary-500 font-semibold hover:underline"
        >
          <ArrowRight className="w-5 h-5" />
          العودة لتسجيل الدخول
        </a>
      </div>
    </div>
  );
}
export default ForgotPassword;
