import {
  Code2,
  Palette,
  Camera,
  Languages,
  Megaphone,
  GraduationCap,
  Sparkles,
  LucideProps,
} from "lucide-react";


export function getSkillIcon(skillName: string, props?: LucideProps) {
  const name = skillName.toLowerCase();
  
  if (
    name.includes("برمجة") ||
    name.includes("تطوير") ||
    name.includes("ويب") ||
    name.includes("برمج") ||
    name.includes("code") ||
    name.includes("dev") ||
    name.includes("web") ||
    name.includes("react") ||
    name.includes("next")
  ) {
    return <Code2 {...props} />;
  }
  
  if (
    name.includes("تصميم") ||
    name.includes("فوتوشوب") ||
    name.includes("جرافيك") ||
    name.includes("ديزاين") ||
    name.includes("design") ||
    name.includes("ux") ||
    name.includes("ui") ||
    name.includes("رسم")
  ) {
    return <Palette {...props} />;
  }

  if (
    name.includes("تصوير") ||
    name.includes("كاميرا") ||
    name.includes("فوتوغرافي") ||
    name.includes("camera") ||
    name.includes("photo") ||
    name.includes("فيديو") ||
    name.includes("video")
  ) {
    return <Camera {...props} />;
  }

  if (
    name.includes("ترجمة") ||
    name.includes("لغات") ||
    name.includes("انجليزي") ||
    name.includes("عربي") ||
    name.includes("لغة") ||
    name.includes("translate") ||
    name.includes("english")
  ) {
    return <Languages {...props} />;
  }

  if (
    name.includes("تسويق") ||
    name.includes("اعلان") ||
    name.includes("إعلان") ||
    name.includes("سوشيال") ||
    name.includes("marketing") ||
    name.includes("ads")
  ) {
    return <Megaphone {...props} />;
  }

  if (
    name.includes("تعليم") ||
    name.includes("دروس") ||
    name.includes("شرح") ||
    name.includes("تدريس") ||
    name.includes("رياضيات") ||
    name.includes("فيزياء") ||
    name.includes("كيمياء") ||
    name.includes("school") ||
    name.includes("teach") ||
    name.includes("study")
  ) {
    return <GraduationCap {...props} />;
  }

  // Fallback to Sparkles
  return <Sparkles {...props} />;
}
