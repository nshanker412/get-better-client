import { createContext } from 'react';
import { NotificationContextType } from './Notifications.types';

const defaultContextValue: NotificationContextType = {  
    permissionsGranted: undefined,
    initialized: false,
    unreadNum:  undefined,
    notifications: [],
    lastReadTime:  undefined,
    configureMyNotifications: () => {},
    sendOutPushNotification: () => { },
    removePushToken: () => Promise.resolve(),
    refreshNotifications: () => Promise.resolve(),
    setNotificationsSeen: () => Promise.resolve(),
};


/**
 * Notifications Context
 */
export const NotificationsContext = createContext<NotificationContextType>(defaultContextValue);
