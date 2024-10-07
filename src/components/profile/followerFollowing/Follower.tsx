import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useUserFollowContext } from '@context/user-follow/UserFollowProvider';
import { TabActions, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useSearchStyles } from './search.styles';
import axios from 'axios';
import { useAuth } from '@context/auth/useAuth';

export const Follower = () => {
	const {  userToken } = useAuth();

	const navigation = useNavigation();

	const { username: myUsername} = useMyUserInfo();
	const [followerList, setFollowerList] = useState([]);
	const [currentUsername, setCurrentUsername] = useState();
	const { theme } = useThemeContext();
	const searchStyles = useSearchStyles();
	const [refreshing, setRefreshing] = useState(false);

	

	const onRefreshCallback = async () => {		
		setRefreshing(true);
		await onFetchFollowers();
		setRefreshing(false);
	};
	const onFetchFollowers = async () => {
	// Implement the fetch logic her
		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			);
			
			setFollowerList(response.data.followers_list)
			setCurrentUsername(response.data.username)
		} catch (error) {
			console.log('ERROR: onFetchFollowers ', error);
		}
	}	


	const onPressProfile = (username: string) => {
		if (!username) return;
		if (username === myUsername && (currentUsername !== myUsername)) {
			navigation.dispatch(TabActions.jumpTo('myProfile'));
		}

		navigation.dispatch(navigation.navigate('profile', { profileUsername: username }))
		
		
	};

	const renderItem = ({ item }) => (
		
		<TouchableOpacity
			onPressIn={() => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			}}
			onPress={() => {onPressProfile(item.username);onFetchFollowers()}}>
			<View style={searchStyles.profile}>
				<ConnectedProfileAvatar
					username={item.username}
					size={50}
				/>
				<View style={searchStyles.profileInfoContainer}>
					<Text style={searchStyles.name}>{item.name}</Text>
					<Text style={searchStyles.username}>@{item.username}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);

	useEffect(() => {
		// if(!followerList){
		// 	onFetchFollowers()
		// }
		console.log('Follower: profileUsername', followerList);
		console.log('Follower: profileUsername', currentUsername);
	}, [followerList, currentUsername]);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.backgroundColor,
			}}>
			<FlashList
				data={followerList}
				renderItem={renderItem}
				keyExtractor={(item) => item.username}
				estimatedItemSize={100}
				estimatedListSize={{
					height: 600,
					width: 400,
				}}
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
