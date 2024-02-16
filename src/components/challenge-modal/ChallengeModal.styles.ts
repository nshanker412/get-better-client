import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useChallengeModalStyles = () => {
	const { theme } = useThemeContext();

	const challengeStyles = StyleSheet.create({
		container: {
			...theme.container,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},
		closeIcon: {
			position: 'absolute',
			top: 10,
			right: 10,
		},

		challengeTextContainer: {
			...theme.innerContainer,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			marginTop: '20%',
		},

		challengeText: {
			...theme.text.title,
			fontSize: 20,
			fontWeight: 'bold',
			margin: 5,
		},

		challengeButton: {
			...theme.button.primary.default,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
		},

		challengeButtonText: {
			...theme.text.title,
			fontSize: 16,
			fontWeight: 'bold',
		},

		inputContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '85%',
		},
	});

	return challengeStyles;
};
