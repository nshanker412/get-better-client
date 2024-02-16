/**
 * Todo
 * - import Screen dimension to de-fuck alignment
 */
import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useHomeStyles = () => {
	const { theme } = useThemeContext();

	const homeStyles = StyleSheet.create({
		header: {
			// TODO: alignment still fucky fix after responsive screen provider implemented
			...theme.text.title,
			width: 200,
			position: 'absolute',
			display: 'flex',
			alignSelf: 'flex-start',
			alignItems: 'flex-start',
			flexDirection: 'row',
			top: 10,
			padding: 0,
			margin: 0,
			left: 0,
			zIndex: 2,
		},
		homeContainer: {
			// needs to be a percentage i think to fit all screens
			backgroundColor: theme.innerContainer.backgroundColor,
			height: '100%',
		},

		homeScrollOuterContainer: {
			height: '100%',
		},

		homeScrollContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},

		feedTypeContainer: {
			position: 'absolute',
			top: 100,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 25,
			zIndex: 1,
		},

		feedTypeText: {
			...theme.text.body.large,
			fontSize: 20,
			fontWeight: 'bold',
		},

		feedTypeTextSelected: {
			...theme.text.body.large,
			fontWeight: 'bold',
		},

		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
		},

		loader: {
			width: 75,
			height: 75,
		},

		bellIconContainer: {
			position: 'absolute',
			right: 50,
			top: 50,
			zIndex: 1,
		},

		bellIconInnerContainer: {
			position: 'absolute',
			// right: 0,
			// top: 0,
			zIndex: 1,
		},

		bellIcon: {
			height: 40,
			width: 40,
		},

		unread: {
			position: 'absolute',
			top: 0,
			right: 0,
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: theme.alertColor,
		},
	});

	return homeStyles;
};
