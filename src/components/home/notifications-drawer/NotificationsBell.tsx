// import { BellIconAlert } from '@assets/darkSvg/BellIconAlert.js';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Circle, Path, Svg, Text as SvgText } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner';
import { NotificationsBellProps } from './NotificationsDrawer.types';

/**
 * SVG icon for the notifications bell
 * shows a red circle with notification count in it if there are new notifications
 * @returns
 */
const BellIconAlert = ({ number = 0, width = 50, height = 54 }) => {
	const showNotification = number >= 1;

	const displayNumber = number <= 9 ? number : '9+';

	return (
		<Svg
			width={width}
			height={height}
			viewBox='0 0 30 34'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<Path
				d='M14.2856 3.45898C10.3517 3.45898 7.15464 6.65603 7.15464 10.5899V14.0247C7.15464 14.7496 6.84563 15.8549 6.4772 16.473L5.11043 18.743C4.2666 20.1454 4.84896 21.7023 6.394 22.2253C11.5164 23.9367 17.0429 23.9367 22.1653 22.2253C23.6034 21.7499 24.2333 20.0503 23.4489 18.743L22.0821 16.473C21.7256 15.8549 21.4166 14.7496 21.4166 14.0247V10.5899C21.4166 6.66791 18.2076 3.45898 14.2856 3.45898Z'
				stroke='white'
				strokeWidth='1.78274'
				strokeLinecap='round'
			/>
			<Path
				d='M16.4843 3.80316C16.1159 3.6962 15.7356 3.613 15.3434 3.56547C14.2024 3.42285 13.109 3.50604 12.0869 3.80316C12.4316 2.92368 13.2873 2.30566 14.2856 2.30566C15.284 2.30566 16.1397 2.92368 16.4843 3.80316Z'
				stroke='white'
				strokeWidth='1.78274'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<Path
				d='M17.8511 22.6533C17.8511 24.6143 16.2467 26.2188 14.2857 26.2188C13.3111 26.2188 12.4078 25.8147 11.7661 25.1729C11.1243 24.5311 10.7202 23.6279 10.7202 22.6533'
				stroke='white'
				strokeWidth='1.78274'
			/>

			{showNotification && (
				<Circle
					cx='22.5'
					cy='26.0234'
					r='7.5'
					fill='#FF0000'
				/>
			)}
			{showNotification && (
				<SvgText
					x='22.5'
					y='27.0234'
					textAnchor='middle'
					alignmentBaseline='middle'
					fill='white'
					fontSize='12'
					fontWeight='bold'>
					{displayNumber}
				</SvgText>
			)}
		</Svg>
	);
};

// function to get all notifications that occured before last timestamp saved in async storage
export const checkForNotifications = async (
	myUsername: string,
): Promise<number> => {
	//1. fetch last notification read timestamp from async storage
	//2. if no timestamp to now
	//3. fetch all notifications
	//4. cont the number of notifications that occured after last timestamp

	try {
		// (1)
		const lastReadFromStorage = await AsyncStorage.getItem(
			'lastNotificationReadTimestamp',
		);
		// (2)
		const lastTimestamp = lastReadFromStorage
			? lastReadFromStorage
			: Date.now();
		const lastNotificationReadTimestamp = Math.floor(
			new Date(lastTimestamp).getTime() / 1000,
		);
		console.log('twoDaysAgoTimestamp', lastNotificationReadTimestamp);

		// (3)
		const res = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${myUsername}`,
		);

		console.log('res', res.data.notifications);

		// (4)
		const newNotifications = res.data.notifications.filter(
			(notification) => {
				return notification.timestamp > lastNotificationReadTimestamp;
			},
		);

		console.log('newNotifications', newNotifications?.length);
		return newNotifications?.length;
	} catch (err) {
		console.error(err);
		return 0;
	}
};

export const NotificationsBell: React.FC<NotificationsBellProps> = ({newNotificationsCount}) => {
	const [loadingNotifications, setLoadingNotifications] =
		useState<boolean>(true);
	const [unreadNotifications, setUnreadNotifications] = useState<
		number | undefined
	>();
	// const { theme } = useThemeContext();
	const { username: myUsername } = useMyUserInfo();

	useEffect(() => {
		setLoadingNotifications(true);
		const fetchNotifications = async (myUsername: string) => {
			try {
				const numNewNots = await checkForNotifications(myUsername);

				setUnreadNotifications(numNewNots);
			} catch (err) {
				console.error(err);
				Toast.show({
					text1: 'Failed to fetch notifications. Please try again.',
					text2: 'Please try again.',
					type: 'error',
				});
			} finally {
				setLoadingNotifications(false);
			}
		};

		fetchNotifications(myUsername!);
	}, []);


	useEffect(() => {
		console.log('newNotificationsCount', newNotificationsCount);
	
	}, [newNotificationsCount]);

	if (loadingNotifications) {
		return <LoadingSpinner />;
	}

	return (
		<BellIconAlert
			number={newNotificationsCount}
			height={35}
			width={38}
		/>
	);
};
