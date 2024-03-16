export interface ConnectedProfileHeaderProps {
	isMyProfile: boolean;
	onOpenLogoutModal?: () => void;
	onOpenChallengeModal?: () => void;
}

export interface ProfileHeaderProps {
	isLoading: boolean;
	userHandle: string | null;
	username: string | null;
	bio: string | null;
	onOpenChallengeModal: () => void;
	onMotivatePress: (() => Promise<void>) | null;
	followers: number | null;
	following: number | null;
	profileImage: string | null;
	isMyProfile: boolean;
	myUsername: string | null;
	amIFollowing: boolean |undefined;
	onLogout: null | (() => void);
}

export interface MyProfileHeaderProps {
	onOpenLogoutModal: () => void;
}
export interface OtherProfileHeaderProps {
	onOpenChallengeModal: () => void;
}
