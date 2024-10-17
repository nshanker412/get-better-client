import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import React, { useEffect } from 'react';
import { LoadingSpinner } from '../../../loading-spinner/LoadingSpinner';
import { PlanList } from './PlanList';
import { ConnectedPlanListProps } from './PlanList.types';

enum ApiLoadingState {
	Idle = 'Idle',
	Loading = 'Loading',
	Loaded = 'Loaded',
	Error = 'Error',
}
/**
 * Connected PlanList Component
 * Details:
 */

const _ConnectedPlanList: React.FC<ConnectedPlanListProps> = ({
	isMyProfile,
	isLoading,
	username,
	plans,
	numberOfPlans,
}) => {
	/**
	 * Todo: Add loading shimmer
	 */


	return (
		<>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<PlanList
					isMyProfile={isMyProfile}
					plans={plans}
					username={username}
					numberOfPlans={numberOfPlans ?? 0}
				/>
			)}
		</>
	);
};
/**
 * My PlanList Component with props driven by MyInfo
 */
export const MyUserPlanList: React.FC = () => {
	const {
		username: myUsername,
		loadPlansState: myLoadPlansState,
		plans: myPlans,
		fetchMyPlans,
	} = useMyUserInfo();

	useEffect(() => {
		fetchMyPlans();
	}, []);

	return (
		<_ConnectedPlanList
			isMyProfile={true}
			username={myUsername}
			isLoading={myLoadPlansState !== ApiLoadingState.Loaded}
			plans={myPlans}
			numberOfPlans={myPlans?.length ? myPlans?.length + 1 : 1}
		/>
	);
};

/**
 * OtherUser PlanList Component with props driven by OtherUserInfo
 */
export const OtherUserPlanList: React.FC = () => {
	const {
		username: otherUsername,
		loadPlansState: otherUserLoadPlansState,
		plans: otherUserPlans,
		fetchUserPlans,
	} = useOtherUserInfo();

	useEffect(() => {
		fetchUserPlans();
	}, []);

	return (
		<_ConnectedPlanList
			isMyProfile={false}
			username={otherUsername}
			isLoading={otherUserLoadPlansState !== ApiLoadingState.Loaded}
			plans={otherUserPlans}
			numberOfPlans={
				otherUserPlans?.length ? otherUserPlans?.length + 1 : 0
			}
		/>
	);
};

export const ConnectedPlanList: React.FC<{ isMyProfile: boolean }> = ({
	isMyProfile,
}) => {
	return isMyProfile ? <MyUserPlanList /> : <OtherUserPlanList />;
};
