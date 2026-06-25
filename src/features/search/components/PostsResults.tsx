import { memo } from "react";
import { Post } from "../../posts/type";
import { PostResultCard } from "./PostResultCard";

interface PostsResultsProps {
  posts: Post[];
  onNavigate?: () => void;
}

const PostsResultsComponent = ({ posts, onNavigate }: PostsResultsProps) => {
  return (
    <div className="flex flex-col gap-4 pb-4">
      {posts.map((post) => (
        <PostResultCard key={post.id} post={post} onNavigate={onNavigate} />
      ))}
    </div>
  );
};

export const PostsResults = memo(PostsResultsComponent);
PostsResults.displayName = "PostsResults";
