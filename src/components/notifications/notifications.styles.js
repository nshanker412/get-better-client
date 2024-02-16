import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useNotificationsStyles = () => {
	const { theme } = useThemeContext();

	const notificationStyles = StyleSheet.create({
		notificationsContainer: {
			...theme.innerContainer,
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 150,
		},

		backArrowContainer: {
			...theme.innerContainer,
			backgroundColor: 'transparent',
			position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			top: 155,
			left: 10,
			width: '100%',
			zIndex: 1000,
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		notificationsTitleContainer: {
			paddingTop: 10,
			paddingBottom: 20,
			width: '100%',
		},

		notificationsTitleText: {
			color: theme.textColorPrimary,
			fontSize: 22,
			fontFamily: theme.text.title.fontFamily,
			textAlign: 'center',
		},

		notificationsScroll: {
			width: 390,
		},

		scrollBuffer: {
			// height: 220,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		notificationContainer: {
			width: '100%',
			display: 'flex',
			padding: 10,
			borderBottomColor: theme.borderColor,
			borderBottomWidth: 1,
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		profileImage: {
			alignItems: 'center',
			justifyContent: 'center',
			width: 40,
			height: 40,
			borderRadius: 20,
		},

		notificationInfoContainer: {
			// borderWidth: 1,
			// borderColor: theme.borderColor,
			// bottomBorderWidth: 1,
			// borderColor: theme.borderColor,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			paddingLeft: 10,

			// justifyContent: 'space-around',
			// alignItems: 'flex-start',
		},

		notificationContentContainer: {
			gap: 5,
			// borderWidth: 1,
			// borderColor: theme.borderColor,
			// bottomBorderWidth: 1,
			// borderColor: theme.textColorPrimary,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'stretch',
			// justifyContent: 'flex-start',
			// alignItems: 'center',
		},

		notificationUser: {
			fontFamily: theme.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontSize: 16,
			// gap: 5
		},

		notificationContent: {
			fontFamily: theme.fontFamilyLight,
			color: theme.textColorPrimary,
			fontSize: 16,
			fontWeight: 'normal',
		},
		timestamp: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontWeight: '400',
			fontSize: 12,
		},

		challengeContainer: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			// justifyContent: 'center',
			alignItems: 'center',
			marginTop: 25,
			marginBottom: 15,
		},

		challengeButton: {
			...theme.button.primary.default,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
			marginTop: 15,
		},

		challengeButtonText: {
			...theme.button.primary.default.buttonText,
			fontWeight: 'bold',
		},

		settingsContainer: {
			marginBottom: 15,
		},

		settingsButton: {
			...theme.button.secondary,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
			marginTop: 10,
		},

		loadingContainer: {
			...theme.innerContainer,
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

	return notificationStyles;
};
