import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from 'react-native';
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner';
import { useActionButtonStyles } from './ActionButton.styles';
import { ActionButtonProps } from './ActionButton.types';
interface CustomStyles {
	container?: StyleProp<ViewStyle>;
	text?: StyleProp<TextStyle>;
}

export const ActionButton: React.FC<
	ActionButtonProps & { styles?: CustomStyles }
> = ({
	loading,
	onPress: onPressCb,
	title,
	defaultPressed,
	disabled = false,
	isPrimary,
	ariaLabel = 'action button',
	styles,
}) => {
	const buttonStyle = useActionButtonStyles(isPrimary);
	const [pressed, setPressed] = React.useState(false);

	const [buttonColorState, setButtonColorState] = React.useState(
		buttonStyle.button,
	);
	const [textColorState, setTextColorState] = React.useState(
		buttonStyle.text,
	);

	React.useEffect(() => {
		if (defaultPressed) {
			setButtonColorState(buttonStyle.buttonPressed);
			setTextColorState(buttonStyle.textPressed);
		}
	}, [defaultPressed]);

	const onPress = () => {
		if (pressed) {
			setButtonColorState(buttonStyle.button);
			setTextColorState(buttonStyle.text);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			setPressed(false);
		} else {
			setButtonColorState(buttonStyle.buttonPressed);
			setTextColorState(buttonStyle.textPressed);
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			setPressed(true);
		}
	};

	useEffect(() => {
		console.log('pressed', pressed);
		if (pressed && onPressCb) {
			onPressCb();
		}
	}, [pressed]);

	return (
		<Pressable
			style={[buttonColorState, styles?.container]}
			disabled={disabled || loading}
			onPress={onPress}
			hitSlop={5}>
			<Text style={[textColorState, styles?.text]}>{title}</Text>
			{loading && <LoadingSpinner />}
		</Pressable>
	);
};
