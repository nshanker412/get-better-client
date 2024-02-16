export interface ConnectedPostCommentDrawerProps {
	postID: string;
	comments: Array<any>;
	profileUsername: string;
}

export interface Comment {
	username: string;
	content: string;
	timestamp: string;
}

export interface PostCommentDrawerProps {
	comments: Array<any>;
	commentsLoading: boolean;
}

export interface CommentDrawerRef {
	openModal: () => void;
	closeModal: () => void;
}
