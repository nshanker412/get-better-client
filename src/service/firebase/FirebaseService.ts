import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
	Auth,
	CompleteFn,
	ErrorFn,
	NextOrObserver,
	Unsubscribe,
	User,
	UserCredential,
	createUserWithEmailAndPassword,
	getReactNativePersistence,
	initializeAuth,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { FirebaseServiceInterface } from './FirebaseService.types';



export class FirebaseService implements FirebaseServiceInterface {
	private readonly firebaseKey = {
		apiKey: 'AIzaSyAU4-0vXuq1sLOObQDsVCZ9iwZijFNbPdo',
		authDomain: 'getbetter-25cd9.firebaseapp.com',
		projectId: 'getbetter-25cd9',
		storageBucket: 'getbetter-25cd9.appspot.com',
		messagingSenderId: '638223405960',
		appId: '1:638223405960:web:0ea7d9cf09ee960825e03d',
		measurementId: 'G-SXYGZ1H1Z0',
	};

	private static instance: FirebaseService | null = null;
	private app: FirebaseApp | null = null;
	private auth: Auth | null = null;

	private constructor() {
		// Initialize Firebase only if it hasn't been initialized
		if (!this.app || !this.auth) {
			this.app = initializeApp(this.firebaseKey, 'getbetter');
			this.auth = initializeAuth(this.app, {
				persistence: getReactNativePersistence(AsyncStorage),
			});
		}
	}

	// Ensure a single instance of FirebaseService
	public static getInstance(): FirebaseService {
		if (!FirebaseService.instance) {
			FirebaseService.instance = new FirebaseService();
		}
		return FirebaseService.instance;
	}

	public onAuthStateChangedFb(
		onNextOrObserver: NextOrObserver<User>,
		onError?: ErrorFn | undefined,
		onComplete?: CompleteFn | undefined,
	): Unsubscribe {
		return onAuthStateChanged(
			this.auth!,
			onNextOrObserver,
			onError,
			onComplete,
		);
	}

	public async signInWithEmailAndPasswordFb(
		email: string,
		password: string,
	): Promise<UserCredential> {
		return signInWithEmailAndPassword(this.auth!, email, password);
	}

	public async createUserWithEmailAndPasswordFb(
		email: string,
		password: string,
	): Promise<UserCredential> {
		return createUserWithEmailAndPassword(this.auth!, email, password);
	}

	public sendPasswordResetEmailFb(email: string): Promise<void> {
		return sendPasswordResetEmail(this.auth!, email);
	}

	public async signOutFb(): Promise<void> {
		return signOut(this.auth!);
	}
}
