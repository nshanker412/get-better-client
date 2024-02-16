import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useLeaderboardStyles } from './Leaderboard.styles';
import { ShimmerTile } from './skeleton/ShimmerTile';


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



export const ConnectedLeaderboard: React.FC = ({ navigation }) => {
	const [profiles, setProfiles] = useState([]);
	const [isFriendsFeed, setIsFriendsFeed] = useState(true);
	const [leaderboardMetric, setLeaderboardMetric] = useState('consistency');
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const limit = 100;
	const { theme } = useThemeContext();

	const leaderboardStyles = useLeaderboardStyles();
	const { username: myUsername } = useMyUserInfo();

	const onPressProfile = (username) => {

		console.log('onPressProfile', username);
		navigation.navigate('profile', { profileUsername: username });

	}
	  
	const renderItem = ({ item, index }) => (
		<TouchableOpacity
			onPressIn={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			}}
			onPress={() => onPressProfile(item.username)}>
			<View style={leaderboardStyles.profile}>
				<View style={leaderboardStyles.rankContainer}>
					<Text style={leaderboardStyles.rankText}>{index + 1}.</Text>
				</View>
				<View style={leaderboardStyles.profileContainer}>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<ConnectedProfileAvatar username={item.username} size={50} />
		
					</View>
					<View style={leaderboardStyles.profileInfoContainer}>
						<Text style={leaderboardStyles.name}>{item.name}</Text>
						<Text style={leaderboardStyles.username}>@{item.username}</Text>
					</View>
				</View>
				<View style={leaderboardStyles.metricContainer}>
					<Text style={leaderboardStyles.metricText}>
						{item.consistency ? `${item.consistency}%` : item.challengesComplete}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
	  

	const onRefreshCallback = () => {
		setRefreshing(true);
		setLoading(true);

		if (myUsername) {
			axios
				.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/leaderboard/${leaderboardMetric}`,
					{
						username: myUsername, // get this
						feedType: isFriendsFeed ? 'friends' : 'public',
						limit: limit,
					},
				)
				.then((response) => {
					console.log(
						'fetchLeaderboardConsistency',
						response.data.leaderboard.length,
					);
					setProfiles(response.data.leaderboard);
					setLoading(false);
					setRefreshing(false);
				})
				.catch((error) => {
					console.log('fetchLeaderboardConsistencyError', error);
					Toast.show({
						type: 'error',
						text1: 'Hmmm...',
						text2: 'Something went wrong. Please try again.',
						topOffset: 150,
					
					})
				}).finally(() => {
					setRefreshing(false);
				})
		}
	}

	useEffect(() => {
		setProfiles([]);
		setLoading(true);
		
		if (myUsername) {
			axios
				.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/leaderboard/${leaderboardMetric}`,
					{
						username: myUsername, // get this
						feedType: isFriendsFeed ? 'friends' : 'public',
						limit: limit,
					},
				)
				.then((response) => {
					console.log(
						'fetchLeaderboardConsistency',
						response.data.leaderboard.length,
					);
					setProfiles(response.data.leaderboard);
					setLoading(false);
				})
				.catch((error) => {
					console.log('fetchLeaderboardConsistencyError', error);
				});
		}
	}, [myUsername, isFriendsFeed, leaderboardMetric]);


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
										Motivating
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
										Public
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
							onValueChange={(value) => setLeaderboardMetric(value)}
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
						renderItem={renderItem}
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
