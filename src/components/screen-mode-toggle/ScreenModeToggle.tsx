import React from 'react';
import { Switch, Text, View } from 'react-native';
import { useScreenModeToggleStyles } from './ScreenModeToggle.styles';
import { ToggleProps } from './ScreenModeToggle.types';

export const ScreenModeToggle: React.FC<ToggleProps> = ({
	onToggle,
	isEnabled: isDarkMode,
}) => {
	const toggleStyles = useScreenModeToggleStyles();

	return (
		<View style={toggleStyles.container}>
			<Text style={toggleStyles.label}>DarkMode</Text>
			<Switch
				trackColor={{ false: '#FFFFFF', true: '#59636D' }}
				thumbColor={'#f4f3f4'}
				onValueChange={onToggle}
				value={isDarkMode}
			/>
		</View>
	);
};
