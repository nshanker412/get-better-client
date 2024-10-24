import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import axios from 'axios';
import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

import React, { useEffect, useState } from 'react';
import { Text, RefreshControl,View,Pressable, StyleSheet,SafeAreaView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useAuth } from '@context/auth/useAuth';
import { ShimmerTile } from '../notifications/skeleton/ShimmerTile';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';

const BIO_MAX_LENGTH = 160;

export const BlockedUsers: React.FC = () =>  {
	const { username: myUsername,  } = useMyUserInfo();
	const { theme } = useThemeContext();

	const [loading, setLoading] = useState(true);
	const [profileData, setProfileData] = useState(Object);
	const {userToken} =useAuth();
	const [refreshing, setRefreshing] = React.useState(false);



	const styles = useBlockedUsers();
	const fetchUser = async () => {
		setLoading(true);
	
			 await axios
				.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

				).then((res) => {
					setProfileData(res.data);
					
				}).catch((err) => {
					console.log(err);
				});
				setLoading(false);
	}
	// fetch user info
	useEffect(() => {
		
		fetchUser();

	}, []);
	// convert image to base64 string


	const Divider = () => {
        return (
            <View style={{padding: 5}} >
			<View style={{
				width: "90%",
				alignSelf: "center",
				backgroundColor: theme.div.color,
				opacity: theme.div.opacity,
				height: StyleSheet.hairlineWidth,
			}} />
            </View>
		);
	  };
	  const CommentLoadingShimmer = () => {
		return (
			<View style={{ flex: 1 }}>
				<Text style={[styles.rowLabel,{padding:5}]}>No Blocked Users</Text>
			</View>
			)
	}

    const renderItem = ({ item, index }) => {
		const UnBlockUser = (id:string) => {
			console.log(id);
			
			axios.delete(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/block-user/${id}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}).catch((err) => {
				console.log(err);
			})
			fetchUser()
		}
        return (

				<View style={[styles.rowWrapper, styles.rowFirst]}>
				<View style={styles.row}>
				<ConnectedProfileAvatar
					key={item.blocked_user__username}
					username={item.blocked_user__username}
					profile_picture={item.blocked_user__username}
					fetchSize={300}
					size={40}
				/>
				<Text style={[styles.rowLabel,{padding:5}]}>{item.blocked_user__username}</Text>
				<View style={styles.rowSpacer} />
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,  borderRadius: 20,}}>
				<ButtonAsync
						containerStyle={{ width: 100, height: 35 }}
						buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5, paddingVertical: 2, alignItems: "center", justifyContent: "center" }}
						id={`${item.id}-unblock-button`}
						gradientColor='gray'
						title='Unblock'
						size='lg'
						onPress={()=>UnBlockUser(item.id)}
						
					/>
					</View>
				</View>

			</View>

			
        );
    };

	// upload a profile picture from camera roll

		return !loading ? (

		<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
			<View style={styles.container}>
				<View style={[styles.profile]}>
					<TouchableOpacity
					
					style={styles.row}>
					<Text style={styles.rowLabel}>Blocked Users</Text>
					<View style={styles.rowSpacer} />
					
					</TouchableOpacity>
				</View>

				<View style={[styles.section,{ width: "100%", minHeight: 400 }]} >
				<FlashList
					data={profileData.blocked ??  []}
					ListEmptyComponent={CommentLoadingShimmer }
					renderItem={renderItem}
					ItemSeparatorComponent={Divider}
					keyExtractor={(item, index) => `un-block-${item.id}`}
					estimatedItemSize={100}
					refreshControl={
						<RefreshControl refreshing={refreshing}/>
					  }
				/>
				</View>
				
			</View>
		</SafeAreaView>

		) : (
			<View style={styles.loadingContainer}>
				<LoadingSpinner />
			</View>
		);
	}


const useBlockedUsers = () => {
	const { theme } = useThemeContext();
	const styles = StyleSheet.create({
		loadingContainer: {
			...theme.container,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		updateLoadingContainer: {
			...theme.container,
			position: 'absolute',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			zIndex: 1000,
		},
	  container: {
  
		paddingVertical: 24,
		paddingHorizontal: 0,
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
	  },
  
	  contentFooter: {
		marginTop: 24,
		fontSize: 13,
		fontWeight: '500',
		color: '#929292',
		textAlign: 'center',
	  },
	  /** Profile */
	  profile: {
		padding: 16,
		flexDirection: 'column',
		alignItems: 'center',
		// backgroundColor: '#fff',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		// borderColor: '#e3e3e3',
		backgroundColor: grayDark.gray1
	  },
	  profileAvatar: {
		width: 60,
		height: 60,
		borderRadius: 9999,
	  },
	  profileName: {
		fontFamily: fonts.inter.bold,
		color: grayDark.gray12,
		// marginTop: 12,
		fontSize: 20,
		// fontWeight: '600',
		// color: '#090909',
	  },
	  profileUsername: {
		fontFamily: fonts.inter.semi_bold,
		color: grayDark.gray11,
		marginTop: 6,
		fontSize: 16,
  
	  },
	  profileEmail: {
		fontFamily: fonts.inter.semi_bold,
		color: grayDark.gray11,
		// marginTop: 6,
		fontSize: 16,
	  },
	  profileAction: {
		marginTop: 12,
		paddingVertical: 10,
		paddingHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#007bff',
		borderRadius: 12,
	  },
	  profileActionText: {
		marginRight: 8,
		fontSize: 15,
		fontWeight: '600',
		color: '#fff',
	  },
	  /** Section */
	  section: {
		paddingTop: 12,
	  },
	  sectionTitleContainer: {
		marginHorizontal: 12,
		gap: 5,
  
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		
	  },
	  sectionTitle: {
		marginVertical: 8,
		fontFamily: fonts.inter.semi_bold,
		fontSize: 14,
		fontWeight: '600',
		color: '#a7a7a7',
		textTransform: 'uppercase',
		letterSpacing: 1.2,
	  },
	  sectionBody: {
		paddingLeft: 24,
		// backgroundColor: '#fff',
		borderTopWidth: 1,
		// backgroundColor: 'rgba(137, 133, 133, 0.3)',
  
		// borderBottomWidth: 1,
		borderColor:  'rgba(137, 133, 133, 0.3)',
  
	  },
	  /** Row */
	  row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingRight: 16,
		height: 50,
	  },
	  rowWrapper: {
		// borderTopWidth: 1,
		borderColor: '#e3e3e3',
	  },
	  rowFirst: {
		borderTopWidth: 0,
	  },
	  rowIcon: {
		width: 30,
		height: 30,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	  },
	  rowLabel: {
		fontSize: 15,
		fontFamily: fonts.inter.black,
		// color: '#000',
		color: grayDark.gray12,
	  },
	  rowSpacer: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 0,
	  },
	  rowValue: {
		fontSize: 17,
		fontWeight: '500',
		color: '#8B8B8B',
		marginRight: 4,
	  },
	  bioContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 20,
		flexBasis: 'auto',
		height: 'auto',
		minHeight: 20,
		width: '85%',
		padding: 5,
		marginBottom: 5,
		flexShrink: 1,
		alignSelf: 'center',
	  },
	  bioText: {
		fontFamily: fonts.inter.semi_bold,
		fontSize: 15,
		color: grayDark.gray11,
		textAlign: 'center',
		flexWrap: 'wrap',
	  },
	});
  
	return styles;
  
  }