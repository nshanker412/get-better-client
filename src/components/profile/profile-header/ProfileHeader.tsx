import { grayDark } from '@context/theme/colors_neon';
import { useThemeContext } from '@context/theme/useThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ActionButton } from '../../primitives/action-button/ActionButton';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { useProfileHeaderStyles } from './ProfileHeader.styles';
import { ProfileHeaderProps } from './ProfileHeader.types';

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
	isLoading,
	onLogout,
	userHandle,
	username,
	bio,
	onOpenChallengeModal,
	onMotivatePress,
	following,
	followers,
	amIFollowing,
	isMyProfile,
	myUsername,
}) => {
	const profileHeaderStyles = useProfileHeaderStyles();
	const navigation = useNavigation();

	const { theme } = useThemeContext();

	const [loadingMotivate, setLoadingMotivate] = useState(false);

	const onMotivatePressCb = async () => {
		setLoadingMotivate(true);
		await onMotivatePress!();
		setLoadingMotivate(false);
	}



	const onViewFollowersPress = () => {
		console.log('Others Followers Pressed', username);
		console.log('Others Followers Pressed');

		navigation.navigate('profileTab', { screen: 'followerFollowing', params:  {
			profileUsername: username,
			following: following,
			followers: followers,
			initial: 'Followers',
		} });
	


	};

	const onViewFollowingPress = () => {
		console.log('Others Following Pressed');

	
		navigation.navigate('profileTab', { screen: 'followerFollowing', params:  {
			profileUsername: username,
			following: following,
			followers: followers,
			initial: 'Followers',
		} });
	};

	if (isMyProfile) {
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
								flex: 1,
								width: '100%',
								height: '100%',
								alignItems: 'flex-end',
								justifyContent: 'flex-start',
								padding: 5,
							}}>
							<TouchableOpacity onPress={onLogout}>
								<MaterialIcons
									name='logout'
									size={24}
									color={theme.textColorPrimary}
								/>
							</TouchableOpacity>
						</View>
					</View>

					<View
						style={{ flex: 4, width: '100%', alignSelf: 'center' }}>
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
										{ flex: 1 },
									]}>
									<TouchableOpacity
										onPress={onViewFollowersPress}>
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
										onPress={onViewFollowingPress}>
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
	} else {
		return (
			<View style={profileHeaderStyles.headerOuterContainer}>
				<View
					style={{
						flex: 1,
						alignItems: 'flex-end',
						justifyContent: 'flex-start',
					}}>
					<View
						style={{
							flex: 1,
							width: '100%',
							height: '100%',
							alignItems: 'flex-start',
							justifyContent: 'flex-start',
						}}>
						<TouchableOpacity
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Medium,
								);
								navigation.goBack();
							}}>
							<MaterialIcons
								name='chevron-left'
								size={40}
								color={theme.textColorPrimary}
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={{ flex: 2, width: '100%', alignSelf: 'center' }}>
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
								{ justifyContent: 'space-between' },
									]}
							>
										<LinearGradient
									colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1]}
									style={{
										borderRadius: 20,
										width: '100%',
										height: '100%',
										flex: 1,
										alignItems: 'center',
										justifyContent: 'center',
										flexDirection: 'column',
									}}

													>

							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
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
										{ flex: 1 },
									]}>
									<TouchableOpacity
										onPress={onViewFollowersPress}>
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
										onPress={onViewFollowingPress}>
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
							</LinearGradient>
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
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								top: 5,
								flexDirection: 'row',
							},
						]}>
						<View style={{ flex: 1 }}>
								<ActionButton
								defaultPressed={false}
								isPrimary={false}
								onPress={onOpenChallengeModal}
								title={'Challenge'}
							/>
						</View>

						<View style={{ flex: 1 }}>
							<View style={[profileHeaderStyles.nameContainer]}>
								<Text style={profileHeaderStyles.name}>
									{username}
								</Text>
							</View>
						</View>
						<View style={{ flex: 1 }}>
								<ActionButton
																		loading={loadingMotivate}

								defaultPressed={amIFollowing}
								isPrimary={true}
								onPress={onMotivatePressCb}
								title={
									!amIFollowing ? 'Motivate' : 'Motivating'
								}
							/>
						</View>
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
};
