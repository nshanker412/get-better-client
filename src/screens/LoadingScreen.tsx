import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export const LoadingScreen = () => {
	return (
		<View style={styles.container}>
			<ActivityIndicator
				size='large'
				color='white'
			/>
			<Text style={styles.loadingText}>Loading...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
	},
});
