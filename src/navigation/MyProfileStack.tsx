import { useThemeContext } from '@context/theme/useThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreatePlan from '../components/createPlan/createPlan';
import CreatePost from '../components/createPost/createPost';
import { MyProfile } from '../components/profile/MyProfile';
import ProfileEdit from '../components/profile/profileEdit';
import { Search } from '../components/search/search';
import { FollowerFollowingTab } from './FollowerFollowingTab';

export const MyProfileStack = () => {
	const HomeStackNav = createStackNavigator();
	const { theme } = useThemeContext();

	return (
		<HomeStackNav.Navigator
			initialRouteName='myProfile'
			screenOptions={{
				headerShown: false,
				headerTintColor: 'white',
				headerStyle: { backgroundColor: 'black' },
				headerBackTitleVisible: false,
				headerBackTitle: 'Back',
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
				component={CreatePlan}
			/>
			<HomeStackNav.Screen
				name='createPost'
				component={CreatePost}
			/>
			<HomeStackNav.Screen
				name='search'
				component={Search}
			/>
			<HomeStackNav.Screen
				name='followerFollowing'
				options={{ headerShown: true, title: '' }}
				component={FollowerFollowingTab}
			/>
		</HomeStackNav.Navigator>
	);
};
