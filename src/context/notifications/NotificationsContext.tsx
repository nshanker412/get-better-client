import { createContext } from 'react';
import { NotificationContextType } from './Notifications.types';

const defaultContextValue: NotificationContextType = {  
    notifications: [],
    setNotifications: () => {},
    pushNotification: () => {},
    removeNotification: () => {},
    clearNotifications: () => {},
    };


/**
 * Notifications Context
 */
export const NotificationsContext = createContext<NotificationContextType>(defaultContextValue);
