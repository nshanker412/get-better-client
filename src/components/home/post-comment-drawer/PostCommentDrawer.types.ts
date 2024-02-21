import { Comment } from '@models/posts';

export interface ConnectedPostCommentDrawerProps {
	postID: string;
	profileUsername: string;
}


export interface PostCommentDrawerProps {
	commentsLoading: boolean;
	comments: Comment[] | [];
}

export interface CommentDrawerRef {
	openModal: () => void;
	closeModal: () => void;
}
