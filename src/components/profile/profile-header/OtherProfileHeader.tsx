import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useProfileHeaderStyles } from './ProfileHeader.styles';
import { OtherProfileHeaderProps } from './ProfileHeader.types';
import { handleSocialPress } from './utils/handleSocialPress';


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
	isLoading,
	userHandle,
	username,
	bio,
	followers, 
	following,
	onOpenChallengeModal,
	onMotivatePress,

	amIFollowing,
}) => {
	const profileHeaderStyles = useProfileHeaderStyles();
	const navigation = useNavigation();
	const { theme } = useThemeContext();


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
			<View style={[profileHeaderStyles.headerOuterContainer, s.r]}>
		
			
				<View style={[{ flexBasis: 100, flexShrink: 0 , width: '100%', alignSelf: 'center'  ,  justifyContent: "flex-start"}, s.g]}>
					{isLoading ? (
						<ShimmerPlaceholder
							style={{
								height: 90,
								maxWidth: '80%',
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
								
								{ justifyContent: 'center', alignItems: 'center',},
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
										}}></LinearGradient>

								<View
									id={'profile-avatar'}
								style={[s.b, {
									display: 'flex',
									flexDirection: 'row',
										alignItems: 'center',
									justifyContent: 'space-around',
										minHeight:122,
									
									
										// justifyContent: 'space-aroun',
				
								}]}>
						
								<View style={{ flex: 1, width: '100%' }}>
									<Text
										style={
											profileHeaderStyles.userHandleStyle
										}>
										{userHandle}
									</Text>
								</View>

								<ConnectedProfileAvatar
									username={username!}
									size={120}
								/>

								<View
									style={[
										profileHeaderStyles.motivatorOuterContainer,
										{ flex: 1 , },
									]}>
									<TouchableOpacity
										onPress={() => onSocialPress('Followers')}>
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
								</View>

					)}
				</View>
				<View
						style={[
							s.b,
							{
								// flex:1 ,
								flexShrink: 0,
								alignItems: 'center',
								justifyContent: 'center',
								// top: 5,
								flexBasis: 50,
								// minHeight: 50,
								// padding:5, 
								marginTop: 5,
								marginBottom: 5,
								flexDirection: 'row',
							},
						]}>
						
						<View style={{ flex: 1, alignItems: "center",  }}>
						<ButtonAsync
							containerStyle={{ width: 100, height: 35, }}
							buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5 ,paddingVertical:2,  alignItems:"center", justifyContent:"center"}}
								id={'challenge-button'}
								loading={false}
								gradientColor='gray'
								isPrimary={true}
								title={'Challenge'}
								size='lg'
								onPress={onOpenChallengeModal}
							/>
						</View>

					

						<View style={{ flex: 1, alignItems:"center" }}>
								<ButtonAsync
							id={'follow-button'}
							containerStyle={{ width: 100, height: 35, }}
							buttonStyle={{ width: 100, height: 35, paddingHorizontal: 5 ,paddingVertical:2,  alignItems:"center", justifyContent:"center"}}
									loading={isLoading}
									gradientColor={'gray' }
									disabled={isLoading}
									isPrimary={!amIFollowing}
									size='lg'
									type = {amIFollowing ?  'outline' :'solid' }
									title={amIFollowing ?'Motivating' :  'Motivate' }
									onPress={onMotivatePress}
								/>
							</View>

				</View>

				<View style={{flex:1,  flexShrink:1, flexBasis:100, alignItems:"center",  }}>
					
							<View style={{flex:1, width: "85%",  }}>
								<Text
									style={[
										profileHeaderStyles.bio,
										{ textAlign: 'center' },
									]}>
									{bio}
								</Text>
					</View>
			
					</View>
							
					{isLoading &&(
						<ShimmerPlaceholder
							style={{
								height: 15,
								width: '75%',
								borderRadius: 20,
								alignSelf: 'center',
								alignItems: 'center',
								flexDirection: 'row',
								opacity: 0.5,
							}}
							shimmerColors={[
								theme.grayShades.gray500,
								theme.grayShades.gray600,
								theme.grayShades.gray700,
							]}
							LinearGradient={LinearGradient}
						/>
					)}
					</View>


		
		);
	}

