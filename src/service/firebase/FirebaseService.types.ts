import {
	CompleteFn,
	ErrorFn,
	NextOrObserver,
	Unsubscribe,
	User,
	UserCredential,
} from 'firebase/auth';

export interface FirebaseServiceInterface {
	onAuthStateChangedFb(
		onNextOrObserver: NextOrObserver<User>,
		onError?: ErrorFn | undefined,
		onComplete?: CompleteFn | undefined,
	): Unsubscribe;
	signInWithEmailAndPasswordFb(
		email: string,
		password: string,
	): Promise<UserCredential>;
	createUserWithEmailAndPasswordFb(
		email: string,
		password: string,
	): Promise<UserCredential>;
	sendPasswordResetEmailFb(email: string): Promise<void>;
	signOutFb(): Promise<void>;
}
