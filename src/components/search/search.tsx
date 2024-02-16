import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { TabActions, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { SearchBar } from './search-bar/SearchBar';
import { useSearchStyles } from './search.styles';

export const Search: React.FC = () => {
	const navigation = useNavigation();
	const { theme } = useThemeContext();
	const searchStyles = useSearchStyles();
	const { username: myUsername } = useMyUserInfo();

	const [profiles, setProfiles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		fetchData('');
	}, []);

	const fetchData = async (keyword: string) => {
		setLoading(true);
		try {
			let url = '';

			if (keyword) {
				// URL for filtered user search
				url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/fetch/${keyword}`;
			} else {
				// URL for unfiltered user search
				url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/users/fetch/all`;
			}

			console.log('url', url);
			const response = await axios.get(url);
			setProfiles(response.data.profiles);
		} catch (error) {
			console.log('searchError', error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const onKeywordChange = useCallback(
		async (text: string | undefined) => {
			console.log(text);
			if (!text) {
				return;
			}
			return fetchData(text.trim());
		},
		[fetchData],
	);

	const onRefreshCallback = () => {
		setRefreshing(true);
		fetchData('');
	};

	const onPressProfile = (username: string) => {
		if (!username) return;
		if (username === myUsername) {
			navigation.dispatch(TabActions.jumpTo('profileTab'));
		}

		console.log('onPressProfile', username);
		navigation.dispatch(
			navigation.navigate('profile', {
				profileUsername: username,
			}),
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
					key={item.username}
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
		console.log(profiles);
	}, [profiles]);

	return (
		<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<View style={{ flex: 1 }}>
				<Header />
			</View>

			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'flex-end',
					paddingLeft: 30,
					paddingRight: 25,
					paddingBottom: 10,
					paddingTop: 20,
				}}>
				<SearchBar onSearchChange={onKeywordChange} />
			</View>
			<View style={{ flex: 10 }}>
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
		</View>
	);
};
