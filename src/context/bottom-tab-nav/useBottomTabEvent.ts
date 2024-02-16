import { useContext } from 'react';
import { BottomTabNavContext } from './BottomTabContext';

/**
 * custom context hook
 */
export const useBottomTabEvent = () => {
	const context = useContext(BottomTabNavContext);
	if (!context) {
		throw new Error(
			'useBottomTabEvent must be used within a BottomTabEventProvider',
		);
	}
	return context;
};
