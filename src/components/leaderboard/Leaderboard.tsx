import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { Header } from '../header/Header';
import { useLeaderboardStyles } from './Leaderboard.styles';
import { LeaderboardProfileCell } from './LeaderboardProfileCell';
import {
    LeaderboardChallengesApiModel, LeaderboardConsistencyApiModel, LeaderboardProfile, LeaderboardProfileChallenges, LeaderboardProfileConsistency
} from './models/LeaderboardProfile';
import {
    LeaderboardProfileType
} from './models/LeaderboardProfile.type';
import { ShimmerTile } from './skeleton/ShimmerTile';
import { mapChallengesApiResponse } from './utils/mapChallengesApiResponse';
import { mapConsistencyApiResponse } from './utils/mapConsistencyApiResponse';
import { useAuth } from '@context/auth/useAuth';
const LBPlaceholder = () => {
	return (
		<View style={{ flex: 1 }}>
			<ShimmerTile opacity={0.5} />
			<ShimmerTile opacity={0.4} />
			<ShimmerTile opacity={0.3} />
			<ShimmerTile opacity={0.2} />
			<ShimmerTile opacity={0.1} />
		</View>
	);
}

export const Leaderboard: React.FC = ({ navigation }) => {
	const [profiles, setProfiles] = useState<LeaderboardProfile[]>([]);
	const [isFriendsFeed, setIsFriendsFeed] = useState(true);
	const [leaderboardMetric, setLeaderboardMetric] = useState('consistency');
	const [leaderboardType, setLeaderboardType] = useState<LeaderboardProfileType>(LeaderboardProfileType.CONSISTENCY);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const limit = 100;
	const { theme } = useThemeContext();
	const leaderboardStyles = useLeaderboardStyles();
	const { username: myUsername } = useMyUserInfo();
	const { userToken } = useAuth();


	const fetchLeaderboardConsistency = async (): Promise<LeaderboardProfileConsistency[]> => {
		try {
			const response = await axios.post<LeaderboardConsistencyApiModel[]>(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/profile/leaderboard_consistency`, {
				username: myUsername,
				feedType: isFriendsFeed ? 'friends' : 'public',
				limit: limit,
			},{headers: {"Authorization" : `Bearer ${userToken}`}}
		);
		
			// Use the updated mapApiResponse function to filter and map the response data
			return mapConsistencyApiResponse(response.data?.leaderboard);
		} catch (error) {
			console.log('error', error);	

			console.log('Failed to fetch leaderboard consistency');
		} 
	}

	


	const fetchLeaderboardChallenges =    async ():  Promise<LeaderboardProfileChallenges[]> =>  {

		try {
			const response = await axios.post<LeaderboardChallengesApiModel[]>(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/profile/leaderboard_challenges`, {
				username: myUsername,
				feedType: isFriendsFeed ? 'friends' : 'public',
				limit: limit,
			},{headers: {"Authorization" : `Bearer ${userToken}`}}
			);
		
			return mapChallengesApiResponse(response.data?.leaderboard);
		} catch (error) {
			console.log('error', error);	
			setProfiles([]);

			console.log('Failed to fetch leaderboard challenges');
		} finally
		{
			setRefreshing(false);
			setLoading(false);
		}
		
	}


	const onFetchLeaderboard = async () => {
		if (refreshing) return;

		setLoading(true);

		try {
			const data = leaderboardType === LeaderboardProfileType.CONSISTENCY ? await fetchLeaderboardConsistency() : await fetchLeaderboardChallenges();
			setProfiles(data);
		} catch (error) {
			setProfiles([]);
			console.log(`Failed to fetch leaderboard metric: ${leaderboardMetric}`);
			
		
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}



	const onRefreshCallback = async () => {
		if(loading) return;
		setRefreshing(true);
		await onFetchLeaderboard();
		setRefreshing(false);
	}

	const onChangeLeaderboardMetric = (value: string) => {
		setLeaderboardMetric(value);
		setLeaderboardType(value === 'consistency' ? LeaderboardProfileType.CONSISTENCY : LeaderboardProfileType.CHALLENGES);
	}


	useEffect(() => {	
		if (refreshing) return;
		setProfiles([]);
		onFetchLeaderboard();
	}, [leaderboardMetric, isFriendsFeed]);


	return (
		<View style={{ flex: 1 }}>
			<Header />
			<View style={leaderboardStyles.leaderboardContainer}>
				<View
					style={{
						display: 'flex',
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
						padding: 15,
					}}
				>
					<Text style={leaderboardStyles.leaderboardTitleText}>
						LeaderBoard
					</Text>
				</View>
				<View
					style={{
						padding: 20,
						display: 'flex',
						width: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<View style={leaderboardStyles.feedTypeContainer}>
						<View style={{ flex: 1 }}>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
									setIsFriendsFeed(true);
								}}
							>
								<View
									style={
										isFriendsFeed
											? leaderboardStyles.activeFeedToggleContainer
											: leaderboardStyles.inactiveFeedToggleContainer
									}
								>
									<Text
										style={
											isFriendsFeed
												? leaderboardStyles.feedTypeTextSelected
												: leaderboardStyles.feedTypeText
										}
									>
										Public
									</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 1, width: "100%" }}>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
									setIsFriendsFeed(false);
								}}
							>
								<View
									style={
										isFriendsFeed
											? leaderboardStyles.inactiveFeedToggleContainer
											: leaderboardStyles.activeFeedToggleContainer
									}
								>
									<Text
										style={
											isFriendsFeed
												? leaderboardStyles.feedTypeText
												: leaderboardStyles.feedTypeTextSelected
										}
									>
										Motivating
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={leaderboardStyles.scrollHeader}>
					<View style={leaderboardStyles.rankHeaderContainer}>
						<Text style={leaderboardStyles.headerText}>
							Rank
						</Text>
					</View>
					<View style={leaderboardStyles.metricHeaderContainer}>
						<RNPickerSelect
							onValueChange={onChangeLeaderboardMetric}
							items={[
								{ label: 'Consistency', value: 'consistency' },
								{ label: 'Challenges Complete', value: 'challenges' },
							]}
							value={leaderboardMetric}
							placeholder={{}}
						>
							<View style={leaderboardStyles.metricSelect}>
								<Text style={leaderboardStyles.headerText}>
									{leaderboardMetric.charAt(0).toUpperCase() + leaderboardMetric.slice(1)}
								</Text>
								<Image
									style={leaderboardStyles.dropdownIcon}
									source={require('../../img/dropdown.png')}
								/>
							</View>
						</RNPickerSelect>
					</View>
				</View>
				<View style={{ flex: 1, width: "100%", height: 200 }}>
					<FlashList
						data={profiles}
						ListEmptyComponent={
								<LBPlaceholder/>
						}

						renderItem={({ item, index }) => (
					
							<LeaderboardProfileCell   item={item} index={index} />
						)}
						estimatedItemSize={100}
						keyExtractor={(item) => item.username}
						refreshing={refreshing}
						onRefresh={onRefreshCallback}
						estimatedListSize={{ height: 600, width: 400 }}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefreshCallback}
								colors={[theme.textColorPrimary]}
								tintColor={theme.textColorPrimary}
							/>
						}
					/>
				</View>
			</View>
		</View>
	);
};
