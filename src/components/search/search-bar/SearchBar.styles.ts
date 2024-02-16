import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useSearchBarStyles = () => {
	const { theme } = useThemeContext();

	const SearchBarStyles = StyleSheet.create({
		outerContainer: {
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%', // Ensure outerContainer fills the parent width
		},
		container: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: theme.grayShades.gray800,
			borderRadius: 16,
			paddingVertical: 8,
			paddingHorizontal: 10,
			margin: 10,
			justifyContent: 'space-between', // ensures items are spaced out
		},
		focusedContainer: {
			backgroundColor: theme.grayShades.gray900,
			justifyContent: 'flex-start', // aligns items to the start
		},
		iconContainer: {
			position: 'absolute',
			left: 10,
		},
		inputStyle: {
			flex: 1,
			color: theme.grayShades.gray200,
			fontSize: 16,
			paddingHorizontal: 15, // Add padding to prevent text from overlapping the icon
		},
		cancelButton: {
			padding: 1,
		},
		cancelButtonText: {
			color: '#657970', // sligntly lighter white color
			fontSize: 16,
		},
		spinnerStyle: {
			marginRight: 10,
		},
	});

	return SearchBarStyles;
};
