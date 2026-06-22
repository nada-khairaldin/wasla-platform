import { apiRequest } from "@/src/services/api";
import {
  PostsResponse,
  PostResponse,
  SavedPost,
  CreatePostRequest,
  UpdatePostRequest,
  FeedResponse,
} from "../type";

export const postServices = {
  getPosts: () => {
    return apiRequest<PostsResponse>({
      method: "GET",
      url: "/posts",
    });
  },

  getFeed: (userId: number) => {
    return apiRequest<FeedResponse>({
      method: "GET",
      url: `/feed/${userId}`,
    });
  },

  createPost: (postData: CreatePostRequest) => {
    return apiRequest<PostResponse, CreatePostRequest>({
      method: "POST",
      url: "/posts",
      payload: postData,
    });
  },

  getMyPosts: () => {
    return apiRequest<PostsResponse>({
      method: "GET",
      url: "/posts/me",
    });
  },

  getSavedPosts: () => {
    return apiRequest<{ savedPosts: SavedPost[] }>({
      method: "GET",
      url: "/posts/saved",
    });
  },

  getPostById: (postId: number) => {
    return apiRequest<PostResponse>({
      method: "GET",
      url: `/posts/${postId}`,
    });
  },

  updatePost: (postId: number, postData: UpdatePostRequest) => {
    return apiRequest<PostResponse, UpdatePostRequest>({
      method: "PATCH",
      url: `/posts/${postId}`,
      payload: postData,
    });
  },

  deletePost: (postId: number) => {
    return apiRequest<void>({
      method: "DELETE",
      url: `/posts/${postId}`,
    });
  },

  savePost: (postId: number) => {
    return apiRequest<{ savedPost: SavedPost }>({
      method: "POST",
      url: `/posts/${postId}/save`,
      payload: { postId },
    });
  },

  unsavePost: (postId: number) => {
    return apiRequest<void>({
      method: "DELETE",
      url: `/posts/${postId}/save`,
    });
  },
};
