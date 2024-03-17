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


export const Follower = () => {

	const navigation = useNavigation();

	const { username: myUsername } = useMyUserInfo();
	const { username: currentUsername, followers: followerList, onFetchFollowers} = useUserFollowContext();
	const { theme } = useThemeContext();
	const searchStyles = useSearchStyles();
	const [refreshing, setRefreshing] = useState(false);

	


	const onRefreshCallback = async () => {
		setRefreshing(true);
		await onFetchFollowers();
		setRefreshing(false);
	};

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
			onPress={() => onPressProfile(item.username)}>
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
