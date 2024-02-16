import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useLoaderStyles = () => {
	const { theme } = useThemeContext();

	const loaderStyles = StyleSheet.create({
		container: {
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},
		loader: {
			color: theme.textColorSecondary,
			height: 10,
			width: 10,
		},
	});

	return loaderStyles;
};
