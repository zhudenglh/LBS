// Comment Types
export interface Comment {
  comment_id: string;
  post_id: string;
  user_id: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
  parent_id?: string | null;
}

export interface CreateCommentRequest {
  post_id: string;
  user_id: string;
  username: string;
  avatar: string;
  content: string;
  parent_id?: string | null;
}
