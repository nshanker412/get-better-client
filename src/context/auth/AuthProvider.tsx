import { InfinityAnimation } from '@components/animations/InfinityAnimation';
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
import { signInWithEmailAndPasswordAPI } from './WithDjangoAPI';
import Toast from 'react-native-toast-message';

import { useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




import axios from 'axios';
interface AuthProviderProps {
	routingInstrumentation: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
	routingInstrumentation,
}) => {
	// const mynavigation = useRef();
	const mynavigation = useNavigationContainerRef();
	
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

			// if (authUser.email) {
			// 	const uname = await fetch(
			// 		`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetchUsername/${authUser.email}`,
			// 	).then((res) => res.json());

			// 	console.log('uname', uname['username']);
			// 	if (uname['username']) {
			// 		dispatch({
			// 			type: 'RESTORE_SESSION',
			// 			token: authUser.email,
			// 		});
			// 	}
			// }
		} else {
			console.log('Auth state changed:', authUser);

			dispatch({ type: 'SIGN_OUT' });
		}
		dispatch({ type: 'SIGN_OUT' });
	};


	const signIn = async (email: string, password: string) => {
		const userCred = await signInWithEmailAndPasswordAPI(
			email,
			password,
		);
		
		const user = userCred && userCred.data?userCred.data:"no data";
		if (user?.auth_token) {
			const uname = await fetch(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${user.auth_token}`} }
			).then((res) => res.json()).catch((err)=>console.log(err));


			dispatch({ type: 'SIGN_IN', token: user.auth_token });
			await AsyncStorage.setItem('accessToken',  user.auth_token);

			
			dispatch({
				type: 'RESTORE_SESSION',
				token: user.auth_token,
			});
			
		}
		
	};

	useEffect(() => {

		const getToken = async()=>{
			const value =  await AsyncStorage.getItem('accessToken')
			console.log("value",value);
			
			if (value != null){
				dispatch({
					type: 'RESTORE_SESSION',
					token: value,
				});
				dispatch({ type: 'SIGN_IN', token: value })
			}else{
				dispatch({ type: 'SIGN_OUT' });
			}
			
		}
		getToken()
		
	}, []);

	const sendPasswordResetEmail = async (email: string) => {
		try {
			await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/auth/password_reset`, { email: email.replaceAll(/\s/g,'') }).then(res=>{
				console.log(res.data);
			}).catch(err=> {
				Toast.show({
					text1: `Password Reset Failed, Please Check Email`,
					type: 'error',
				  });
			});

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
		// not in use
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

		await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/auth/logout`,{ headers: {"Authorization" : `Bearer ${state.userToken}`} }).catch(err=>{console.log(`${err} in logout`);
		});
		await AsyncStorage.removeItem('accessToken')
		dispatch({ type: 'SIGN_OUT' });


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
						ref={mynavigation}
						onReady={() => {
							
							// if (mynavigation != null) {
							// 	console.log(mynavigation)
							// 	routingInstrumentation.registerNavigationContainer(
							// 		mynavigation,
							// 	);
							// }
							
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
