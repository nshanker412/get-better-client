import { StyleSheet } from 'react-native';
import { useThemeContext } from '@context/theme/useThemeContext';

export const useCOMPONENT_NAMEStyles = () => {
	const { theme } = useThemeContext();

	const COMPONENT_NAMEStyles = StyleSheet.create({
		container: {
			...theme.container,
			position: 'absolute',
			zIndex: 1,
		},
		username: {
			...theme.text.body.mediumer,
		},
	});

	return COMPONENT_NAMEStyles;
};
