import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark, redDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Input } from '@rneui/base';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useProfileEditStyles } from './ProfileEdit.styles';



const BIO_MAX_LENGTH = 160;

export const ProfileEdit: React.FC = () =>  {
	const { username: myUsername, refreshMyUserInfo } = useMyUserInfo();
	const navigate = useNavigation();
	const [newProfileImage, setNewProfileImage] = useState(null);
	const [newProfileImageB64, setNewProfileImageB64] = useState(null);
	const [oldProfileImage, setOldProfileImage] = useState(null);
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [loading, setLoading] = useState(true);
	const [updateLoading, setUpdateLoading] = useState(false);
	const { theme } = useThemeContext();

	// todo update to make dynamic 

	const [box1Title, setBox1Title] = useState<string| undefined> (undefined );
	const [box1Stat, setBox1Stat]  =useState<string| undefined> (undefined );

	const [box2Title, setBox2Title] = useState<string| undefined> (undefined );
	const [box2Stat, setBox2Stat] = useState<string| undefined> (undefined );

	const [box3Title, setBox3Title] = useState<string| undefined> (undefined );
	const [box3Stat, setBox3Stat] = useState<string| undefined> (undefined );

	const [box4Title, setBox4Title] = useState<string| undefined> (undefined );
	const [box4Stat, setBox4Stat] = useState<string| undefined> (undefined );

	const profileEditStyles = useProfileEditStyles();

	// fetch user info
	useEffect(() => {
		const fetchUser = async () => {
		setLoading(true);
		if (myUsername) {
	
			await axios
				.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${myUsername}/${myUsername}/True`,
				)
				.then((response) => {
					console.log('fetchUser', response.data.name);
					setName(response.data.name);
					setBio(response.data.bio);
					if (response.data.profileImage) {
						setOldProfileImage(response.data.profileImage);
					}
					setLoading(false);
				})
				.catch((error) => {
					console.log('fetchUserError', error);
				});
		}
		}
		fetchUser();
	}, [myUsername]);

	// convert image to base64 string
	const imageToBase64 = async (uri) => {
		let base64 = await FileSystem.readAsStringAsync(uri, {
			encoding: FileSystem.EncodingType.Base64,
		});
		return base64;
	};

	// set stored profile picture
	const setStorageProfilePicture = async (image) => {
		const storedProfileImages = JSON.parse(
			await AsyncStorage.getItem('profileImages'),
		);
		if (storedProfileImages) {
			// storedProfileImages = JSON.parse(storedProfileImages);
			console.log(
				'setStoredProfileImages',
				Object.keys(storedProfileImages).length,
			);
		} else {
			console.log(
				'setStoredProfileImages: storedProfileImages is null or undefined',
			);
		}

		if (storedProfileImages) {
			storedProfileImages[myUsername] = image;
			await AsyncStorage.setItem(
				'profileImages',
				JSON.stringify(storedProfileImages),
			);
		} else {
			const newStoredProfileImages = {
				[myUsername]: image,
			};
			await AsyncStorage.setItem(
				'profileImages',
				JSON.stringify(newStoredProfileImages),
			);
		}
	};

	// update the profile info
	const updateProfile = async () => {
		setUpdateLoading(true);
		let formData = new FormData();
		formData.append('name', name);
		formData.append('username', myUsername);
		formData.append('bio', bio);
		if (newProfileImage) {
			let fileName = newProfileImage.split('/').pop();
			let fileType = newProfileImage.split('.').pop();

			formData.append('profileImage', {
				uri: newProfileImage,
				name: `photo.${fileName}`,
				type: `image/${fileType}`,
			});
		}

		await axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/update`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			)
			.then((response) => {
				console.log('updateProfile', response.data);
				if (newProfileImage) {
					setStorageProfilePicture(newProfileImageB64);
				}
			})
			.catch((error) => {
				console.log('errorMessage', error.response.data);
				setErrorMessage(error.response.data);
			})
			.finally(() => {
				refreshMyUserInfo()
					.then(() => {
						setUpdateLoading(false);
						navigate.goBack();
					})
					.catch((error) => {
						console.log('refreshMyUserInfoError', error);
					})
					.finally(() => {
						setLoading(false);
					});
			});
	};

	// upload a profile picture from camera roll
	const uploadProfileImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: false,
		});

		console.log(result);

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const uri = result.assets[0].uri;
			const base64Image = await imageToBase64(uri);
			setNewProfileImage(uri);
			setNewProfileImageB64(base64Image);
		}
	};

	return !loading ? (
		<>
			{updateLoading && (
				<View style={profileEditStyles.updateLoadingContainer}>
					<LoadingSpinner />
				</View>
			)}
			<View style={profileEditStyles.editProfileContainer}>
				<TouchableOpacity onPress={uploadProfileImage}>
					<View
						style={[
							profileEditStyles.editProfileImage,
							{ alignItems: 'center', justifyContent: 'center' },
						]}>
						<ConnectedProfileAvatar
							overrideImage={newProfileImage || oldProfileImage}
							username={myUsername}
							size={138}
							onNavigateToProfile={() => {
								console.log('navigate to profile');
							}}
						/>
					</View>
					<View style={profileEditStyles.cameraIconContainer}>
						<MaterialCommunityIcons
							name='camera-plus-outline'
							size={30}
							color={theme.textColorPrimary}
						/>
					</View>
				</TouchableOpacity>


				<View style={[profileEditStyles.inputContainer]}>
					<Input
						containerStyle={{
							width: '100%',
							marginTop: 10,
							padding:20
						}}
						style={{
							textAlign: 'justify'
						}}
						placeholderTextColor={grayDark.gray12}
						
						labelStyle={{
							color: grayDark.gray12,
							fontFamily: fonts.inter.bold,
						
						}}
						inputStyle={{
							color: grayDark.gray12,
							fontFamily: fonts.inter.light,
							fontSize: 16
						}}
						label='full name'
						placeholder='Jane Doe'
						value={name}
						onChangeText={setName}
						maxLength={50}
						keyboardAppearance='dark'
					/>
				</View>
		
				<View style={[profileEditStyles.inputContainer]}>
					<Input
						containerStyle={{
							width: '100%',
							marginTop: 10,
							padding:20
						}}
						style={{
							textAlign: 'justify'
						}}
						placeholderTextColor={grayDark.gray12}
						
						labelStyle={{
							color: grayDark.gray12,
							fontFamily: fonts.inter.bold,
						
						}}
						inputStyle={{
							color: grayDark.gray12,
							fontFamily: fonts.inter.light,
							fontSize: 16
						}}
						label='Bio'
						placeholder='description about me'
						value={bio}
						onChangeText={setBio}
						maxLength={ BIO_MAX_LENGTH}
						numberOfLines={4}
						errorStyle={{ color: redDark.red10, borderRadius: 10, borderColor: redDark.red10}}
						multiline={true}
						keyboardAppearance='dark'

					/>
				</View>



				<Text>{errorMessage}</Text>
				<TouchableOpacity
					style={profileEditStyles.updateButton}
					onPress={updateProfile}>
					<Text style={profileEditStyles.updateText}>
						Update Profile
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigate.goBack()}>
					<Text style={profileEditStyles.cancelText}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</>
	) : (
		<View style={profileEditStyles.loadingContainer}>
			<LoadingSpinner />
		</View>
	);
}
