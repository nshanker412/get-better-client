import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// At the top of your test file or Jest setup file
jest.mock('@sentry/react-native', () => ({
	...jest.requireActual('@sentry/react-native'), // This line is optional, retains original functionality for non-mocked methods
	...require('./__mocks__/sentry'), // Adjust path as necessary
  }));
  

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

// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup';

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// In Jest setup file or test file
jest.mock('@sentry/react-native');
jest.mock('expo-constants');
