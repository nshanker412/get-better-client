import { useContext, useMemo } from 'react';
import { MyUserInfoContext } from './MyUserInfoProvider';

export const useMyUserInfo = () => {
	const context = useContext(MyUserInfoContext);
	if (!context) {
		console.log(
			'useMyUserInfo must be used within a MyUserInfoProvider',
		);
	}
	console.log("dsd",context)
	const memoizedContext = useMemo(() => context, [context]);

	return memoizedContext;
};
