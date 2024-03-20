import { ButtonAsync } from '@components/primitives/async-button/ButtonAsync';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { blue, grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
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


	const onSettingsPress = () => {
		navigation.navigate('settings');
	}
	
	useEffect(() => {
		// Use `setOptions` to update the button that we previously specified
		// Now the button includes an `onPress` handler to update the count
		navigation.setOptions({
		  headerRight: () => (
				<MaterialIcons name="settings" size={24} color={ grayDark.gray12} onPress={onSettingsPress} />
		  ),
		});
	  }, [navigation]);


		return (
			<View style={[profileHeaderStyles.headerOuterContainer, { flexBasis: "auto", flexGrow:1, flexShrink: 0 }]}>
			<View style={[{ flexBasis: 100, flexShrink: 0, width: '100%', alignSelf: 'center', justifyContent: "flex-start" }]}>

					<View
						style={{ flexBasis:"auto", width: '100%', alignSelf: 'center' }}>
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
							<View style={profileHeaderStyles.headerInnerContainer}>
							<LinearGradient
							  colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1]}
							  style={{
								borderRadius: 20,
								width: '100%',
								height: 90,
								position: 'absolute',
								borderWidth: 0.5,
								borderColor: theme.innerBorderColor,
								alignItems: 'center',
								justifyContent: 'space-between',
							  }}
							/>
							<View style={{
							  flex: 1,
							  width: '100%',
							  alignItems: 'center',
							  justifyContent: 'center',
							}}>
							  <View style={{ alignItems: "center", justifyContent: "center" }}>
								<View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
								  <Text style={[profileHeaderStyles.userNameStyle, { fontSize: 45, color: grayDark.gray12, fontFamily: fonts.inter.thin }]}>
									{myData?.consistency}%
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
							<View style={profileHeaderStyles.motivatorOuterContainer}>
							  <TouchableOpacity onPress={() => onSocialPress('Followers')}>
								<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								  <Text style={profileHeaderStyles.motivateNum}>
									{followers ?? '-'}
								  </Text>
								  <Text style={profileHeaderStyles.motivatorText}>
									Motivators
								  </Text>
								</View>
							  </TouchableOpacity>
							  <TouchableOpacity onPress={() => onSocialPress('Following')}>
								<View style={{ flexDirection: 'column', alignItems: 'center' }}>
								  <Text style={profileHeaderStyles.motivateNum}>
									{following ?? '-'}
								  </Text>
								  <Text style={profileHeaderStyles.motivatorText}>
									Motivating
								  </Text>
								</View>
							  </TouchableOpacity>
							</View>
						  </View>
						)}
					</View>
				</View>
				<View
					style={[
						{
						flexShrink: 0,
						alignItems: 'center',
						justifyContent: 'center',
						flexBasis: 25,
						marginTop: 2,
						marginBottom: 2,
						flexDirection: 'row',
						},
					]}
				>
			<View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center", borderRadius: 20,}}/>
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,  borderRadius: 20,}}>
						<ButtonAsync
							containerStyle={{ width: 80, height: 25, }}
							buttonStyle={{ width: 80, height: 25, gap: 5, paddingHorizontal: 2, paddingVertical: 2, alignItems: "center", justifyContent: "center" , borderRadius: 20, borderWidth: 1, borderColor: blue.blue5,}}
							textStyle={{
								color: blue.blue5,
								fontSize: 12,
								fontFamily: fonts.inter.bold,
								fontWeight: 'bold',
							}}
							onPress={onPressEditProfile}
							title='edit'
							size='sm'
							type='outline'
							icon={<AntDesign name="edit" size={15} color={blue.blue5} />}
							loading={false}
							loadingSize='small'
							loadingStyle={{ marginRight: 0 }}
			/>
		  </View>

				</View>
					{bio ? (<View style={{ flexBasis: "auto", height: "auto", minHeight: 20, width: "85%",  padding: 5, marginBottom: 5,  flexShrink: 1, alignItems: "center", justifyContent: 'center', alignSelf: "center", flexWrap: 1, }}>
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
	