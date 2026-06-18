import UserProfilePage from "@/src/features/user-profile/userProfile.page";

export default async function UserRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id, 10);

  if (isNaN(userId)) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-center">
        <p className="text-neutral-500 font-semibold">معرف المستخدم غير صالح.</p>
      </div>
    );
  }

  return <UserProfilePage userId={userId} />;
}
