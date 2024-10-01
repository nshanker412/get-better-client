import { useRoute } from '@react-navigation/core';
import axios from 'axios';
import React, { ReactNode, createContext, useEffect, useState } from 'react';
import { useAuth } from '@context/auth/useAuth';


type UserFollow = {
	name: string;
	username: string;
};

type UserFollowContextType = {
	username: string | undefined;
	onFetchFollowing:() => Promise<void>;
	onFetchFollowers: () => Promise<void>;
	followers: UserFollow[] |  [] | undefined;
	following: UserFollow[] | []| undefined;
};

const defaultContext = {
	username: undefined,
	onFetchFollowing: async () => { },
	onFetchFollowers: async () => { },
	followers: undefined,
	following: undefined,
};


export const UserFollowContext = createContext<UserFollowContextType>(defaultContext);




interface UserFollowProviderProps {
	children: ReactNode;
	username: string | undefined;
}

export const UserFollowProvider: React.FC<UserFollowProviderProps> = ({ children, username: u }) => {
    const route = useRoute();
    const profileUsername = route.params?.profileUsername;
    const [username, setUsername] = useState(profileUsername);
	const {userToken} =useAuth();


    useEffect(() => {
        console.log("in UserFollowProvider: ", route?.params?.profileUsername);
        setUsername(route?.params?.profileUsername);
    } , [route?.params?.profileUsername]);
	
    const [followers, setFollowers] = useState<UserFollow[] | undefined>();
	const [following, setFollowing] = useState<UserFollow[] | undefined>();

	console.log('username', username);



	const onFetchFollowers = async () => {
		

		if (username) {
			
			// Implement the fetch logic her
			try {
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
				);
				setFollowers(response.data.followers_list);
				console.log('profile followers', response.data.followers_list);
			} catch (error) {
				console.log('ERROR: onFetchFollowers ', error);
			}
		}
	}	


	const onFetchFollowing = async () => {
		console.log('onFetchFollowing pre shit')



		// Implement the fetch logic her
		if (username) {

			try {
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

				);
				setFollowing(response.data.following_list);
			} catch (error) {
				console.log('ERROR: onFetchFollowing ', error);
			}
		}

    }



	const onFollowUser = async (me: string, userToFollow: string): Promise<void> => {
		console.log('onFetchFollowing pre shit')
		console.log("onFetchFollow3rs",
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/follow`)	


		// Implement the fetch logic her
		if (username) {

			try {
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

				);
				console.log('profile Following', response.data.following_list);
				setFollowing(response.data.following_list);
			} catch (error) {
				console.log('ERROR: onFetchFollowing ', error);
			}
		}

    }
    


	useEffect(() => {
		onFetchFollowers();
		onFetchFollowing();
	}, [username]);
	


	const value: UserFollowContextType = {
		onFetchFollowers: onFetchFollowers,
		onFetchFollowing:  onFetchFollowing,
        username: username,
        
		followers: followers,
		following: following,
	};

  return (
	  <UserFollowContext.Provider value={value}>

      { children }
    </UserFollowContext.Provider>
  );
};



export const useUserFollowContext = () => React.useContext(UserFollowContext);
