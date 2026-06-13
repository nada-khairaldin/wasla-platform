"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import Button from "@/src/components/ui/Button"; 
import { PostFormModal } from "./PostFormModal";

export const CreateServiceTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="filled"
        size="md"
        className="flex gap-2 rounded-full px-8 shadow-lg shadow-primary-500/20 transition-transform active:scale-95"
        onClick={() => setIsOpen(true)}
      >
        <PlusCircle size={18} />
        انشر خدمة
      </Button>

      <PostFormModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};