import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { CreatePlanScreen } from 'src/plans/CreatePlanScreen';
import CreatePost from '../components/createPost/createPost';
import { Profile } from '../components/profile/Profile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { Search } from '../components/search/search';
import { PreviewUserPlan } from '../plans/preview/PreviewUserPlan';
import { FollowerFollowingTab } from './FollowerFollowingTab';



export const MyProfileStack = ({navigation}) => {
	const ProfileStackNav = createStackNavigator();
	const {username} = useMyUserInfo();

	return (
		<>
		<ProfileStackNav.Navigator
			initialRouteName='myProfile'
			screenOptions={{
				headerShown: true,
				headerTintColor: 'white',
				headerTitle: '',
				headerTitleStyle: false,

				headerShadowVisible: false,
				headerStyle: { backgroundColor: 'black',height: 80 },
				headerBackTitleVisible: false,
				cardStyle: { backgroundColor: 'black' },
			}}>
			<ProfileStackNav.Screen
					options={{
						headerShown: true,
						headerLeftLabelVisible: false,
						headerRightContainerStyle: {},
						headerTitle: '',
						headerTintColor: 'white',
						headerTransparent: true,
						headerBackTitleVisible: true,
						headerLeft: () => null,
					}}
					name='myProfile'
					component={Profile}
					initialParams={{ profileUsername: username }}
			/>
			<ProfileStackNav.Screen
				name='profileEdit'
					component={ProfileEdit}
				
			/>
			<ProfileStackNav.Screen
					name='createPlan'
					options={
						{
							headerShown: true,
							title: '',
							headerTintColor: 'transparent',
							headerBackTitleVisible: false,
						}
					}
				component={CreatePlanScreen}
			/>
			<ProfileStackNav.Screen
				name='createPost'
				component={CreatePost}
			/>
			<ProfileStackNav.Screen
				options={{
					headerShown: true,
					title: '',
					headerTintColor: 'white',
					headerBackTitleVisible: false,
			}}
				name='profilePlanV2'
				component={PreviewUserPlan}
			/>

			<ProfileStackNav.Screen
				name='search'
				component={Search}
			/>
			<ProfileStackNav.Screen
				name='followerFollowing'
				options={{
					headerShown: true,
					headerBackTitleVisible: false, 
					headerTintColor: 'white',
				 }}
				component={FollowerFollowingTab}
			/>
			</ProfileStackNav.Navigator>
			</>
	);
};
