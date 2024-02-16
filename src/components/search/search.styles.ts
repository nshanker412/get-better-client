import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useSearchStyles = () => {
	const { theme } = useThemeContext();

	const searchStyles = StyleSheet.create({
		searchContainer: {
			backgroundColor: theme.backgroundColor,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},
		title: {
			...theme.text.header,
			fontSize: 24,
			textAlign: 'center',
			marginTop: 20,
			marginBottom: 20,
		},
		searchBarContainer: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			backgroundColor: theme.containerColor,
			height: 40,
			padding: 10,
			width: '90%',
			borderRadius: 50,
		},

		inputStyle: {
			flex: 1,
			color: '#000',
			paddingLeft: 10,
			fontSize: 16,
		},
		iconStyle: {
			marginRight: 10,
		},

		backArrowContainer: {
			position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			top: 50,
			left: 10,
			width: '100%',
			zIndex: 1000,
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		input: {
			...theme.input,
		},
		defaultInputText: {
			color: theme.textColorPrimary,
		},
		searchIcon: {
			paddingLeft: 6,
			paddingRight: 10,
		},
		profilesContainer: {
			display: 'flex',
			flexDirection: 'column',
			width: '100%',
			padding: 20,
			// marginTop: 25,
		},
		profile: {
			// borderWidth: 1,
			// borderColor: theme.borderColor,
			width: '100%',
			// height: 50,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			padding: 15,
			borderRadius: 16,
			// borderTopColor: theme.borderColor,
			// borderTopWidth: 1,
			// paddingTop: 10,
			// paddingBottom: 10
		},
		lastProfile: {
			width: '100%',
			height: 50,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
		},
		scrollBuffer: {
			height: 200,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		profileImage: {
			width: 50,
			height: 50,
			borderRadius: 25,
			alignSelf: 'center',
			// marginLeft: 15,
			// marginRight: 15
		},
		genericProfileImage: {
			// width: 40,
			// height: 40,
			// borderRadius: 25,
			// marginLeft: 15,
			// marginRight: 15,
			// backgroundColor: theme.innerContainer.backgroundColor,
			backgroundColor: theme.grayShades.gray400,
			alignSelf: 'center',
			width: 50,
			height: 50,
			borderRadius: 60,
			// shadowColor: '#ddd',
			// shadowOffset: { width: 2, height: 2 },
			// shadowOpacity: 0.3,
			// shadowRadius: 2,
		},

		profileInfoContainer: {
			// width: "100%",
			flex: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			paddingLeft: 9,
		},

		name: {
			...theme.text.header,
			fontSize: 16,
			textAlign: 'left',
			flex: 1,
			alignSelf: 'flex-start',
		},
		username: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.grayShades.gray700,
			fontSize: 16,
			textAlign: 'left',
			// flex: 1,
			alignSelf: 'flex-start',
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
		divider:
		{
			backgroundColor: theme.borderColor,
			height: 1,
			width: '100%',
		}
	});

	return searchStyles;
};
