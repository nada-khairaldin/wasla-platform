"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Lock, Contact, HandHeart, ShoppingBasket, AlertOctagon } from "lucide-react";
import ServicesTagSelector from "./ServicesTagSelector";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, EditProfileFormData } from "@/src/features/auth/schemas/authSchema";

interface EditProfileFormProps {
  initialData: {
    name: string;
    username: string;
    bio: string;
    servicesNeeded: string[];
    servicesOffered: string[];
  } | null;
  isLoading: boolean;
  isPending: boolean;
  onSubmit: (data: {
    name: string;
    bio: string;
    servicesNeeded: string[];
    servicesOffered: string[];
  }) => void;
  onCancel: () => void;
}

export default function EditProfileForm(props: EditProfileFormProps) {
  const { initialData, isLoading, isPending, onSubmit, onCancel } = props;

  const [username, setUsername] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      bio: "",
      servicesNeeded: [],
      servicesOffered: [],
    },
  });


  const servicesNeeded = watch("servicesNeeded") || [];
  const servicesOffered = watch("servicesOffered") || [];
  const bio = watch("bio") || "";


  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        bio: initialData.bio || "",
        servicesNeeded: initialData.servicesNeeded || [],
        servicesOffered: initialData.servicesOffered || [],
      });
      setUsername(initialData.username || "");
    }
  }, [initialData, reset]);

  const handleBack = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    onCancel();
  };

  const handleServicesNeededChange = (tags: string[]) => {
    setValue("servicesNeeded", tags, { shouldDirty: true, shouldValidate: true });
  };

  const handleServicesOfferedChange = (tags: string[]) => {
    setValue("servicesOffered", tags, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmitForm = (data: EditProfileFormData) => {
    onSubmit({
      name: data.name,
      bio: data.bio ?? "",
      servicesNeeded: data.servicesNeeded,
      servicesOffered: data.servicesOffered,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-neutral-150 flex items-center justify-center text-primary-500 hover:bg-neutral-50 hover:shadow-sm transition-all cursor-pointer"
            title="رجوع للملف الشخصي"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-cairo">تعديل الملف الشخصي</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1.5">تحديث معلوماتك الشخصية والخدمات التي تقدمها أو تحتاجها</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6 w-full animate-pulse">
            <div className="bg-white rounded-3xl border border-neutral-100 p-5 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-32 rounded" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-40 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <div className="flex justify-between mt-1">
                  <Skeleton className="h-3.5 w-16 rounded" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-neutral-100 p-5 sm:p-6 flex flex-col gap-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
                <div className="h-20 w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4" />
              </div>
              <div className="bg-white rounded-3xl border border-neutral-100 p-5 sm:p-6 flex flex-col gap-4">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-5 w-24 rounded" />
                <div className="h-20 w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4" />
              </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-4 mt-6">
              <Skeleton className="h-11 w-36 rounded-full" />
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-6">


            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-8 flex flex-col gap-6">

              <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 text-primary-600">
                <Contact className="w-5 h-5 shrink-0" />
                <h2 className="text-lg font-bold">المعلومات الشخصية</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                <div className="flex flex-col gap-2 w-full text-right">
                  <label htmlFor="fullName" className="text-neutral-700 text-sm font-bold block mb-1">
                    الاسم الكامل
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    {...register("name")}
                    className={`w-full rounded-xl border p-3.5 focus:border-primary-500 outline-none bg-white text-neutral-800 text-right font-cairo transition-all text-sm font-medium ${errors.name ? "border-error-500 focus:border-error-500" : "border-neutral-200"
                      }`}
                  />
                  {errors.name && <p className="text-error-500 text-xs mt-1 text-right">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-2 w-full text-right">
                  <label htmlFor="username" className="text-neutral-700 text-sm font-bold block mb-1">
                    اسم المستخدم (لا يمكن تغييره)
                  </label>
                  <div className="relative w-full">
                    <input
                      id="username"
                      type="text"
                      disabled
                      value={username ? `@${username}` : ""}
                      className="w-full rounded-xl border border-neutral-200 p-3.5 pl-10 pr-4 outline-none bg-neutral-50/20 text-neutral-400 cursor-not-allowed text-right font-cairo text-sm font-medium"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none">
                      <Lock size={16} />
                    </div>
                  </div>
                </div>
              </div>


              <div className="flex flex-col gap-2 w-full text-right">
                <label htmlFor="bio" className="text-neutral-700 text-sm font-bold block mb-1">
                  النبذة الشخصية
                </label>
                <textarea
                  id="bio"
                  placeholder="اكتب نبذة مختصرة عن مهاراتك وخبراتك..."
                  {...register("bio")}
                  className={`w-full rounded-xl border p-3.5 outline-none focus:border-primary-500 transition-all bg-white text-neutral-800 text-right min-h-[110px] resize-none font-cairo text-sm ${errors.bio ? "border-error-500 focus:border-error-500" : "border-neutral-200"
                    }`}
                />

                <div className="flex justify-between items-center mt-1">
                  {errors.bio ? (
                    <p className="text-error-500 text-xs">{errors.bio.message}</p>
                  ) : (
                    <div></div>
                  )}
                  <span className={`text-xs ${bio.length > 250 ? "text-error-500 font-bold" : "text-neutral-400"}`}>
                    {bio.length} / 250 حرف
                  </span>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                <ServicesTagSelector
                  label="خدمات أقدمها"
                  addButtonLabel="أضف مهارة"
                  placeholder="ابحث عن مهارة لتقديمها..."
                  selectedTags={servicesOffered}
                  onChange={handleServicesOfferedChange}
                  icon={<HandHeart className="w-5 h-5 shrink-0" />}
                  category="TECHNICAL"
                />
                {errors.servicesOffered && (
                  <p className="text-error-500 text-xs text-right mt-1">{errors.servicesOffered.message}</p>
                )}
              </div>


              <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-5 sm:p-6 flex flex-col gap-4">
                <ServicesTagSelector
                  label="خدمات أحتاجها"
                  addButtonLabel="أضف خدمة"
                  placeholder="ابحث عن خدمة تحتاجها..."
                  selectedTags={servicesNeeded}
                  onChange={handleServicesNeededChange}
                  icon={<ShoppingBasket className="w-5 h-5 shrink-0" />}
                  category="GENERAL"
                />
                {errors.servicesNeeded && (
                  <p className="text-error-500 text-xs text-right mt-1">{errors.servicesNeeded.message}</p>
                )}
              </div>

            </div>

            <div className="flex flex-row justify-center items-center gap-4 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="px-10 py-3 rounded-full border border-primary-600 text-primary-600 hover:bg-primary-50/50 transition-all font-bold font-cairo cursor-pointer text-center text-sm min-w-[150px]"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-10 py-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-bold font-cairo transition-all active:scale-98 disabled:opacity-50 cursor-pointer text-center text-sm min-w-[150px]"
              >
                {isPending ? "جاري حفظ التغييرات..." : "حفظ التغييرات"}
              </button>
            </div>

          </form>
        )}
      </div>


      {showDiscardModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-[340px] w-full flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-250">
            <div className="w-14 h-14 rounded-full bg-error-50 flex items-center justify-center text-error-600 mb-5">
              <AlertOctagon size={28} />
            </div>

            <h3 className="text-xl font-bold text-neutral-900 mb-2 font-cairo">تجاهل التغييرات؟</h3>

            <p className="text-sm text-neutral-500 leading-relaxed mb-6 font-cairo">
              أي تغييرات أجريتها لن يتم حفظها في ملفك الشخصي.
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="w-full py-3.5 rounded-xl bg-error-500 hover:bg-error-600 text-white font-bold font-cairo transition-all active:scale-98 cursor-pointer text-center text-sm"
              >
                تجاهل
              </button>
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="w-full py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 font-bold font-cairo transition-all active:scale-98 cursor-pointer text-center text-sm"
              >
                متابعة التعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
