"use client";
import { useRouter } from "next/navigation";
import Button from "../../../../../components/ui/Button";
import AuthWrapper from "../../../../../features/auth/components/AuthWrapper";
import SkillMatchingForm from "../../../../../features/auth/components/SkillMatchingForm";
import Stepper from "../../../../../features/auth/components/Stepper";
import { useEffect, useState } from "react";
import { ChevronRight, FileText } from "lucide-react";
import { skillsSchema } from "../../../../../features/auth/schemas/authSchema";
import {
  useSignupActions,
  useSignupStore,
} from "../../../../../features/auth/store/useSignupStore";
import BioInput from "../../../../../features/auth/components/BioInput";

function Page() {
  const data = useSignupStore((state) => state.formData);
  const router = useRouter();

  useEffect(() => {
    if (!data.email) {
      router.replace("/signup/basic-info");
    }
  }, [data, router]);

  const savedOfferedSkills = useSignupStore(
    (state) => state.formData.offeredSkills,
  );
  const savedRequiredSkills = useSignupStore(
    (state) => state.formData.requiredSkills,
  );
  const savedBio = useSignupStore((state) => state.formData.bio);

  const [offeredSkills, setOfferedSkills] = useState<string[]>(
    savedOfferedSkills || [],
  );
  const [requiredSkills, setRequiredSkills] = useState<string[]>(
    savedRequiredSkills || [],
  );
  const [bio, setBio] = useState<string>(savedBio || "");

  const [errors, setErrors] = useState<{
    offered?: string;
    required?: string;
    bio?: string;
  }>({});

  const { setStepData } = useSignupActions();

  function handleContinue() {
    const dataToValidate = {
      offeredSkills: offeredSkills,
      requiredSkills: requiredSkills,
      bio: bio,
    };

    const result = skillsSchema.safeParse(dataToValidate);

    if (!result.success) {
      const allErrors = result.error!.issues;

      const offerError = allErrors.find((e) =>
        e.path.includes("offeredSkills"),
      )?.message;
      const reqError = allErrors.find((e) =>
        e.path.includes("requiredSkills"),
      )?.message;
      const bioError = allErrors.find((e) => e.path.includes("bio"))?.message;

      setErrors({
        offered: offerError,
        required: reqError,
        bio: bioError,
      });
      return;
    }

    setStepData({ ...result.data, bio });
    router.push("/signup/confirmation");
  }

  return (
    <div>
      <AuthWrapper
        src={"/images/features/auth/skill-matching.png"}
        alt={"skill matching background image"}
      >
        <Stepper currentStep={2} />

        <div className="space-y-8 mt-6">
          <div className="text-center">
            <h3 className="text-slate-500 font-medium text-sm md:text-base">
              ساعدنا في مطابقتك بشكل أدق
            </h3>
          </div>

          <div>
            <SkillMatchingForm
              label="المهارات التي أقدمها"
              selectedSkills={offeredSkills}
              onSkillsChange={setOfferedSkills}
            />
            {errors.offered && (
              <p className="text-red-500 text-xs mt-2 mr-2">{errors.offered}</p>
            )}
          </div>

          <div>
            <SkillMatchingForm
              label="المهارات التي أحتاجها"
              selectedSkills={requiredSkills}
              onSkillsChange={setRequiredSkills}
            />
            {errors.required && (
              <p className="text-red-500 text-xs mt-2 mr-2">
                {errors.required}
              </p>
            )}
          </div>

          <BioInput value={bio} onChange={setBio} error={errors.bio} />
          <div className="flex flex-col gap-4 pt-4 w-full">
            <Button
              variant="filled"
              className="w-full h-12 text-lg"
              onClick={handleContinue}
            >
              استمرار
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-12 text-neutral-600 font-medium"
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
