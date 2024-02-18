import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationsProvider } from '@context/notifications/NotificationsProvider';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Intro from '../components/intro/intro';
import { MainScreen } from '../navigation/MainScreen';
import { LoadingScreen } from '../screens/LoadingScreen';

export const AuthStack = () => {
	const AuthStackNav = createStackNavigator();
	const { username: myUsername, hasPostedDaily } = useMyUserInfo();


	if (myUsername == null){
		return (
			<LoadingScreen/>
		)
	}
	return (
			<NotificationsProvider myUsername={myUsername}>
				<AuthStackNav.Navigator
						screenOptions={{
							headerShown: false,
							cardStyle: { 
								backgroundColor: 'black' 
							},
					}}>
					
						{!hasPostedDaily && (
						<AuthStackNav.Screen
							name='Intro'
							component={Intro}
						/>)}
					<AuthStackNav.Screen
						name='Main'
						component={MainScreen}
					/>
				</AuthStackNav.Navigator>
			</NotificationsProvider>
		);
	
};
