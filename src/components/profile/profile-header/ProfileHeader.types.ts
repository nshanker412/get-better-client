export interface ConnectedProfileHeaderProps {
	isMyProfile: boolean;
	onOpenLogoutModal?: () => void;
	onOpenChallengeModal?: () => void;
}

export interface OtherProfileHeaderProps {
	isLoading: boolean;
	userHandle: string | null;
	username: string | null;
	bio: string | null;
	onOpenChallengeModal: () => void;
	onMotivatePress: (() => Promise<void>) | null;
	followers: number | null;
	following: number | null;
	myUsername: string | null;
	amIFollowing: boolean |undefined;
}



export interface MyProfileHeaderProps {
	isLoading: boolean;
	userHandle: string | null;
	username: string | null;
	bio: string | null;
	followers: number | null;
	following: number | null;
	profileImage: string | null;
	myUsername: string | null;
	amIFollowing: boolean |undefined;
	onLogout: null | (() => void);
}


export interface MyProfileHeaderConnectedProps {
	onOpenLogoutModal: () => void;
}
export interface OtherProfileHeaderConnectedProps {
	onOpenChallengeModal: () => void;
}
