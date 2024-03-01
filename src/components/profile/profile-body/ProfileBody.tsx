/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlanModel } from 'src/plans/models/plan';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanItem } from './plan-list/plan-item/ConnectedPlanItem';
import { PlanType } from './plan-list/plan-item/PlanItem.types';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';

interface PlanTileType {
	planType: PlanType;
	title: string;
}



 
  

const MemoFeed: React.FC<{ isMyProfile: boolean }> = ({ isMyProfile }) => {
	const profileBodyStyles = useProfileBodyStyles();

	return (
		<View style={{ flex: 1, width: "100%", height: "auto" }}>
			<View style={profileBodyStyles.container}>
				<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
					<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
						<View style={profileBodyStyles.scrollInnerContainer}>
							<View style={profileBodyStyles.scrollInnerContainer}>
								<ConnectedProfilePosts isMyProfile={isMyProfile}  />
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};




export const _ProfileBody: React.FC<ProfileBodyProps> = ({ isMyProfile, username }) => {
	const { theme } = useThemeContext();
	const profileBodyStyles = useProfileBodyStyles();
	const ProfileTab = createMaterialTopTabNavigator();
	const [pla, setPla] = useState<PlanTileType[] | []>([]);
	const [plaV2, setPlaV2] = useState<PlanTileType[] | []>([]);
	const [loadedPlans, setLoadedPlans] = useState(true); //TODO: ERIC REMEMTO TO ADD ANIMATED LOADER

	const navig = useNavigation();

	useEffect(() => {
		const fetchV2 = async () => {
			console.log(username)
			try {
				const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/plans/fetch/${username}`);
					const  planList: PlanTileType[] = response.data?.plans?.map((plan: PlanModel) => ({
						id: plan.id,
						title: plan.planName,
						planType: plan.data.planCategory,
					}));			
					
					if (isMyProfile) {
						const newPlan: PlanTileType[] = [{ title: "New Plan", planType: PlanType.NewPlan }];
						const newArr = [...newPlan, ...planList];

						setPlaV2(newArr);

					} else {
						setPlaV2(planList);
					}
			} catch (error) {
				console.log("couldnt fetch v2 plans", error);
			}
		}
		fetchV2();	
	}, [username, isMyProfile]);





	
	useEffect(() => {
		const foo = async () => {
			console.log(username)
			try {
				const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plans/fetch/${username}`);
					const  planList: PlanTileType[] = response.data?.plans?.map((plan: PlanTileType) => ({
						id: `${plan?.timestamp}`,
						title: plan?.title,
						planType: plan?.planType,
					}));
				
					
					if (isMyProfile) {
						const newPlan: PlanTileType[] = [{ title: "New Plan", planType: PlanType.NewPlan }];
						const newArr = [...newPlan, ...planList];

						setPla(newArr);

					} else {
						setPla(planList);
					}
			} catch (error) {
				console.log("couldnt fetch plans", error);
			}
		}
		foo();	
	}, [username, isMyProfile]);

	const onPressTile =  (planID: string, planType: PlanType) => {
		console.log(planID, planType);
		if (planType === PlanType.NewPlan) {
			navig.navigate('createPlan');
		} else {
			navig.navigate('profilePlan', { planID: planID, profileUsername: username });
		
		}
	}

	const PlanItem = ({ item  }) => {
		console.log(item)
		return (
			<View style={{ flex: 1, width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: 10, padding: 10 }}>
			<TouchableOpacity	onPress={() => onPressTile(item?.id, item.planType)}>
				<View style={{ flex: 1, width: 130, height: 130, borderColor: grayDark.gray9, borderWidth: 1, borderRadius: 5, padding: 10, backgroundColor: grayDark.gray5, alignItems: "center", justifyContent: "center" }}>
				<ConnectedPlanItem planType={item?.planType } planTitle={item?.title} />
					</View>
					</TouchableOpacity>
				</View>
		)
	}

	const Plans = () => {

		return (
			<View style={{flex: 1, width: "100%", height: "auto"}}>
			<View style={profileBodyStyles.container}>
				<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
					<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
						<View style={[profileBodyStyles.scrollInnerContainer, {flex: 1, width: Dimensions.get("screen").width, height: 500, minHeight: 500}]}>
								<FlashList 
									estimatedItemSize={100}
									data={plaV2}
									numColumns={2}
									keyExtractor={(item) => `${item.id}`}
									renderItem={PlanItem}

								/>
						</View>
					</View>
				</View>
					</View>
			</View>
			)
	}


	const _MemoFeed = React.memo(() => {
		return (
			<MemoFeed isMyProfile={isMyProfile}  />
		)
	});
	


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
					}}>
				<ProfileTab.Screen
					name='ProfilePostFeed'
					component={_MemoFeed}
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