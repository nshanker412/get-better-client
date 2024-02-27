import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useCreatePostStyles = () => {
	const { theme } = useThemeContext();

	const createPostStyles = StyleSheet.create({
		noPermisssionsText: {
			color: theme.textColorPrimary,
			fontSize: 24,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 20,
		},

		createPostContainer: {
			backgroundColor: theme.backgroundColor,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			height: '100%',
		},
		photoStyle: {
			backgroundColor: theme.backgroundColor,
			shadowColor: theme.grayShades.gray900,
			shadowRadius: 10,
			shadowOffset: {
				width: 5,
				height: 5,
			},
			shadowOpacity: 0.34,
			flex: 1,
		},

		cameraContainer: {
			position: 'relative',
			width: '100%',
			height: '100%',
			borderRadius: 15,
			overflow: 'hidden',
		},

		camera: {
			width: '100%',
			height: '100%',
		},

		takePhotoContainer: {
			position: 'absolute',
			bottom: 125,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},

		takePhotoContainerInner: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},

		isPhotoContainer: {
			color: 'white',
			display: 'flex',
			flexDirection: 'row',
			padding: 10,
			gap: 15,
		},

		timerText: {
			fontSize: 24,
			color: 'white',
			fontWeight: 'bold',
		},

		isPhotoTextSelected: {
			fontSize: 18,
			color: 'white',
			fontWeight: 'bold',
		},

		isPhotoTextNotSelected: {
			fontSize: 18,
			color: theme.grayShades.gray300,
			fontWeight: 'bold',
		},

		flashButton: {
			width: 40,
			height: 40,
		},

		takePhotoButton: {
			width: 80,
			height: 80,
			marginLeft: 20,
			marginRight: 25,
			borderRadius: 50,
			borderWidth: 7.5,
			borderColor: theme.borderColor,
		},

		takeVideoButton: {
			width: 80,
			height: 80,
			marginLeft: 20,
			marginRight: 25,
			borderRadius: 50,
			borderWidth: 7.5,
			borderColor: theme.borderColor,
			backgroundColor: theme.errorColor,
		},

		videoRecording: {
			width: 30,
			height: 30,
			marginLeft: 17.5,
			marginTop: 17.5,
			borderRadius: 5,
			backgroundColor: 'red',
		},

		reverseCameraButton: {
			width: 35,
			height: 35,
		},

		takenPhotoContainer: {
			flex: 1, // Take up all available space
			width: '100%', // Ensure the container is full width
			alignItems: 'center', // Center children horizontally
			justifyContent: 'center', // Center children vertically
		},

		takenPhoto: {
			width: '100%',
			height: '100%',
		},

		retakeIconContainer: {
			position: 'absolute',
			top: 50,
			right: 20,
			backgroundColor: theme.grayShades.gray300,
			opacity: 0.95,
			borderRadius: 25,
			zIndex: 1000,
		},

		retakeIcon: {
			height: 25,
			width: 25,
			margin: 5,
		},

		inputContainer: {
			position: 'absolute',
			top: 100,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			gap: 10,
		},

		input: {
			...theme.input,
			// height: 50,
			maxWidth: '70%',
			minWidth: '40%',
			width: '70%',
			marginTop: 5,
			paddingTop: 15,
			paddingLeft: 15,
			paddingRight: 15,
			borderWidth: 0,
			borderRadius: 25,
			fontSize: 16,
			textAlign: 'center',
			// overflow: 'hidden',
		},

		submitCaptionButton: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.grayShades.gray300,
			opacity: 0.95,
			height: 30,
			borderRadius: 15,
		},

		submitCaptionText: {
			color: theme.textColorPrimary,
			fontSize: 16,
			fontWeight: 'bold',
			textDecorationLine: 'underline',
			paddingLeft: 15,
			paddingRight: 15,
		},

		sendPostContainer: {
			// position: 'absolute',
			// borderRadius: 25,
			borderRadius: 16,
			backgroundColor: theme.grayShades.gray300,
			opacity: 0.95,

			// width: 200,
			// bottom: 125,

			// bottom: 100,
			// right: 0,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			// width: '100%',
			gap: 15,
			// padding: 20,
			paddingTop: 10,
			paddingBottom: 10,
			paddingLeft: 25,
			paddingRight: 25,
			// marginTop: '7.5%'
		},

		sendPostText: {
			fontFamily: fonts.inter.bold,
			color: theme.textColorPrimary,
			fontSize: 20,
			alignSelf: 'center',
			// fontSize: 44,
			// fontWeight: 'bold',
		},

		sendIcon: {
			width: 60,
			height: 60,
		},

		cameraRollContainer: {
			position: 'absolute',
			top: 50,
			right: 15,
			backgroundColor: theme.grayShades.gray900,
			borderRadius: 60,
			opacity: 0.95,
			zIndex: 1,
			// alignItems: 'center',
			// justifyContent: 'center',
		},

		cameraRollIcon: {
			padding: 5,
			// width: 40,
			// height: 40,
			// margin: 5,
		},

		sendLoadingContainer: {
			position: 'absolute',
			backgroundColor: theme.grayShades.gray400,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		loader: {
			width: 75,
			height: 75,
		},
	});

	return createPostStyles;
};
