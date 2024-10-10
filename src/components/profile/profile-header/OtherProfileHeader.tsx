import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React,{useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useProfileHeaderStyles } from './ProfileHeader.styles';
import { OtherProfileHeaderProps } from './ProfileHeader.types';
import { handleSocialPress } from './utils/handleSocialPress';
import { useAuth } from '@context/auth/useAuth';
import axios from 'axios';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';


const s = StyleSheet.create({
	r: {
		borderColor: 'red',
		// borderWidth: 1,
	},
	b: {
		borderColor: 'blue',
		// borderWidth: 1,
	},
	g: {
		borderColor: 'green',
		// borderWidth: 1,
	},
	
	
}
);

export const OtherProfileHeader: React.FC<OtherProfileHeaderProps> = ({
	id,
	isLoading,
	consistency,
	userHandle,
	username,
	bio,
	followers, 
	following,
	myUsername,
	myId,
	onOpenChallengeModal,
	onMotivatePress,

	amIFollowing,
}) => {
	const profileHeaderStyles = useProfileHeaderStyles();
	const navigation = useNavigation();
	const { theme } = useThemeContext();
	const { userToken } = useAuth();
	const [isBlocked,setIsBlocked] = useState(false)

	const BlockUser = async() =>{		
		await axios.post(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/block-user`,
			{	user: id,
				blocked_user: id
			},
			{ headers: {"Authorization" : `Bearer ${userToken}`}}
		  ).then(resp=>{resp;setIsBlocked(true)}).catch(er=>{console.log(er);
		  });
		  
	}
    const onSocialPress = async (screen: 'Followers' | 'Following') => {
        handleSocialPress(
            username!,
            navigation!,
            following ?? 0,
            following ?? 0,
            screen
        );

	};
	

	return (
	  <View style={[profileHeaderStyles.headerOuterContainer, s.r, { flexBasis: "auto", flexGrow:1, flexShrink: 0 }]}>
		<View style={[{ flexBasis: 100, flexShrink: 0, width: '100%', alignSelf: 'center', justifyContent: "flex-start" }, s.g]}>
		  {isLoading ? (
			<ShimmerPlaceholder
			  style={{
				height: 90,
				maxWidth: '80%',
				width: '80%',
				minWidth: 350,
				borderRadius: 20,
				alignSelf: 'center',
				alignItems: 'center',
				flexDirection: 'row',
				opacity: 0.5,
			  }}
			  duration={1000}
			  shimmerColors={[
				theme.grayShades.gray500,
				theme.grayShades.gray600,
				theme.grayShades.gray700,
			  ]}
			  LinearGradient={LinearGradient}
			/>
		  ) : (
			<View
			  style={[
				profileHeaderStyles.headerInnerContainer,
				{ justifyContent: 'center', alignItems: 'center' },
			  ]}
			>
			  <LinearGradient
				colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1]}
				style={{
				  borderRadius: 20,
				  width: '100%',
				  height: 90,
				  position: 'absolute',
				  borderWidth: 0.5,
				  borderColor: theme.innerBorderColor,
				  display: 'flex',
				  flexDirection: 'row',
				  alignItems: 'center',
				  justifyContent: 'space-between',
				}}
			  />
			  <View
				id={'profile-avatar'}
				style={[s.b, {
				  display: 'flex',
				  flexDirection: 'row',
				  alignItems: 'center',
				  justifyContent: 'center',
				  minHeight: 122,
				}]}
			  >
				<View style={{ flex: 1, width: '100%' }}>
				<View style={{ alignItems: "center", justifyContent: "center" }}>
								<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
								  <Text style={[profileHeaderStyles.userNameStyle, { fontSize: 45, color: grayDark.gray12, fontFamily: fonts.inter.thin }]}>
									{consistency}%
								  </Text>
								</View>
							  </View>
							  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
								<Text style={profileHeaderStyles.userHandleStyle}>
								  {userHandle}
								</Text>
							  </View>
				</View>
				<ConnectedProfileAvatar
				  username={username!}
				  size={120}
				/>
				<View
				  style={[
					profileHeaderStyles.motivatorOuterContainer,
					{ flex: 1 },
				  ]}
				>
				  <TouchableOpacity onPress={() => onSocialPress('Followers')}>
					<Text style={profileHeaderStyles.motivateNum}>
					  {followers ?? '-'}
					</Text>
					<Text style={profileHeaderStyles.motivatorText}>
					  Motivators
					</Text>
				  </TouchableOpacity>
				  <TouchableOpacity onPress={() => onSocialPress('Following')}>
					<Text style={profileHeaderStyles.motivateNum}>
					  {following ?? '-'}
					</Text>
					<Text style={profileHeaderStyles.motivatorText}>
					  Motivating
					</Text>
				  </TouchableOpacity>
				</View>
			  </View>
			</View>
		  )}
		</View>
		<View
		  style={[
			s.b,
			{
			  flexShrink: 0,
			  alignItems: 'center',
			  justifyContent: 'center',
			  flexBasis: 50,
			  marginTop: 2,
			  marginBottom: 2,
			  flexDirection: 'row',
			},
		  ]}
		>
		  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<ButtonAsync
			  containerStyle={{ width: 100, height: 35 }}
			  buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5, paddingVertical: 2, alignItems: "center", justifyContent: "center" }}
			  id={'challenge-button'}
			  loading={false}
			  gradientColor='gray'
			  isPrimary={true}
			  title={'Challenge'}
			  size='lg'
			  onPress={onOpenChallengeModal}
			/>
		  </View>
		  <View>
		  <ButtonAsync
			  containerStyle={{ width: 100, height: 35 }}
			  buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5, paddingVertical: 2, alignItems: "center", justifyContent: "center" }}
			  id={'challenge-button'}
			  loading={false}
			  gradientColor='gray'
			  isPrimary={true}
			  type={isBlocked ? 'outline' : 'solid'}
			  title={isBlocked?'Block':'Blocked'}
			  size='lg'
			  onPress={BlockUser}
			/>
		  </View>
		  <View style={{ flex: 1, alignItems: "center" }}>
			<ButtonAsync
			  id={'follow-button'}
			  containerStyle={{ width: 100, height: 35 }}
			  buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5, paddingVertical: 2, alignItems: "center", justifyContent: "center" }}
			  loading={isLoading}
			  gradientColor={'gray'}
			  disabled={isLoading}
			  isPrimary={!amIFollowing}
			  size='lg'
			  type={amIFollowing ? 'outline' : 'solid'}
			  title={amIFollowing ? 'Motivating' : 'Motivate'}
			  onPress={onMotivatePress}
			/>
		  </View>
			</View>
			{bio ? (
				<View style={{ flexBasis: "auto", height: "auto", minHeight: 20, width: "85%", padding: 10, marginBottom: 5, flexShrink: 1, alignItems: "center", justifyContent: 'center', alignSelf: "center", flexWrap: 1, }}>
				<Text
					style={
						profileHeaderStyles.bio
					}
				>
					{bio}
				</Text>
			</View>) :
				<View style={{ minHeight: 20 }} />
			}

		  
	  </View>
	);
	}

