export interface AuthState {
	userToken: string | null; //email for now
	isLoading: boolean;
	isSignout: boolean;
}

export type AuthAction =
	| { type: 'SIGN_IN'; token: string | null }
	| { type: 'SIGN_OUT' }
	| { type: 'RESTORE_SESSION'; token: string | null };

const initialState: AuthState = {
	userToken: null,
	isSignout: false,
	isLoading: true,
};

const authenticationReducer = (
	state: AuthState,
	action: AuthAction,
): AuthState => {
	switch (action.type) {
		case 'SIGN_IN':
			return {
				...state,
				userToken: action.token,
				isLoading: false,
			};
		case 'SIGN_OUT':
			return {
				...state,
				userToken: null,
				isSignout: true,
				isLoading: false,
			};
		case 'RESTORE_SESSION':
			return {
				...state,
				userToken: action.token,
				isLoading: false,
			};
		default:
			return state;
	}
};

export { authenticationReducer, initialState };
