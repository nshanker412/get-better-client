import React from 'react';
import { Text, View } from 'react-native';
import { PlanItem } from './PlanItem';
import { usePlanItemStyles } from './PlanItem.styles';
import { ConnectedPlanItemProps } from './PlanItem.types';

/**
 * Connected PlanItem Component
 * Details:
 */
export const ConnectedPlanItem: React.FC<ConnectedPlanItemProps> = ({
	planType,
	planTitle,
}) => {
	const planItemStyles = usePlanItemStyles();

	return (
		<View style={planItemStyles.container}>
			<PlanItem planType={planType} />
			<Text style={planItemStyles.text}>{planTitle ?? planType}</Text>
		</View>
	);
};
