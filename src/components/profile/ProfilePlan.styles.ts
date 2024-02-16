import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfilePlanStyles = () => {
	const { theme } = useThemeContext();

	const profilePlanSyles = StyleSheet.create({
		backArrowContainer: {
			// position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			// top: 50,
			// left: 10,
			// width: '100%',
			// flex: 1
			// zIndex: 1000
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		planContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			// paddingTop: 100,
		},

		planTitle: {
			...theme.text.header,
			fontFamily: theme.text.header.fontFamily,
			color: theme.textColorPrimary,
		
			fontWeight: 'bold',
			paddingBottom: 15,
			textAlign: 'center',

		},

		planDescription: {
			...theme.text.body.large,
			// color: theme.textColorSecondary,
			color: theme.textColorPrimary,
			opacity: 0.8,
			fontFamily: theme.fontFamilyLight,
			// paddingBottom: 30,
			textAlign: 'center',
		},

		planImageContainer: {
			display: 'flex',
			width: '100%',
			// ...theme.text.container,
			// width: '80%',
			// height: '55%',

			// overflow: 'hidden',
			// borderRadius: 15,
		},

		planImage: {
			width: '100%',
			height: '100%',
		},

		planDataContainer: {
			// ...theme.innerContainer,
			backgroundColor: theme.innerContainer.backgroundColor,
			// borderRadius: 5,
			// padding: 10, 
			// width: '80%',
			// display: 'flex',
			// flexDirection: 'row',
			// justifyContent: 'center',
			// alignItems: 'center',
			// height: '15%',
		},

		dataText: {
			...theme.text.body.large,
			fontWeight: 'bold',
		},

		helperText: {
			...theme.text.body.large,
		},

		loadingContainer: {
			...theme.text.body.medium,
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

	return profilePlanSyles;
};
