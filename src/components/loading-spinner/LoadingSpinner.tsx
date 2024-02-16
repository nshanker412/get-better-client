import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLoaderStyles } from './LoadingSpinner.styles';
import { LoadingSpinnerProps, SpinSpeed } from './LoadingSpinner.types';

/**
 * Activity loader component.
 * TODO: update w/ custom designed loader svg(s)/animations. migrating from direct gif
 * to minimize bundle size
 */

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	isActive = true,
	speed = SpinSpeed.Normal,
	size = 'small',
}) => {
	const loaderStyles = useLoaderStyles();

	return (
		<View style={loaderStyles.container}>
			<ActivityIndicator
				style={loaderStyles.loader}
				size={size}
			/>
		</View>
	);
};
