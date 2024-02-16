export interface ConnectedPlanListProps {
	isMyProfile: boolean;
	isLoading: boolean;
	username?: string | null;
	plans: null | Array<any>;
	numberOfPlans?: number;
}

export interface PlanListProps {
	isMyProfile: boolean;
	plans: null | Array<any>;
	username?: string | null;
	numberOfPlans: number;
}
