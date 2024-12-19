import { useAuth } from '@context/auth/useAuth';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import {
	Keyboard,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
	TextInput,
	ImageBackground
} from 'react-native';
// import { TextInput } from 'react-native-paper';

import { SvgXml } from 'react-native-svg';
import { MailIcon } from '@assets/darkSvg/MailIcon';
import { LockIcon } from '@assets/darkSvg/LockIcon';
import { ArrowIcon } from '@assets/darkSvg/ArrowIcon';
import Toast from 'react-native-toast-message';
import { showErrorToast } from '../error/showErrorToast';
import { Header } from '../header/Header';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useLoginStyles } from './signin_v2.styles';
import Icon from 'react-native-vector-icons/Ionicons'; // You'll need to install this package


export const SignIn: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState(false)
	const [isPasswordFocused, setIsPasswordFocused] = useState(false)
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const navigate = useNavigation();

	const { signIn } = useAuth();

	const { theme } = useThemeContext();
	const loginStyles = useLoginStyles();


	const login = useCallback(async () => {
		setLoading(true);
		try {
			await signIn(email, password);
		} catch (error) {
			if (error instanceof Error) {
				console.log('error', error.message);
				showErrorToast(error.message);
			} else {
				showErrorToast('Something went wrong');
			}
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
			{/* <Header /> */}

				<ImageBackground source={require("../../../assets/signin_background.png")} imageStyle={loginStyles.backgroundImage}  >
					<View style={loginStyles.loginContainer}>
						<View style={{ gap: 10 , marginBottom:70}}>
							<Text style={loginStyles.SignInText}>SIGN IN</Text>
							<Text
								style={loginStyles.SignInSubtext}>
								Improve everyday with everyone
							</Text>
						</View>
						<View style={loginStyles.inputContainer}>
						<View style={loginStyles.inputSubContainer}>
						<Text style={loginStyles.lableText}>EMAIL ADDRESS</Text>

						<SvgXml style={loginStyles.iconContainer} xml={MailIcon} color="#ff0000" size={20}/>
						
						<TextInput
							style={[loginStyles.input,
								isFocused && loginStyles.inputFocused
							]}
							ref={emailRef}
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
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}

						/>

						</View>
						<View style={loginStyles.inputSubContainer}>
						<Text style={loginStyles.lableText}>PASSWORD</Text>
						<SvgXml style={loginStyles.iconContainer} xml={LockIcon} color="#ff0000" size={20}/>

						<TextInput
							ref={passwordRef}
							style={[loginStyles.input,
								isPasswordFocused && loginStyles.inputFocused
							]}
							secureTextEntry={!showPassword}
							onChangeText={setPassword}
							autoCapitalize='none'
							placeholderTextColor={theme.containerDefaultTextColor}
							keyboardAppearance='dark'
							returnKeyType='next'
							onSubmitEditing={Keyboard.dismiss}
							onFocus={() => setIsPasswordFocused(true)}
							onBlur={() => setIsPasswordFocused(false)}

						/>
						<TouchableOpacity 
							style={loginStyles.eyeButton}
							onPress={() => setShowPassword(!showPassword)}
							>
							<Icon
								name={showPassword ? 'eye-outline' : 'eye-off-outline'}
								size={24}
								color="#666"
							/>
							</TouchableOpacity>
						</View>
						</View>
						<View style={{ flexDirection: 'column', gap: 20, alignItems: "center" }}>
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
										<>
									<Text
										style={[
											loginStyles.loginText,
											{ alignSelf: 'flex-end' },
											loading && { opacity: 0.8 },
										]}>
										SIGN IN

									</Text>
									<SvgXml style={loginStyles.iconSignInContainer} xml={ArrowIcon} color="#ff0000" size={20}/>
									</>
									<>
										{loading && (
											<View style={{ width: 20, height: 20 }}>
												<LoadingSpinner />
											</View>
										)}
									</>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={onClickSignUp}>
								<Text style={loginStyles.otherText}>
									Don&apos;t have an account? &nbsp;
									<Text  style={loginStyles.SignUp}>Sign Up.</Text>
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={loginStyles.forgotPasswordContainer}
								onPress={onClickPasswordReset}>
								<Text style={loginStyles.transferText}>
									Forgot Password
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
		</SafeAreaView>
	);
};
