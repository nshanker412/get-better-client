import { Link } from '@react-navigation/native';
import { NativeEvent } from '@types';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { usePlanListStyles } from './PlanList.styles';
import { PlanListProps } from './PlanList.types';
import { ConnectedPlanItem } from './plan-item/ConnectedPlanItem';
import { PlanType } from './plan-item/PlanItem.types';

export const PlanList: React.FC<PlanListProps> = ({
	isMyProfile,
	plans,
	username,
	numberOfPlans,
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const PlanListStyles = usePlanListStyles();
	const planListRef = useRef<React.ReactNode[]>([]);

	const handlePageScroll = (e: NativeEvent) => {
		setActiveIndex(e?.nativeEvent?.position ?? 0);
	};

	planListRef.current = plans?.length
		? plans.map((item, index) => (
				<View
					key={index}
					style={{
						flex: 1,
						alignContent: 'center',
						alignItems: 'center',
					}}>
					<Link
						to={{
							screen: 'profilePlan',
							params: {
								profileUsername: username,
								planID: item.timestamp,
							},
						}}
						style={PlanListStyles.statContainer}
						key={index}>
						<View style={PlanListStyles.planContainerInner}>
							<ConnectedPlanItem
								planType={item?.planType}
								planTitle={item?.title}
							/>
						</View>
					</Link>
				</View>
		  ))
		: [];

	if (isMyProfile) {
		planListRef.current.push(
			<View
				key={`${numberOfPlans + 1}`}
				style={{
					flex: 1,
					alignContent: 'center',
					alignItems: 'center',
				}}>
				<Link
					to={{
						screen: 'createPlan',
						params: { profileUsername: username },
					}}
					style={PlanListStyles.statContainer}>
					<View style={PlanListStyles.planContainerInner}>
						<ConnectedPlanItem
							planType={PlanType.NewPlan}
							planTitle={'New Plan'}
						/>
					</View>
				</Link>
			</View>,
		);
	}
	if (planListRef.current.length === 0) {
		return null;
	}

	return (
			<PagerView
				style={{
					flex: 1,
					alignContent: 'center',
					justifyContent: 'center',
				}}
				initialPage={0}
				onPageScroll={handlePageScroll}>
				{planListRef.current}
			</PagerView>

	);
};
