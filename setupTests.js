import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

/**
 * Firebase mocking
 */
jest.mock('firebase/app', () => {
	return {
		__esModule: true,
		default: jest.fn(),
		app: jest.fn(),
		FirebaseApp: jest.fn(),
		initializeApp: jest.fn(),
	};
});
jest.mock('firebase/auth', () => {
	return {
		__esModule: true,
		default: jest.fn(),
		auth: jest.fn(),
		Auth: jest.fn(),
		CompleteFn: jest.fn(),
		ErrorFn: jest.fn(),
		NextOrObserver: jest.fn(),
		Unsubscribe: jest.fn(),
		User: jest.fn(),
		UserCredential: jest.fn(),
		createUserWithEmailAndPassword: jest.fn(),
		getReactNativePersistence: jest.fn(),
		initializeAuth: jest.fn(),
		onAuthStateChanged: jest.fn(),
		sendPasswordResetEmail: jest.fn(),
		signInWithEmailAndPassword: jest.fn(),
		signOut: jest.fn(),
	};
});
