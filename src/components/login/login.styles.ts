import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useLoginStyles = () => {
	const { theme } = useThemeContext();

	const loginStyles = StyleSheet.create({
		loginContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			gap: 25,
		},

		input: {
			// width: '75%',
			width: '80%',

			textAlign: 'center',
			// alignSelf: 'center',
			fontSize: 22,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			backgroundColor: theme.innerContainer.backgroundColor,
			shadowOpacity: 0.7,
			color: theme.textColorPrimary,
			padding: 8,
			// margin: 25,
			borderRadius: 10,
		},
		inputFocused: {
			width: '80%',
			textAlign: 'left',
			alignSelf: 'center',
			fontSize: 22,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			backgroundColor: theme.innerContainer.backgroundColor,
			shadowOpacity: 0.7,
			color: theme.textColorPrimary,
			padding: 10,
			// margin: 25,
			borderRadius: 10,
		},

		loginButton: {
			...theme.button.primary.default,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			// backgroundColor: theme.button.primary.default.backgroundColor,
			borderRadius: 16,
			margin: 25,
		},

		loginText: {
			...theme.button.primary.default.buttonText,
			fontSize: 22,
			textAlign: 'center',
			padding: 10,
		},

		transferText: {
			...theme.text.body.large,
			...theme.text.subtext,

			fontSize: 16,
			textDecorationLine: 'underline',
		},

		forgotPasswordContainer: {
			marginBottom: 15,
		},

		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			// marginTop: 100,
			backgroundColor: '#FFFFFF',
		},

		loader: {
			width: 75,
			height: 75,
		},
	});

	return loginStyles;
};
