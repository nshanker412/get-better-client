import { useAuth } from '@context/auth/useAuth';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Linking,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	
} from 'react-native';
import  CheckBox  from "@react-native-community/checkbox";
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useLoginStyles } from './login.styles';

import { showErrorToast } from '../error/showErrorToast';
import { blue } from '@context/theme/colors_neon';


interface RegisterData {
	email: string;
	name: string;
	username: string;
}

export const Register: React.FC = () => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSelected, setSelection] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigation();

	const { signUp: signupFb } = useAuth();

	const { theme } = useThemeContext();
	const loginStyles = useLoginStyles();

	const emailRef = useRef(null);
	const nameRef = useRef(null);
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const submitButtonRef = useRef(null);


	const onClickSignUp = () => {
		Toast?.hide();
		navigate.navigate('SignIn');
	};

	const registerUser = async (data: RegisterData): Promise<any> => {
		try {
			const response = await axios.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/register`,
				data,
			);
			return response.data;
		} catch (error) {
			const axiosError = error as AxiosError;
			if (axiosError && axiosError.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				// console.error('Error Data:', axiosError.response.data);
				// console.error('Status:', axiosError.response.status);
				console.log(
					axiosError.response.data.message ||
						'An error occurred during the registration process.',
				);
			} else if (axiosError.request) {
				// The request was made but no response was received
				// console.error('Request:', axiosError.request);
				// console.error('Error Message:', axiosError.message);
				console.log(
					'No response received during the registration process.',
				);
				console.log(
					'No response received during the registration process.',
				);
			} else {
				// Something happened in setting up the request
				// console.error('Error message:', axiosError.message);
				console.log(
					'An error occurred setting up the registration request.',
				);
			}
		}
	};

	const attemptFbSignUp = async (email: string, password: string) => {
		try {
			await signupFb(email, password);
		} catch (error ) {
			if (error instanceof Error) {
				showErrorToast(error.message);
			} else {
				console.log('Firebase Error');
			}
		}
	};

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const inputValidation = (
		email: string,
		name: string,
		username: string,
		password: string,
	) => {
		if (!email || !password || !name || !username) {
			console.log('Please fill out all fields!');
			showErrorToast('Please fill out all fields!');
		}
		if (!isValidEmail(email)) {
			console.log('Please enter a valid email');
			showErrorToast('Please fill out all fields!');

		}

		if (password.length < 6) {
			console.log('Password must be at least 6 characters');
			showErrorToast('Please fill out all fields!');

		}

		if (username.length < 5) {
			console.log('Password must be at least 6 characters');
			showErrorToast('Please fill out all fields!');

		}
		if (username.length > 20) {
			console.log('Username must be less than 20 characters');
			showErrorToast('Please fill out all fields!');

		}
	};

	const trySignUp = useCallback(async () => {
		try {
			inputValidation(email, name, username, password);
			setLoading(true);
			const input: RegisterData = {
				email,
				name,
				username,
			};
			const resp = await registerUser(input);
			await attemptFbSignUp(email, password);
	
				console.log('Unsuccessful register');
				showErrorToast('Unsuccessful register');
				//delete user from server
				try {

					const form = new FormData();
					form.append('email', email);
					form.append('username', username);
					form.append('name', name);

					const response = await axios.post(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/deleteUser`,
						form,
					);
					console.log('delete user resp', response);
				} catch (err) {
					console.log('error deleting user', err);	

					Toast.show({
						text1: "Woah there...",
						text2: "Your having some back luck, try again later.",
						type: 'error',
						visibilityTime: 5000,
						topOffset: 150,
						autoHide: true,
					});
				}
			
			console.log('Successful register');

			navigate.navigate('SignIn');
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error:', error.message);
				showErrorToast(error.message);
			}
			 else {
				showErrorToast('something went wrong, please try again');
			}
		} finally {
			setLoading(false);
		}
	}, [email, name, username, password]);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{
					flex: 1,
					backgroundColor: 'transparent',

					// color: 'white',
				}}
				behavior={'padding'}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
						<View style={loginStyles.loginContainer}>
							<View style={{ gap: 10 }}>
								<Text style={theme.text.title}>Register </Text>
								<Text
									style={[
										theme.text.subtext,
										{
											maxWidth: '80%',
											textAlign: 'center',
										},
									]}>
									Please provide the information below to
									continue
								</Text>
							</View>

							<TextInput
								style={loginStyles.input}
								placeholder='email'
								onChangeText={setEmail}
								autoCapitalize='none'
								keyboardAppearance='dark'
								placeholderTextColor={
									theme.containerDefaultTextColor
								}
								ref={emailRef}
								returnKeyType='next'
								onSubmitEditing={() => nameRef.current?.focus()}
							/>
							<TextInput
								style={loginStyles.input}
								placeholder='full name'
								secureTextEntry={false}
								onChangeText={setName}
								autoCapitalize='none'
								keyboardAppearance='dark'
								placeholderTextColor={
									theme.containerDefaultTextColor
								}
								ref={nameRef}
								returnKeyType='next'
								onSubmitEditing={() =>
									usernameRef.current?.focus()
								}
							/>
							<TextInput
								style={loginStyles.input}
								placeholder='username'
								onChangeText={setUsername}
								autoCapitalize='none'
								keyboardAppearance='dark'
								placeholderTextColor={
									theme.containerDefaultTextColor
								}
								ref={usernameRef}
								returnKeyType='next'
								onSubmitEditing={() =>
									passwordRef.current?.focus()
								}
							/>

							<TextInput
								style={loginStyles.input}
								placeholder='password'
								ref={passwordRef}
								secureTextEntry={true}
								onChangeText={setPassword}
								autoCapitalize='none'
								keyboardAppearance='dark'
								placeholderTextColor={
									theme.containerDefaultTextColor
								}
								returnKeyType='next'
								onSubmitEditing={Keyboard.dismiss}
							/>
							<View style={{
									flexDirection: 'column',
									gap: 5,
									alignItems: 'center',
									justifyContent: 'center',
								}}
								>
							<CheckBox
								value={isSelected}
								onValueChange={setSelection}

							/>
							<Text style={{
								color: 'white',
								
								}} >
								I Agree to the <Text style={{color:"blue"}} onPress={()=>Linking.openURL("https://getbetterbrand.com/privacy-policy")}>EULA</Text> and<Text style={{color:"blue"}} onPress={()=>Linking.openURL("https://getbetterbrand.com/privacy-policy")}> Privacy Policy </Text>
								</Text>
							</View>
							<View
								style={{
									flexDirection: 'column',
									gap: 5,
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<TouchableOpacity
									style={[
										loginStyles.loginButton,
										loading && {
											opacity: 0.5,
											backgroundColor: '',
										},
									]}
									onPress={trySignUp}
									disabled={loading}
									activeOpacity={0.8}
									ref={submitButtonRef}>
									<View
										style={{
											flexDirection: 'row',
											maxHeight: 45,
											alignItems: 'center',
											maxWidth: 200,
										}}>
										<Text
											style={[
												loginStyles.loginText,
												loading && { opacity: 0.8 },
											]}>
											Sign Up
										</Text>
										<View style={{ width: 20, height: 20 }}>
											{loading && <LoadingSpinner />}
										</View>
									</View>
								</TouchableOpacity>
								<TouchableOpacity onPress={onClickSignUp}>
									<Text style={loginStyles.transferText}>
										Already getting better? Login here.
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
