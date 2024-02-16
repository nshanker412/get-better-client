import { StackNavigationProp } from '@react-navigation/stack';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useLeaderboardStyles } from './Leaderboard.styles';

type Profile = {
  username: string;
  name: string;
  consistency?: number;
  challengesComplete?: number;
};

type LeaderboardProps = {
  navigation: StackNavigationProp<any, any>;
};

export const ConnectedLeaderboard: React.FC<LeaderboardProps> = ({ navigation }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isFriendsFeed, setIsFriendsFeed] = useState<boolean>(true);
  const [leaderboardMetric, setLeaderboardMetric] = useState<string>('consistency');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme } = useThemeContext();
  const leaderboardStyles = useLeaderboardStyles();
  const { username: myUsername } = useMyUserInfo();

  const onPressProfile = (username: string): void => {
    navigation.navigate('profile', { profileUsername: username });
  };

	  
	  const renderItem = ({ item, index }: {item: any, index: number}) => (
		<TouchableOpacity
			onPressIn={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

			}	}
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
	  

	  const onRefreshCallback = async (): Promise<void> => {
		setRefreshing(true);
		if (myUsername) {
		  try {
			const response = await axios.post(
			  `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/leaderboard/${leaderboardMetric}`, {
				username: myUsername,
				feedType: isFriendsFeed ? 'friends' : 'public',
				limit: 100,
			  },
			);
			setProfiles(response.data.leaderboard);
		  } catch (error) {
			Toast.show({
			  type: 'error',
			  text1: 'Hmmm...',
			  text2: 'Something went wrong. Please try again.',
			  topOffset: 150,
			});
		  } finally {
			setLoading(false);
			setRefreshing(false);
		  }
		}
	  };


	  useEffect(() => {
		onRefreshCallback();
	  }, [myUsername, isFriendsFeed, leaderboardMetric]);
	
	  return (
		<View style={{ flex: 1 }}>
		  <Header />
		  <View style={leaderboardStyles.leaderboardContainer}>
  <Text style={leaderboardStyles.leaderboardTitle}>Leaderboard</Text>
  <View style={leaderboardStyles.feedTypeSwitch}>
    <TouchableOpacity
      onPress={() => setIsFriendsFeed(true)}
      style={isFriendsFeed ? leaderboardStyles.activeFeedType : leaderboardStyles.inactiveFeedType}
    >
      <Text style={leaderboardStyles.feedTypeText}>Motivating</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setIsFriendsFeed(false)}
      style={!isFriendsFeed ? leaderboardStyles.activeFeedType : leaderboardStyles.inactiveFeedType}
    >
      <Text style={leaderboardStyles.feedTypeText}>Public</Text>
    </TouchableOpacity>
  </View>
  <RNPickerSelect
    onValueChange={setLeaderboardMetric}
    items={[
      { label: 'Consistency', value: 'consistency' },
      { label: 'Challenges Complete', value: 'challenges' },
    ]}
    value={leaderboardMetric}
    style={{
      inputIOS: leaderboardStyles.pickerSelectStyles,
      inputAndroid: leaderboardStyles.pickerSelectStyles,
    }}
  />
  <FlashList
    data={profiles}
    renderItem={renderItem}
    keyExtractor={(item) => item.username}
    estimatedItemSize={100}
    refreshing={refreshing}
    onRefresh={onRefreshCallback}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefreshCallback}
        colors={[theme.textColorPrimary]}
        tintColor={theme.textColorPrimary}
      />
    }
  />
</View>		  <FlashList
			data={profiles}
			renderItem={renderItem}
			keyExtractor={(item) => item.username}
			refreshing={refreshing}
			onRefresh={onRefreshCallback}
			estimatedItemSize={100}
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
	  );
	};