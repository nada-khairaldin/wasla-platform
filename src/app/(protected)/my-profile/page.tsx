"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePage from "@/src/features/profile/components/ProfilePage";
import { ProfileData } from "@/src/features/profile/types";
import { useAuthActions } from "@/src/features/auth/store/useAuthStore";
import { authServices } from "@/src/features/auth/services/authService";

const MOCK_PROFILE: ProfileData = {
  name: "سارة خالد",
  title: "مطور ويب متكامل ومهتم بتصميم واجهات المستخدم",
  bio: "شغوفة ببناء تطبيقات ويب حديثة وسريعة باستخدام React و Next.js. لدي خبرة 3 سنوات في تطوير المواجهات والتطبيقات البرمجية. أحب تبادل المعرفة والتعلم من مجتمعي ومساعدة الآخرين في إنجاز مشاريعهم البرمجية.",
  tags: ["تطوير_ويب", "تصميم_واجهات", "جاوا_سكريبت", "برمجة"],
  avatarUrl: undefined,
  timeBalanceHours: 12.5,
  stats: {
    rating: 4.8,
    servicesReceived: 8,
    servicesProvided: 12,
  },
  savedServices: [
    {
      id: "s1",
      title: "تصميم شعار وهويّة بصرية متكاملة",
      providerName: "أحمد عبد الله",
      durationHours: 3,
    },
    {
      id: "s2",
      title: "جلسة تصوير احترافية للمنتجات",
      providerName: "خالد محمود",
      durationHours: 2,
    },
  ],
  reviews: [
    {
      id: "r1",
      reviewerName: "أحمد العتيبي",
      reviewerInitial: "أ",
      rating: 5,
      comment: "سارة ممتازة وسريعة جداً في الفهم والتنفيذ، قامت بمساعدتي في بناء صفحة هبوط متجاوبة باستخدام React بدقة عالية وتنسيق جميل.",
    },
    {
      id: "r2",
      reviewerName: "منى علي",
      reviewerInitial: "م",
      rating: 4,
      comment: "خدمة رائعة وتواصل ممتاز، أنصح بالتعاون معها في تصميم واجهات المستخدم وتطوير الويب.",
    },
  ],
  recentContracts: [
    {
      id: "c1",
      title: "تطوير صفحة هبوط تفاعلية",
      partnerName: "أحمد العتيبي",
      date: "2026/06/10",
      durationHours: 4,
      iconBg: "bg-success-50 text-success-600",
      iconEmoji: "💻",
    },
    {
      id: "c2",
      title: "جلسة إرشادية في ريادة الأعمال للمشاريع الناشئة",
      partnerName: "سليمان الفهد",
      date: "2026/05/10",
      durationHours: 3,
      iconBg: "bg-warning-50 text-warning-600",
      iconEmoji: "💡",
    },
    {
      id: "c3",
      title: "ترجمة مقالات تقنية للغة العربية",
      partnerName: "ياسمين حسن",
      date: "2026/04/28",
      durationHours: 6,
      iconBg: "bg-info-50 text-info-600",
      iconEmoji: "📝",
    },
  ],
  walletTransactions: [
    {
      id: "t1",
      type: "deposit",
      description: "تقديم خدمة تطوير صفحة هبوط تفاعلية",
      hours: 4.0,
      date: "2026/06/10",
    },
    {
      id: "t2",
      type: "withdrawal",
      description: "استلام خدمة تصميم شعار وهوية بصرية",
      hours: 3.0,
      date: "2026/06/05",
    },
    {
      id: "t3",
      type: "gift",
      description: "هدية ترحيبية من منصة وصلة",
      hours: 5.0,
      date: "2026/05/15",
    },
  ],
};

export default function ProfileRoute() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(MOCK_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const { logout } = useAuthActions();

  const handleEditProfile = () => {
    router.push("/my-profile/edit");
  };

  const handleChangePassword = () => {
    router.push("/my-profile/change-password");
  };

  const handleLogout = async () => {
    try {
      await authServices.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      logout();
    }
  };

  const handleDeleteAccount = async () => {
    // Delete account triggers log out directly since confirmation is now managed by the custom popup modal
    await handleLogout();
  };

  const handleUnsaveService = (id: string) => {
    setProfile(prev => prev ? {
      ...prev,
      savedServices: prev.savedServices.filter(s => s.id !== id)
    } : null);
  };

  return (
    <div className="pb-20 bg-neutral-50">
      <ProfilePage
        profile={profile}
        isLoading={isLoading}
        onEditProfile={handleEditProfile}
        onDeleteAccount={handleDeleteAccount}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
        onUnsaveService={handleUnsaveService}
        onViewWalletDetails={() => router.push("/my-profile/wallet")}
        onViewAllContracts={() => router.push("/my-contracts")}
        onViewAllSaved={() => router.push("/my-profile/saved")}
        onViewAllTransactions={() => router.push("/my-profile/wallet")}
        onViewAllReviews={() => router.push("/my-profile/reviews")}
        onContractClick={(id) => router.push(`/my-contracts/${id}`)}
      />
    </div>
  );
}
