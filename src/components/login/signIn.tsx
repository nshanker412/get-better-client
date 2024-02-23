import { useAuth } from '@context/auth/useAuth';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
	Keyboard,
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Header } from '../header/Header';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useLoginStyles } from './login.styles';

export const SignIn: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const navigate = useNavigation();

	const { signIn } = useAuth();

	const { theme } = useThemeContext();
	const loginStyles = useLoginStyles();

	const showErrorToast = (error) => {
		console.log('this is error passed ot toast: ', error);
		Toast.show({
			text1: error,
			type: 'error',
			visibilityTime: 5000,
			topOffset: 150,
			autoHide: true,
		});
	};

	const login = useCallback(async () => {
		setLoading(true);
		try {
			await signIn(email, password);
		} catch (error) {
			console.log('error', error.message);
			showErrorToast(error.message);
			false;
		} finally {
			setLoading(false);
		}
	}, [email, password]);

	const onClickPasswordReset = () => {
		Toast.hide();

		navigate.navigate('ForgotPassword');
	};

	const onClickSignUp = () => {
		Toast.hide();

		navigate.navigate('Register');
	};

	return (
		<SafeAreaView>
			<Header />
			<View style={loginStyles.loginContainer}>
				<View style={{ gap: 10 }}>
					<Text style={theme.text.title}>Welcome </Text>
					<Text
						style={[
							theme.text.subtext,
							{ maxWidth: '80%', textAlign: 'center' },
						]}>
						Enter your login info below to continue{' '}
					</Text>
				</View>

				<TextInput
					style={loginStyles.input}
					ref={emailRef}
					placeholder='email'
					onChangeText={setEmail}
					autoCapitalize='none'
					placeholderTextColor={theme.containerDefaultTextColor}
					spellCheck={false}
					autoCorrect={false}
					keyboardAppearance='dark'
					returnKeyType='next'
					onSubmitEditing={() => {
						passwordRef.current?.focus();
					}}
				/>
				<TextInput
					ref={passwordRef}
					style={loginStyles.input}
					placeholder='password'
					secureTextEntry={true}
					onChangeText={setPassword}
					autoCapitalize='none'
					placeholderTextColor={theme.containerDefaultTextColor}
					keyboardAppearance='dark'
					returnKeyType='next'
					onSubmitEditing={Keyboard.dismiss}
				/>
				<View style={{ flexDirection: 'column', gap: 15, alignItems: "center" }}>
					<TouchableOpacity
						style={[
							loginStyles.loginButton,
							loading && {
								opacity: 0.5,
								backgroundColor: '',
							},
						]}
						onPress={login}
						disabled={loading}
						activeOpacity={0.8}>
						<View
							style={{
								flexDirection: 'row',
								maxHeight: 45,
								alignItems: 'center',
								justifyContent: 'flex-end',
								maxWidth: 200,
							}}>
							<Text
								style={[
									loginStyles.loginText,
									{ alignSelf: 'flex-end' },
									loading && { opacity: 0.8 },
								]}>
								Login
							</Text>
							<>
								{loading && (
									<View style={{ width: 20, height: 20 }}>
										<LoadingSpinner />
									</View>
								)}
							</>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						style={loginStyles.forgotPasswordContainer}
						onPress={onClickPasswordReset}>
						<Text style={loginStyles.transferText}>
							Forgot password?
						</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onClickSignUp}>
						<Text style={loginStyles.transferText}>
							New? Sign up here.
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};
