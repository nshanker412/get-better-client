import { UserStatType } from '@types';
export interface BaseConnectedStatsListProps {
	isLoading: boolean;
	consistency?: UserStatType;
	challengesComplete?: UserStatType;
	numberOfPlans: UserStatType;
}

export interface StatsListProps {
	consistency?: UserStatType;
	challengesComplete?: UserStatType;
	numberOfPlans: UserStatType;
	statsListLength?: number;
}

export interface ConnectedStatsListProps {
	isMyProfile: boolean;
}
