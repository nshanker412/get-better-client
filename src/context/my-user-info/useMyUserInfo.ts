import { useContext } from 'react';
import { MyUserInfoContext } from './MyUserInfoProvider';

export const useMyUserInfo = () => {
	const context = useContext(MyUserInfoContext);
	if (!context) {
		console.log(
			'useMyUserInfo must be used within a MyUserInfoProvider',
		);
	}

	return context;
};
