import { useThemeContext } from '@context/theme/useThemeContext';
import { Dimensions, StyleSheet } from 'react-native';

export const useProfileStyles = () => {
	const window = Dimensions.get('window');

	const { theme } = useThemeContext();

	const profileStyles = StyleSheet.create({
		safeAreaViewContainer: {
			flex: 1,
			width: '100%',
			height: '100%',
			backgroundColor: theme.backgroundColor,
		},

		profileContainer: {
			...theme.container,

			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',

		},

		profileHeader: {
			...theme.text.header,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		profileBody: {
			...theme.text.header,
			display: 'flex',
			flex: 1,
			alignItems: 'center',
		},
		logoutIconContainer: {
			paddingRight: 10,
		},

		logoutIcon: {
			width: 40,
			height: 40,
		},

		usernameContainer: {
			...theme.innerContainer,
			width: 390,
			height: 268,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			alignSelf: 'flex-start',
			backgroundColor: theme.backgroundColor,
		},

		username: {
			color: theme.text.body.large,
			fontSize: 20,
			fontWeight: 'bold',
			padding: 7.5,
			paddingRight: 10,
		},

		editIcon: {
			width: 25,
			height: 25,
			marginRight: 10,
		},

		profileImage: {
			width: 120,
			height: 120,
			borderRadius: 70,
		},

		name: {
			...theme.text.body.large,
			fontSize: 20,
			fontWeight: 'bold',
			paddingTop: 10,
		},

		bioContainer: {
			width: '40%',
		},

		bio: {
			fontSize: 16,
			paddingTop: 2.5,
			textAlign: 'center',
		},

		motivateButton: {
			...theme.button.secondary.default,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			width: 95,
			borderWidth: 1,
		},

		motivatingButton: {
			...theme.button.secondary.default,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			width: 95,
			borderWidth: 1,
		},

		motivateButtonText: {
			...theme.button.secondary.default.buttonText,
			padding: 7.5,
			fontSize: 14,
			fontWeight: 'bold',
		},

		motivatingButtonText: {
			...theme.button.secondary.default.buttonText,
			padding: 7.5,
			fontSize: 14,
			fontWeight: 'bold',
		},

		userDataContainer: {
			...theme.innerContainer,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			width: '100%',
			paddingTop: 25,
		},

		userDataColumnLink: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '33.33%',
		},

		userDataColumnLinkButtons: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 15,
		},

		userDataColumn: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			padding: 5,
		},

		userData: {
			...theme.text.body.medium,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},

		userDataPoint: {
			...theme.text.body.mediumer,
			fontWeight: 'bold',
		},

		userDataLabel: {
			...theme.text.body.mediumer,
			fontSize: 16,
		},

		headerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			gap: 1,
			marginTop: 25,
		},

		headerInnerContainer: {
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.backgroundColor,
			padding: 15,
		},

		headerText: {
			...theme.text.header,
			fontWeight: 'bold',
		},

		scrollContainer: {
			...theme.innerContainer,
			width: '100%',
			height: '70%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
		},

		scrollInnerContainer: {
			width: '33.33%',
			borderWidth: 1,
			borderColor: theme.borderColor,
		},

		scrollBuffer: {
			height: 200,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		imageScrollBuffer: {
			height: 300,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		profileFeedContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			flexWrap: 'wrap',
			width: '100%',
		},

		imageContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: 200,
			alignSelf: 'flex-start',
		},

		planContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: 125,
			alignSelf: 'flex-start',
		},

		planContainerInner: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderBottomColor: theme.borderColor,
			borderTopWidth: 1,
			borderTopColor: theme.borderColor,
			padding: 10,
		},

		profileFeedImage: {
			width: '100%',
			height: '100%',
		},

		profilePlanImage: {
			width: 40,
			height: 40,
		},

		profilePlanText: {
			textAlign: 'center',
			overflow: 'hidden',
		},

		statsContainer: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: 200,
			gap: 15,
			alignSelf: 'flex-start',
			borderBottomWidth: 1,
			borderBottomColor: theme.borderColor,
			borderTopWidth: 1,
			borderTopColor: theme.borderColor,
		},

		statsDataPoint: {
			fontSize: 30,
			fontWeight: 'bold',
		},

		statsDataLabel: {
			fontSize: 16,
			textAlign: 'center',
		},

		logoutContainer: {
			position: 'absolute',
			backgroundColor: theme.backgroundColor,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'flex-end',
			width: '100%',
			// height: '100%'
		},

		logoutButton: {
			// ...theme.button.primary.default,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'flex-end',
			// right: 10,
			// top: 10,
			width: '100%',
			height: 15,
			// padding: 15,
			paddingTop: 25,
			paddingRight: 30,
			borderRadius: 10,
		},

		logoutText: {
			...theme.button.primary.default.buttonText,
			fontSize: 20,
			fontWeight: 'bold',
		},


		input: {
			...theme.input,
			maxWidth: '80%',
			minWidth: '40%',
			margin: 25,
			paddingTop: 25,
			paddingBottom: 25,
			paddingLeft: 25,
			paddingRight: 25,
			borderWidth: 0,
			borderRadius: 25,
			fontSize: 16,
			textAlign: 'center',
			overflow: 'hidden',
		},

		submitCommentButton: {
			...theme.button.primary.default,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			width: 125,
			borderWidth: 1,
		},

		submitCommentText: {
			...theme.button.primary.default.buttonText,
			padding: 7.5,
			fontSize: 16,
			fontWeight: 'bold',
		},

		challengeErrorTextContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},

		challengeErrorText: {
			textAlign: 'center',
			marginBottom: 10,
		},

		cancelText: {
			fontSize: 16,
			textDecorationLine: 'underline',
			margin: 15,
		},

		loadingContainer: {
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

	return profileStyles;
};
