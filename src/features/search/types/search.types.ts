import { Post } from "../../posts/type";


export interface PostsSearchRequest {
  query: string;
  topK?: number;
  threshold?: number;
  filters?: {
    category?: string;
    serviceMode?: string;
    minCredits?: number;
    maxCredits?: number;
    location?: string;
  };
}

export interface UsersSearchRequest {
  query: string;
  topK?: number;
  filters?: {
    skillType?: string;
    location?: string;
    isOnline?: boolean;
  };
}

export interface SearchUser {
  id: number;
  username: string;
  full_name: string;
  profile_image: string;
  offeredSkills?: string[];
  requestedSkills?: string[];
  bio?: string;
  stats?: {
    availableTimeCredits: number;
    servicesProvided: number;
    servicesReceived: number;
  };
  trustRating?: {
    average: number;
    count: number;
  };
  isOnline?: boolean;
  location?: string;
}

export interface PostsSearchResponse {
  posts: Post[];
}

export interface UsersSearchResponse {
  users: SearchUser[];
}
