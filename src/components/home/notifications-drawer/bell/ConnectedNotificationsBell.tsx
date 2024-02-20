// import { BellIconAlert } from '@assets/darkSvg/BellIconAlert.js';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNotifications } from '@context/notifications/useNotifications';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NotificationsBell } from './NotificationsBell';



export const ConnectedNotificationsBell: React.FC = () => {
    const { username: myUsername } = useMyUserInfo();
    const {navigate} = useNavigation();

    const { initialized, unreadNum, lastReadTime } = useNotifications();
    

    const onPressNotification = useCallback(async () => {
        
        const navigateParams = {
            profileUsername: myUsername,
            unreadNum: unreadNum,
            lastReadTime: lastReadTime,
        }

        navigate('notifications', navigateParams);
	
	}, [myUsername, unreadNum, lastReadTime, navigate]);

    return (
        <TouchableOpacity onPress={onPressNotification} 
        >
		<NotificationsBell
            unreadNum={unreadNum ?? 0}
            loading={!initialized}
            />
        </TouchableOpacity>
	);
};
