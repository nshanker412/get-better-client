import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Follower } from '../components/profile/followerFollowing/Follower';
import { Following } from '../components/profile/followerFollowing/Following';



const Tab = createMaterialTopTabNavigator();


export function FollowerFollowingTab({ route, navigation}) {
	// const route = useRoute();
	const { theme } = useThemeContext();
	
	const username = route?.params?.profileUsername;
	const followerCount = route?.params?.followers;
	const followingCount = route?.params?.following;

	console.log('FollowerFollowingTab: username', username);	
	console.log('FollowerFollowingTab: followerCount', followerCount);
	console.log('FollowerFollowingTab: followingCount', followingCount);

	// useEffect(() => {
	// 	navigation.setOptions({ title: `@${uname}`, headerShown: true, headerBackTitle: 'back'});
	// }, [uname]);



	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<>
			<Tab.Navigator
				
					screenOptions={{
				

					tabBarLabelStyle: {
							fontSize: 15,
							fontFamily: theme.fontFamily,
							color: theme.textColorPrimary,
							// backgroundColor: theme.backgroundColor
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
			}}>
				<Tab.Screen
				name='Following'
				component={Following}

				options={{
					tabBarLabel: followingCount
						? `Motivating (${followingCount})`
						: 'Motivating',
				}}
			
				initialParams={{ profileUsername: username }}
			/>
			<Tab.Screen
				name='Followers'
				component={Follower}
				options={{
					tabBarLabel: followerCount
						? `Motivators (${followerCount})`
						: 'Motivators',

			
				}}
				
				initialParams={{ profileUsername: username }}
				/>
			</Tab.Navigator>
				</>
</SafeAreaView>
	);
}
