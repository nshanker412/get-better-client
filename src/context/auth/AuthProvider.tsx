import { MyUserInfoProvider } from '@context/my-user-info/MyUserInfoProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import React, { useEffect, useReducer, useRef } from 'react';
import { AuthStack } from '../../navigation/AuthStack';
import { UnAuthStack } from '../../navigation/UnAuthStack';
import { FirebaseService } from '../../service/firebase'; // Replace with the actual path to your Firebase service
import { AuthContextProps } from './Auth.types';
import { AuthContext } from './AuthContext';
import { authenticationReducer, initialState } from './authReducer';
import { firebaseErrorToMessage } from './firebaseErrorToMessage';


import { InfinityAnimation } from '@components/animations/InfinityAnimation';

interface AuthProviderProps {
	routingInstrumentation: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
	routingInstrumentation,
}) => {
	const navigation = useRef();
	const RootAuthStack = createStackNavigator();
	const firebaseService = FirebaseService.getInstance(); // Initialize your Firebase service
	const [state, dispatch] = useReducer(authenticationReducer, initialState);

	/**
	 * Observer for the firebase auth state change
	 */
	const onAuthStateChangeCb = async (authUser: User | null) => {
		if (authUser !== null) {
			const authUserJson = JSON.stringify(authUser);
			console.log('Auth state changed:', authUserJson);

			if (authUser.email) {
				const uname = await fetch(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetchUsername/${authUser.email}`,
				).then((res) => res.json());

				console.log('uname', uname['username']);
				if (uname['username']) {
					dispatch({
						type: 'RESTORE_SESSION',
						token: authUser.email,
					});
				}
			}
		} else {
			console.log('Auth state changed:', authUser);

			dispatch({ type: 'SIGN_OUT' });
		}
	};

	// Subscribe to the firebase auth state change
	useEffect(() => {
		// Set up Firebase auth state listener
		const unsubscribe = firebaseService.onAuthStateChangedFb(
			onAuthStateChangeCb,
			(error) => {
				console.log('Auth state change error:', error);
			},
		);
		// Cleanup function
		return unsubscribe;
	}, [firebaseService]);

	const signIn = async (email: string, password: string) => {
		try {
			const userCred = await firebaseService.signInWithEmailAndPasswordFb(
				email,
				password,
			);
			const user = userCred.user;
			console.log('user', user, user.email);
			if (user?.email) {
				const uname = await fetch(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetchUsername/${user.email}`,
				).then((res) => res.json());

				console.log('uname', uname['username']);

				dispatch({ type: 'SIGN_IN', token: user.email });
			}
		} catch (err) {
			if (err instanceof FirebaseError) {
				const error = firebaseErrorToMessage(err);
				console.log('firebase error handle', error);	
				throw new Error(error);

		
			} else {
				console.log('Non firebas error', err);
			}
		}
	};

	useEffect(() => {
		console.log('AuthStack: useEffect, userToken change', state.userToken);
	}, [state.userToken]);

	const sendPasswordResetEmail = async (email: string) => {
		try {
			await firebaseService.sendPasswordResetEmailFb(email);
		} catch (err) {
			if (err instanceof FirebaseError) {
				const error = firebaseErrorToMessage(err);
				console.log('firebase error handle', error);
				throw new Error(error);
			} else {
				console.log('Non firebas error', err);
			}
			
		}
	};

	const signUp = async (email: string, password: string) => {
		console.log('signUp', email, password);
		if (!email || !password) {
			return Promise.reject(new Error('Email and password are required'));
		}
		try {
			const userCred =
				await firebaseService.createUserWithEmailAndPasswordFb(
					email,
					password,
				);
			console.log(userCred);
		} catch (err) {
			if (err instanceof FirebaseError) {
				const error = firebaseErrorToMessage(err);
				console.log('useAuth(): signUp(): firebase error handle', err);
				throw new Error(error);
			} else {
				console.log('Auth: signUp: Non firebas error', err);
			}
		}
	};

	const signOut = async () => {
		try {
			await firebaseService.signOutFb();
			dispatch({ type: 'SIGN_OUT' });
		} catch (err) {
			if (err instanceof FirebaseError) {
				const error = firebaseErrorToMessage(err);
				console.log('firebase error handle', error);	
				// throw new Error(error);
			} else {
				console.log('Non firebas error', err);
			}
	
		}
	};

	const contextValue: AuthContextProps = {
		userToken: state.userToken,
		sendPasswordResetEmail,
		signIn,
		signUp,
		signOut,
	};

	if (state.isLoading) {
		return (
			<InfinityAnimation />
		)
	}

	return (
			<AuthContext.Provider value={contextValue}>
				<MyUserInfoProvider>
					<NavigationContainer
						ref={navigation}
						onReady={() => {
							// Register the navigation container with the instrumentation
							routingInstrumentation.registerNavigationContainer(
								navigation,
							);
						}}>
							<RootAuthStack.Navigator
								screenOptions={{
									headerShown: false,
									cardStyle: { backgroundColor: 'black' },
								}}>
								{state.userToken === null ? (
									<RootAuthStack.Screen
										name='UnAuthStack'
										component={UnAuthStack}
									/>
								) : (
									<RootAuthStack.Screen
										name='AuthStack'
										component={AuthStack}
									/>
								)}
							</RootAuthStack.Navigator>
						</NavigationContainer>
				</MyUserInfoProvider>
			</AuthContext.Provider>
	);
};
