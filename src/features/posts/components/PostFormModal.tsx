"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, PenLine, AlignRight } from "lucide-react";
import Toggle from "./Toggle";
import InputField from "../../../components/ui/InputField";
import { HourRangeSlider } from "../../home/components/HourRangeSlider";
import CategoryDropdown from "./CategoryDropdown";
import {
  CreateServiceFormData,
  createServiceSchema,
} from "../schemas/postSchema";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreatePost } from "../hooks/useCreatePost";
import { useUpdatePost } from "../hooks/useUpdatePost";
import { CreatePostRequest, Post } from "../type";

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit?: Post | null;
}

export function PostFormModal({
  isOpen,
  onClose,
  postToEdit,
}: PostFormModalProps) {
  const isEditMode = !!postToEdit;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      serviceType: "request",
      title: "",
      description: "",
      category: "",
      deliveryType: "offline",
      hours: 12,
    },
  });

  useEffect(() => {
    if (isOpen && postToEdit) {
      reset({
        serviceType: postToEdit.category === "REQUEST" ? "request" : "offer",
        title: postToEdit.title,
        description: postToEdit.description,
        category: postToEdit.category,
        deliveryType:
          postToEdit.serviceMode?.toLowerCase() === "online"
            ? "online"
            : "offline",
        hours: postToEdit.assignedTimeCredits || 12,
      });
    } else if (!isOpen) {
      reset();
    }
  }, [isOpen, postToEdit, reset]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const onSubmit = async (data: CreateServiceFormData) => {
    const payload: CreatePostRequest = {
      title: data.title,
      description: data.description,
      category: data.serviceType === "offer" ? "OFFER" : "REQUEST",
      serviceMode: data.deliveryType === "online" ? "ONLINE" : "OFFLINE",
      assignedTimeCredits: data.hours,
      status: "PUBLISHED",
    };

    if (isEditMode && postToEdit) {
      updatePost(
        { postId: postToEdit.id, postData: payload },
        {
          onSuccess: () => {
            toast.success("تم تحديث الخدمة بنجاح!");
            onClose();
          },
          onError: (err: Error) => {
            toast.error(err.message || "حدث خطأ أثناء تعديل الخدمة");
          },
        },
      );
    } else {
      createPost(payload, {
        onSuccess: () => {
          toast.success("تم نشر الخدمة بنجاح!");
          reset();
          onClose();
        },
        onError: (err: Error) => {
          toast.error(err.message || "حدث خطأ أثناء نشر الخدمة");
        },
      });
    }
  };

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-primary-900/60 backdrop-blur-md animate-in fade-in duration-300 z-10"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh] z-20"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 md:p-8 text-center border-b border-primary-50 relative shrink-0">
          <button
            type="button"
            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-400 rounded-full hover:bg-primary-100 transition-all active:scale-90 z-30"
            onClick={onClose}
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl md:text-3xl font-black text-primary-900 font-cairo mb-2 mt-2">
            {isEditMode ? "تعديل الخدمة" : "إنشاء خدمة"}
          </h2>
          <p className="text-primary-400 text-sm font-medium">
            {isEditMode
              ? "قم بتحديث تفاصيل منشورك الزمني لتتناسب مع متطلباتك الحالية."
              : "شارك خبرتك أو اطلب خدمة كل ساعة تمنحك رصيداً زمنياً واحداً."}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
          <div className="flex flex-col gap-3 w-full">
            <label className="text-neutral-800 text-lg block font-bold text-right">
              نوع الخدمة
            </label>
            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <Toggle
                  options={[
                    { label: "طلب خدمة", value: "request" },
                    { label: "عرض خدمة", value: "offer" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <InputField
            id="service-title"
            label="عنوان الخدمة"
            placeholder="أدخل عنواناً جذاباً للخدمة..."
            icon={<PenLine size={18} />}
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-col gap-3 w-full">
            <label className="text-neutral-800 text-lg block font-bold text-right">
              وصف الخدمة
            </label>
            <div className="relative w-full">
              <div className="absolute right-4 top-4 text-neutral-400 z-10">
                <AlignRight size={18} />
              </div>
              <textarea
                className={`w-full rounded-xl border-none p-4 pr-12 outline-none focus:ring-1 focus:ring-neutral-100 transition-all bg-neutral-50 text-neutral-900 text-right min-h-[140px] resize-none font-cairo ${errors.description ? "ring-1 ring-error-500" : ""}`}
                placeholder="اشرح ما ستقدمه أو ما تحتاجه بالتفصيل..."
                {...register("description")}
              />
            </div>
            {errors.description && (
              <p className="text-error-500 text-sm mt-1 text-right">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-neutral-800 text-lg block font-bold text-right">
              المجال
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CategoryDropdown
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.category?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-3 w-full">
            <label className="text-neutral-800 text-lg block font-bold text-right">
              طريقة تقديم الخدمة
            </label>
            <Controller
              name="deliveryType"
              control={control}
              render={({ field }) => (
                <Toggle
                  options={[
                    { label: "ميداني (أوفلاين)", value: "offline" },
                    { label: "عن بعد (أونلاين)", value: "online" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="pt-2">
            <Controller
              name="hours"
              control={control}
              render={({ field }) => (
                <HourRangeSlider
                  initialValue={field.value}
                  onChange={field.onChange}
                  label="عدد الساعات"
                  labelClassName="text-neutral-800 text-lg font-bold"
                  valueClassName="text-xl font-black text-primary-600"
                  variant="modal"
                />
              )}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-primary-50/30 border-t border-primary-50 rounded-b-[32px] shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="py-4 rounded-2xl font-cairo font-bold text-primary-400 bg-white border border-primary-100 hover:bg-primary-50 transition-all active:scale-95"
              onClick={onClose}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating || isSubmitting}
              className="py-4 rounded-2xl font-cairo font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isCreating || isUpdating || isSubmitting
                ? "جاري الحفظ..."
                : isEditMode
                  ? "حفظ التعديلات"
                  : "نشر الخدمة الآن"}
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body,
  );
}
