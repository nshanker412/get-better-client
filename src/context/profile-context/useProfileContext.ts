import { useContext } from 'react';
import { ProfileContext } from './ProfileContext';

export const useProfileContext = () => {
	const context = useContext(ProfileContext);
	if (!context) {
		console.log('useProfileContext must be used within a ProfileProvider');
	}
	return context;
}

