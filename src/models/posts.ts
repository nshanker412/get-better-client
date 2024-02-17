
interface Comment {
	content: string;
	timestamp: number;
	username: string;
  }
  
  interface  PostMetadata {
	caption: string;
	challenge: string | boolean; 
	comments: Comment[];
	likes: string[];
	timestamp: number;
	type: 'image' | 'video'; 
	user: string;
  }
  
  export interface Post {
	filename: string;
	metadata: PostMetadata;
  }

export interface PostsApiResponse {
    posts: Post[];
}