import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Comment } from '@models/posts';
import axios from 'axios';
import React, { createContext, useContext, useMemo, useState } from 'react';

// Define the context shape
interface CommentDrawerContextType {
    isOpen: boolean;
    loading: boolean;
    comments: Comment[] | [];
    openDrawer: () => void;
    onRefresh: () => void;
    closeDrawer: () => void;
    addComment: (comment: string) => Promise<Comment[] | void>;
    onPostChange: (postID: string) => void;
    numComments: number;
}

// Create the context
const CommentDrawerContext = createContext<CommentDrawerContextType | undefined>(undefined);


/**
 * CommentDrawerProvider
 * 1. loads the comments when current post changes
 * 2. keeps the state of the drawer
 * @param param0 
 * @returns 
 */

// Context provider component
export const CommentDrawerProvider= ({  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPostID, setCurrentPostId] = useState<string | null>(null);    
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    const {username: myUsername} = useMyUserInfo();

    const _setComments = async (postID: string) => {
        setLoading(true);

        const user = postID.split('_')[0];
        const id = postID.split('_')[1];

        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/comments`,
                {
                    profileUsername: user,
                    postID: id,
                },
            );
            console.log('response', response.data.comments);
            setComments(response.data.comments);
            

        } catch (error) {
            console.error('Comment fetch failed:', error);
            throw new Error(error);
        } finally {
            setLoading(false);

        }

    }


    const onRefresh = async () => {
        if (!currentPostID) {
            console.log('WARN: onRefresh called with no postID');
            return;
        }
        await _setComments(currentPostID);
    }

    const addComment = async (comment: string): Promise<void>  => {
        if (!comment) {
            console.log('WARN: addComment called with empty comment');
            return ;
        }
        if (!currentPostID) {
            console.log('WARN: addComment called with no postID');
            return;
        }
        const poster = currentPostID.split('_')[0];
        const id = currentPostID.split('_')[1];

        console.log('addComment', poster, id, comment);


        try {
            const response = await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`,
                {
                    profileUsername: poster,
                    postID: id,
                    myUsername: myUsername,
                    content: comment,
                },
            );
            console.log('response', response.data.comments);
            setComments(response.data.comments);
            

        } catch (error) {
            console.error('Adding comment failed:', error);
            throw new Error(error);
        }

    }


    const onPostChange = async (postID: string) => {
        if (postID === currentPostID) return;
        console.log('onPostChange', postID, currentPostID);
        setCurrentPostId(postID);
        await _setComments(postID);
    }


    const openDrawer = () => setIsOpen(true);
    const closeDrawer = () => setIsOpen(false);
        

    const contextValue: CommentDrawerContextType = useMemo(() => ({
        loading: loading,
        isOpen: isOpen,
        comments: comments,
        numComments: comments?.length || 0, // Fallback to 0 if comments is null/undefined
        onPostChange: onPostChange,
        openDrawer: openDrawer,
        addComment: addComment,
        onRefresh: onRefresh,
        closeDrawer: closeDrawer,
      }), [loading, isOpen, comments, currentPostID]);

  return (
    <CommentDrawerContext.Provider value={contextValue}>
      {React.Children}
    </CommentDrawerContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useCommentDrawer = () => {
  const context = useContext(CommentDrawerContext);
  if (context === undefined) {
    throw new Error('useCommentDrawer must be used within a CommentDrawerProvider');
  }
  return context;
};
