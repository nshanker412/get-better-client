import Intro from '@components/intro/intro';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationsProvider } from '@context/notifications/NotificationsProvider';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { MainScreen } from '../navigation/MainScreen';

const styles = StyleSheet.create({
	animationContainer: {
		//   backgroundColor: '#fff',
		backgroundColor: 'transparent',
	  alignItems: 'center',
	  justifyContent: 'center',
	  flex: 1,
	},
	buttonContainer: {
	  paddingTop: 20,
	},
  });

const Loader = () => {
	const animation = useRef(null);
	useEffect(() => {
	  // You can control the ref programmatically, rather than using autoPlay
		// animation.current?.play();
		animation.current?.play();
		// return () => 		animation.current?.reset();

	}, []);
  
	return (
	  <View style={styles.animationContainer}>
		<LottieView
		  autoPlay
		  ref={animation}
		  style={{
			width: 200,
			  height: 200,
		
			  backgroundColor: 'transparent',
			
		  }}
				source={require('@assets/lottie/inf_loader_2.json')}
		/>
		
	  </View>
	);
  }


export const AuthStack = () => {
	const AuthStackNav = createStackNavigator();
	const { username: myUsername, hasPostedDaily } = useMyUserInfo();



	if (myUsername == null) {
		return (
			<Loader />
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
