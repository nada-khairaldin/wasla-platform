import React from "react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { id: 1, title: "المعلومات الأساسية" },
  { id: 2, title: "تطابق المهارات" },
  { id: 3, title: "تأكيد" },
];

const Stepper = ({ currentStep }: StepperProps) => {
  return (
    <div className="relative w-full py-8 md:py-10 mb-12 md:mb-16 bg-neutral-50 md:-top-10 rounded-[24px] md:rounded-[40px] px-4 overflow-visible">
      <h1 className="text-xl md:text-2xl font-bold text-primary-900 flex items-center justify-center mb-10 md:mb-12">
        انضم لمجتمع وصلة
      </h1>

      <div className="flex items-start justify-center w-full max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-center relative flex-1">
              {/* Circle */}
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ease-in-out shadow-sm z-10 shrink-0
                ${
                  currentStep >= step.id
                    ? "bg-primary-600 border-primary-600 text-white shadow-primary-200"
                    : "bg-white border-neutral-200 text-neutral-400"
                }`}
              >
                {currentStep > step.id ? (
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="font-bold text-base md:text-lg">
                    {step.id}
                  </span>
                )}
              </div>

              {/* Title Container */}
              <div className="absolute top-12 md:top-14 w-full flex justify-center">
                <div className="w-full text-center px-1">
                  <span
                    className={`text-[10px] md:text-sm transition-colors duration-300 block leading-tight ${
                      currentStep >= step.id
                        ? "text-primary-900 font-bold"
                        : "text-neutral-400 font-medium"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Line */}
            {index !== steps.length - 1 && (
              <div className="flex-1  h-[3px] mt-5 md:mt-6 bg-neutral-100 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 h-full bg-primary-600 transition-all duration-700 ease-in-out"
                  style={{
                    width: currentStep > step.id ? "100%" : "0%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="h-6 md:h-8"></div>
    </div>
  );
};

export default Stepper;