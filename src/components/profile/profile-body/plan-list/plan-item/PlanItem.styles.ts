import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const usePlanItemStyles = () => {
	const { theme } = useThemeContext();

	const PlanItemStyles = StyleSheet.create({
		container: {
			flex: 1,
			borderColor: theme.borderColor,
			justifyContent: 'center',
			alignItems: 'center',
			gap: 10,
		},
		text: {
			color: theme.grayShades.gray700,
			fontSize: 16,
			fontFamily: theme.text.body.medium.fontFamily,
			textAlign: 'center',
			justifyContent: 'center',
			alignSelf: 'center',
		},
	});

	return PlanItemStyles;
};
