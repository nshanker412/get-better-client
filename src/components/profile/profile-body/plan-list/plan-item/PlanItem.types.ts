export enum PlanType {
	Cardio = 'Cardio',
	Lifting = 'Lifting',
	Nutrition = 'Nutrition',
	NewPlan = 'New Plan',
}

export interface ConnectedPlanItemProps {
	planType: PlanType;
	planTitle: string;
}

export interface PlanItemProps {
	planType: PlanType;
}
