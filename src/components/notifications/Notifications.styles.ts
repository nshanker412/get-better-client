import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useNotificationsStyles = () => {
	const { theme } = useThemeContext();

	const notificationStyles = useMemo(() => StyleSheet.create({
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
			// left: 10,
			width: 100,
			zIndex: 1,
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
		subcontentText: {
			// fontFamily: theme.text.body.fontFamily,
			fontFamily: fonts.inter.regular,
			color: theme.textColorThird,
			fontSize: 14,
			fontWeight: 'normal',
			
			// paddingLeft: 10,
		},

		notificationContainer: {
			width: '100%',
			display: 'flex',
			padding: 10,
			// borderBottomColor: theme.borderColor,
			// borderBottomWidth: 1,
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		unreadNotificationContainer: {
			width: '100%',
			display: 'flex',
			padding: 10,
			borderColor: theme.grayShades.gray300,
			backgroundColor: theme.grayShades.gray500,
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
			// gap: 2

			// justifyContent: 'space-around',
			// alignItems: 'flex-start',
		},

		notificationContentContainer: {
			// gap: 5,
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

		notificationTypeContent: {
			// fontFamily: theme.fontFamily,
			fontFamily: fonts.inter.regular,
			color: theme.textColorPrimary,
			textAlign: 'left',
			fontSize: 16,
		},

		notificationContent: {
			// fontFamily: theme.fontFamily,
			fontFamily: fonts.inter.regular,
			color: theme.textColorPrimary,
			textAlign: 'left',
			fontSize: 16,
		},
		timestamp: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontWeight: '400',
			fontSize: 11,
		},

		challengeContainer: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			// justifyContent: 'center',
			alignItems: 'center',
			// marginTop: 25,
			// marginBottom: 15,
		},

		challengeButton: {
			...theme.button.primary.default,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
			// marginTop: 15,
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
		headerInnerContainer: {
			display: 'flex',
			// flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'flex-end',
			paddingBottom: 15,
			width: '100%',
			borderBottomWidth: 1,
			borderBottomColor: theme.textColorPrimary,
			// borderColor: 'blue',
			// borderWidth: 1,
			height: 60
		},
		headerContainer: {
			// backgroundColor: theme.innerContainer.,
			flexDirection: 'row',
			width: '100%',
			// height: 50,
			justifyContent: 'flex-start',
	
		
			// alignItems: 'center',
		},
		headerText: {
			color: theme.textColorPrimary,
			fontSize: 22,
			fontFamily: theme.text.title.fontFamily,
			// textAlign: 'center',

		},
		divider:{
			backgroundColor: theme.borderColor,
			height: 1,
			width: '100%',
		}
	})
	, [theme]);

	return notificationStyles;
};
