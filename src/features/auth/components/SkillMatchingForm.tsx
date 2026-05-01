"use client";
import React, { useState } from "react";
import { X, Plus, Check } from "lucide-react";
import InputField from "./InputField";

const INITIAL_SUGGESTIONS = [
  "تطوير مواقع الويب",
  "لغة بايثون",
  "وردبريس",
  "uxui design",
  "تطوير العاب",
  "لغات",
];

interface SkillMatchingFormProps {
  label: string;
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

function SkillMatchingForm({
  label,
  selectedSkills,
  onSkillsChange,
}: SkillMatchingFormProps) {
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>(() =>
    INITIAL_SUGGESTIONS.filter((skill) => !selectedSkills.includes(skill)),
  );
  const [addNewSkill, setAddNewSkill] = useState<boolean>(true);
  const [newSkill, setNewSkill] = useState<string>("");
  const [error, setError] = useState(false);

  function removeSkill(skill: string) {
    onSkillsChange(selectedSkills.filter((s) => s !== skill));
    setSuggestedSkills((prev) => {
      if (INITIAL_SUGGESTIONS.includes(skill)) return [...prev, skill];
      else return prev;
    });
  }

  function addSkill(skill: string) {
    onSkillsChange([...selectedSkills, skill]);
    setSuggestedSkills((prev) => prev.filter((s) => s !== skill));
  }
  function handleAddNew() {
    const trimmedSkill = newSkill.trim();
    if (trimmedSkill) {
      if (
        selectedSkills.includes(trimmedSkill) ||
        suggestedSkills.includes(trimmedSkill)
      )
        setError(true);
      else {
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
      <div className="flex flex-wrap gap-sm mb-base p-base">
      {selectedSkills.length > 0 && (
  <div className="flex flex-wrap gap-sm mb-base bg-neutral-50 p-base rounded-2xl w-full border border-neutral-100">
    {selectedSkills.map((skill) => (
      <button
        key={skill}
        className="flex items-center space-between bg-primary-500 text-white rounded-3xl p-base gap-sm hover:bg-primary-700 transition-colors duration-200"
        onClick={() => removeSkill(skill)}
      >
        <span>{skill}</span> <X size={16} />
      </button>
    ))}
  </div>
)}

{/* منطقة المقترحات وإضافة مهارة جديدة */}
<div className="flex flex-wrap gap-sm">
  {suggestedSkills.map((skill) => (
    <button
      key={skill}
      className="flex items-center space-between bg-white text-primary-500 rounded-3xl p-base gap-sm border-primary-500 border hover:bg-neutral-50 transition-colors duration-200"
      onClick={() => addSkill(skill)}
    >
      <span>{skill}</span> <Plus size={16} />
    </button>
  ))}

        {addNewSkill ? (
          <button
            className="flex items-center space-between text-white rounded-3xl p-base gap-sm bg-primary-500 border hover:bg-primary-700 transition-colors duration-200"
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
                className="absolute left-sm top-1/2 transform -translate-y-1/2 p-1 bg-primary-500 text-white hover:bg-primary-700 rounded-full transition-colors"
              >
                <Check size={20} strokeWidth={3} />
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-1 pr-4 text-right">
                المهارة موجودة مسبقاً
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default SkillMatchingForm;
