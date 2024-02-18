import { createContext } from 'react';
import { NotificationContext } from './Notifications.types';

/**
 * Notifications Context
 */
export const NotificationsContext = createContext<NotificationContext | undefined>(undefined);
