/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import { useProfileContext } from '@context/profile-context/useProfileContext';
import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlanModel } from 'src/plans/models/plan';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanItem } from './plan-list/plan-item/ConnectedPlanItem';
import { PlanType } from './plan-list/plan-item/PlanItem.types';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';

interface PlanTileType {
	v: "v1" | "v2";
	id: string;
	planType: PlanType;
	title: string;
}

interface PlanTileType {
	id: string;
	planType: PlanType;
	title: string;
}


const Feed: React.FC = () => {
	

	const profileBodyStyles = useProfileBodyStyles();

	return (
		<View style={{ flex: 1, width: "100%", height: "auto" }}>
			<View style={profileBodyStyles.container}>
				<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
					<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
						<View style={profileBodyStyles.scrollInnerContainer}>
							<View style={profileBodyStyles.scrollInnerContainer}>
								<ConnectedProfilePosts   />
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};



const Plans: React.FC = () => {
	const [plaV2, setPlaV2] = useState<PlanTileType[] | []>([]);
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const { onFetchPlans, plans, username, isMyProfile } = useProfileContext();
	const profileBodyStyles = useProfileBodyStyles();
	const navig = useNavigation();

	const onPressTile = (planID: string, planType: PlanType, version: string) => {
		if (planType === PlanType.NewPlan) {
			navig.navigate('createPlan');

		} else if (version === "v2") {
			console.log("v2", planID, username)
			navig.navigate('profilePlanV2', { planID: planID, profileUsername: username });
		} else {
			navig.navigate('profilePlan', { planID: planID, profileUsername: username });
		}
	}

	useEffect(() => {
		if (plans) {
			const planList: PlanTileType[] = plans?.map((plan: PlanModel) => ({
				v: "v2",
				id: plan.id,
				title: plan.planName,
				planType: plan.data.planCategory,
			}));
					
			if (isMyProfile) {
				const newPlan: PlanTileType[] = [{ title: "New Plan", planType: PlanType.NewPlan }];

				// compare the lists and only set state if there are new plans
				if (planList.length === plaV2.length) {
					let isSame = true;
					for (let i = 0; i < planList.length; i++) {
						if (planList[i].id !== plaV2[i].id) {
							isSame = false;
							break;
						}
					}
					if (isSame) {
						return;
					}
				}
				const newArr = [...newPlan, ...planList];
				setPlaV2(newArr);
			} else {
				setPlaV2(planList);
			}
	}
	}, [plans, isMyProfile, refreshing]);

	useEffect(() => {
		onFetchPlans();
	}, []	);
	

	const PlanItem = ({ item }) => {
		console.log(item)
		return (
			<View style={{ flex: 1, width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: 10, padding: 10 }}>
				<TouchableOpacity onPress={() => onPressTile(item?.id, item.planType, item.v)}>
					<LinearGradient colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1]} style={{ borderRadius: 8, width: '100%' }}>
						<View style={{ flex: 1, width: 140, height: 140, borderColor: grayDark.gray9, borderWidth: 0.5, borderRadius: 8, padding: 10, alignItems: "center", justifyContent: "center" }}>
							<ConnectedPlanItem planType={item?.planType} planTitle={item?.title} />
						</View>
			
					</LinearGradient>
				</TouchableOpacity>
			</View>
		)
	}

	const onRefresh = async () => {
		setRefreshing(true);
		await onFetchPlans();
		setRefreshing(false);
	}

	return (
			<View style={{ flex: 1, width: "100%", height: "auto" }}>
				<View style={profileBodyStyles.container}>
					<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
						<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
							<View style={[profileBodyStyles.scrollInnerContainer, { flex: 1, width: Dimensions.get("screen").width, height: 500, minHeight: 500 }]}>
								<FlashList
									estimatedItemSize={100}
									data={plaV2}
									numColumns={2}
									keyExtractor={(item) => `${item.id}`}
									renderItem={PlanItem}
									refreshing={refreshing}
									onRefresh={onRefresh}
									contentContainerStyle={{ paddingBottom: 150 }} // Adds bottom padding
								/>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	};

 const _ProfileBody: React.FC<ProfileBodyProps> = ({ isMyProfile }) => {
	const { theme } = useThemeContext();
	const ProfileTab = createMaterialTopTabNavigator();

	const route = useRoute();
	const linkPostIDParams = useMemo(() => ({ linkPostID: route?.params?.linkPostID }), [route?.params?.linkPostID]);

	return (
		<ProfileTab.Navigator
			screenOptions={{
					tabBarLabelStyle: {
						fontSize: 15,
						fontFamily: theme.fontFamily,
						color: theme.textColorPrimary,
					},
					tabBarIndicatorStyle: {
						backgroundColor: theme.textColorPrimary,
					},
					tabBarStyle: { backgroundColor: 'transparent', width: Dimensions.get('window').width },
			}}
			
		>
			<ProfileTab.Screen
				name='ProfilePostFeed'
				initialParams={linkPostIDParams}
				component={Feed}
					options={{
						tabBarLabel: "Dailys",
					}}
				/>
			<ProfileTab.Screen
					name='GetBetter'
					component={Plans}
					options={{
						tabBarLabel: "Get Better",
					}}
				/>
			</ProfileTab.Navigator>	
	
	);
};


export const ProfileBody = React.memo(_ProfileBody);