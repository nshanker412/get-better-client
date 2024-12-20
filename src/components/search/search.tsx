import { useThemeContext } from '@context/theme/useThemeContext';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View, ViewabilityConfig } from 'react-native';
import { Header } from '../header/Header';
import { SearchItemCell } from './SearchItemCell';
import { SearchUser } from './models/SearchUser';
import { SearchBar } from './search-bar/SearchBar';
import { ShimmerTile } from './skeleton/ShimmerTile';
import {useAuth} from "@context/auth/useAuth";



const SearchLoadingShimmer = () => {
	return (
		<View style={{ flex: 1 }}>
			<ShimmerTile opacity={0.6} />
			<ShimmerTile opacity={0.5} />
			<ShimmerTile opacity={0.4} />
			<ShimmerTile opacity={0.3} />
			<ShimmerTile opacity={0.2} />
			<ShimmerTile opacity={0.1} />
		</View>
	);
}

interface SearchProps {
	instance?: React.RefObject<FlashList<SearchUser>>;
	CellRendererComponent?: React.ComponentType<any>;
}

export const Search: React.FC = () => {
	const { theme } = useThemeContext();
	const {userToken} =useAuth();
 	const [profiles, setProfiles] = useState<SearchUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [keyword, setKeyword] = useState('');

	const viewabilityConfig = useRef<ViewabilityConfig>({
		waitForInteraction: true,
		itemVisiblePercentThreshold: 50,
		minimumViewTime: 1000,
	  }).current;


	// placeholder when no data is available
	const SearchNotFound = () => {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ color: theme.textColorSecondary }}>No users found</Text>
			</View>
		);
	}

	useEffect(() => {	
		fetchData('');
	}, []);


	// useEffect(() => {
	// 	const timer = setTimeout(() => {
	// 		fetchData('');
	// 	}, 1000);


	// 	// make a 1000 ms delay to show the shimmer effect
	// 	return () => clearTimeout(timer);
	// }, []);

	const Divider = () => {
		return (
			<View style={{
				width: "80%",
				alignSelf: "center",
				backgroundColor: theme.div.color,
				opacity: theme.div.opacity,
				height: StyleSheet.hairlineWidth,
			}} />
		);
	  };

	const fetchData = async (keyword: string | null) => {
		setLoading(true);
		try {
			let url = '';

			if (keyword) {
				url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${keyword}`;
			} else {
				url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users`;
			}

			const response = await axios.get(url,{ headers: {"Authorization" : `Bearer ${userToken}`}});
			setProfiles(response.data.results);
		} catch (error) {
			console.log('searchError', error);
			console.log('Error fetching profiles');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const onKeywordChange = useCallback(
		async (text: string | undefined) => {
			setKeyword(text ?? '');
			if (!text) {
				fetchData();
			}
			return fetchData(text.trim());
		},
		[fetchData],
	);

	const onRefreshCallback = useCallback(() => {
		setRefreshing(true);
		if (keyword!==''){
			fetchData();
		}
		else{
			fetchData(keyword);
		}
		
	}, [fetchData, keyword]);


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
					// paddingLeft: 30,
					// paddingRight: 25,
					// paddingBottom: 10,
					paddingTop: 40
				}}>
				<SearchBar onSearchChange={onKeywordChange} />
			</View>
			<View style={{ flex: 10, 
				// paddingLeft: 30,
				// paddingRight: 25,
				paddingBottom: 80,
			}}>
				<FlashList
					testID='search-flashlist'
					data={profiles}
					disableAutoLayout={true}
					renderItem={({ item }) => (
						<SearchItemCell
							user={item}
						/>
					)}
					ListEmptyComponent={keyword === '' ? SearchLoadingShimmer : SearchNotFound}
					keyExtractor={(item) => {
						return item.username;
					  }}
					estimatedItemSize={100}
					estimatedListSize={{
						height: 600,
						width: 400,
					}}
					viewabilityConfig={viewabilityConfig}
					ItemSeparatorComponent={Divider}
					refreshing={refreshing}
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



  
