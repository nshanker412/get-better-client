import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useScreenModeToggleStyles = () => {
	const { theme } = useThemeContext();

	const toggleStyles = StyleSheet.create({
		label: {
			fontFamily: theme.text.body.mediumer.fontFamily,
			fontSize: 16,
			color: '#FFFFFF',
			textAlign: 'center',
			fontWeight: 'normal',
			textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
			textShadowOffset: { width: 0, height: 1 }, // Shadow offset (horizontal and vertical)
			textShadowRadius: 1, // Shadow radius
		},
		container: {
			position: 'absolute',
			flexDirection: 'row',
			alignItems: 'center',
			zIndex: 1,
		},
	});

	return toggleStyles;
};
