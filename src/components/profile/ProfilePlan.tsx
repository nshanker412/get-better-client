import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { LoadingSpinner } from '@components/loading-spinner/LoadingSpinner';
import { useThemeContext } from '@context/theme/useThemeContext';
import { EvilIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useProfilePlanStyles } from './ProfilePlan.styles';

export const  ProfilePlan: React.FC = () => {
	const route = useRoute();
	const profileUsername = route.params.profileUsername;
	const planID = route.params.planID;
	const { theme } = useThemeContext();
	const navigate = useNavigation();
	const [planData, setPlanData] = useState({});
	const [loading, setLoading] = useState(true);

	console.log(profileUsername, planID);

	useEffect(() => {
		console.log('fetchPlan', profileUsername, planID, planData);
	}, [profileUsername, planID, planData]);

	const profilePlanStyles = useProfilePlanStyles();

	useEffect(() => {
		setLoading(true);
		axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plans/fetch/${profileUsername}/${planID}/400/400`,
			)
			.then((response) => {
				console.log('fetchPlan', profileUsername, planID);
				setPlanData(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.log('fetchPlanError', error);
			});
	}, []);
	return (
		<SafeAreaView
			style={{
				flex: 1,
				alignItems: 'stretch',
				justifyContent: 'center',
			}}>
			{loading ? (
				<LoadingSpinner />
			) : (
				<View style={{ flex: 1, gap: 10 }}>
					<TouchableOpacity
						style={profilePlanStyles.backArrowContainer}
						onPress={() => navigate.goBack()}>
						<EvilIcons
							name='chevron-left'
							size={50}
							color='white'
						/>
					</TouchableOpacity>

					<View style={{ flex: 1, justifyContent: 'center' }}>
						<Text style={profilePlanStyles.planTitle}>
							{planData.title}
						</Text>
						<Text style={profilePlanStyles.planDescription}>
							{planData.description}
						</Text>
					</View>
					<View
						style={{
							flex: 6,
							alignSelf: 'center',
							width: '90%',
							borderRadius: 10,
						}}>
						<Image
							style={{
								borderRadius: 10,
								width: '100%',
								height: '100%',
							}}
							contentFit='contain'
							allowDownscaling={false}
							source={{
								uri: `data:image/jpeg;base64,${planData.image}`,
							}}
						/>
					</View>
					<View
						style={{
							flex: 3,
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
						}}>
						{planData.planType !== 'Nutrition' && (
							<View
								style={{
									flex: 1,
									flexDirection: 'row',
									alignItems: 'flex-start',
									justifyContent: 'center',
									width: '100%',
									height: 'auto',
									display: 'flex',
								}}>
								<View
									style={[
										profilePlanStyles.planDataContainer,
										{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
											padding: 20,
											height: 'auto',
											width: '80%',
											display: 'flex',
											borderRadius: 6,
										},
									]}>
									<Text style={profilePlanStyles.dataText}>
										{planData.data2}
									</Text>
									{planData.planType === 'Lifting' ? (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											x
										</Text>
									) : (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											:
										</Text>
									)}
									<Text style={profilePlanStyles.dataText}>
										{planData.data3}
									</Text>
									{planData.planType === 'Lifting' ? (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											{' '}
											at{' '}
										</Text>
									) : (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											{' '}
											for{' '}
										</Text>
									)}
									<Text style={profilePlanStyles.dataText}>
										{planData.data1}
									</Text>
									{planData.planType === 'Lifting' ? (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											{' '}
											lbs{' '}
										</Text>
									) : (
										<Text
											style={
												profilePlanStyles.helperText
											}>
											{' '}
											miles{' '}
										</Text>
									)}
								</View>
							</View>
						)}
					</View>
				</View>
			)}
		</SafeAreaView>
	);
}
