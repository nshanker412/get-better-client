import { useThemeContext } from '@context/theme/useThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { CreatePlanScreen } from 'src/plans/CreatePlanScreen';
import CreatePost from '../components/createPost/createPost';
import { MyProfile } from '../components/profile/MyProfile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { Search } from '../components/search/search';
import { PreviewUserPlan } from '../plans/preview/PreviewUserPlan';
import { FollowerFollowingTab } from './FollowerFollowingTab';

export const MyProfileStack = () => {
	const HomeStackNav = createStackNavigator();
	const { theme } = useThemeContext();

	return (
		<HomeStackNav.Navigator
			initialRouteName='myProfile'
			screenOptions={{
				headerShown: false,
				// headerTintColor: 'white',
				headerStyle: { backgroundColor: 'black' },
				headerBackTitleStyle: {
					color: theme.textColorPrimary,
					fontFamily: theme.fontFamily,
				},
				headerBackTitleVisible: true,
				headerBackTitle: 'back',
				headerTitleStyle: {
					color: theme.textColorPrimary,
					fontFamily: theme.fontFamily,
				},
				cardStyle: { backgroundColor: 'black' },
			}}>
			<HomeStackNav.Screen
				name='myProfile'
				component={MyProfile}
			/>
			<HomeStackNav.Screen
				name='profileEdit'
				component={ProfileEdit}
			/>
			<HomeStackNav.Screen
				name='createPlan'
				component={CreatePlanScreen}
			/>
			<HomeStackNav.Screen
				name='createPost'
				component={CreatePost}
			/>
			<HomeStackNav.Screen
				options={{
					headerShown: true,
					title: '',
					headerTintColor: 'white',
					headerBackTitleVisible: false,
			}}
				name='profilePlanV2'
				component={PreviewUserPlan}
			/>

			<HomeStackNav.Screen
				name='search'
				component={Search}
			/>
			<HomeStackNav.Screen
				name='followerFollowing'
				options={{ headerShown: true, title: 'back', 
				headerTintColor: 'white',
				 }}
				component={FollowerFollowingTab}
			/>
		</HomeStackNav.Navigator>
	);
};
