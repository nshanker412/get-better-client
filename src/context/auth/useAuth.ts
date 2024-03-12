import { useContext } from 'react';
import { AuthContext } from './AuthContext';

export const useAuth = () => {
	const context = useContext(AuthContext);

	if (!context) {
		console.log('useAuth must be used within an AuthProvider');
	}

	return context;
};
