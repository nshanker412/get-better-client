// Import the real firebase/auth module
import { auth as realAuth } from '../../firebase/config';

// Create a mock object with a signInWithEmailAndPassword method
const signInWithEmailAndPasswordMock = jest.fn((email, password) => {
	return Promise.resolve({
		email,
		password /* additional fields as needed */,
	});
});

// Mock the signInWithEmailAndPassword method in the mock object
jest.mock('firebase/auth', () => ({
	...realAuth,
	signInWithEmailAndPassword: signInWithEmailAndPasswordMock,
	Unsubscribe: jest.fn(),
}));
