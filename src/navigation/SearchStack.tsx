import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Profile } from '../components/profile/Profile';
import { Search } from '../components/search/search';

export const SearchStack = () => {
	const SearchStackNav = createStackNavigator();

	return (
		<SearchStackNav.Navigator
			screenOptions={{
				headerShown: false,
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
		</SearchStackNav.Navigator>
	);
};
