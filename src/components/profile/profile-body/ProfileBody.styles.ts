import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfileBodyStyles = () => {
	const { theme } = useThemeContext();

	const ProfileBodyStyles = StyleSheet.create({
		container: {
			display: 'flex',
			flexDirection: 'column',
			alignContent: 'stretch',
			backgroundColor: theme.backgroundColor,
			width: '100%',
			height: '100%',
			// borderRadius: 5,
			borderWidth: 1,
		},

		labelText: {
			// ...theme.text.body.medium,
			fontSize: 20,
			fontFamily: theme.text.title.fontFamily,
			color: theme.textColorPrimary,
			flex: 1,
			textAlign: 'center',
			alignSelf: 'center',
		},
		outerContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignContent: 'stretch',
			backgroundColor: theme.innerContainer.backgroundColor,
			width: '100%',
			height: '100%',
			borderRadius: 5,
			// borderWidth: 1,
			// borderColor: theme.innerBorderColor,
		},
		imageScrollBuffer: {
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'stretch',
		},

		planContainerInner: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-evenly',
			alignItems: 'center',
		},
		postContainer: {
			display: 'flex',
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingTop: 25,
			alignSelf: 'flex-start',
		},
		statsCategoryColumn: {
			borderLeftColor: theme.innerBorderColor,
			borderLeftWidth: 1,
			borderTopColor: theme.innerBorderColor,
			borderTopWidth: 1,
			// borderTopLeftRadius: 5,
			// borderTopRightRadius: 5,

			flexDirection: 'row',
			justifyContent: 'center',
			alignContent: 'center',
			flex: 1,
		},
		postsLoadingContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			// height: "50%",
		},
		categoryContainer: {
			flexDirection: 'column',
			justifyContent: 'center',
			alignContent: 'center',
			flex: 1,
			// borderTopWidth: 1,
			// borderTopColor: theme.innerBorderColor,
			// borderTopRightRadius: 5,
			borderRightWidth: 1,
			borderRightColor: theme.innerBorderColor,
		},
		profileFeedImage: {
			width: '100%',
			height: '100%',
		},
		postsColumn: {
			flex: 1,
			alignContent: 'stretch',
			width: '100%',
		},
		scrollInnerContainer: {
			borderRadius: 5,
		},

		profileFeedContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			flexWrap: 'wrap',
			width: '100%',
		},
		profilePlanImage: {
			width: 40,
			height: 40,
		},

		profilePlanText: {
			color: 'white',
			fontSize: 16,
			textAlign: 'center',
			overflow: 'hidden',
		},
		statContainer: {
			flex: 1,
			justifyContent: 'center',
			alignContent: 'center',
			width: '100%',
		},
		statsContainer: {
			flexDirection: 'column',
			justifyContent: 'center',
			alignContent: 'center',
			flex: 1,
			// borderLeftWidth: 1,
			// borderLeftColor: theme.innerBorderColor,
			borderRightWidth: 1,
			borderRightColor: theme.innerBorderColor,
			// borderTopRightRadius: 5,
		},
	});

	return ProfileBodyStyles;
};
