import { User } from '@/src/types';

export type PostCategory = 'REQUEST' | 'OFFER'; 
export type ServiceMode = 'ONLINE' | 'OFFLINE';
export type PostStatus = 'PUBLISHED' | 'ARCHIVED';

export interface Post {
  id: number;
  title: string;
  description: string;
  category: PostCategory;
  serviceMode: ServiceMode;
  assignedTimeCredits: number;
  status: PostStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: User; 
}

export interface CreatePostRequest {
  title: string;
  description: string;
  category: PostCategory;
  serviceMode: ServiceMode;
  assignedTimeCredits: number;
  status?: PostStatus;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
  category?: PostCategory;
  serviceMode?: ServiceMode;
  assignedTimeCredits?: number;
  status?: PostStatus;
}

export interface SavedPost {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
  post: Post;
}

export interface PostsResponse {
  posts: Post[];
  nextCursor?: number | string | null;
}

export interface PostResponse {
  post: Post;
}

export interface FeedResponse {
  posts: Post[];
  source?: "recommender" | "fallback" | string;
  nextCursor?: number | string | null;
}