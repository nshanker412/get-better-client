import { useAuth } from '@context/auth/useAuth';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useRef, useState, useReducer } from 'react';
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
	AsyncStorage,
	ImageBackground

} from 'react-native';
import CheckBox from "@react-native-community/checkbox";
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useLoginStyles } from './signin_v2.styles';
import { SvgXml } from 'react-native-svg';

import { showErrorToast } from '../error/showErrorToast';
import { blue } from '@context/theme/colors_neon';
import { authenticationReducer, initialState } from '@context/auth/authReducer';
import { MailIcon } from '@assets/darkSvg/MailIcon';
import Icon from 'react-native-vector-icons/Ionicons'; // You'll need to install this package
import { LockIcon } from '@assets/darkSvg/LockIcon';
import { UserName } from '@assets/darkSvg/UserName';
import { ArrowIcon } from '@assets/darkSvg/ArrowIcon';

interface RegisterData {
	email: string;
	name: string;
	username: string;
	password: string;
	is_eula: boolean;
}

export const Register: React.FC = () => {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false)
	const [isSelected, setSelection] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigation();

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
		await axios.post(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/auth/register`,
			data,
		).then((response) => {
			Toast.show({
				type: 'success',
				text1: 'Thank you for signing up. Please verify your email before logging in.',
				visibilityTime: 180000,
				position: 'bottom',
				bottomOffset: 40
			});
			navigate.navigate('SignIn');
		}).catch((err) => {
			showErrorToast(`${err.response.data.errors[0].message},Try again`);
			setLoading(false);
		})
	};


	const trySignUp = useCallback(async () => {
		setLoading(true);
		const input: RegisterData = {
			email,
			name,
			username,
			password,
			is_eula: isSelected,
		};
		const resp = await registerUser(input);
		if (resp) {
			setLoading(false);
		}

	}, [email, name, username, password]);

	return (
		<SafeAreaView style={{ flex: 1, top: 50 }}>
			<KeyboardAvoidingView
				style={{
					flex: 1,
					backgroundColor: 'transparent',
				}}
				behavior={'padding'}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
						<ImageBackground source={require("../../../assets/signup_background.png")} imageStyle={loginStyles.backgroundImage}  >
							<View style={loginStyles.loginContainer}>
								<View style={{ gap: 10, marginBottom: 0 }}>
									<Text style={loginStyles.SignInText}>SIGN UP</Text>
									<Text
										style={loginStyles.SignInSubtext}>
										Improve everyday with everyone
									</Text>
								</View>
								<View style={loginStyles.inputSignUpContainer}>
									<View style={loginStyles.inputSubContainer}>
										<Text style={loginStyles.lableText}>EMAIL ADDRESS</Text>
										<SvgXml style={loginStyles.iconContainer} xml={MailIcon} color="#ff0000" size={20} />
										<TextInput
											style={loginStyles.input}
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
									</View>
									<View style={loginStyles.inputSubContainer}>
										<Text style={loginStyles.lableText}>FULL NAME</Text>
										<SvgXml style={loginStyles.iconContainer} xml={UserName} color="#ff0000" size={20} />
										<TextInput
											style={loginStyles.input}
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
									</View>
									<View style={loginStyles.inputSubContainer}>
										<Text style={loginStyles.lableText}>USERNAME</Text>
										<SvgXml style={loginStyles.iconContainer} xml={UserName} color="#ff0000" size={20} />
										<TextInput
											style={loginStyles.input}
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

									</View>
									<View style={loginStyles.inputSubContainer}>
										<Text style={loginStyles.lableText}>PASSWORD</Text>
										<SvgXml style={loginStyles.iconContainer} xml={LockIcon} color="#ff0000" size={20} />
										<TextInput
											style={loginStyles.input}
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
									<View style={loginStyles.inputSubContainer}>

										<Text style={{
											color: 'white',

										}} >
											<CheckBox
												value={isSelected}
												onValueChange={setSelection}
												style={loginStyles.CheckBox}
												onTintColor={theme.textColorSecondary}
												onCheckColor={theme.textColorSecondary}
												tintColor="#24262B"

											/>
											I Agree to the <Text style={{ color: theme.textColorSecondary }} onPress={() => Linking.openURL("https://getbetterbrand.com/eula")}>EULA</Text> and<Text style={{ color: theme.textColorSecondary }} onPress={() => Linking.openURL("https://getbetterbrand.com/privacy-policy")}> Privacy Policy </Text>
										</Text>
									</View>

								</View>
								<View
									style={{
										flexDirection: 'column',
										gap: -6,
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
											<>
												<Text
													style={[
														loginStyles.loginText,
														loading && { opacity: 0.8 },
													]}>
													Sign Up
												</Text>
												<SvgXml style={loginStyles.iconSignInContainer} xml={ArrowIcon} color="#ff0000" size={20} />
											</>
											<View style={{ width: 20, height: 20 }}>
												{loading && <LoadingSpinner />}
											</View>
										</View>
									</TouchableOpacity>
									<TouchableOpacity onPress={onClickSignUp}>
										<Text style={loginStyles.otherText}>
											Already have an account? <Text style={loginStyles.SignUp}>Sign In.</Text>
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</ImageBackground>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
