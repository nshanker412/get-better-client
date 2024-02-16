import { BottomTabEventProvider } from '@context/bottom-tab-nav/BottomTabEventProvider';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreatePost from '../components/createPost/createPost';
import { Home } from '../components/home/home';
import Notifications from '../components/notifications/notifications';
import { Profile } from '../components/profile/Profile';
import ProfilePlan from '../components/profile/ProfilePlan';
import ProfilePost from '../components/profile/ProfilePost';
import ProfileEdit from '../components/profile/profileEdit';

export const HomeStack: React.FC = ({ navigation }) => {
	const HomeStackNav = createStackNavigator();

	return (
		<BottomTabEventProvider tabnav={navigation}>
			<HomeStackNav.Navigator
				screenOptions={{
					headerShown: false,
					cardStyle: { backgroundColor: 'black' },
				}}>
				<HomeStackNav.Screen
					name='home'
					component={Home}
				/>
				<HomeStackNav.Screen
					name='post'
					component={CreatePost}
				/>
				<HomeStackNav.Screen
					name='profile'
					component={Profile}
				/>
				<HomeStackNav.Screen
					name='notifications'
					component={Notifications}
				/>
				<HomeStackNav.Screen
					name='profilePost'
					component={ProfilePost}
				/>
				<HomeStackNav.Screen
					name='profilePlan'
					component={ProfilePlan}
				/>
				<HomeStackNav.Screen
					name='profileEdit'
					component={ProfileEdit}
				/>
			</HomeStackNav.Navigator>
		</BottomTabEventProvider>
	);
};
