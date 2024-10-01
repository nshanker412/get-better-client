import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ExpoNotifications from 'expo-notifications';
import React, {
	useEffect,
	useState
} from 'react';
import { NotificationsDrawer } from './NotificationsDrawer';
import {
	ConnectedNotificationsDrawerProps
} from './NotificationsDrawer.types';
import {useAuth} from "@context/auth/useAuth";




export const ConntectedNotificationsDrawer: React.FC<ConnectedNotificationsDrawerProps> = ({ lastReadtimestamp }) => {
	// console.log(lastReadtimestamp);
	// const [loading, setLoading] = useState<boolean>(false);
	// const myNotifMap= new Map<number, MyNotification>();

	// const [notifList, setNotifList] = useState<MyNotification[]>([]);
	// const {username: myUsername} = useMyUserInfo();



	// const lastReadTimestamp = Date.now(); //TODO - get from async storage

	


	// const fetchNotifications = async (myUsername: string): Promise<Notification[] | void>  => {
	// 	try {
	// 		const res = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${myUsername}`);
	// 		const notifications = res.data.notifications;
	// 		return notifications;
	// 	} catch (err) {
	// 		console.error(err);
	// 		Toast.show({ text1: 'Failed to fetch notifications. Please try again.', text2: "Please try again.", type: "error" });
	// 	}
	// }

	// const fetchProfileImage = useCallback(async (username_i: string) => {
	// 	try {
	// 		return await axios
	// 		.get(
	// 			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${username_i}/profile/300/300`,
	// 		)
	// 	} catch (err) {
	// 		console.error(err);
	// 		// Toast.show({ text1: 'Failed to fetch profile images. Please try again.', text2: "Please try again.", type: "error" });
	// 	}
	// }, []);



	// useEffect(() => {
	// 	setLoading(true);
	// 	const fetchAllNotifShit = async (myUsername: string) => {

	// 		try {
	// 			// (1) get notif list, 
	// 			const nots: Notification[] | void = await fetchNotifications(myUsername);
	// 			if (!nots?.len) return;
	// 			setNotifList(nots); 


	// 			nots?.forEach(async (notif: Notification, index) => {
	// 				const profileImage = await fetchProfileImage(notif.linkUsername)

	// 				myNotifMap.set(index, {
	// 					notification: notif,
	// 					userProfileImage: profileImage?.data.image,
	// 					unread: notif.timestamp > lastReadTimestamp,
	// 				});
	// 			});

	// 		} catch (err) {
	// 			console.error(err);
	// 			Toast.show({ text1: 'Failed to fetch notifications. Please try again.', text2: "Please try again.", type: "error" });
	// 		}
	// 	}

	// 	fetchAllNotifShit(myUsername!);
	// }, []);

	const { profileUsername } = useRoute();
	// const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);
	const [profileImages, setProfileImages] = useState({});
	const [loading, setLoading] = useState(true);
	const [notificationPermissions, setNotificationPermissions] = useState('');
	const { userToken } = useAuth();

	// const notificationStyles = useNotificationsStyles();
	// const { theme } = useThemeContext();

	// set the unread notification variable
	const setUnread = async () => {
		await AsyncStorage.setItem('notifications', 'read');
	};

	// fetch stored profile picture
	const fetchProfilePictures = async () => {
		// fetch new profile pictures in feed
		notifications.forEach((item) => {
			const itemUsername = item.content.split(' ')[0];
			if (!(itemUsername in profileImages)) {
				const filePath = `${itemUsername}_profile.jpeg`;
				const fileUri = FileSystem.documentDirectory + filePath;

				FileSystem.getInfoAsync(fileUri).then(({ exists }) => {
					if (exists) {
						FileSystem.readAsStringAsync(fileUri, {
							encoding: FileSystem.EncodingType.Base64,
						})
							.then((base64String) => {
								setProfileImages((prevProfileImages) => {
									let updatedProfileImages = {
										...prevProfileImages,
										[itemUsername]: base64String,
									};
									return updatedProfileImages;
								});
							})
							.catch((readFileError) => {
								console.log(
									'readFileError',
									readFileError.message,
								);
							});
					} else {
						axios
							.get(
								`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
							)
							.then(async (response) => {
								console.log(
									'fetchProfilePicture',
									itemUsername,
								);
								setProfileImages((prevProfileImages) => {
									let updatedProfileImages = {
										...prevProfileImages,
										[itemUsername]: response.data.profile_picture,
									};
									return updatedProfileImages;
								});

								// write new pfp to file system
								await FileSystem.writeAsStringAsync(
									fileUri,
									response.data.image,
									{
										encoding:
											FileSystem.EncodingType.Base64,
									},
								);
							})
							.catch((error) => {
								// console.log(" notificaiton drawer fetchProfilePictureError", error);
							});
					}
				});
			}
		});
	};

	async function fetchNotificationPermissions() {
		const { status: permissions } =
			await ExpoNotifications.getPermissionsAsync();
		setNotificationPermissions(permissions);

		if (permissions !== 'granted') {
		  alert('Please enable notifications in your settings.');
		  return;
		}
	}

	useEffect(() => {
		fetchProfilePictures();
	}, [notifications]);

	useEffect(() => {
		setUnread();
	}, []);

	useEffect(() => {
		fetchNotificationPermissions();
	}, []);

	useEffect(() => {
		setLoading(true);
	
		let url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${profileUsername}`;


		axios
			.get(url)
			.then((response) => {
				console.log(
					'fetchNotifications',
					response.data.notifications.length,
				);
				setNotifications(response.data.notifications);
				setLoading(false);
			})
			.catch((error) => {
				console.log('fetchNotificationsError', error);
			});
	}, [process.env.EXPO_PUBLIC_SERVER_BASE_URL]);

	return (
		<NotificationsDrawer
			loading={loading}
			newNotifications={notifications}
			allNotifications={notifications}
			profileImages={profileImages}
		/> 
	);
};
