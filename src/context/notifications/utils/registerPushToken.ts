import axios from 'axios';
// import Constants from 'expo-constants';
import * as ExpoNotifications from 'expo-notifications';
import {useAuth} from '@context/auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function registerForPushNotificationsAsync() {
	let token;

	  const { status: existingStatus } = await ExpoNotifications.getPermissionsAsync();
	  let finalStatus = existingStatus;
	  if (existingStatus !== 'granted') {
		const { status } = await ExpoNotifications.requestPermissionsAsync();
		finalStatus = status;
	  }
	  if (finalStatus !== 'granted') {
		alert('Failed to get push token for push notification!');
		return;
	  }
	  token = await ExpoNotifications.getExpoPushTokenAsync({
		projectId: '6fb0255c-e280-4c9f-b098-4bf5553a0523',
	  });
	  
	return token.data;
  }

export const registerPushToken = async ()=> {

	registerForPushNotificationsAsync().then(async (token) => {
		await AsyncStorage.setItem("NotificationToken",token)
		}
	);
	return await AsyncStorage.getItem("NotificationToken")
    };
    