

export interface Notification {
	content: string;
	linkUsername: string;
	timestamp: number;
}


export interface MyNotification {
	unread: boolean;
	notification: Notification;
	userProfileImage: string | null;
}

export interface NotificationDrawerProps {
	newNotifications: Notification[];
	allNotifications: MyNotification[];
	profileImages: { [key: string]: string };
	loading: boolean;
}

export interface NotificationsDrawerRef {
	openModal: () => void;
	closeModal: () => void;
}

export interface ConnectedNotificationsDrawerProps {
	lastReadtimestamp: number;
}

export interface NotificationsBellProps {
	newNotificationsCount: number;
}