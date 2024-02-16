import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useIntroStyles = () => {
	const { theme } = useThemeContext();

	const introStyles = StyleSheet.create({
		introContainer: {
			...theme.container,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		questionContainer: {
			width: '80%',
			display: 'flex',
			paddingBottom: 50,
		},

		questionText: {
			...theme.text.title,
		},

		yesButton: {
			...theme.button.primary.default,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			marginBottom: 25,
		},

		yesText: {
			...theme.button.primary.default.buttonText,
			fontSize: 22,
			padding: 10,
		},

		noButton: {
			...theme.button.secondary.default,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			borderWidth: 1,
		},

		noText: {
			...theme.button.secondary.default.buttonText,
			fontSize: 22,
			padding: 10,
		},
	});

	return introStyles;
};
