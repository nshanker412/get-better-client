import { Notification } from '@models/notifications';
import React from 'react';

export interface NotificationContext {
    /** GB service */
    permissionsGranted: boolean;
    initialized: boolean;
    unreadNum: number | undefined;
    notifications: Notification[] | undefined;
    lastReadTime: number | undefined;
    configureMyNotifications: (myUsername: string) => void;
    sendOutPushNotification: (recipient: string, PushNotificationPacket: PushNotificationInfoPacket) => void; // Non-blocking
    removePushToken: () => Promise<void>;
    refreshNotifications: (username: string) => Promise<void>;
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
    data: {
        path: string, params?: { [key: string]: string };
    }}

/**
 *  For callers of the sendOutPushNotification function
 */
export interface PushNotificationInfoPacket {
    title: string;
    body: string;
    data: {
        path: string, params?: { [key: string]: string };
    }
}

  
export interface NotificationTokenApiResponse {
    tokens: string[];
}

