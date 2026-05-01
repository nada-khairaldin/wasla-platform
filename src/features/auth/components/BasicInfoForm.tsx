"use client";
import {
  LockKeyhole,
  Mail,
  MapPin,
  RotateCcwKey,
  User,
  UserRound,
} from "lucide-react";
import InputField from "./InputField";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import { useSignupActions, useSignupStore } from "../store/useSignupStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoSchema, basicInfoSchema } from "../schemas/authSchema";
import { useRouter } from "next/navigation";

const GAZA_CITIES = [
  "غزة",
  "جباليا",
  "بيت لاهيا",
  "بيت حانون",
  "دير البلح",
  "النصيرات",
  "البريج",
  "المغازي",
  "الزوايدة",
  "خان يونس",
  "رفح",
];

function BasicInfoForm() {
  const [selectedCity, setSelectedCity] = useState("");
  const router = useRouter();
  const { formData } = useSignupStore();
  const { setStepData } = useSignupActions();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoSchema>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formData,
    mode: "onBlur",
  });

  const onSubmit = (data: Partial<BasicInfoSchema>) => {
    setStepData(data);
    router.push("/signup/skill-matching");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}
      className="flex flex-col gap-lg"
    >
      <InputField
        id="user name"
        label="اسم المستخدم"
        type="text"
        placeholder=" أدخل اسم مستخدم"
        icon={<UserRound />}
        {...register("username")}
        error={errors.username?.message}
      />

      <InputField
        id="name"
        label="الاسم"
        type="text"
        placeholder="أدخل اسمك"
        icon={<User />}
        {...register("full_name")}
        error={errors.full_name?.message}
      />

      <div className="w-full flex flex-col">
        <label
          htmlFor="location"
          className="text-neutral-800 text-lg block font-bold text-right m-sm mb-2"
        >
          المدينة (الموقع)
        </label>

        <div className="relative w-full">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-neutral-400">
            <MapPin size={20} />
          </div>

          <select
            id="location"
            {...register("city")}
            onChange={(e) => setSelectedCity(e.target.value)}
            className={`w-full rounded-xl border-none p-4 pr-12 outline-none focus:ring-1 focus:ring-neutral-200 transition-all bg-neutral-50 text-right appearance-none 
      ${selectedCity === "" ? "text-neutral-400" : "text-neutral-900"}`}
            dir="rtl"
          >
            <option value="" className="text-neutral-100">
              اختر مدينتك
            </option>
            {GAZA_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* رسالة الخطأ تظهر الآن خارج حاوية الأيقونة فلا تؤثر عليها */}
        {errors.city && (
          <p className="text-red-500 text-sm mt-1 text-right">
            {errors.city.message}
          </p>
        )}
      </div>

      <InputField
        id="email"
        label="البريد الالكتروني"
        type="email"
        placeholder="أدخل البريد الالكتروني"
        icon={<Mail />}
        {...register("email")}
        error={errors.email?.message}
      />

      <InputField
        id="password"
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        icon={<LockKeyhole />}
        {...register("password")}
        error={errors.password?.message}
      />
      <InputField
        id="confirmPassword"
        label="تأكيد كلمة المرور"
        type="password"
        placeholder="أكد كلمة المرور"
        icon={<RotateCcwKey />}
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" size="lg" variant="filled" className="mt-xl">
        استمرار
      </Button>
    </form>
  );
}

export default BasicInfoForm;
