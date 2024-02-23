import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';
import { DotsProperties } from 'react-native-dots-pagination';

export const useStatsListStyles = () => {
	const { theme } = useThemeContext();

	const StatsListStyles = StyleSheet.create({
		statsDataPoint: {
			color: theme.textColorPrimary,
			fontFamily: theme.fontFamily,
			fontSize: 30,
			textAlign: 'center',
		},
		statsDataLabel: {
			color: theme.grayShades.gray700,
		
			fontSize: 14,
			fontFamily: fonts.inter.bold,
			textAlign: 'center',
			maxWidth: '60%',
			alignSelf: 'center',
		},
		statsContainer: {
			flex: 1,
			alignContent: 'center',
			alignItems: 'center',
			justifyContent: 'center',
		},
		statContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'stretch',
			// gap: 2,
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

	return StatsListStyles;
};
