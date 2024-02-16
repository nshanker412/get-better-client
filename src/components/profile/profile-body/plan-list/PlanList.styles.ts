import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';
import { DotsProperties } from 'react-native-dots-pagination';

export const usePlanListStyles = () => {
	const { theme } = useThemeContext();

	const PlanListStyles = StyleSheet.create({
		planContainerInner: {
			flex: 1,
			width: '100%',
		},
		statsContainer: {
			flex: 1,
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
		statContainer: {

			justifyContent: 'center',
			alignItems: 'center',
		},
		dotProps: {
			activeDotHeight: 12,
			activeDotWidth: 12,
			activeColor: theme.borderColor,
			passiveColor: theme.innerBorderColor,
			passiveDotHeight: 8,
			passiveDotWidth: 8,
			paddingVertical: 15,
			marginHorizontal: 5,
		} as DotsProperties,
	});

	return PlanListStyles;
};
