import { ImageErrorEventData, ImageSource } from 'expo-image';

export interface ConnectedProfileAvatarProps {
	username: string;
	fetchSize?: number;
	size?: number;
	onNavigateToProfile?: null | (() => void);
	priority?: 'low' | 'normal' | 'high';
}

export interface ProfileAvatarProps {
	username: string;
	size: number;
	imgSrc: ImageSource | null;
	hasProfileImage: boolean;
	onError: (event: ImageErrorEventData) => void;
	priority: 'low' | 'normal' | 'high';
}
