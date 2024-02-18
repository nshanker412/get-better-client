import { NotificationsResponseV2 } from '@models/notifications';
import { useNavigation } from '@react-navigation/native';
import * as ExpoNotifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { NotificationContext, NotificationTokenApiResponse, NotificationsProviderProps, PushNotificationPacket } from './Notifications.types';
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
    const [notificationsResponse, setNotificationsResponse] = useState<NotificationsResponseV2| null>(null);
    // const [myToken, setMyToken] = useState<string>();

    /** EXPO  */
    // const [notification, setNotification] = useState<ExpoNotifications.Notification>();
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
            configureMyNotifications(myUsername);
        }
        
    }, [_myUsername]);


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

        // 1. (EXPO) Register for push notifications and get my push tokens
        try {
            const token = await registerPushToken(myUsername);
            // setMyToken(token);
            console.log('myToken', token);
        } catch (e) {
            console.log('Error getting notification token', e);
            throw new Error('Failed to register my push tokens');
        }

        // 2. (EXPO) Schedule daily notification
        try {
            await scheduleDailyNotification();
        } catch (e) {
            console.log('Error scheduling daily notification', e);
            throw new Error('Failed to schedule daily notification');
        }

        // 3. (GB) Fetch notifications
        try {
            const notifs = await fetchNotifications(myUsername);
            if (notifs) {
                setNotificationsResponse(notifs);
            }
            
        } catch (e) {
            console.log('Error fetching unread notifications', e);
            throw new Error('Failed to fetch unread notifications from GB service');
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
            } catch (e) {
                console.log('Error setting notifications seen', e);
                throw new Error('Failed to set notifications seen');
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
                throw new Error('Failed to fetch unread notifications from GB service');
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
                throw new Error('Failed to remove push token');
            }
        }
    }

    /**
     * Send out push notification
     * @param recipient
     * @param pushPacket
     * @returns
     */
    const sendOutPushNotification = async (recipient: string, pushPacket: PushNotificationPacket) => {

        if (!recipient) return;
        if (!pushPacket) return;

        // 1. Get recipient's tokens
        let recipientTokens: NotificationTokenApiResponse | undefined;
        try {
             recipientTokens = await fetchTokens(recipient);

        } catch (e) {
            console.log('Error getting recipient token', e);
            throw new Error('Failed to get recipient token');
        }

        // 2. Send out push notifications to all tokens
        recipientTokens?.notificationTokens?.forEach(async (token) => {
            try {
                await sendPushNotification({ ...pushPacket, to: token })
            
            } catch (e) {
                console.log('Error sending out push notification', e);
                throw new Error('Failed to send out push notification');
            }
        })
    }

    const contextValue: NotificationContext = {
        initialized,
        unreadNum: notificationsResponse?.unreadNum,
        lastReadTime: notificationsResponse?.lastReadTime,
        notifications: notificationsResponse?.notifications,
        configureMyNotifications,
        setNotificationsSeen,
        refreshNotifications,
        removePushToken,
        sendOutPushNotification,
	};


	return (
			<NotificationsContext.Provider value={contextValue}>
                {children}
			</NotificationsContext.Provider>
	);
};


