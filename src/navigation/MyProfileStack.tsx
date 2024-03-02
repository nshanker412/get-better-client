import { useThemeContext } from '@context/theme/useThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { CreatePlanScreen } from 'src/plans/CreatePlanScreen';
import CreatePost from '../components/createPost/createPost';
import { MyProfile } from '../components/profile/MyProfile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { Search } from '../components/search/search';
import { PreviewUserPlan } from '../plans/preview/PreviewUserPlan';
import { FollowerFollowingTab } from './FollowerFollowingTab';




const SettingDrawer = () => {
	return (
		<Drawer
			drawerPosition="right"
			renderNavigationView={() => <SettingsButton />}
		>
			<MyProfile />
		</Drawer>
	);
}


export const MyProfileStack = () => {
	const ProfileStackNav = createStackNavigator();
	const { theme } = useThemeContext();



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
						
					// headerRight: () => <Ionicons name="settings-sharp" size={24} color={grayDark.gray12} onPress={() => console.log("blah")} />

				}}
				name='myProfile'
				component={MyProfile}
			/>
			<ProfileStackNav.Screen
				name='profileEdit'
				component={ProfileEdit}
			/>
			<ProfileStackNav.Screen
				name='createPlan'
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
