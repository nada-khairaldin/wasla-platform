"use client";

import { useState } from "react";
import { Post, PostStatus } from "../../../features/posts/type";
import { useDeletePost, useMyPosts, useUpdatePost } from "../../../features/posts/hooks";
import { PostCard } from "../../../features/posts/components/PostCard";
import { PostFormModal } from "../../../features/posts/components/PostFormModal";
import { ArchiveX, Plus, Trash2, X, Archive, RotateCcw } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import { ContractStatusTabs } from "../../../features/contracts/components/ContractStatusTabs";
import toast from "react-hot-toast";

export default function MyPostsPage() {
  const [activeTab, setActiveTab] = useState<PostStatus>("PUBLISHED");
  const [selectedPostForEdit, setSelectedPostForEdit] = useState<Post | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<number | null>(null);
  const [postIdToArchive, setPostIdToArchive] = useState<number | null>(null);
  const [postIdToRestore, setPostIdToRestore] = useState<number | null>(null);
  
  const { data: posts = [], isLoading, isError, error } = useMyPosts();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const filteredPosts = posts.filter(p => p.status === activeTab);

  const POST_TABS = [
    { key: "PUBLISHED", label: "المنشورة" },
    { key: "DRAFT", label: "المسودات" },
    { key: "ARCHIVED", label: "المؤرشفة" },
  ];

  const handleOpenEdit = (post: Post) => {
    setSelectedPostForEdit(post);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedPostForEdit(null);
    setIsModalOpen(true);
  };

  const handleDeleteTrigger = (postId: number) => {
    setPostIdToDelete(postId);
  };

  const handleExecuteDelete = () => {
    if (postIdToDelete !== null) {
      deletePost(postIdToDelete, {
        onSuccess: () => {
          setPostIdToDelete(null);
        },
      });
    }
  };

  const handleExecuteArchive = () => {
    if (postIdToArchive !== null) {
      updatePost(
        { postId: postIdToArchive, postData: { status: "ARCHIVED" } },
        {
          onSuccess: () => {
            setPostIdToArchive(null);
            toast.success("تم أرشفة المنشور بنجاح");
          }
        }
      );
    }
  };

  const handleExecuteRestore = () => {
    if (postIdToRestore !== null) {
      updatePost(
        { postId: postIdToRestore, postData: { status: "PUBLISHED" } },
        {
          onSuccess: () => {
            setPostIdToRestore(null);
            toast.success("تمت إعادة نشر المنشور");
          }
        }
      );
    }
  };

  const getEmptyStateText = () => {
    switch (activeTab) {
      case "PUBLISHED":
        return {
          title: "لا توجد منشورات منشورة",
          desc: "لم تقوم بنشر أي خدمة أو طلب متاح حالياً."
        };
      case "DRAFT":
        return {
          title: "لا توجد مسودات محفوظة",
          desc: "ليس لديك أي مسودات محفوظة حالياً."
        };
      case "ARCHIVED":
        return {
          title: "لا توجد منشورات مؤرشفة",
          desc: "ليس لديك أي منشورات في الأرشيف."
        };
      default:
        return { title: "", desc: "" };
    }
  };
  const emptyText = getEmptyStateText();

  return (
    <main
      className="min-h-screen bg-neutral-50/60 py-10 px-4 sm:px-6 lg:px-8"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-6 text-right">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-primary-900 font-cairo mb-sm">
              منشوراتي المتاحة
            </h1>
            <p className="text-neutral-400 text-sm font-medium">
              يمكنك تحديث أو تعديل خدماتك وعروضك المنشورة في أي وقت عند الحاجة.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3.5 rounded-3xl shadow-lg shadow-primary-600/10 transition-all active:scale-95 shrink-0 self-start sm:self-center"
          >
            <Plus size={18} />
            <span>إنشاء منشور</span>
          </button>
        </div>

        <ContractStatusTabs 
          active={activeTab} 
          onChange={(status) => setActiveTab(status as PostStatus)} 
          tabs={POST_TABS} 
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="p-6 bg-white border border-neutral-100 rounded-xl space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20 rounded-b-xl" />
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-10 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">
            حدث خطأ أثناء جلب البيانات: {error?.message}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 outline-none">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={activeTab !== "ARCHIVED" ? handleOpenEdit : undefined}
                onDelete={handleDeleteTrigger}
                onArchive={activeTab === "PUBLISHED" ? () => setPostIdToArchive(post.id) : undefined}
                onRestore={activeTab === "ARCHIVED" ? () => setPostIdToRestore(post.id) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-neutral-200 rounded-[24px] mx-auto shadow-sm">
            <ArchiveX className="mx-auto text-neutral-300 mb-4" size={44} />
            <h3 className="text-neutral-700 font-bold text-base mb-1">
              {emptyText.title}
            </h3>
            <p className="text-neutral-400 text-xs px-6 mb-5">
              {emptyText.desc}
            </p>
            {activeTab !== "ARCHIVED" && (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                <Plus size={14} />
                <span>أنشأ منشورك الأول</span>
              </button>
            )}
          </div>
        )}
      </div>

      <PostFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedPostForEdit(null);
          setIsModalOpen(false);
        }}
        postToEdit={selectedPostForEdit}
      />

      {postIdToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[600px] rounded-2xl p-6 shadow-xl border border-neutral-100 text-right space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <div className="flex items-center gap-2.5 text-error-600">
                <div className="p-2 bg-error-50 rounded-xl">
                  <Trash2 size={20} />
                </div>
                <h3 className="font-cairo font-black text-lg text-neutral-800">
                  تأكيد حذف المنشور
                </h3>
              </div>
              <button
                onClick={() => setPostIdToDelete(null)}
                className="text-neutral-400 hover:text-error-600 hover:bg-error-50 active:scale-90 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-neutral-500 font-cairo text-sm leading-relaxed">
              هل أنتِ متأكد تماماً من رغبتكِ في حذف هذا المنشور ؟ هذا الإجراء
              سيقوم بإزالة المنشور نهائياً من منصة التبادل ولا يمكن التراجع عنه.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExecuteDelete}
                disabled={isDeleting}
                className="flex-1 bg-error-500 hover:bg-error-600 disabled:bg-error-300 text-white font-cairo font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-error-500/10 active:scale-98"
              >
                {isDeleting ? "جاري الحذف..." : "نعم، احذفه"}
              </button>
              <button
                onClick={() => setPostIdToDelete(null)}
                disabled={isDeleting}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-cairo font-bold text-sm py-3 rounded-xl transition-all active:scale-98"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {postIdToArchive !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[600px] rounded-2xl p-6 shadow-xl border border-neutral-100 text-right space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <div className="flex items-center gap-2.5 text-primary-600">
                <div className="p-2 bg-primary-50 rounded-xl">
                  <Archive size={20} />
                </div>
                <h3 className="font-cairo font-black text-lg text-primary-600">
                  تأكيد أرشفة المنشور
                </h3>
              </div>
              <button
                onClick={() => setPostIdToArchive(null)}
                className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 active:scale-90 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-neutral-500 font-cairo text-sm leading-relaxed">
              هل تريد أرشفة هذا المنشور؟ سيتم إخفاؤه من المنشورات النشطة ويمكنك استعادته لاحقًا.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExecuteArchive}
                disabled={isUpdating}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-cairo font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-98"
              >
                {isUpdating ? "جاري الأرشفة..." : "أرشفة"}
              </button>
              <button
                onClick={() => setPostIdToArchive(null)}
                disabled={isUpdating}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-cairo font-bold text-sm py-3 rounded-xl transition-all active:scale-98"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {postIdToRestore !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-[600px] rounded-2xl p-6 shadow-xl border border-neutral-100 text-right space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* الهيدر */}
            <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
              <div className="flex items-center gap-2.5 text-primary-600">
                <div className="p-2 bg-primary-50 rounded-xl">
                  <RotateCcw size={20} />
                </div>
                <h3 className="font-cairo font-black text-lg text-primary-600">
                  إعادة نشر المنشور؟
                </h3>
              </div>
              <button
                onClick={() => setPostIdToRestore(null)}
                className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 active:scale-90 p-1.5 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-neutral-500 font-cairo text-sm leading-relaxed">
              سيعود هذا المنشور إلى المنشورات النشطة.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleExecuteRestore}
                disabled={isUpdating}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-cairo font-bold text-sm py-3 rounded-xl transition-all shadow-md active:scale-98"
              >
                {isUpdating ? "جاري الإعادة..." : "تأكيد"}
              </button>
              <button
                onClick={() => setPostIdToRestore(null)}
                disabled={isUpdating}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-cairo font-bold text-sm py-3 rounded-xl transition-all active:scale-98"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
