import { apiRequest } from "../../../services/api";
import {
  PostsSearchRequest,
  PostsSearchResponse,
  UsersSearchRequest,
  UsersSearchResponse,
} from "../types/search.types";

import { Post } from "../../posts/type";
import { SearchUser } from "../types/search.types";

interface PostsApiResponse {
  results?: Array<{ post?: Post } | Post>;
  posts?: Post[];
}

interface UsersApiResponse {
  results?: Array<{ user?: SearchUser } | SearchUser>;
  users?: SearchUser[];
}

export const searchPosts = async (
  payload: PostsSearchRequest,
  signal?: AbortSignal
): Promise<PostsSearchResponse> => {
  const { data, error } = await apiRequest<PostsApiResponse, PostsSearchRequest>({
    method: "post",
    url: "/posts/search",
    payload,
    config: { signal },
  });

  if (error) {
    throw new Error(error);
  }

  const posts = data?.results
    ? data.results.map((r) => ("post" in r && r.post ? r.post : r) as Post)
    : data?.posts || [];
  return { posts };
};

export const searchUsers = async (
  payload: UsersSearchRequest,
  signal?: AbortSignal
): Promise<UsersSearchResponse> => {
  const { data, error } = await apiRequest<UsersApiResponse, UsersSearchRequest>({
    method: "post",
    url: "/users/search",
    payload,
    config: { signal },
  });

  if (error) {
    throw new Error(error);
  }

  const users = data?.results
    ? data.results.map((r) => ("user" in r && r.user ? r.user : r) as SearchUser)
    : data?.users || [];
  return { users };
};
