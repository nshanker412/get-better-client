import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useProfileHeaderStyles } from './ProfileHeader.styles';
import { MyProfileHeaderProps } from './ProfileHeader.types';
import { handleSocialPress } from './utils/handleSocialPress';


export const MyProfileHeader: React.FC<MyProfileHeaderProps> = ({
	isLoading,
	onLogout,
	userHandle,
	username,
	bio,
	following,
	followers,
}) => {

	const navigation = useNavigation();
	const { theme } = useThemeContext();
	const profileHeaderStyles = useProfileHeaderStyles();

	const {myData } = useMyUserInfo();

	const onPressEditProfile = () => {
		navigation.navigate('profileEdit');
	}

    const onSocialPress = async (screen: 'Followers' | 'Following') => {
        handleSocialPress(
            username!,
            navigation!,
            followers ?? 0,
            following ?? 0,
            screen
        );

    };


		return (
			<>
				<View style={profileHeaderStyles.headerOuterContainer}>
					<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<View
							style={{
								// flex: 1,
								position: 'absolute',
								right: -15,
								top: -15,
							
								alignItems: 'flex-end',
								justifyContent: 'flex-start',
								padding: 5,
							}}>
					
							<TouchableOpacity onPress={onLogout}>
								<MaterialIcons
									name='logout'
									size={24}
									color={"white"}
								/>
							</TouchableOpacity>
							
						</View>
					</View>

					<View
						style={{ flex: 5, width: '100%', alignSelf: 'center' }}>
						{isLoading ? (
							<ShimmerPlaceholder
								style={{
									height: 90,
									borderRadius: 10,
									alignSelf: 'center',
									alignItems: 'center',
									flexDirection: 'row',
									opacity: 0.5,
								}}
								shimmerColors={[
							
									'#404040', // Inverted from darkTheme
									 '#333333', // Inverted from darkTheme
									 '#292929', // In
								]}
								LinearGradient={LinearGradient}
							/>
						) : (
							<View
								style={[
									profileHeaderStyles.headerInnerContainer,
									{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
									},
									]}>
									<LinearGradient
										colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1]}
										style={{
											borderRadius: 20,
											width: '100%',
											// flex: 1,
											height: 90,
											position: 'absolute',
											borderWidth: 0.5,
											borderColor: theme.innerBorderColor,
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'space-between',
										}}></LinearGradient>
										
								
									<View style={{ flex: 1, width: '100%', gap: 10,  alignItems: 'stretch', height: "100%", justifyContent: 'center' }}>
											<View style={{ alignItems: "center", justifyContent: "center" ,  }}>
											
												<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
													<Text style={[profileHeaderStyles.userNameStyle, {fontSize: 45, color: grayDark.gray12, fontFamily: fonts.inter.thin}]}>
													{myData?.consistency}%

														</Text>	
											</View> 
											
											
											</View>
											<View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center',  }}>
												<Text
										style={[
														profileHeaderStyles.userHandleStyle,
														{
															fontSize: 11,
															textAlign: 'left',
														
												
											}
										]
										}>
												{userHandle}

													</Text>
												</View>

										{/* <ButtonAsync
								onPress={onPressEditProfile}
								title='edit'
								size='sm'
								type='outline'
								icon='edit'
								loading={false}
								loadingColor='white'
								loadingSize='small'
								loadingStyle={{ marginRight: 5 }}
								style={{
									backgroundColor: 'transparent',
									borderWidth: 0,
									padding: 0,
									margin: 0,
									marginTop: 0

								}}
								containerStyle={{
									backgroundColor: 'transparent',
									borderWidth: 0,
									padding: 0,
									margin: 0,
									marginTop: 0
								}
								}
								textStyle={{
									color: blue.blue5,
									fontSize: 12,
									fontFamily: fonts.inter.bold,
									fontWeight: 'bold',
								}}
							/> */}
											{/* </View> */}
								</View>

								<ConnectedProfileAvatar
									username={username!}
									size={120}
								/>

								<View
									style={[
										profileHeaderStyles.motivatorOuterContainer,
										{ flex: 1,  },
									]}>
									<TouchableOpacity
										onPress={() => onSocialPress('Followers')}>
										<View
											style={{
												flexDirection: 'column',
											}}>
											<Text
												style={
													profileHeaderStyles.motivateNum
												}>
												{followers ?? '-'}
											</Text>

											<Text
												style={
													profileHeaderStyles.motivatorText
												}>
												Motivators
											</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
											onPress={() => onSocialPress('Following')}>

										<Text
											style={
												profileHeaderStyles.motivateNum
											}>
											{following ?? '-'}
										</Text>
										<Text
											style={
												profileHeaderStyles.motivatorText
											}>
											Motivating
										</Text>
									</TouchableOpacity>
										</View>
							</View>
						)}
					</View>

					<View
						style={[
							profileHeaderStyles.nameBioContainer,
							{
								flex: 4,
								flexShrink:2,
								alignItems: 'center',
								justifyContent: 'center',
							},
						]}>
						

						<View
							style={{
								flex: 1,
								maxWidth: '80%',
								alignSelf: 'center',

								// overflow: 'ellipsis',
							}}>
							<View style={[profileHeaderStyles.bioContainer]}>
								<Text style={profileHeaderStyles.bio}>
									{bio}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</>
		);
}
	