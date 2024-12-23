import { useAuth } from '@context/auth/useAuth';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	SafeAreaView,
	Text,
	TextInput,
	TouchableOpacity,
	View,

} from 'react-native';
import { SvgXml } from 'react-native-svg';

import Toast from 'react-native-toast-message';
import { Header } from '../header/Header';
import { useLoginStyles } from './signin_v2.styles';
import { MailIcon } from '@assets/darkSvg/MailIcon';

export const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState('');

	const { sendPasswordResetEmail } = useAuth();

	const { theme } = useThemeContext();
	const loginStyles = useLoginStyles();
	const navigate = useNavigation();

	useEffect(() => {
		return () => Toast.hide();
	}, []);

	const showToastMsg = (type, msg, msg2 = '') => {
		Toast.show({
			text1: msg,
			text2: msg2,
			type: type,
			visibilityTime: 5000,
			topOffset: 150,
			autoHide: true,
		});
	};

	const onClickSignUp = () => {
		Toast.hide();
		navigate.navigate('Register');
	};

	const handlePasswordReset = () => {
		if (email) {
			sendPasswordResetEmail(email)
				.then(() => {
					showToastMsg(
						'success',
						'Reset link sent to your email.',
						''
					);
					// navigate to login screen after 2 seconds
					setTimeout(() => {
						navigate.navigate('SignIn');
					},2000);
				})
				.catch((error) => {
					showToastMsg('error', error.message);
				});
		} else {
			showToastMsg(
				'error',
				'Please enter your email address to reset your password.',
			);
		}
	};

	return (
		<SafeAreaView>
			<Header />
			<View style={[loginStyles.loginContainer, { gap: 20 , alignItems: "center"}]}>
				<View style={{ gap: 10 }}>
					<Text style={theme.text.title}>Password Reset </Text>
					<Text
						style={[
							theme.text.subtext,
							{ maxWidth: '80%', textAlign: 'center' },
						]}>
						Enter your email below to reset your password{' '}
					</Text>
				</View>
				<SvgXml style={loginStyles.iconContainer} xml={MailIcon} color="#ff0000" size={20} />

				<TextInput
					style={loginStyles.input}
					placeholder='Email Address'
					onChangeText={setEmail}
					autoCapitalize='none'
					placeholderTextColor={theme.containerDefaultTextColor}
				/>

				<View style={{ flexDirection: 'column', gap: 15, alignItems: "center" }}>
					<TouchableOpacity
						style={loginStyles.loginButton}
						onPress={handlePasswordReset}>
						<Text style={loginStyles.loginText}>Send Reset</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={onClickSignUp}>
						<Text style={loginStyles.SignUp}>
							New? Sign up here.
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};
