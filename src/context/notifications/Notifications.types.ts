import { Notification as NotificationModel } from '@models/notifications';
import React from 'react';

export interface NotificationContextType {
    /** GB service */
    permissionsGranted: boolean;
    initialized: boolean;
    unreadNum: number | undefined;
    notifications: NotificationModel[] | [];
    lastReadTime: number | undefined;
    configureMyNotifications: (myUsername: string) => void;
    sendOutPushNotification: ( recipient: string, PushNotificationPacket: PushNotificationInfoPacket) => void; // Non-blocking
    removePushToken: () => Promise<void>;
    refreshNotifications: (username: string) => Promise<void>;
    setNotificationsSeen: () => Promise<void>;
}



export enum NotificationType {
    LIKED_POST= "LIKED_POST",
    COMMENTED_ON_POST = "COMMENTED_ON_POST",
    FOLLOWED = "FOLLOWED",
    MENTIONED = "MENTIONED",
    CHALLENGE_COMPLETED = "CHALLENGE_COMPLETED",
    CHALLENGED = "CHALLENGED",
    DAILY_REMINDER = "DAILY_REMINDER",
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
        type: NotificationType,
        path: string,
        params?: { [key: string]: string };

    }}

/**
 *  For callers of the sendOutPushNotification function
 */
export interface PushNotificationInfoPacket {
    title: string;
    body: string;
    data: {
        type: NotificationType,
        path: string,
        params?: { [key: string]: string };
    }
}

  
export interface NotificationTokenApiResponse {
    tokens: string[];
}
