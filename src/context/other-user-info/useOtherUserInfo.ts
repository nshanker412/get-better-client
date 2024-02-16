import { useContext } from 'react';
import { OtherUserInfoContext } from './OtherUserInfoProvider';

export const useOtherUserInfo = () => {
	const context = useContext(OtherUserInfoContext);
	if (!context) {
		throw new Error(
			'useOtherUserInfo must be used within a MyUserInfoProvider',
		);
	}
	return context;
};
