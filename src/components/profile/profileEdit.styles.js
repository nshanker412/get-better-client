import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfileEditStyles = () => {
	const { theme } = useThemeContext();

	const profileEditStyles = StyleSheet.create({
		editProfileContainer: {
			...theme.container,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			// paddingTop: '30%'
		},

		editProfileImage: {
			width: 140,
			height: 140,
			borderRadius: 70,
			margin: 50,
			borderWidth: 3,
			borderColor: 'white',
		},

		cameraIconContainer: {
			...theme.innerContainer,
			backgroundColor: theme.backgroundColor,

			// backgroundColor: theme.innnerContainer.backgroundColor,

			position: 'absolute',
			right: '20%',
			bottom: '20%',
			width: 50,
			height: 50,
			padding: 8,
			borderRadius: 25,
			borderWidth: 2,
			borderColor: theme.textColorPrimary,
		},
		cameraIcon: {
			width: '100%',
			height: '100%',
			top: '50%',
			left: '50%',
		},

		inputContainer: {
			// ...theme.innerContainer,
			backgroundColor: theme.innerContainer.backgroundColor,
			borderRadius: 5,

			width: '90%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			borderTopWidth: 1,
			marginBottom: 10,
		},

		lastInputContainer: {
			borderBottomWidth: 1,
		},

		input: {
			...theme.text.body.medium,
			width: '70%',
			fontSize: 18,
			padding: 10,
			// borderRadius: 10
		},

		multiLineInput: {
			paddingTop: 10,
		},

		inputText: {
			...theme.text.body.medium,
			width: '30%',
			fontSize: 18,
			fontWeight: 'bold',
		},

		updateButton: {
			...theme.button.primary.default,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			margin: 25,
		},

		updateText: {
			...theme.button.primary.default.buttonText,
			fontSize: 20,
			padding: 10,
		},

		cancelText: {
			...theme.text.body.medium,
			fontSize: 16,
			textDecorationLine: 'underline',
		},

		loadingContainer: {
			...theme.container,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		updateLoadingContainer: {
			...theme.container,
			position: 'absolute',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			zIndex: 1000,
		},

		loader: {
			width: 75,
			height: 75,
		},
	});

	return profileEditStyles;
};
