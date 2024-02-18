// import { BellIconAlert } from '@assets/darkSvg/BellIconAlert.js';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Unread } from '@models/notification';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NotificationsBell } from './NotificationsBell';



export const ConnectedNotificationsBell: React.FC = () => {
	const [loadingNotifications, setLoadingNotifications] =
		useState<boolean>(true);
	const [unreadNotifications, setUnreadNotifications] = useState<
		number | undefined
        >();
    const [lastReadTime, setLastReadTime] = useState<number | undefined>();
    const { username: myUsername } = useMyUserInfo();
    const navigation = useNavigation();

	useEffect(() => {
		setLoadingNotifications(true);
		const fetchNotifications = async (myUsername: string) => {
			try {
                const response = await axios.get<Unread>(
                    `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/unread/${myUsername}`,
                );
                const unreadNotifs: Unread = response.data
                setLastReadTime(unreadNotifs.lastNotificationReadTime);
                setUnreadNotifications(unreadNotifs.unreadNum);

			} catch (err) {
				console.error(err);
                throw new Error('Failed to fetch notifications. Please try again.'); 
                
			} finally {
				setLoadingNotifications(false);
			}
		};

		fetchNotifications(myUsername!);
    }, []);
    


    const onPressNotification = useCallback(async () => {
        
        const navigateParams = {
            profileUsername: myUsername,
            unreadNum: unreadNotifications,
            lastReadTime: lastReadTime,
        }

		navigation.navigate('notifications', navigateParams);
	
	}, [myUsername]);

    return (
        <TouchableOpacity onPress={onPressNotification} style={{
         
        }
}>
		<NotificationsBell
            unreadNum={unreadNotifications??0}
            loading={loadingNotifications}
            />
        </TouchableOpacity>
	);
};
