import { InfinityAnimation } from '@components/animations/InfinityAnimation';
import Intro from '@components/intro/intro';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationsProvider } from '@context/notifications/NotificationsProvider';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { MainScreen } from '../navigation/MainScreen';


export const AuthStack = () => {
	const AuthStackNav = createStackNavigator();
	const { username: myUsername, hasPostedDaily } = useMyUserInfo();


	if (myUsername == null) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<InfinityAnimation />
			</View>
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
