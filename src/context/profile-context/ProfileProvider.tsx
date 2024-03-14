
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info/useOtherUserInfo';
import React, { useEffect, useState } from 'react';
import { ProfileContext } from './ProfileContext';
import { ProfileProviderProps } from './ProfileContext.types';



export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children, isMyProfile }) => {
    const [isMine, setIsMine] = useState(isMyProfile);  
    // const useProfile = isMyProfile ? useMyUserInfo : useOtherUserInfo;
    const { username: myUsername, fetchMyPlans, fetchMyPosts, plans: myPlans, posts: myPosts} = useMyUserInfo();
    const { username: otherUsername, fetchUserPlans, fetchUserPosts, plans: otherPlans, posts: otherPosts} = useOtherUserInfo();

    useEffect(() => {
        setIsMine(isMyProfile);
    }, [isMyProfile])

    useEffect(() => {
        console.log("ProfileProvider: ", isMine, myUsername, otherUsername)
        if (isMine) {
            fetchMyPlans();
            fetchMyPosts();
        } else {
            fetchUserPlans();
            fetchUserPosts();
        }
    }, [isMine])



    
	const context = {
        isMyProfile: isMine,
        username : isMine ? myUsername : otherUsername,
        onFetchPosts: isMine ? fetchMyPosts : fetchUserPosts,
        onFetchPlans: isMine ? fetchMyPlans : fetchUserPlans,
        posts: isMine ? myPosts : otherPosts,
        plans: isMine ? myPlans : otherPlans
    }
    
	return (
		<ProfileContext.Provider value={context}>
			{children}
		</ProfileContext.Provider>
	)	
}