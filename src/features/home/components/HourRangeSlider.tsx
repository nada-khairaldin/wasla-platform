"use client";
import { useState } from "react";

interface HourRangeSliderProps {
  onChange?: (value: number) => void;
  initialValue?: number;
  label?: string;
  labelClassName?: string;
  valueClassName?: string;
  variant?: "sidebar" | "modal"; 
}

export const HourRangeSlider = ({ 
  onChange, 
  initialValue = 12,
  label = "نطاق الساعات",
  labelClassName = "text-sm font-bold text-neutral-500",
  valueClassName = "text-lg font-bold text-neutral-700",
  variant = "sidebar" 
}: HourRangeSliderProps) => {
  const [hours, setHours] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setHours(value);
    if (onChange) onChange(value);
  };


  const thumbBg = variant === "modal" ? "#215479" : "#ffffff"; 
  const thumbBorder = variant === "modal" ? "#ffffff" : "#215479"; 

  return (
    <div className="space-y-4 font-cairo">
      <div className="flex justify-between items-center">
        <p className={`${labelClassName} text-right`}>{label}</p>
        <span className={`${valueClassName}`}>
          {label === "نطاق الساعات" ? `1-${hours}` : `${hours} ساعة`}
        </span>
      </div>
      <div className="relative pt-2">
        <input
          type="range"
          min="1"
          max="24"
          value={hours}
          onChange={handleChange}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer outline-none shadow-inner transition-all"
          style={{
            background: `linear-gradient(to left, #215479 ${((hours - 1) / 23) * 100}%, #e5e7eb 0%)`,
            "--thumb-bg": thumbBg,
            "--thumb-border": thumbBorder,
          } as React.CSSProperties}
        />
        
    
        <style jsx>{`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
          }
          
      
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px; 
            height: 24px;
            border-radius: 50% !important;
            background: var(--thumb-bg) !important;
            border: 2px solid var(--thumb-border) !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22) !important; 
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.15); 
          }
          
          /* متصفح فايرفوكس */
          input[type="range"]::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50% !important;
            background: var(--thumb-bg) !important;
            border: 2px solid var(--thumb-border) !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.22) !important;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          input[type="range"]::-moz-range-thumb:hover {
            transform: scale(1.15);
          }
        `}</style>
      </div>
    </div>
  );
};