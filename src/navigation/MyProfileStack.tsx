import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { CreatePlanScreen } from 'src/plans/CreatePlanScreen';
import CreatePost from '../components/createPost/createPost';
import { MyProfile } from '../components/profile/MyProfile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { Search } from '../components/search/search';
import { PreviewUserPlan } from '../plans/preview/PreviewUserPlan';
import { FollowerFollowingTab } from './FollowerFollowingTab';


const SettingsButton = () => {
	return (
		
		<Ionicons name="settings-sharp" size={24} color="white" />
	);
}


export const MyProfileStack = () => {
	const HomeStackNav = createStackNavigator();
	const { theme } = useThemeContext();

	return (
		<HomeStackNav.Navigator
			initialRouteName='myProfile'
			screenOptions={{
				headerShown: true,
				headerTintColor: 'white',
				headerTitle: '',
				headerTitleStyle: false,
				headerShadowVisible: false,

				headerStyle: { backgroundColor: 'black' },
				headerBackTitleVisible: false,
				cardStyle: { backgroundColor: 'black' },
			}}>
			<HomeStackNav.Screen
				options={{
					headerShown: true,
					headerRight: () => <Ionicons name="settings-sharp" size={24} color={grayDark.gray12} />
				}}
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
				options={{
					headerShown: true,
					headerBackTitleVisible: false, 
					headerTintColor: 'white',
				 }}
				component={FollowerFollowingTab}
			/>
		</HomeStackNav.Navigator>
	);
};
