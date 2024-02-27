
export interface Comment {
	content: string;
	timestamp: number;
	username: string;
  }
  
  export interface  PostMetadata {
	caption: string;
	challenge: string | boolean; 
	comments: Comment[];
	likes: string[];
	timestamp: number;
	type: 'image' | 'video'; 
	  user: string;
	  linkedPlans?: string[];
  }
  
  export interface Post {
	filename: string;
	metadata: PostMetadata;
  }

export interface PostsApiResponse {
    posts: Post[];
}