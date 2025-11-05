// Post Related Types

export interface PostData {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    avatar: string;
  };
  images: string[];
  busTag: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: number;
}

export interface PostFormData {
  title: string;
  content: string;
  images: string[];
  busTag: string;
}
