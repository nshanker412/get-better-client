import { ImageErrorEventData, ImageSource } from 'expo-image';

export interface ConnectedProfileAvatarProps {
	username: string;
	fetchSize?: number;
	overrideImage?: ImageSource;
	size?: number;
	onNavigateToProfile?: null | (() => void);
	priority?: 'low' | 'normal' | 'high';
	disableLink?: boolean;
	profile_picture: string | ImageSource |  null;
}

export interface ProfileAvatarProps {
	username: string;
	size: number;
	imgSrc: ImageSource | null;
	hasProfileImage: boolean;
	onError: (event: ImageErrorEventData) => void;
	priority: 'low' | 'normal' | 'high';
	profile_picture:string | null;

}
