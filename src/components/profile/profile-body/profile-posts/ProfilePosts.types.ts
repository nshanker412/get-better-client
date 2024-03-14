import { Post } from "@models/posts";
export interface ConnectedProfilePostsProps {
	isMyProfile: boolean;
}

export interface ProfilePostsProps {
	posts: Post[] | [];
	isMyProfile: boolean;
	fetchUserPosts: () => Promise<void>;
}
