import { SettingsScreen } from '@components/settings/SettingsScreen';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { CreatePlanScreen } from 'src/plans/CreatePlanScreen';
import CreatePost from '../components/createPost/createPost';
import { Profile } from '../components/profile/Profile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { Search } from '../components/search/search';
import { PreviewUserPlan } from '../plans/preview/PreviewUserPlan';
import { FollowerFollowingTab } from './FollowerFollowingTab';

function SettingsTitle(props) {
	return (
		<View style={{ flexDirection: 'column', alignItems: 'center' }}>
			<Text style={{ fontSize: 18, fontFamily: fonts.inter.bold, color: grayDark.gray12 }}>Profile Settings</Text>
			<Text style={{ fontSize: 12, fontFamily: fonts.inter.black, color: grayDark.gray10 }}>{`@${props.username}`}</Text>
		</View>
	
	);
  }



export const MyProfileStack = ({navigation}) => {
	const ProfileStackNav = createStackNavigator();
	const { username } = useMyUserInfo();
	
	const Header = () => {
		<SettingsTitle username={username} />
	}


	return (
		<>
		<ProfileStackNav.Navigator
			initialRouteName='myProfile'
			screenOptions={{
				headerShown: false,
				headerTintColor: 'white',
				headerTitleStyle: false,
				headerShadowVisible: false,
				headerStyle: {
					backgroundColor: 'black',
					height: 80
				},
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
			
					options={{
						presentation: 'modal',
					}}
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
					
					headerShown: false,
					headerBackTitleVisible: false, 
					title: '',
					headerTintColor: 'white',



					// headerTintColor: 'white',
				 }}
				component={FollowerFollowingTab}
				/>
				<ProfileStackNav.Screen

					options={{
						headerShown: true,
						// headerTransparent: true,
						headerTitle: "Settings",
						// headerTitle: () => <SettingsTitle username={username} /> ,

				
					
						// headerTitleStyle: { fontSize: 20, fontFamily: fonts.inter.bold, color: grayDark.gray12 },
						headerTintColor: 'white',
						headerBackTitleVisible: false,
					}}
					name='settings'
					component={SettingsScreen}
				/>
			</ProfileStackNav.Navigator>
			</>
	);
};
