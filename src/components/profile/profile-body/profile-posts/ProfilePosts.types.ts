export interface ConnectedProfilePostsProps {
	isMyProfile: boolean;
}

export interface ProfilePostsProps {
	posts: Array<any>;
	currentScrollIndex: number;
	isError: boolean;
	isMyProfile: boolean;
	fetchUserPosts: () => void;
}
