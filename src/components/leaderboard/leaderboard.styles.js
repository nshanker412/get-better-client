import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useLeaderboardStyles = () => {
	const { theme } = useThemeContext();

	const leaderboardStyles = StyleSheet.create({
		leaderboardContainer: {
			backgroundColor: theme.container.backgroundColor,
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'space-evenly',
			marginTop: 100,
			gap: 10,
		},

		leaderboardTitleText: {
			...theme.text.header,
			// fontSize: 20,
		},
		activeFeedToggleContainer: {
			// display: 'flex',
			backgroundColor: theme.backgroundColor,
			alignItems: 'center',
			padding: 12,
			borderRadius: 50,
			// flex: 1,
		},
		inaciveFeedToggleContianer: {
			// display: 'flex',
			backgroundColor: theme.backgroundColor,
			alignItems: 'center',
			padding: 12,
			borderRadius: 50,
			// flex: 1,
		},

		feedTypeContainer: {
			width: '90%',
			borderRadius: 50,
			height: 70,
			backgroundColor: '#1E1D1D',
			display: 'flex',
			flexDirection: 'row',
			// justifyContent: 'space-evenly',
			alignItems: 'center',
			padding: 7,
			// gap: 25,
			// margin: 25
		},

		feedTypeText: {
			...theme.text.header,
			// fontWeight: 'bold',
			// zIndex: 1,
		},

		feedTypeTextSelected: {
			...theme.text.header,
			// fontWeight: 'bold',
		},

		scrollHeader: {
			// ...theme.text.header,
			width: '90%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingBottom: 10,
		},

		rankHeaderContainer: {
			// width: '17.5%',
			flex: 1,
		},

		metricHeaderContainer: {
			// width: '35%',
			flex: 1,
		},

		metricSelect: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 5,
		},

		dropdownIcon: {
			height: 20,
			width: 20,
		},

		headerText: {
			...theme.text.header,
			fontSize: 16,
			fontWeight: 'bold',
			textAlign: 'center',
		},

		profilesContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			width: '100%',
		},

		profile: {
			backgroundColor: 'black',
			width: '90%',
			alignSelf: 'center',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			// alignItems: 'stretch',
			// borderRadius: 16,
			// borderWidth: 1,
			// borderColor: theme.borderColor,
		},

		lastProfile: {
			width: '100%',
			// height: 50,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			padding: 10,
			borderRadius: 16,
			// borderTopColor: theme.borderColor,
			// borderTopWidth: 1,
			// borderBottomColor: theme.borderColor,
			// borderBottomWidth: 1,
			// paddingTop: 10,
			// paddingBottom: 10
		},

		scrollBuffer: {
			height: 340,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		profileContainer: {
			flex: 5,
			// borderWidth: 1,
			// borderColor: theme.borderColor,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			// width: '100%',
			padding: 20,
			gap: 8,
			// marginTop: 25,
		},

		rankContainer: {
			flex: 1,
			display: 'flex',
			alignContent: 'center',
			justifyContent: 'center',
			// gap: 2,
		},

		rankText: {
			// color: '#59636D',
			color: theme.textColorPrimary,
			fontFamily: theme.text.body.medium.fontFamily,
			fontSize: 20,
			textAlign: 'right',
		},

		profileImage: {
			width: 50,
			height: 50,
			borderRadius: 25,
			alignSelf: 'center',
			// marginLeft: 15,
			// marginRight: 15
		},

		profileInfoContainer: {
			// borderWidth: 1,
			// borderColor: theme.borderColor,
			flex: 3,
			display: 'flex',
			alignItems: 'flex-start',
			justifyContent: 'center',
		},

		metricContainer: {
			flex: 1,

			display: 'flex',
			alignItems: 'flex-end',
			justifyContent: 'center',
			// width: '25%',
			// paddingRight: 15,
			paddingRight: 20,
		},

		metricText: {
			fontFamily: theme.text.body.medium.fontFamily,
			fontSize: 20,
			// color: '#59636D',
			color: theme.textColorPrimary,

			// fontWeight: 'bold',
			// textAlign: 'right'
		},

		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			minHeight: 30,
			minWidth: 30,
		},

		loader: {
			width: 75,
			height: 75,
		},
		genericProfileImage: {
			backgroundColor: theme.grayShades.gray400,
			alignSelf: 'center',
			width: 50,
			height: 50,
			borderRadius: 60,
		},

		name: {
			...theme.text.header,
			fontSize: 16,
			// textAlign: 'left',

			// alignSelf: 'flex-start'
		},
		username: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.grayShades.gray700,
			fontSize: 16,
			// textAlign: 'left',
			// flex: 1,
			// alignSelf: 'flex-start'
		},

		// profileInfoContainer: {
		//     // width: "100%",
		//     flex: 1,
		//     display: 'flex',
		//     flexDirection: 'column',
		//     justifyContent: 'flex-start',
		//     paddingLeft: 9
		// },
	});

	return leaderboardStyles;
};
