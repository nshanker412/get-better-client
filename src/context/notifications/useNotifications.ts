import { useContext } from 'react';
import { NotificationsContext } from './NotificationsContext';

export const useNotifications = () => {
	const context = useContext(NotificationsContext);
	if (!context) {
		console.log(
			'useNotifications must be used within NotificationsProvider',
		);
	}

	return context;
};
