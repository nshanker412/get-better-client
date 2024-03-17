import { useContext } from 'react';
import { OtherUserInfoContext } from './OtherUserInfoProvider';

export const useOtherUserInfo = () => {
	const context = useContext(OtherUserInfoContext);
	if (!context) {
		console.log(
			'useOtherUserInfo must be used within a MyUserInfoProvider',
		);
	}


	return context;
};
