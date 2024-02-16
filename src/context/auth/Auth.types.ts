export interface AuthContextProps {
	userToken: string | null;
	sendPasswordResetEmail: (email: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void | { error: string }>;
}
