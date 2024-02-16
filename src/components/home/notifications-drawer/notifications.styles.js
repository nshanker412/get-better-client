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
			marginTop: 100,
		},

		backArrowContainer: {
			...theme.innerContainer,
			backgroundColor: 'transparent',
			position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			top: 100,
			left: 10,
			width: '100%',
			zIndex: 1000,
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		notificationsTitleContainer: {
			paddingBottom: 15,
		},

		notificationsTitleText: {
			...theme.text.title,
			fontSize: 20,
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
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopColor: theme.borderColor,
			borderTopWidth: 1,
		},

		lastNotification: {
			borderBottomColor: theme.borderColor,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopColor: theme.innerBorderColor,
			borderTopWidth: 1,
			borderBottomWidth: 1,
		},

		profileImage: {
			width: 40,
			height: 40,
			borderRadius: 25,
			marginLeft: 15,
			marginRight: 15,
		},

		notificationInfoContainer: {
			width: '75%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start',
		},

		notificationContentContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		notificationUser: {
			fontFamily: theme.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontSize: 16,
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
			// justifyContent: 'center',
			alignItems: 'center',
			marginTop: 25,
			marginBottom: 15,
		},

		challengeButton: {
			...theme.button.primary,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
			marginTop: 15,
		},

		challengeButtonText: {
			...theme.button.buttonText,
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
