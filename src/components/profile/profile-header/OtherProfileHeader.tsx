import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useProfileHeaderStyles } from './ProfileHeader.styles';
import { OtherProfileHeaderProps } from './ProfileHeader.types';
import { handleSocialPress } from './utils/handleSocialPress';



export const OtherProfileHeader: React.FC<OtherProfileHeaderProps> = ({
	isLoading,
	userHandle,
	username,
	bio,
	onOpenChallengeModal,
	onMotivatePress,
	following,
	followers,
	amIFollowing,
}) => {
	const profileHeaderStyles = useProfileHeaderStyles();
	const navigation = useNavigation();
	const { theme } = useThemeContext();

	

	const onToggleFollow = (newState: boolean) => {
		console.log('Follow Pressed');
		onMotivatePress!();
    }

 


    const onSocialPress = async (screen: 'Followers' | 'Following') => {
        handleSocialPress(
            username!,
            navigation!,
            following ?? 0,
            following ??0,
            screen
        );

    };


	
		return (
			<View style={profileHeaderStyles.headerOuterContainer}>
						<View
						style={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
				
					</View>
			
				<View style={{ flex: 5, width: '100%', alignSelf: 'center' , justifyContent: "center"}}>
					{isLoading ? (
						<ShimmerPlaceholder
							style={{
								height: 90,
								width: '80%',
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
								style={{
									display: 'flex',
									flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-around',
										// justifyContent: 'space-aroun',
				
								}}>
						
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

				{isLoading ? (
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
				) : (
					<View
						style={[
							profileHeaderStyles.nameBioContainer,
							{
								flex:4 ,
								alignItems: 'center',
								justifyContent: 'center',
								// top: 5,
								flexDirection: 'row',
							},
							]}>
							<View style={{flex: 1} }/>
						<View style={{ flex: 2 }}>
						
								<ButtonAsync
									id={'challenge-button'}
									loading={false}
									gradientColor='gray'
									isPrimary={true}
									title={'Challenge'}
									size='lg'
									onPress={onOpenChallengeModal}
								/>
						</View>

						<View style={{ flex: 1 }}>
							{/* <View style={[profileHeaderStyles.nameContainer]}>
								<Text style={profileHeaderStyles.name}>
									{username}
								</Text>
							</View> */}
						</View>
						<View style={{ flex: 2 }}>
								<ButtonAsync
									id={'follow-button'}
									loading={isLoading}
									gradientColor={'gray' }
									disabled={isLoading}
									isPrimary={!amIFollowing}
									size='lg'
									type = {amIFollowing ?  'outline' :'solid' }
									title={amIFollowing ?'Motivating' :  'Motivate' }
									onPress={() => onToggleFollow(!amIFollowing)}
								/>
							</View>
							<View style={{flex: 1} }/>

					</View>
				)}

				<View
					style={[
						profileHeaderStyles.nameBioContainer,
						{
							flex: 1,
							alignItems: 'flex-start',
							justifyContent: 'center',
							flexDirection: 'row',
						
						},
					]}>
					<View style={[profileHeaderStyles.bioContainer]}>
						<Text
							style={[
								profileHeaderStyles.bio,
								{ textAlign: 'center' },
							]}>
							{bio}
						</Text>
					</View>
				</View>
			</View>
		);
	}

