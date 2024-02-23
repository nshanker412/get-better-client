/**
 * TODO:
 * - move stats container to separate internally driven component (reduce prop spam & unnecessary rerenders)
 */

import { useThemeContext } from '@context/theme/useThemeContext';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MasonryFlashList } from '@shopify/flash-list';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useProfileBodyStyles } from './ProfileBody.styles';
import { ProfileBodyProps } from './ProfileBody.types';
import { ConnectedPlanItem } from './plan-list/plan-item/ConnectedPlanItem';
import { ConnectedProfilePosts } from './profile-posts/ConnectedProfilePosts';


const Divider = () => {
	const { theme} = useThemeContext();
	return (
		<View style={{padding: 1}} >
		<View style={{
			width: "100%",
			alignSelf: "center",
			backgroundColor: 'white',
			opacity: 0.2, 
			// height: StyleSheet.hairlineWidth,
			height: 1,
		}} />
		</View>
	);
};
  


const MemoFeed: React.FC<{ isMyProfile: boolean }> = ({ isMyProfile }) => {
	const profileBodyStyles = useProfileBodyStyles();

	return (
		<View style={{ flex: 1, width: "100%", height: "auto" }}>
			<View style={profileBodyStyles.container}>
				<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
					<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
						<View style={profileBodyStyles.scrollInnerContainer}>
							<View style={profileBodyStyles.scrollInnerContainer}>
								<ConnectedProfilePosts isMyProfile={isMyProfile} />
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};




export const ProfileBody: React.FC<ProfileBodyProps> = ({ isMyProfile, username }) => {
	const { theme } = useThemeContext();
	const profileBodyStyles = useProfileBodyStyles();
	const ProfileTab = createMaterialTopTabNavigator();
	const [plans, setPlans] = useState([]);
	const [loadedPlans, setLoadedPlans] = useState(true); //TODO: ERIC REMEMTO TO ADD ANIMATED LOADER
	

	useEffect(() => {
		const foo = async () => {
			console.log(username)
			try {
				await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/fetch/plans/${username}`).then((response) => {
					setPlans(response.data.plans);
					console.log('FETCH PLANS: => ', response?.data);

				});
			} catch (error) {
				console.log("couldnt fetch plans", error);
			}
		}
		foo();	
	}, [username]);


	const PlanItem = (item ) => {
		return (
			<View style={{ flex: 1, width: 300 }}>

				<ConnectedPlanItem planType={item } planTitle="Daily" />

			</View>
		)
	}




	const Plans = () => {

		return (
			<View style={{flex: 1, width: "100%", height: "auto"}}>
			<View style={profileBodyStyles.container}>
				<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
					<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
						<View style={[profileBodyStyles.scrollInnerContainer, {width: 200, minHeight: 500}]}>
								<MasonryFlashList 
									data={plans}
									renderItem={({ item }) => <PlanItem {...item} />}
									keyExtractor={(item) => item.id}

								/>
						</View>
					</View>
				</View>
					</View>
			</View>
			)
	}

	// const Posts = () => {

	// 	return (
	// 		<View style={{flex: 1, width: "100%", height: "auto"}}>
	// 		<View style={profileBodyStyles.container}>
	// 			<View style={[profileBodyStyles.statsCategoryColumn, { flex: 5 }]}>
	// 				<View style={[profileBodyStyles.postsColumn, { flex: 26 }]}>
	// 					<View style={profileBodyStyles.scrollInnerContainer}>
	// 						<ConnectedProfilePosts isMyProfile={isMyProfile} />
	// 					</View>
	// 				</View>
	// 			</View>
	// 				</View>
	// 		</View>
	// 		)
	// }

	const _MemoFeed = () => {
		return (
			<MemoFeed isMyProfile={isMyProfile} />
		)
	}

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
