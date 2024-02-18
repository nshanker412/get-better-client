import { Notification } from '@models/notifications';
import React from 'react';

export interface NotificationContext {
    /** GB service */
    initialized: boolean;
    unreadNum: number | undefined;
    notifications: Notification[] | undefined;
    lastReadTime: number | undefined;
    configureMyNotifications: (myUsername: string) => void;
    sendOutPushNotification: (recipient: string, PushNotificationPacket: PushNotificationPacket) => void;
    removePushToken: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
    setNotificationsSeen: () => Promise<void>;
}
  
export interface NotificationsProviderProps {
    myUsername: string ,
    children: React.ReactNode;
}

/**
 * Type declarations for helper types
 */
export interface PushNotificationPacket {
    to: string;
    sound: 'default';
    title: string;
    body: string;
    data: { path: string };
}

  
export interface NotificationTokenApiResponse {
    notificationTokens: string[];
}

