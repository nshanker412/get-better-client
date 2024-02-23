import { BarbellIcon } from '@assets/darkSvg/BarbellIcon';
import { DinnerIcon } from '@assets/darkSvg/DinnerIcon';
import { ShoeIcon } from '@assets/darkSvg/ShoeIcon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import { PlanItemProps, PlanType } from './PlanItem.types';

export const PlanItem: React.FC<PlanItemProps> = ({ planType }) => {
	const { theme } = useThemeContext();

	// const PlanItemStyles = usePlanItemStyles();

	switch (planType) {
		case PlanType.Cardio:
			return (
				<SvgXml
					xml={ShoeIcon}
					width={50}
					height={50}
				/>
			);
		case PlanType.Lifting:
			return (
				<SvgXml
					xml={BarbellIcon}
					width={40}
					height={40}
				/>
			);
		case PlanType.Nutrition:
			return (
				<SvgXml
					xml={DinnerIcon}
					width={40}
					height={40}
				/>
			);
		case PlanType.NewPlan:
			return (
					<AntDesign
						name='pluscircleo'
						size={40}
						color={theme.textColorPrimary}
					/>
			);
		default:
			return null;
	}
};
