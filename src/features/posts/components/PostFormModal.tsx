"use client";

import { useEffect, useState, useRef } from "react";
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
import { z } from "zod";
import toast from "react-hot-toast";
import { useCreatePost } from "../hooks/useCreatePost";
import { useUpdatePost } from "../hooks/useUpdatePost";
import { CreatePostRequest, Post } from "../type";
import { skillsService } from "@/src/features/skills/services/skillsService";

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
    control,
    reset,
    getValues,
    clearErrors,
    setError,
    formState: { errors, isDirty },
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
      const isInvalidCat = postToEdit.category === "REQUEST" || postToEdit.category === "OFFER" || postToEdit.category === "لم يتم التحديد";
      reset({
        serviceType: postToEdit.category === "REQUEST" ? "request" : "offer",
        title: postToEdit.title,
        description: postToEdit.description,
        category: isInvalidCat ? "" : postToEdit.category,
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

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const submitStatusRef = useRef<"PUBLISHED" | "DRAFT">("PUBLISHED");
  const [activeAction, setActiveAction] = useState<"DRAFT" | "PUBLISH" | null>(null);

  const handleClose = () => {
    if (isDirty && !showExitConfirm) {
      setShowExitConfirm(true);
    } else {
      setShowExitConfirm(false);
      reset();
      onClose();
    }
  };

  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const executeSubmission = (payload: CreatePostRequest, customCategoryStr: string) => {
    const registerCustomCategory = async (cat: string) => {
      if (!cat) return;
      try {
        const { data: skillsData } = await skillsService.getSkills();
        const existingSkills = skillsData?.skills || [];
        const exists = existingSkills.some(
          (s) => s.name.toLowerCase() === cat.toLowerCase()
        );
        if (!exists) {
          await skillsService.createSkill({ name: cat, category: "GENERAL" });
        }
      } catch (err) {
        console.error("Failed to register custom post category:", err);
      }
    };

    if (isEditMode && postToEdit) {
      updatePost(
        { postId: postToEdit.id, postData: payload },
        {
          onSuccess: async () => {
            await registerCustomCategory(customCategoryStr);
            const msg = submitStatusRef.current === "DRAFT" ? "تم حفظ المسودة — يمكنك إكمالها لاحقًا" : "تم تحديث الخدمة بنجاح!";
            toast.success(msg);
            setShowExitConfirm(false);
            setActiveAction(null);
            onClose();
          },
          onError: (err: Error) => {
            setActiveAction(null);
            toast.error(err.message || "حدث خطأ أثناء تعديل الخدمة");
          },
        },
      );
    } else {
      createPost(payload, {
        onSuccess: async () => {
          await registerCustomCategory(customCategoryStr);
          const msg = submitStatusRef.current === "DRAFT" ? "تم حفظ المسودة — يمكنك إكمالها لاحقًا" : "تم نشر الخدمة بنجاح!";
          toast.success(msg);
          reset();
          setShowExitConfirm(false);
          setActiveAction(null);
          onClose();
        },
        onError: (err: Error) => {
          setActiveAction(null);
          toast.error(err.message || "حدث خطأ أثناء نشر الخدمة");
        },
      });
    }
  };

  const handleSaveDraft = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (activeAction !== null) return;

    const data = getValues();
    const isTitleEmpty = !data.title || data.title.trim() === "";
    const isDescEmpty = !data.description || data.description.trim() === "";
    const isCatEmpty = !data.category || data.category === "لم يتم التحديد" || data.category === "";

    if (isTitleEmpty && isDescEmpty && isCatEmpty) {
      toast.error("لا يمكن حفظ مسودة فارغة. يرجى إدخال بعض التفاصيل أولاً.");
      return;
    }

    submitStatusRef.current = "DRAFT";
    setActiveAction("DRAFT");
    clearErrors(); // Remove any existing publish errors
    onSubmitDraft(data);
  };

  const onSubmitDraft = (data: CreateServiceFormData) => {
    // For drafts, we accept empty fields and auto-fallback
    const titleValue = typeof data.title === "string" ? data.title.trim() : "";
    
    // We add dummy data to satisfy the backend Zod validation which doesn't know it's a draft
    const descriptionValue = data.description?.length >= 20 
      ? data.description 
      : (data.description || "") + " (مسودة قيد التعديل يرجى التجاهل...)";

    const payload: any = {
      title: titleValue ? titleValue : "مسودة بدون عنوان",
      description: descriptionValue,
      category: data.serviceType === "offer" ? "OFFER" : "REQUEST",
      serviceMode: data.deliveryType === "online" ? "ONLINE" : "OFFLINE",
      assignedTimeCredits: data.hours || 12,
      status: "DRAFT",
    };

    // Inject city and area if offline to bypass backend validation
    if (data.deliveryType === "offline") {
      payload.city = "غير محدد";
      payload.area = "غير محدد";
    }

    // Safe to pass 'لم يتم التحديد' for drafts if empty
    executeSubmission(payload as CreatePostRequest, data.category || "لم يتم التحديد");
  };

  const handlePublish = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (activeAction !== null) return;
    submitStatusRef.current = "PUBLISHED";
    setActiveAction("PUBLISH");

    // Manually validate using the Zod schema
    const data = getValues();
    const result = createServiceSchema.safeParse(data);

    if (!result.success) {
      // Set field-level errors from Zod
      clearErrors();
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof CreateServiceFormData;
        setError(fieldName, { type: "manual", message: issue.message });
      }
      setActiveAction(null);
      return;
    }

    // Validation passed — submit
    onSubmitPublish(result.data);
  };

  const onSubmitPublish = async (data: CreateServiceFormData) => {
    const payload: CreatePostRequest = {
      title: data.title,
      description: data.description,
      category: data.serviceType === "offer" ? "OFFER" : "REQUEST",
      serviceMode: data.deliveryType === "online" ? "ONLINE" : "OFFLINE",
      assignedTimeCredits: data.hours,
      status: "PUBLISHED",
    };
    executeSubmission(payload, data.category);
  };

  if (!isOpen || typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-primary-900/60 backdrop-blur-md animate-in fade-in duration-300 z-10"
        onClick={handleClose}
      />

      <div
        className="relative bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-300 flex flex-col max-h-[90vh] z-20"
        dir="rtl"
      >
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-[32px]">
            <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-2xl  w-full text-center space-y-5 animate-in zoom-in-95">
              <h3 className="font-cairo font-black text-lg text-primary-600">لديك تغييرات غير محفوظة</h3>
              <div className="flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all"
                >
                  حفظ كمسودة
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    reset();
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl font-bold text-error-600 bg-error-50 hover:bg-error-100 transition-all"
                >
                  تجاهل والخروج
                </button>
                <button 
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-3 rounded-xl font-bold text-neutral-500 bg-neutral-100 hover:bg-neutral-200 transition-all"
                >
                  متابعة التحرير
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-6 md:p-8 text-center border-b border-primary-50 relative shrink-0">
          <button
            type="button"
            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-primary-50 text-primary-400 rounded-full hover:bg-primary-100 transition-all active:scale-90 z-30"
            onClick={handleClose}
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
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={activeAction === "DRAFT"}
              className={`flex-1 py-4 rounded-2xl font-cairo font-bold transition-all active:scale-95 ${
                activeAction === "DRAFT"
                  ? "text-primary-400 bg-primary-50/50 cursor-not-allowed"
                  : "text-primary-600 bg-primary-50 hover:bg-primary-100"
              }`}
            >
              {activeAction === "DRAFT" ? "جاري الحفظ..." : "حفظ كمسودة"}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={activeAction === "PUBLISH"}
              className={`flex-[2] py-4 rounded-2xl font-cairo font-bold transition-all active:scale-95 ${
                activeAction === "PUBLISH"
                  ? "text-white/70 bg-primary-400 cursor-not-allowed"
                  : "text-white bg-primary-600 hover:bg-primary-700 shadow-xl shadow-primary-600/20"
              }`}
            >
              {activeAction === "PUBLISH"
                ? "جاري النشر..."
                : isEditMode
                  ? "حفظ التعديلات"
                  : "نشر الخدمة الآن"}
            </button>
          </div>
          {Object.keys(errors).length > 0 && activeAction !== "DRAFT" && (
            <div className="mt-4 p-3 bg-error-50 text-error-600 border border-error-200 rounded-xl text-sm font-bold text-center animate-in fade-in zoom-in-95">
              تعذر نشر المنشور بسبب وجود حقول غير مكتملة أو بيانات غير صحيحة. يرجى مراجعة جميع الحقول المطلوبة قبل المتابعة.
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
