"use client";
import React, { memo, useCallback, useMemo, useState } from "react";
import { X, Plus, Check } from "lucide-react";
import InputField from "../../../components/ui/InputField";

interface AvailableSkill {
  id: number;
  name: string;
}

interface SkillMatchingFormProps {
  label: string;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  availableSkills?: AvailableSkill[];
  isLoading?: boolean;
  hasMoreSkills?: boolean;
  isFetchingMoreSkills?: boolean;
  onLoadMoreSkills?: () => void;
  isError?: boolean;
  isFetchMoreError?: boolean;
  onRetrySkills?: () => void;
}

function SkillMatchingForm({
  label,
  selectedSkills,
  onSkillsChange,
  availableSkills = [],
  isLoading = false,
  hasMoreSkills = false,
  isFetchingMoreSkills = false,
  onLoadMoreSkills,
  isError = false,
  isFetchMoreError = false,
  onRetrySkills,
}: SkillMatchingFormProps) {
  const [addNewSkill, setAddNewSkill] = useState<boolean>(true);
  const [newSkill, setNewSkill] = useState<string>("");
  const [error, setError] = useState(false);

  const selectedSkillsSet = useMemo(() => {
    return new Set(selectedSkills);
  }, [selectedSkills]);

  const suggestedSkills = useMemo(() => {
    return availableSkills.filter((skill) => !selectedSkillsSet.has(skill.name));
  }, [availableSkills, selectedSkillsSet]);

  const handleSkillsScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!onLoadMoreSkills || !hasMoreSkills || isFetchingMoreSkills) return;

      const target = event.currentTarget;
      const distanceFromBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight;
      if (distanceFromBottom <= 48) {
        onLoadMoreSkills();
      }
    },
    [hasMoreSkills, isFetchingMoreSkills, onLoadMoreSkills],
  );

  const removeSkill = useCallback((skill: string) => {
    onSkillsChange(selectedSkills.filter((s) => s !== skill));
  }, [onSkillsChange, selectedSkills]);

  const addSkill = useCallback((skill: string) => {
    onSkillsChange([...selectedSkills, skill]);
  }, [onSkillsChange, selectedSkills]);

  function handleAddNew() {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill) {
      if (selectedSkills.includes(trimmedSkill)) {
        setError(true);
      } else {
        // Add immediately to selected skills
        onSkillsChange([...selectedSkills, trimmedSkill]);
        setNewSkill("");
        setAddNewSkill(true);
        setError(false);
      }
    }
  }

  return (
    <div className="w-full mb-xl3 text-right">
      <label className="text-primary-900 font-bold text-lg mb-base block">
        {label}
      </label>

      {isLoading ? (
        <div className="flex flex-wrap gap-sm mb-base p-base bg-white rounded-2xl border border-neutral-100">
          <div className="w-24 h-10 bg-neutral-200 animate-pulse rounded-3xl shrink-0" />
          <div className="w-32 h-10 bg-neutral-200 animate-pulse rounded-3xl shrink-0" />
          <div className="w-20 h-10 bg-neutral-200 animate-pulse rounded-3xl shrink-0" />
          <div className="w-28 h-10 bg-neutral-200 animate-pulse rounded-3xl shrink-0" />
          <div className="w-36 h-10 bg-neutral-200 animate-pulse rounded-3xl shrink-0" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-sm mb-base p-base">
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-sm mb-base bg-neutral-50 p-base rounded-2xl w-full border border-neutral-100">
              {selectedSkills.map((skill) => {
                return (
                  <button
                    key={skill}
                    className="flex items-center space-between bg-primary-500 text-white rounded-3xl p-base gap-sm hover:bg-primary-700 transition-colors duration-200"
                    onClick={() => removeSkill(skill)}
                  >
                    <span>{skill}</span> <X size={16} />
                  </button>
                );
              })}
            </div>
          )}

          <div className="w-full bg-white rounded-2xl border border-neutral-100 p-base">
            <div
              className="max-h-56 overflow-y-auto scroll-smooth px-1"
              onScroll={handleSkillsScroll}
            >
              {isError ? (
                <div className="py-6 text-center text-sm text-neutral-600">
                  <p>تعذر تحميل المهارات حالياً</p>
                  <button
                    type="button"
                    onClick={onRetrySkills}
                    className="mt-3 rounded-xl border border-primary-500 px-4 py-2 text-primary-500 hover:bg-primary-50 transition-colors duration-200"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              ) : suggestedSkills.length === 0 && !hasMoreSkills ? (
                <p className="py-6 text-center text-sm text-neutral-500">
                  No skills available
                </p>
              ) : (
                <div className="flex flex-wrap gap-sm content-start">
                  {suggestedSkills.map((skill) => (
                    <MemoizedSuggestedSkillButton
                      key={skill.id}
                      name={skill.name}
                      onAddSkill={addSkill}
                    />
                  ))}
                </div>
              )}

              {isFetchingMoreSkills && (
                <div className="mt-4 space-y-2 pb-1">
                  <div className="w-32 h-2 bg-neutral-200 animate-pulse rounded-full mx-auto" />
                  <div className="flex justify-center text-xs text-neutral-400">
                    Loading more skills...
                  </div>
                </div>
              )}

              {isFetchMoreError && !isError && (
                <div className="mt-3 pb-1 text-center">
                  <p className="text-xs text-neutral-500">
                    فشل تحميل دفعة جديدة من المهارات
                  </p>
                  <button
                    type="button"
                    onClick={onRetrySkills}
                    className="mt-2 rounded-lg border border-primary-500 px-3 py-1 text-xs text-primary-500 hover:bg-primary-50 transition-colors duration-200"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-sm">
            {addNewSkill ? (
              <button
                className="flex items-center space-between text-white rounded-3xl p-base gap-sm bg-primary-500 border hover:bg-primary-700 transition-colors duration-200 active:scale-90"
                onClick={() => setAddNewSkill(false)}
              >
                <span>أضف مهارة</span> <Plus />
              </button>
            ) : (
              <div className="w-full flex flex-col items-end">
                <div className="relative w-full">
                  <InputField
                    id="addSkill"
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNew();
                      }
                    }}
                    placeholder="أدخل مهارة جديدة"
                    className="p-base text-primary-500 border border-primary-500 rounded-3xl outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddNew()}
                    className="absolute left-sm top-1/2 transform -translate-y-1/2 p-1 bg-primary-500 text-white hover:bg-primary-700 rounded-full transition-colors active:scale-90"
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm mt-1 pr-4 text-right">
                    المهارة موجودة مسبقاً في القائمة المختارة
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SuggestedSkillButtonProps {
  name: string;
  onAddSkill: (skillName: string) => void;
}

const SuggestedSkillButton = ({ name, onAddSkill }: SuggestedSkillButtonProps) => {
  return (
    <button
      type="button"
      className="flex items-center space-between bg-white text-primary-500 rounded-3xl p-base gap-sm border-primary-500 border hover:bg-neutral-50 transition-colors duration-200"
      onClick={() => onAddSkill(name)}
    >
      <span>{name}</span> <Plus size={16} />
    </button>
  );
};

const MemoizedSuggestedSkillButton = memo(SuggestedSkillButton);

export default SkillMatchingForm;
