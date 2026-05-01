"use client";
import { useRouter } from "next/navigation";
import Button from "../../../../../components/ui/Button";
import AuthWrapper from "../../../../../features/auth/components/AuthWrapper";
import SkillMatchingForm from "../../../../../features/auth/components/SkillMatchingForm";
import Stepper from "../../../../../features/auth/components/Stepper";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { skillsSchema } from "../../../../../features/auth/schemas/authSchema";
import {
  useSignupActions,
  useSignupStore,
} from "../../../../../features/auth/store/useSignupStore";

function Page() {
  const data = useSignupStore((state) => state.formData);
  const router = useRouter();

useEffect(() => {
  if (!data.email) { 
    router.replace('/signup/basic-info');
  }
}, [data, router]);

  const savedOfferedSkills = useSignupStore(
    (state) => state.formData.offeredSkills,
  );
  const savedRequiredSkills = useSignupStore(
    (state) => state.formData.requiredSkills,
  );

  const [offeredSkills, setOfferedSkills] = useState<string[]>(
    savedOfferedSkills || [],
  );
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    savedRequiredSkills || [],
  );
  const [errors, setErrors] = useState<{ offered?: string; required?: string }>(
    {},
  );

  const { setStepData } = useSignupActions();

  function handleContinue() {
    const dataToValidate = {
      offeredSkills: offeredSkills,
      requiredSkills: requiredSkills,
    };
    const result = skillsSchema.safeParse(dataToValidate);

    if (!result.success) {
      const allErrors = result.error!.issues;
      const offerError = allErrors.find((e) =>
        e.path.includes("offeredSkills"),
      )?.message;
      const requiredSkills = allErrors.find((e) =>
        e.path.includes("requiredSkills"),
      )?.message;

      setErrors({
        offered: offerError,
        required: requiredSkills,
      });
      return;
    }
    setStepData(result.data);
    router.push("/signup/confirmation");
  }

  return (
    <div>
      <AuthWrapper
        src={"/images/features/auth/skill-matching-bg.png"}
        alt={"skill matching background image"}
      >
        <Stepper currentStep={2} />
        <div className="space-y-10">
          <div className="text-center mb-6">
            <h3 className="text-slate-500 font-medium">ساعدنا في مطابقتك</h3>
          </div>

          <SkillMatchingForm
            label="المهارات التي أقدمها"
            selectedSkills={offeredSkills}
            onSkillsChange={setOfferedSkills}
          />
          {errors.offered && (
            <p className="text-red-500 text-sm mt-2">{errors.offered}</p>
          )}

          <SkillMatchingForm
            label="المهارات التي أحتاجها"
            selectedSkills={requiredSkills}
            onSkillsChange={setRequiredSkills}
          />
          {errors.required && (
            <p className="text-red-500 text-sm mt-2">{errors.required}</p>
          )}

          <div className="flex flex-col gap-4 pt-6 w-full">
            <Button
              variant="filled"
              className="w-full"
              onClick={handleContinue}
            >
              استمرار
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 text-neutral-600 font-medium "
              onClick={() => router.back()}
            >
              <ChevronRight size={20} />
              <span>رجوع لتعديل البيانات</span>
            </Button>
          </div>
        </div>
      </AuthWrapper>
    </div>
  );
}

export default Page;
