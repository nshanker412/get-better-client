import { NotificationsResponseV2 } from '@models/notifications';
import { useNavigation } from '@react-navigation/native';
import * as ExpoNotifications from 'expo-notifications';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NotificationContext, NotificationTokenApiResponse, NotificationsProviderProps, PushNotificationInfoPacket, PushNotificationPacket } from './Notifications.types';
import { NotificationsContext } from './NotificationsContext';
import { fetchNotifications } from './utils/fetchNotifications';
import { fetchTokens } from './utils/fetchTokens';
import { registerPushToken } from './utils/registerPushToken';
import { removePushToken as _removePushToken } from './utils/removePushToken';
import { scheduleDailyNotification } from './utils/scheduleDailyNotification';
import { sendPushNotification } from './utils/sendPushNotification';
import { setNotificationsSeen as _setNotificationsSeen } from './utils/setNotificationsSeen';



// ExpoNotifications.setNotificationHandler({
//     handleNotification: async () => ({
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     }),
// });


/**
 *  Notifications Provider 
 *  configs expo push notifications and manages 
 *  app state for social notifications
 * @param param0 
 * @returns 
 */
export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({myUsername: _myUsername, children }) => {
    /** GB Service */
    const [myUsername, setMyUsername] = useState<string>('');
    const [initialized, setInitialized] = useState<boolean>(false)
    const [permissions, setPermissions] = useState<boolean>(false);
    const [notificationsResponse, setNotificationsResponse] = useState<NotificationsResponseV2| null>(null);
    const [unreadNum, setUnreadNum] = useState<number | undefined>(undefined);
    const [notifications, setNotifications] = useState<Notification[] | []>([])
    const [lastReadTime, setLastReadTime] = useState<number | undefined>(undefined);

    /** EXPO  */
    const notificationListener = useRef<ExpoNotifications.Subscription>(null);
    const responseListener = useRef<ExpoNotifications.Subscription>(null);

    const { navigate } = useNavigation();

    /**
     * Called when a user taps on a notification
     * @param event 
     */
    const onNotificationResponseReceived = (event: ExpoNotifications.NotificationResponse) => {
        const path = event.notification.request.content.data.path;
        if (path) {
            navigate(path);
        }
    }

    /**
     * Called when a notification is received
     * @param notification 
     */
    const onNotificationReceived = (notification: ExpoNotifications.Notification) => {
        // setNotification(notification);
        console.log('Inbound Notification received', notification);
        // TODO: Add animatied handling for this
        refreshNotifications();

    }


    useEffect(() => {
        if (_myUsername) {
            console.log('INSDE myUsername notifications', _myUsername);
            configureMyNotifications(_myUsername);
        }
    }, [_myUsername]);


    useEffect(() => {
        if (notificationsResponse) {
            setUnreadNum(notificationsResponse.unreadNum);
            setNotifications(notificationsResponse.notifications);
            setLastReadTime(notificationsResponse.lastReadTime);
        }
    }, [notificationsResponse]);


    /**
     * EXPO Notification subscription manager
     */
    useEffect(() => {
        notificationListener.current = ExpoNotifications.addNotificationReceivedListener(onNotificationReceived);
        responseListener.current = ExpoNotifications.addNotificationResponseReceivedListener(onNotificationResponseReceived);
	
        return () => {
            ExpoNotifications.removeNotificationSubscription(notificationListener?.current);
            ExpoNotifications.removeNotificationSubscription(responseListener?.current);
        }
    }, []);


    /**
     *  Configure my notifications
     * @param myUsername 
     */
    const configureMyNotifications = async (myUsername: string) => {
       
        setMyUsername(myUsername);

        // 1. Check for notification permissions
        try {
            const { status } = await ExpoNotifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: askStatus } = await ExpoNotifications.requestPermissionsAsync();
                if (askStatus !== 'granted') {
                    console.log('Notification permissions not granted');
                    return;
                }
            } else {
                setPermissions(true);
            }
        } catch (e) {
            console.log('Error getting notification permissions', e);
            console.log('Init NotifProvider: (1) Failed to get notification permissions');
        }

        // 2. (EXPO) Register for push notifications and get my push tokens
        try {
            const token = await registerPushToken(myUsername);
            // setMyToken(token);
            console.log('myToken', token);
        } catch (e) {
            console.log('Error getting notification token', e);
            console.log('Init NotifProvider: (2) Failed to register my push tokens');
        }

        // 3. (EXPO) Schedule daily notification
        try {
            await scheduleDailyNotification();
        } catch (e) {
            console.log('Error scheduling daily notification', e);
            console.log('Init NotifProvider: (3) Failed to schedule daily notification');
        }

        // 4. (GB) Fetch notifications
        try {
            const notifs = await fetchNotifications(myUsername);
            if (notifs) {
                setNotificationsResponse(notifs);
            }
            
        } catch (e) {
            console.log('Error fetching unread notifications', e);
            console.log('Init NotifProvider: (4) Failed to fetch unread notifications from GB service');
        }

        setInitialized(true);
    }

    /**
     * Set notifications seen
     */
    const setNotificationsSeen = async () => {
        if (myUsername) {
            try {
                // (GB) Set notifications seen
                await _setNotificationsSeen(myUsername)
                await refreshNotifications();
            } catch (e) {
                console.log('Error setting notifications seen', e);
                console.log('Failed to set notifications seen');
            }
        }   
    }

    /**
     * Refresh notifications
     */
    const refreshNotifications = async () => {
        if (myUsername) {
            try {
                const newNotifications = await fetchNotifications(myUsername);
                if (newNotifications) {
                    setNotificationsResponse(newNotifications)
                }
            } catch (e) {
                console.log('Error fetching unread notifications', e);
                console.log('Failed to fetch unread notifications from GB service');
            }
        }
    }

    /**
     * Remove push token
     */
    const removePushToken = async () => {
        if (myUsername) {
            try {
                // (GB) Remove push token
                await _removePushToken(myUsername);
            } catch (e) {
                console.log('Error removing push token', e);
                console.log('Failed to remove push token');
            }
        }
    }

    /**
     * Send out push notification
     * @param recipient
     * @param pushPacket
     * @returns
     */
    const sendOutPushNotification = async (recipient: string, pushPacket: PushNotificationInfoPacket) => {
        if (!recipient) {
            console.log('No recipient, not sending push notification!');
            return;
        };

        if (recipient === myUsername) {
            console.log('Recipient is me, not sending push notification!');
            return;
        }

        if (!pushPacket) {
            console.log('No push packet, not sending push notification!');
            return;
        
        };

        console.log('SENDING OUT PUSH NOTIFICATION-->>', recipient, pushPacket)
        console.log('recipient', recipient);
        console.log('pushPacket', pushPacket);

        // 1. Get recipient's tokens
        let recipientTokens: NotificationTokenApiResponse | undefined;
        try {
             recipientTokens = await fetchTokens(recipient);

        } catch (e) {
            console.log('Error getting recipient token', e);
            console.log('Failed to get recipient token');
        } finally {
            console.log('recipientTokens', recipientTokens);
        }

        // 2. Send out push notifications to all tokens
        recipientTokens?.tokens?.forEach(async (token) => {
            try {
                const payload: PushNotificationPacket = {
                    to: token,
                    sound: 'default',
                    title: pushPacket.title,
                    body: pushPacket.body,
                    data: { path: pushPacket.data.path, params: pushPacket.data?.params },
                }
                console.log('actually sending payload', payload);    
                await sendPushNotification(payload)
            
            } catch (e) {
                console.log('Error sending out push notification', e);
                // console.log('Failed to send out push notification');
            }
        })
    }

    const contextValue: NotificationContext = useMemo(() => {
        return {
            initialized,
            permissionsGranted: permissions,
            unreadNum: unreadNum,
            lastReadTime: lastReadTime,
            notifications: notifications,
            configureMyNotifications,
            setNotificationsSeen,
            refreshNotifications,
            removePushToken,
            sendOutPushNotification,
	}
    }, [initialized, permissions, unreadNum, lastReadTime, notifications, myUsername]);


	return (
			<NotificationsContext.Provider value={contextValue}>
                {children}
			</NotificationsContext.Provider>
	);
};


