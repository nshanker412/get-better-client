export enum SpinSpeed {
	Fast = 'fast',
	Normal = 'normal',
	Slow = 'slow',
}

export interface LoadingSpinnerProps {
	isActive?: boolean;
	speed?: SpinSpeed;
	size?: 'small' | 'large';
}
