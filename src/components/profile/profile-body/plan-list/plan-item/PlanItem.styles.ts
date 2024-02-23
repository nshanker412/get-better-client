import { fonts } from '@context/theme/fonts';
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
			gap: 5,
		},
		text: {
			color: theme.grayShades.gray700,
			fontSize: 14,
			fontFamily: fonts.inter.bold,
			textAlign: 'center',
			justifyContent: 'center',
			alignSelf: 'center',
		},
	});

	return PlanItemStyles;
};
