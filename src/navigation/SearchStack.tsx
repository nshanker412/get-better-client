import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Profile } from '../components/profile/Profile';
import { FollowerFollowingTab } from './FollowerFollowingTab';
import { Search } from '../components/search/search';


export const SearchStack = () => {
	const SearchStackNav = createStackNavigator();

	return (
		<SearchStackNav.Navigator
			screenOptions={{
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
			<SearchStackNav.Screen
				name='search'
				component={Search}
			/>
			<SearchStackNav.Screen
				name='profile'
				component={Profile}
			/>
			<SearchStackNav.Screen
				name='followerFollowing'
				component={FollowerFollowingTab}
				options={{
					headerShown: true,
					// headerBackTitleVisible: true, 
					title: '',
					headerTintColor: 'white',
				}}
			/>
		</SearchStackNav.Navigator>
	);
};
