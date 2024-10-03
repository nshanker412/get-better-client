
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Comment } from '@models/posts';
import { useEffect, useState } from 'react';
import { addCommentToPost } from '../utils/addCommentToPost';
import { fetchPostComments } from '../utils/fetchPostComments';
import {useAuth} from "@context/auth/useAuth";

export interface UseCommentsReturnType {
    loadingFetchComments: boolean;
    loadingAddComment: boolean;
    comments: Comment[];
    addComment: (comment: string) => Promise<void>;
    fetchComments: () => Promise<void>;
}
  
/**
 *  hook to manage comment lifecycle for a post
 * @param postID
 * @param originalPoster
 */
export const useComments = (postID: string, originalPoster: string): UseCommentsReturnType => {
    const [comments, setComments] = useState<Comment[]>([]);
    const { username: myUsername } = useMyUserInfo();
    const {userToken} = useAuth();

    const [loadingAddComment, setLoadingAddComment] = useState(false);
    const [loadingFetchComments, setLoadingFetchComments] = useState(false);


    const fetchComments = async () => {
        setLoadingFetchComments(true);
        try {
            const newComments = await fetchPostComments(originalPoster, postID, userToken);
            if (newComments) {
                setComments(newComments);
            }
        } catch (e) {
            console.log(`Error fetching comments for ${postID}`, e);
        } finally {
            setLoadingFetchComments(false);
        }
    };

    const addComment = async (comment: string) => {
        setLoadingAddComment(true);
        // 1. try adding comment to post
        try {
            await addCommentToPost(originalPoster, postID, myUsername!, comment,userToken);
        } catch (e) {
            console.log('Error adding comment', e);
        } 
        // 2. re-fetch comments
        try {
            await fetchComments();
     
        } catch (e) {
            console.log('Error re-fetching comments', e);

        } finally {
            setLoadingAddComment(false);
        }
  
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return { loadingAddComment,  loadingFetchComments, comments, addComment, fetchComments };
};