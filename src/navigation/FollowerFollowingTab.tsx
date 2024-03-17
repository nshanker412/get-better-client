import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Follower } from '../components/profile/followerFollowing/Follower';
import { Following } from '../components/profile/followerFollowing/Following';

const Tab = createMaterialTopTabNavigator();

export function FollowerFollowingTab() {
	const route = useRoute();
	const navigation = useNavigation();
	const { theme } = useThemeContext();
	
	const uname = route?.params?.profileUsername;
	const followerCount = route?.params?.followers;
	const followingCount = route?.params?.following;

	useEffect(() => {
		navigation.setOptions({ title: `@${uname}`, headerShown: true, headerBackTitle: 'back'});
	}, [uname]);


	/**
	 * Todo: add text hygene to follower count
	 * once gets > 1000
	 */

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarLabelStyle: {
					fontSize: 15,
					fontFamily: theme.fontFamily,
					color: theme.textColorPrimary,
				},
				tabBarIndicatorStyle: {
					backgroundColor: theme.textColorPrimary,
				},
				tabBarStyle: { backgroundColor: 'black' },
			}}>
			<Tab.Screen
				name='Following'
				component={Following}
				options={{
					tabBarLabel: followingCount
						? `Motivating (${followingCount})`
						: 'Motivating',
				}}
			
				initialParams={{ profileUsername: uname }}
			/>
			<Tab.Screen
				name='Followers'
				component={Follower}
				options={{
					tabBarLabel: followerCount
						? `Motivators (${followerCount})`
						: 'Motivators',
				}}
				initialParams={{ profileUsername: uname }}
			/>
		</Tab.Navigator>
	);
}
