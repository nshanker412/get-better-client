import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Follower } from '../components/profile/followerFollowing/Follower';
import { Following } from '../components/profile/followerFollowing/Following';
import { useNavigation } from '@react-navigation/native';
import React, { useState,useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@context/auth/useAuth';
import { HeaderBackButton } from '@react-navigation/elements';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';

const Tab = createMaterialTopTabNavigator();


export function FollowerFollowingTab({ route}) {
	// const route = useRoute();
	const { theme } = useThemeContext();
	const { userToken } = useAuth();
	const { username: myUsername } = useMyUserInfo();
	const navigation = useNavigation();
	
	const [username,setUsername] = useState(route?.params?.profileUsername);
	const [followerCount,setFollowerCount]= useState(0);
	const [followingCount,setFollowingCount]= useState(0);
	const [followerList,setFollowerList]= useState([]);
	const [followingList,setFollowingList]= useState([]);

	

	useEffect( () => {
		
		navigation.setOptions({ headerShown: true,
			headerLeft: (props) => (
				<HeaderBackButton
					{...props}
					onPress={() => {
						if (username===undefined){
						navigation.goBack();
						}
						else{
							navigation.navigate("home");
						}
					}}
				/>
			)
		});
	} ); 
	useEffect(() => {
		
		const fetchFollowers = async () => {
			const profileOf = await AsyncStorage.getItem("InProfile")
			
				try {
					const response = await axios.get(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${profileOf}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
		
					);
					setFollowingCount(response.data.results[0].following_list.length);
					setFollowerCount(response.data.results[0].followers_list.length);
					setFollowerList(response.data.results[0].followers_list)
					setFollowingList(response.data.results[0].following_list)
					
				} catch (error) {
					console.log('ERROR: onFetchFollowing ', error);
				}
			}
			
			fetchFollowers();
		
	}, [username]);


	return (
		<SafeAreaView style={{ flex: 1 }}>
			
			<Tab.Navigator
				
					screenOptions={{
					tabBarLabelStyle: {
							fontSize: 15,
							fontFamily: theme.fontFamily,
							color: theme.textColorPrimary,
							backgroundColor: theme.backgroundColor
					},
					tabBarItemStyle: {
						flex: 1,
						// backgroundColor: "red",
						height: 80
					},
					tabBarStyle: {
					backgroundColor: theme.backgroundColor,
						},
						
					tabBarIndicatorStyle: {
							backgroundColor: theme.textColorPrimary,
						},

				swipeEnabled: true,
			}} >

				<Tab.Screen
				name='Following'
				component={Following}

				options={{
					tabBarLabel: followingCount
						? `Motivating (${followingCount})`
						: 'Motivating',
					
				}}
			
				initialParams={{ profileUsername: username,followingList:followingList }}
			/>
			<Tab.Screen
				name='Followers'
				component={Follower}
				options={{
					tabBarLabel: followerCount
						? `Motivators (${followerCount})`
						: 'Motivators',
						
			
				}}
				
				initialParams={{ profileUsername: username,followerList:followerList }}
				/>
			</Tab.Navigator>
</SafeAreaView>
	);
}
