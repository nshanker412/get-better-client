import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useUserFollowContext } from '@context/user-follow/UserFollowProvider';
import { TabActions, useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useSearchStyles } from './search.styles';




export const Following = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { username: myUsername } = useMyUserInfo();
	const { theme } = useThemeContext();

	const { following: flist, onFetchFollowing} = useUserFollowContext();

	const profileUsername = route.params?.profileUsername;
	const followers = route.params?.followers;
	const following = route.params?.following;

	const searchStyles = useSearchStyles();
	const [refreshing, setRefreshing] = useState(false);



	const onRefreshCallback = async () => {
		setRefreshing(true);
		await onFetchFollowing();
		setRefreshing(false);
	};

	const onPressProfile = (username: string) => {
		if (!username) return;
		if (username === myUsername && !(profileUsername === myUsername)) {
			navigation.dispatch(
				TabActions.jumpTo('myProfile', { name: 'MyProfile' }),
			);
		}

		console.log('onPressProfile', username);
		navigation.dispatch(
			navigation.navigate('profile', { profileUsername: username }),
		);
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

	return (
		<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<FlashList
				data={flist ??[]}
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