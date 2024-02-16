import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import React from 'react';
import { STATS_LIST_LENGTH } from '../../../../constants/constants';
import { LoadingSpinner } from '../../../loading-spinner/LoadingSpinner';
import { StatsList } from './StatsList';
import {
	BaseConnectedStatsListProps,
	ConnectedStatsListProps,
} from './StatsList.types';

 enum ApiLoadingState {
	Idle = 'Idle',
	Loading = 'Loading',
	Loaded = 'Loaded',
	Error = 'Error',
}

/**
 * Connected StatsList Component
 * TODO - bundle UserState into state object w/ redux
 * change of the user should trigger a rerender
 */
const _ConnectedStatsList: React.FC<BaseConnectedStatsListProps> = ({
	isLoading,
	consistency,
	challengesComplete,
	numberOfPlans,
}) => {
	/**
	 * Todo: Add loading shimmer
	 */
	return (
		<>
			{!isLoading ? (
				<StatsList
					consistency={consistency}
					challengesComplete={challengesComplete}
					numberOfPlans={numberOfPlans}
					statsListLength={STATS_LIST_LENGTH}
				/>
			) : (
				<LoadingSpinner />
			)}
		</>
	);
};

const MyUserStatsList: React.FC = () => {
	const { loadUserInfoState, loadPlansState, myData, plans } =
		useMyUserInfo();

	return (
		<_ConnectedStatsList
			isLoading={
				loadUserInfoState !== ApiLoadingState.Loaded &&
				loadPlansState !== ApiLoadingState.Loaded
			}
			consistency={myData?.consistency}
			challengesComplete={myData?.challengesComplete}
			numberOfPlans={plans?.length}
		/>
	);
};

const OtherUserStatsList: React.FC = () => {
	const { loadUserInfoState, loadPlansState, userData, plans } =
		useOtherUserInfo();

	return (
		<_ConnectedStatsList
			isLoading={
				loadUserInfoState !== ApiLoadingState.Loaded &&
				loadPlansState !== ApiLoadingState.Loaded
			}
			consistency={userData?.consistency}
			challengesComplete={userData?.challengesComplete}
			numberOfPlans={plans?.length}
		/>
	);
};

export const ConnectedStatsList: React.FC<ConnectedStatsListProps> = ({
	isMyProfile,
}) => {
	return isMyProfile ? <MyUserStatsList /> : <OtherUserStatsList />;
};
