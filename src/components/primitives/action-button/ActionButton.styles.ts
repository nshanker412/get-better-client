import { useThemeContext } from '@context/theme/useThemeContext';
import { TextStyle, ViewStyle } from 'react-native';

export const useActionButtonStyles = (isPrimary?: boolean) => {
	const { theme } = useThemeContext();

	return {
		button: {
			display: 'flex',
			backgroundColor: isPrimary
				? theme.button.primary.default.backgroundColor
				: theme.button.secondary.default.backgroundColor,
			borderRadius: 16,
			borderWidth: 1,
			borderColor: isPrimary
				? theme.backgroundColor
				: theme.innerBorderColor,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
		} as ViewStyle,
		buttonPressIn: {
			display: 'flex',
			backgroundColor: isPrimary
				? theme.button.primary.default.backgroundColor
				: theme.button.secondary.default.backgroundColor,
			backgroundColorOpacity: 0.5,
			borderRadius: 16,
			borderWidth: 1,
			borderColor: isPrimary
				? theme.backgroundColor
				: theme.innerBorderColor,
			height: 32,
			alignItems: 'center',
			justifyContent: 'center',
		} as ViewStyle,
		buttonPressed: {
			display: 'flex',
			backgroundColor: !isPrimary
				? theme.button.primary.default.backgroundColor
				: theme.button.secondary.default.backgroundColor,
			backgroundColorOpacity: 0.8,

			borderRadius: 16,
			borderWidth: 1,
			borderColor: !isPrimary
				? theme.backgroundColor
				: theme.innerBorderColor,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
		} as ViewStyle,

		buttonPressOut: {
			display: 'flex',
			backgroundColor: !isPrimary
				? theme.button.primary.default.backgroundColor
				: theme.button.secondary.default.backgroundColor,
			opacity: 0.5,
			borderRadius: 16,
			borderWidth: 1,
			borderOpacity: 0.5,
			borderColor: !isPrimary
				? theme.backgroundColor
				: theme.innerBorderColor,
			// flex: 1,
			height: 40,
			alignItems: 'center',
			justifyContent: 'center',
		},
		buttonDisabled: {},
		text: {
			...(isPrimary
				? theme.button.primary.default.buttonText
				: theme.button.secondary.default.buttonText),
			fontFamily: theme.fontFamily,
		} as TextStyle,

		textPressed: {
			...(!isPrimary
				? theme.button.primary.default.buttonText
				: theme.button.secondary.default.buttonText),
			fontFamily: theme.fontFamily,
			opacity: 0.5,
		} as TextStyle,
	};
};
