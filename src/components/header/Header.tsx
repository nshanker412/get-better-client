import React from 'react';
import { Text, View } from 'react-native';
import { useHeaderStyles } from './header.styles';

export const Header = () => {
	const headerStyles = useHeaderStyles();

	return (
		<View style={headerStyles.headerContainer}>
			<View style={headerStyles.titleContainer}>
				<Text style={headerStyles.whiteText}>GetBetter.</Text>
				<Text style={headerStyles.shadowText}>GetBetter.</Text>
				<Text style={headerStyles.title}>GetBetter.</Text>
			</View>
		</View>
	);
};
