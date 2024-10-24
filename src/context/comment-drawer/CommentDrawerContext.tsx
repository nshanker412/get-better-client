import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { Comment } from '@models/posts';
import axios from 'axios';
import React, { createContext, useContext, useMemo, useState } from 'react';
import {useAuth} from "@context/auth/useAuth";
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
export const CommentDrawerProvider= ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPostID, setCurrentPostId] = useState<string | null>(null);    
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const {userToken} = useAuth();

    const {sendOutPushNotification} = useNotifications();

    const {username: myUsername} = useMyUserInfo();

    const _setComments = async (postID: string) => {
        setLoading(true);

        const user = postID.split('_')[0];
        const id = postID.split('_')[1];

        try {
            console.log('fetching comments', user, id);
            const response = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post-comment?search=${id}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
    
            );
            console.log('response', response.data["results"]);
            setComments(response.data["results"]);
            

        } catch (error) {
            console.error('Comment fetch failed:', error);
            console.log(error);
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
            const resp = await axios.get(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
                
          
              );
            await axios.post(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post-comment`,
                {
                    created_by: resp.data["id"],
                    post: id,
                    comment: comment,
                },
                { headers: {"Authorization" : `Bearer ${userToken}`}}
            ).then((response) => {
                setComments([response.data, ...comments]);
            })

      
            const pushNotifInfo: PushNotificationInfoPacket = {
                title:  `${myUsername} commented on your post.`,
                body: `"${comment}"`,
                data: {
                    type: NotificationType.COMMENTED_ON_POST,
                    path: 'profile',
                    params: {
                        profileUsername: poster,
                        postID: id
                    }
                },
              };
        
              sendOutPushNotification(poster, pushNotifInfo);
            

        } catch (error) {
            console.error('Adding comment failed:', error);
            console.log(error);
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
      {children}
    </CommentDrawerContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useCommentDrawer = () => {
  const context = useContext(CommentDrawerContext);
  if (context === undefined) {
    console.log('useCommentDrawer must be used within a CommentDrawerProvider');
  }
  return context;
};
