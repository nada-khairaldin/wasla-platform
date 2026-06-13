import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postServices } from "../services/postService";
import { SavedPost } from "../type";

interface SaveToggleParams {
  postId: number;
  isSavedBefore: boolean;
}

interface MutationContext {
  previousSavedPosts: SavedPost[] | undefined;
}

export const useSaveToggle = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { postId: number; isSaved: boolean; savedPost?: SavedPost },
    Error,
    SaveToggleParams,
    MutationContext
  >({
    mutationFn: async ({ postId, isSavedBefore }) => {
      if (isSavedBefore) {
        const { error } = await postServices.unsavePost(postId);
        if (error) throw new Error(error);
        return { postId, isSaved: false };
      } else {
        const { data, error } = await postServices.savePost(postId);
        if (error) throw new Error(error);
        return { postId, isSaved: true, savedPost: data?.savedPost };
      }
    },

    onMutate: async ({ postId, isSavedBefore }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["savedPosts"] });

      const previousSavedPosts = queryClient.getQueryData<SavedPost[]>([
        "savedPosts",
      ]);

      queryClient.setQueryData<SavedPost[]>(["savedPosts"], (old) => {
        if (!old) return [];
        if (isSavedBefore) {
          return old.filter((sp) => sp.postId !== postId);
        } else {
          return [...old, { postId } as SavedPost];
        }
      });

      return { previousSavedPosts };
    },

    onError: (err, variables, context) => {
      if (context?.previousSavedPosts) {
        queryClient.setQueryData<SavedPost[]>(
          ["savedPosts"],
          context.previousSavedPosts,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });
};
