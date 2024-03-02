import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfileHeaderStyles = () => {
	const { theme } = useThemeContext();

	const profileHeaderStyles = StyleSheet.create({
		headerOuterContainer: {
			// borderWidth: 1,
			// borderColor: 'red',
			display: 'flex',
			flex: 1,
			width: '100%',
			height: '100%',
			// padding: 10,
		},
		headerInnerContainer: {
			borderWidth: 0.5,
			borderColor: theme.innerBorderColor,
			alignSelf: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			width: '90%',
			height: 90,
			borderRadius: 20,

		},
		centerColumnContainer: {
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		columnContainer: {
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		nameContainer: {
			display: 'flex',
			// alignSelf: 'center',
			alignItems: 'center',
			// alignContent: 'center',
			// justifyContent: 'center',
		},
		nameBioContainer: {
			// borderWidth: 1,
			// borderColor: theme.grayShades.gray600,
			display: 'flex',
			height: "100%",
			// alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'column',
			alignSelf: 'center',
			alignItems: 'flex-start',
		},
		name: {
			color: theme.text.header.color,
			fontSize: 20,
			fontFamily: theme.fontFamily,
			// fontWeight: '700',
			alignSelf: 'center',
			textAlign: 'center',
		},
		bioContainer: {
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			alignSelf: 'center',
		},
		bio: {
			fontFamily: theme.text.body.mediumer.fontFamily,
			fontSize: 15,
			color: theme.grayShades.gray700,
			textAlign: 'center',
			flexWrap: 'wrap',
			alignItems: 'center',
			justifyContent: 'center',
			width: 'auto',
			padding: 1,
		},
		handleContainer: {
			flex: 3,
			height: '100%',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
		},
		userHandleStyle: {
			color: theme.grayShades.gray700,
			textAlign: 'center',
			fontSize: 15,
			alignItems: 'center',
		},
		motivatorOuterContainer: {
			// borderWidth: 1,
			// borderColor: 'red',
			padding: 10,
			flex: 1,
			justifyContent: 'flex-start',

			alignItems: 'center',
			flexDirection: 'column',
			gap: 5,
		},
		motivatorsInnerContainer: {
			// flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
		},
		motivatorText: {
			fontSize: 14,
			color: theme.grayShades.gray700,
			textAlign: 'center',
			fontFamily: fonts.inter.light,
		},
		motivateNum: {
			fontFamily: fonts.inter.bold,
			fontSize: 15,
			color: theme.textColorPrimary,
			textAlign: 'center',
		},
		roundProfilePic: {
			backgroundColor: theme.grayShades.gray600,
			alignSelf: 'center',
			width: 120,
			height: 120,
			borderRadius: 60,
			shadowColor: '#000',
			shadowOffset: { width: 2, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
		},
		placeholderCircle: {
			position: 'relative',
		},
		loadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		challengeButtonContainer: {
			flex: 4,
			justifyContent: 'center',
			width: 120,
			height: 50,
		},
		motivateButtonContainer: {
			flex: 4,
			justifyContent: 'center',
			width: 120,
			height: 50,
		},
		profilePicOuter: {
			justifyContent: 'center',
			alignItems: 'flex-start',
			paddingBottom: 5,
		},
		profPicContainer: {
			backgroundColor: 'transparent',
			alignSelf: 'center',
			width: 120,
			height: 120,
			borderRadius: 60,
			shadowColor: '#000',
			shadowOffset: { width: 2, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
		},
		profileImage: {
			width: 120,
			height: 120,
			borderRadius: 60,
			borderColor: theme.grayShades.gray600,
			borderWidth: 1,
			shadowColor: '#000',
			shadowOffset: { width: 2, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
		},
		editIcon: {
			width: 25,
			height: 25,
			marginRight: 10,
		},
	});

	return profileHeaderStyles;
};
