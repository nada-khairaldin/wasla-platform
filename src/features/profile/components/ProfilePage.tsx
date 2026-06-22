// components/profile/ProfilePage.tsx
"use client";

import  { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import TimeBalanceCard from "./TimeBalanceCard";
import StatsSection from "./StatsSection";
import SavedServicesSection from "./SavedServicesSection";
import ReviewsSection from "./ReviewsSection";
import RecentContracts from "./RecentContracts";
import WalletHistory from "./WalletHistory";

import Link from "next/link";
import { ProfileData, ProfilePageProps } from "../types";
import { Skeleton } from "@/src/components/ui/Skeleton";


export default function ProfilePage(props: ProfilePageProps) {
  const {
    profile,
    isLoading,
    onEditProfile,
    onDeleteAccount,
    onChangePassword,
    onLogout,
    onViewWalletDetails,
    onViewAllContracts,
    onViewAllSaved,
    onViewAllTransactions,
    onViewAllReviews,
    onUnsaveService,
    onContractClick,
  } = props;

  const isEmpty = !profile;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
          {/* Row 1: Profile Header + Time Balance Card Skeletons */}
          <div className="flex flex-col min-[815px]:flex-row gap-4 items-stretch">
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 h-full flex items-start gap-4">
                <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0" />
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton className="h-6 w-1/3 rounded" />
                      <Skeleton className="h-4 w-1/2 rounded" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-5/6 rounded mt-1" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="min-[815px]:w-52 min-[815px]:shrink-0">
              <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 flex flex-col gap-4 h-full">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-10 w-16 rounded mt-2 animate-pulse" />
                <Skeleton className="h-9 w-full rounded-full mt-auto" />
              </div>
            </div>
          </div>

          {/* Row 2: Stats Section Skeleton */}
          <div className="rounded-2xl bg-white border border-neutral-100 p-4 sm:p-6 flex flex-col gap-4">
            <Skeleton className="h-5 w-36 rounded" />
            <div className="flex gap-3">
              <div className="flex-1 p-5 border border-neutral-50 rounded-2xl flex flex-col items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
              </div>
              <div className="flex-1 p-5 border border-neutral-50 rounded-2xl flex flex-col items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
              </div>
              <div className="flex-1 p-5 border border-neutral-50 rounded-2xl flex flex-col items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3.5 w-16 rounded" />
                <Skeleton className="h-6 w-10 rounded" />
              </div>
            </div>
          </div>

          {/* Row 3: Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="flex flex-col gap-3 mt-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
            <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="flex flex-col gap-3 mt-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col min-[815px]:flex-row gap-4 items-stretch">
          <div className="flex-1 min-w-0">
            <ProfileHeader
              name={isEmpty ? "" : profile.name}
              title={isEmpty ? "" : profile.title}
              bio={isEmpty ? "" : profile.bio}
              offeredSkills={isEmpty ? [] : profile.offeredSkills}
              requiredSkills={isEmpty ? [] : profile.requiredSkills}
              avatarUrl={isEmpty ? undefined : profile.avatarUrl}
              onEditClick={onEditProfile}
              isEmpty={isEmpty}
            />
          </div>
          <div className="min-[815px]:w-52 min-[815px]:shrink-0">
            <TimeBalanceCard
              hours={isEmpty ? 5 : profile.timeBalanceHours}
              onViewDetails={onViewWalletDetails}
            />
          </div>
        </div>

        {/* Row 2: Stats */}
        <StatsSection
          rating={isEmpty ? 0 : profile.stats.rating}
          servicesReceived={isEmpty ? 0 : profile.stats.servicesReceived}
          servicesProvided={isEmpty ? 0 : profile.stats.servicesProvided}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewsSection 
            reviews={isEmpty ? [] : profile.reviews} 
            onViewAll={onViewAllReviews} 
          />
          <SavedServicesSection
            services={isEmpty ? [] : profile.savedServices}
            onUnsave={onUnsaveService}
            onViewAll={onViewAllSaved}
          />
        </div>

        {/* Row 4: Recent Contracts */}
        <RecentContracts
          contracts={isEmpty ? [] : profile.recentContracts}
          onViewAll={onViewAllContracts}
          onContractClick={onContractClick}
        />

        {/* Row 5: Wallet History */}
        {!isEmpty && profile.walletTransactions.length > 0 && (
          <WalletHistory
            transactions={profile.walletTransactions}
            onViewAll={onViewAllTransactions}
          />
        )}

        {/* Account Settings / Options */}
        {!isEmpty && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden" dir="rtl">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100">
              <h2 className="text-sm sm:text-base font-bold text-neutral-800">إعدادات الحساب</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {/* Edit Profile Option */}
              <button
                onClick={onEditProfile}
                className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-right hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">تعديل الملف الشخصي</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Change Password Option */}
              <button
                onClick={onChangePassword}
                className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-right hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center text-warning-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">تغيير كلمة المرور</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Logout Option */}
              <button
                onClick={onLogout}
                className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-right hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-neutral-700">تسجيل الخروج</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Delete Account Option */}
              <button
                onClick={onDeleteAccount}
                className="w-full px-4 sm:px-6 py-3.5 flex items-center justify-between text-right hover:bg-red-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-red-600">حذف الحساب نهائياً</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
