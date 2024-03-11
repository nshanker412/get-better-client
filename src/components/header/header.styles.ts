import { fonts } from '@context/theme/fonts';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useHeaderStyles = () => {
	// const { theme } = useThemeContext();

	const f = fonts.inter.black;

	const headerStyles = useMemo(() => StyleSheet.create({
		headerContainer: {
			shadowColor: '#000000',
			shadowOffset: { width: -4, height: 4 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			backgroundColor: 'transparent',
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
			fontFamily: f,
			textAlign: 'center',
			fontSize: 36,
			zIndex: 1,
			// fontWeight: 'bold',
		},

		shadowText: {
			// fontWeight: 'bold',
			fontFamily: f,
			textAlign: 'center',
			fontSize: 36,
			color: 'black',
			position: 'absolute',
			zIndex: 0, // Behind the original white text
			top: 2,
			left: -2,
		},

		whiteText: {
			color: '#FFFFFF',
			// fontWeight: 'bold',
			fontFamily: f,
			textAlign: 'center',
			fontSize: 36,
			opacity: 0.1,
			position: 'absolute',
			zIndex: -1, // Behind the black text
			top: 3,
			left: -3,
		},
	})
	, []);
	return headerStyles;
};
