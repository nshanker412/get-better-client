import { TextStyle, ViewStyle } from 'react-native';
export interface ActionButtonStyles {
	container: ViewStyle;
	button: ViewStyle;
	text: TextStyle;
}

export interface ActionButtonProps {
	loading?: boolean;
	defaultPressed: boolean;
	onPress: null | (() => void);
	title: string;
	id?: string;
	isPrimary?: boolean;
	disabled?: boolean;
	ariaLabel?: string;
	styles?: Partial<ActionButtonStyles>;
}
