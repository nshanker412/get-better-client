import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import axios from 'axios';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { LoadingSpinner } from '../../../loading-spinner/LoadingSpinner';
import { ProfilePosts } from './ProfilePosts';
import { useProfilePostsStyles } from './ProfilePosts.styles';
import { ConnectedProfilePostsProps } from './ProfilePosts.types';



/**
 * Connected ProfilePosts Component
 * Details:
 */
export const ConnectedProfilePosts: React.FC<ConnectedProfilePostsProps> = ({
	isMyProfile,
}) => (isMyProfile ? <MyProfilePosts /> : <OtherProfilePosts />);

const MyProfilePosts: React.FC = () => {
	const { username: myUsername } = useMyUserInfo();
	const ProfilePostsStyles = useProfilePostsStyles();
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState([]);

	const [refreshing, setRefreshing] = useState(false);
	const { theme } = useThemeContext();

	

	const handleScroll = (event: any) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
		const index = Math.round(yOffset / 200);
		setCurrentScrollIndex(index);
	};

	// TODO: API call should not timeout if the user has no posts
	// fetch all user's posts metadata
	const fetchUserPosts = async () => {
		setLoadedPosts(false);
		setPosts([]);
		 await axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${myUsername}`,
			)
			.then((response) => {
				console.log('FETCH POSTS: => ', response?.data);
				setPosts(response?.data.posts);
				// setPostPreviews(response?.data?.posts.map(() => true));
			})
			.catch((error) => {
				console.log('fetchMyposts', error);
				setIsError(true);
			})
			.finally(() => {
				setLoadedPosts(true);
			});
	}


	const onRefreshFeed = async () => {
		setRefreshing(true);
		await fetchUserPosts();
		setRefreshing(false);
	}


	useEffect(() => {
		fetchUserPosts();
	}, [myUsername]);

	return (
		<ScrollView
			contentContainerStyle={ProfilePostsStyles.profileFeedContainer}
			onScroll={handleScroll}
			refreshControl={
				<RefreshControl
				size={10}
					refreshing={refreshing}
					onRefresh={onRefreshFeed}
					colors={[theme.textColorPrimary]}
					tintColor={theme.textColorPrimary}
				/>
			}
			scrollEventThrottle={3000}>

			<>
				{posts?.length > 0 ? (
					<ProfilePosts
						posts={posts}
						currentScrollIndex={currentScrollIndex}
						isError={isError}
						isMyProfile={true}
						fetchUserPosts={onRefreshFeed}
					/>
				) : loadedPosts ? (
					// No posts, show a message
					<Link
						style={{ flex: 1 }}
						to={{
							screen: 'post',
							params: { profileUsername: myUsername },
						}}>
						<TouchableOpacity
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
							}}
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Medium,
								);
							}}>
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									justifyContent: 'center',
									height: 400,
									width: 400,
									gap: 10,
								}}>
								<AntDesign
									name='pluscircleo'
									size={50}
									color={theme.textColorPrimary}
								/>
								<Text style={ProfilePostsStyles.noPostsText}>
									Add your first post!
								</Text>
							</View>
						</TouchableOpacity>
					</Link>
				) : (
					// Loading spinner while posts are being fetched
					<View style={ProfilePostsStyles.imageContainer}>
						<LoadingSpinner />
					</View>
				)}
				<View style={ProfilePostsStyles.imageScrollBuffer}></View>
			</>
		</ScrollView>
	);
};

const OtherProfilePosts: React.FC = () => {
	const { username: profileUsername } = useOtherUserInfo();
	const ProfilePostsStyles = useProfilePostsStyles();
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState([]);
	const [postPreviews, setPostPreviews] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const { theme } = useThemeContext();

	const handleScroll = (event: any) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
		const index = Math.round(yOffset / 200);
		setCurrentScrollIndex(index);
	};

	// TODO: API call should not timeout if the user has no posts
	// fetch all user's posts metadata
	const fetchUserPosts = async () => {
		setLoadedPosts(false);
		axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${profileUsername}`,
			)
			.then((response) => {
				setPosts(response?.data.posts);
				setPostPreviews(response?.data?.posts.map(() => true));
			})
			.catch((error) => {
				console.log('fetchFriendsPostsError', error);
				setIsError(true);
			})
			.finally(() => {
				setLoadedPosts(true);
			});
	};

	useEffect(() => {
		fetchUserPosts();
	}, [profileUsername]);


	const onRefreshFeed = async () => {
		setRefreshing(true);
		await fetchUserPosts();
		setRefreshing(false);
	}



	return (
		<ScrollView
			contentContainerStyle={ProfilePostsStyles.profileFeedContainer}
			onScroll={handleScroll}
			refreshControl={
				<RefreshControl
					size={10}
					refreshing={refreshing}
					onRefresh={onRefreshFeed}
					colors={[theme.textColorPrimary, theme.textColorSecondary]}
					tintColor={theme.textColorPrimary}
				/>
			}
			scrollEventThrottle={3000}>
			<>
				{posts?.length > 0 ? (
					<ProfilePosts
						posts={posts}
						currentScrollIndex={currentScrollIndex}
						isError={isError}
						isMyProfile={false}
						fetchUserPosts={fetchUserPosts}
						onOpenDeletePostModal={null}
					/>
				) : loadedPosts ? (
					// No posts, show a message

					<View style={ProfilePostsStyles.noPostsContainer}>
						<Text style={ProfilePostsStyles.noPostsText}>
							User has no posts
						</Text>
					</View>
				) : (
					// Loading spinner while posts are being fetched
					<View style={ProfilePostsStyles.imageContainer}>
						<LoadingSpinner />
					</View>
				)}
				<View style={ProfilePostsStyles.imageScrollBuffer}></View>
			</>
		</ScrollView>
	);
};
