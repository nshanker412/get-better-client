import FeedScreen from '@components/profile/profile-body/profile-posts/post-flashlist/Feed';
import { BottomTabEventProvider } from '@context/bottom-tab-nav/BottomTabEventProvider';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { PreviewUserPlan } from 'src/plans/preview/PreviewUserPlan';
import CreatePost from '../components/createPost/createPost';
import { Notifications } from '../components/notifications/Notifications';
import { Profile } from '../components/profile/Profile';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { ProfilePost } from '../components/profile/ProfilePost';

export const HomeStack: React.FC = ({ navigation }) => {
	const HomeStackNav = createStackNavigator();

	return (
		<BottomTabEventProvider tabnav={navigation}>
			<HomeStackNav.Navigator
				screenOptions={{
					headerShown: true,
					headerTintColor: 'white',
					headerTitle: '',
					headerTitleStyle: false,
					headerShadowVisible: false,
					headerTransparent: true,
					headerStyle: { backgroundColor: 'black', height: 80 },
					headerBackTitleVisible: false,
					cardStyle: { backgroundColor: 'black'},

				}}>
				<HomeStackNav.Screen

					options={{ headerShown: false, headerStyle: { backgroundColor: 'black', height: 80 } }}
					name='home'
					component={FeedScreen}
				/>
				<HomeStackNav.Screen
					options={{
						presentation: 'modal',
					}}
					
					name='post'
					component={CreatePost}
				/>
				<HomeStackNav.Screen
					
					name='profile'
					component={Profile}
					
				/>
				<HomeStackNav.Screen
					options={{ headerShown: false }}
					name='notifications'
					component={Notifications}
				/>
				<HomeStackNav.Screen
					name='profilePost'
					component={ProfilePost}
				/>
				
				<HomeStackNav.Screen
					name='profilePlanV2'
					component={PreviewUserPlan}
				/>
				<HomeStackNav.Screen
					name='profileEdit'
					component={ProfileEdit}
				/>
			</HomeStackNav.Navigator>
		</BottomTabEventProvider>
	);
};
