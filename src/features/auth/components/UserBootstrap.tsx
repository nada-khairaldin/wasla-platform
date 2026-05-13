"use client";

import { useCurrentUser } from "@/src/hooks/useCurrentUser";

export default function UserBootstrap() {
  useCurrentUser(); 
  return null;
}