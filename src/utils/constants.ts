export const GAZA_CITIES = [
  "غزة",
  "جباليا",
  "بيت لاهيا",
  "بيت حانون",
  "دير البلح",
  "النصيرات",
  "البريج",
  "المغازي",
  "الزوايدة",
  "خان يونس",
  "رفح",
] as const;

export type GazaCity = (typeof GAZA_CITIES)[number];
