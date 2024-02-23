import { NativeEvent } from '@types';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useStatsListStyles } from './StatsList.styles';
import { StatsListProps } from './StatsList.types';

export const StatsList: React.FC<StatsListProps> = ({
	consistency,
	challengesComplete,
	numberOfPlans,
	statsListLength,
}) => {
	const [activeIndex, setActiveIndex] = useState<number>(0);

	const StatsListStyles = useStatsListStyles();

	const handlePageScroll = (e: NativeEvent) => {
		setActiveIndex(e?.nativeEvent?.position ?? 0);
	};

	return (
		<>
			<PagerView
				style={{
					flex: 1,
					alignContent: 'stretch',
					justifyContent: 'center',
				}}
				initialPage={0}
				onPageScroll={handlePageScroll}>
				<View style={StatsListStyles.statContainer}>
					<Text style={StatsListStyles.statsDataPoint}>
						{consistency}%
					</Text>
					<Text style={StatsListStyles.statsDataLabel}>
						Consistency
					</Text>
				</View>
				<View style={StatsListStyles.statContainer}>
					<Text style={StatsListStyles.statsDataPoint}>
						{challengesComplete}
					</Text>
					<Text style={StatsListStyles.statsDataLabel}>
						Challenges Complete
					</Text>
				</View>
				<View style={StatsListStyles.statContainer}>
					<Text style={StatsListStyles.statsDataPoint}>
						{numberOfPlans}
					</Text>
					<Text style={StatsListStyles.statsDataLabel}>Plans</Text>
				</View>
			</PagerView>
		
		</>
	);
};
