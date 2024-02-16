import { useContext } from 'react';
import { MyUserInfoContext } from './MyUserInfoProvider';

export const useMyUserInfo = () => {
	const context = useContext(MyUserInfoContext);
	if (!context) {
		throw new Error(
			'useMyUserInfo must be used within a MyUserInfoProvider',
		);
	}

	return context;
};
