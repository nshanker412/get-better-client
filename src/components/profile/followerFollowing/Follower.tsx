import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { TabActions, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useSearchStyles } from './search.styles';

export const Follower = ({ navigation }) => {
	const route = useRoute();

	const profileUsername = route.params?.profileUsername;

	// const navigation = useNavigation();
	const { username: myUsername } = useMyUserInfo();
	const { theme } = useThemeContext();

	const searchStyles = useSearchStyles();

	const [profiles, setProfiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchData = useCallback(
		async (profileUsername: string) => {
			setLoading(true);
			try {
				console.log(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/fetch/all/${profileUsername}/followers`,
				);
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/fetch/all/${profileUsername}/followers`,
				);

				setProfiles(response.data.profiles);
				console.log('profile followers', response.data.profiles);
			} catch (error) {
				console.log('profile followers', error);
			} finally {
				setLoading(false);
			}
		},
		[route.params?.profileUsername],
	);

	useEffect(() => {
		fetchData(route.params?.profileUsername);
	}, [route.params?.profileUsername]);

	const onRefreshCallback = async () => {
		setRefreshing(true);
		await fetchData(route.params?.profileUsername);
		setRefreshing(false);
	};

	const onPressProfile = (username: string) => {
		if (!username) return;
		if (username === myUsername) {
			navigation.dispatch(TabActions.jumpTo('myProfile'));
		}

		navigation.navigate('profile', { profileUsername: username })
		
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
		<View
			style={{
				flex: 1,
				backgroundColor: theme.backgroundColor,
			}}>
			<FlashList
				data={profiles}
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
