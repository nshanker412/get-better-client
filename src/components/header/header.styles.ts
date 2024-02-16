import { StyleSheet } from 'react-native';

export const useHeaderStyles = () => {
	// const { theme } = useThemeContext();

	const headerStyles = StyleSheet.create({
		headerContainer: {
			position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			left: 15,
			top: 50,
			width: '100%',
			textAlign: 'center',
			zIndex: 1,
		},

		titleContainer: {
			position: 'relative',
		},

		title: {
			color: '#FFFFFF',
			textAlign: 'center',
			fontSize: 36,
			fontWeight: 'bold',
		},

		shadowText: {
			fontWeight: 'bold',
			textAlign: 'center',
			fontSize: 36,
			color: 'black',
			position: 'absolute',
			zIndex: 0, // Behind the original white text
			top: 1,
			left: 2,
		},

		whiteText: {
			color: '#FFFFFF',
			fontWeight: 'bold',
			textAlign: 'center',
			fontSize: 36,
			opacity: 0.5,
			position: 'absolute',
			zIndex: -1, // Behind the black text
			top: 0,
			left: 0,
		},
	});

	return headerStyles;
};
