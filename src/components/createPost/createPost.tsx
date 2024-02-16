import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Video } from 'expo-av';
import { Camera } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Image, ImageContentFit } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import React, { useEffect, useState } from 'react';
import {
	Dimensions,
	Keyboard,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Header } from '../header/Header';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useCreatePostStyles } from './createPost.styles';

const MAX_CAPTION_LENGTH = 200;

export default function CreatePost() {
	const route = useRoute();
	const { theme } = useThemeContext();

	const [permission, requestPermission] = Camera.useCameraPermissions();

	const challengeUsername = route?.params?.challengeUsername;
	const challengeID = route?.params?.challengeID;
	const challenge = route?.params?.challenge;

	// const [hasPermission, setHasPermission] = useState(null);
	const [cameraRef, setCameraRef] = useState(null);
	const [photo, setPhoto] = useState(null);
	const [caption, setCaption] = useState(
		challenge
			? `I completed @${challengeUsername}'s challenge: ${challenge}`
			: '',
	);
	const [loading, setLoading] = useState(false);
	const [isCameraFront, setIsCameraFront] = useState(true);
	const [isFlashOn, setIsFlashOn] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isPhoto, setIsPhoto] = useState(true);
	const [isRecording, setIsRecording] = useState(false);
	const [vid, setVideo] = useState(null);
	const [timer, setTimer] = useState(10); // Initial countdown time
	const [timerId, setTimerId] = useState(null); // To store the timer ID

	const navigate = useNavigation();
	const { username: myUsername, refreshMyUserInfo } = useMyUserInfo();
	const createPostStyles = useCreatePostStyles();

	const [photoContentFit, setPhotoContentFit] = useState<ImageContentFit>('contain');

	const toggleContentFit = () => {
		setPhotoContentFit(photoContentFit === 'cover' ? 'contain' : 'cover');
	};

	useEffect(() => {
		(async () => {
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				alert(
					'Sorry, we need camera roll permissions to make this work!',
				);
			}
		})();
	}, []);

	const onSendSuccessToast = () => {
		Toast.show({
			type: 'success',
			text1: 'Post uploaded!',
			topOffset: 100,
		});
	};

	// pick an image from camera roll
	const pickImage = async () => {

			const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: false,
				quality: 1,
				allowsMultipleSelection: false,
				videoMaxDuration: 10,
			});
		
		
			if (result.assets[0].type === 'image') {

			console.log('result', result.assets);

			if (!result.canceled && result.assets && result.assets[0].uri) {
				console.log("think its an image")
				setVideo(null);
				setPhoto(result.assets[0].uri);
				return;
				// const pickedImageWidth = result.assets[0].width;
				// const pickedImageHeight = result.assets[0].height;

				// console.log('pickedImageWidth', pickedImageWidth);
				// console.log('pickedImageHeight', pickedImageHeight);
				// const windowWidth = Dimensions.get('window').width;
				// const windowHeight = Dimensions.get('window').height;

				// console.log(
				// 	pickedImageWidth,
				// 	pickedImageHeight,
				// 	windowWidth,
				// 	windowHeight,
				// );

				// // Calculate the aspect ratios
				// const pickedAspectRatio = pickedImageWidth / pickedImageHeight;
				// const screenAspectRatio = windowWidth / windowHeight;

				// // Initialize crop configuration
				// let cropConfig = {
				// 	originX: 0,
				// 	originY: 0,
				// 	width: pickedImageWidth,
				// 	height: pickedImageHeight,
				// };

				// if (pickedAspectRatio > screenAspectRatio) {
				// 	// Image is wider than screen aspect ratio, crop the sides
				// 	const newWidth = pickedImageHeight * screenAspectRatio;
				// 	cropConfig.originX = (pickedImageWidth - newWidth) / 2; // Center the crop
				// 	cropConfig.width = newWidth;
				// 	console.log('newWidth', newWidth);
				// } else if (pickedAspectRatio < screenAspectRatio) {
				// 	// Image is taller than screen aspect ratio, crop the top and bottom
				// 	const newHeight = pickedImageWidth / screenAspectRatio;
				// 	cropConfig.originY = (pickedImageHeight - newHeight) / 2; // Center the crop
				// 	cropConfig.height = newHeight;
				// 	console.log('newHeight', newHeight);
				// }

				// // Crop the image
				// let croppedImage = await ImageManipulator.manipulateAsync(
				// 	result.assets[0].uri,
				// 	[{ crop: cropConfig }],
				// 	{ format: ImageManipulator.SaveFormat.JPEG },
				// );

				// // Resize the cropped image to fit the screen
				// let resizedImage = await ImageManipulator.manipulateAsync(
				// 	croppedImage.uri,
				// 	[{ resize: { width: windowWidth, height: windowHeight } }],
				// 	{ format: ImageManipulator.SaveFormat.JPEG },
				// );

				// setPhoto(resizedImage.uri);
			}
		} else {
			// let result = await ImagePicker.launchImageLibraryAsync({
			// 	mediaTypes: ImagePicker.MediaTypeOptions.Videos,
			// 	allowsEditing: true,
			// 	quality: 1,
			// 	videoMaxDuration: 10,
				// });
				console.log("think its an image")

				
				console.log('result', result);

			if (!result.canceled && result.assets && result.assets[0].uri) {
				setVideo(result.assets[0].uri);
				setPhoto(null);
			}
		}
	};

	const takePhoto = async () => {
		console.log('takephoto');
		if (cameraRef) {
			let photo = await cameraRef.takePictureAsync({
				quality: 1,
			});

			// // Calculate the aspect ratio of the camera image
			// const aspectRatio = photo.width / photo.height;

			// // Calculate the width based on the height of the screen
			// const targetWidth = window.height * aspectRatio;

			if (isCameraFront) {
				const flippedImage = await ImageManipulator.manipulateAsync(
					photo.uri,
					[
						{ flip: ImageManipulator.FlipType.Horizontal },
						// { crop: { originX: (targetWidth - window.width) / 2, originY: 0, width: window.width, height: window.height } } // Crop to fit the screen width
						// { resize: { height: window.height } }
					],
					{ format: ImageManipulator.SaveFormat.JPEG },
				);

				setPhoto(flippedImage.uri);
			} else {
				setPhoto(photo.uri);
			}
		}
	};

	const handleVideoRecording = async () => {
		if (cameraRef) {
			if (isRecording) {
				console.log('recording stopped');
				cameraRef.stopRecording();
				clearInterval(timerId);
				setTimer(10);
			} else {
				console.log('recording started');
				setIsRecording(true);

				// Start the countdown timer
				const id = setInterval(() => {
					setTimer((prevTimer) => {
						if (prevTimer === 1) {
							cameraRef.stopRecording();
							setIsRecording(false);
							setTimer(10);
							clearInterval(id);
							return 0;
						}
						return prevTimer - 1;
					});
				}, 1000);
				setTimerId(id);

				try {
					const recordingPromise = await cameraRef.recordAsync();

					// Wait for recording to finish
					const videoData = await recordingPromise;
					clearTimeout(timer);

					if (videoData && videoData.uri) {
						console.log('video set', videoData);
						setVideo(videoData.uri);
					} else {
						console.log('No video data received');
					}
				} catch (error) {
					console.error('Error during video recording:', error);
				} finally {
					setIsRecording(false);
					setTimer(10);
					clearInterval(id);
				}
			}
		}
	};

	const sendPost = async () => {
		setLoading(true);
		let formData = new FormData();
		formData.append('user', myUsername);
		formData.append('caption', caption);
		formData.append('challenge', challenge ? true : false);

		if (photo) {
			formData.append('postMedia', {
				uri: photo,
				type: 'image/jpeg', // Adjust based on your image format
				name: `${Math.floor(Date.now() / 1000)}.jpeg`,
			});
		} else if (vid) {
			formData.append('postMedia', {
				uri: vid,
				type: 'video/mp4', // Adjust based on your video format
				name: `${Math.floor(Date.now() / 1000)}.mp4`,
			});
		}

		axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/save`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			)
			.then((response) => {
				console.log('sendPost', response.data);
				onSendSuccessToast();
				setPhoto(null);
				setVideo(null);
				setLoading(false);
				// fetch friends notifications
				axios
					.get(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/friends/fetch/${myUsername}`,
					)
					.then((response) => {
						console.log('fetchFriendsNotifications', response.data);
						// create notification objects
						const notifications = response.data['tokens'].map(
							(token) => ({
								to: token,
								sound: 'default',
								title: `${myUsername} just got better today.`,
								body: `will you?`,
								data: { path: { screen: 'home' } },
							}),
						);

						console.log('notifications', notifications);

						// send notifications
						axios
							.post(
								'https://exp.host/--/api/v2/push/send',
								notifications,
								{
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
									},
								},
							)
							.then((response) => {
								console.log(response.data);
							})
							.catch((error) => {
								console.error(
									'sendExpoNotificationsError',
									error,
								);
							});
					})
					.catch((error) => {
						console.log('fetchFriendsNotificationsError', error);
						throw new Error(error);
					});

				if (challengeUsername) {
					axios
						.post(
							`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/challenge/complete`,
							{
								recievingUser: myUsername,
								sendingUser: challengeUsername,
								challengeID: challengeID,
							},
						)
						.then((response) => {
							console.log('completeChallenge', response.data);
						})
						.catch((error) => {
							console.log('completeChallengeError', error);
						});
				}
			})
			.catch((error) => {
				console.log('sendPostError', error);
			})
			.finally(() => {
				refreshMyUserInfo()
				navigate.goBack();
			});
	};

	if (permission === null) {
		return (
			<View style={createPostStyles.loadingContainer}>
				<LoadingSpinner />
			</View>
		);
	}
	if (permission === false) {
		return (
			<View style={[createPostStyles.createPostContainer, { flex: 1 }]}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text style={createPostStyles.noPermisssionsText}>
						No access to camera!
					</Text>
					<Text
						style={[
							createPostStyles.noPermisssionsText,
							{ fontSize: 16, fontWeight: '600' },
						]}>
						Please allow access in settings
					</Text>
				</View>
			</View>
		);
	}

	return (
		<TouchableWithoutFeedback
			style={{ flex: 1 }}
			onPress={() => Keyboard.dismiss()}
			accessible={false}>
			{photo === null && vid === null ? (
				<>
					<Header />
					<TouchableHighlight
						style={createPostStyles.cameraRollContainer}
						onPress={pickImage}>
						<FontAwesome
							style={createPostStyles.cameraRollIcon}
							name='picture-o'
							size={24}
							// color='white'
							// backgroundColor='white'
						/>
					</TouchableHighlight>
					<View style={createPostStyles.createPostContainer}>
						<View style={createPostStyles.cameraContainer}>
							<Camera
								style={createPostStyles.camera}
								type={
									isCameraFront
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								}
								flashMode={
									isFlashOn
										? Camera.Constants.FlashMode.on
										: Camera.Constants.FlashMode.off
								}
								ref={(ref) => setCameraRef(ref)}
							/>
						</View>
						<View style={createPostStyles.takePhotoContainer}>
							{isRecording && (
								<View style={createPostStyles.isPhotoContainer}>
									<Text style={createPostStyles.timerText}>
										{timer}
									</Text>
								</View>
							)}
							{!isRecording && (
								<View style={createPostStyles.isPhotoContainer}>
									<TouchableOpacity
										onPress={() => setIsPhoto(true)}>
										<Text
											style={
												isPhoto
													? createPostStyles.isPhotoTextSelected
													: createPostStyles.isPhotoTextNotSelected
											}>
											Photo
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => setIsPhoto(false)}>
										<Text
											style={
												isPhoto
													? createPostStyles.isPhotoTextNotSelected
													: createPostStyles.isPhotoTextSelected
											}>
											Video
										</Text>
									</TouchableOpacity>
								</View>
							)}
							<View
								style={
									createPostStyles.takePhotoContainerInner
								}>
								{!isRecording && (
									<TouchableOpacity
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											setIsFlashOn((prev) => !prev);
										}}>
										{isFlashOn ? (
											<Image
												style={
													createPostStyles.flashButton
												}
												source={require('../../img/flashOnWhite.png')}></Image>
										) : (
											<Image
												style={
													createPostStyles.flashButton
												}
												source={require('../../img/flashOffWhite.png')}></Image>
										)}
									</TouchableOpacity>
								)}
								{isPhoto ? (
									<TouchableOpacity
										style={createPostStyles.takePhotoButton}
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											takePhoto();
										}}></TouchableOpacity>
								) : (
									<TouchableOpacity
										style={
											isRecording
												? createPostStyles.takePhotoButton
												: createPostStyles.takeVideoButton
										}
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											handleVideoRecording();
										}}>
										{
											<View
												style={
													createPostStyles.videoRecording
												}></View>
										}
									</TouchableOpacity>
								)}
								{!isRecording && (
									<TouchableOpacity
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											setIsCameraFront((prev) => !prev);
										}}>
										<Image
											style={
												createPostStyles.reverseCameraButton
											}
											source={require('../../img/reverseWhite.png')}></Image>
									</TouchableOpacity>
								)}
							</View>
						</View>
					</View>
				</>
			) : (
				<>
					<Header  />
					<TouchableHighlight
						style={createPostStyles.retakeIconContainer}
						onPress={
							loading
								? null
								: () => {
										Haptics.impactAsync(
											Haptics.ImpactFeedbackStyle.Medium,
										);
										setCaption('');
										setPhoto(null);
										setVideo(null);
								  }
						}>
						<AntDesign
							style={createPostStyles.retakeIcon}
							name='close'
							size={25}
							color='#ffffff'
						/>
					</TouchableHighlight>
					<View style={createPostStyles.createPostContainer}>
						<View style={createPostStyles.takenPhotoContainer}>
							{photo && (
								<TouchableWithoutFeedback
									style={{ flex: 1 }}
									onPress={() => {
										Keyboard.dismiss();
										toggleContentFit(); // Toggle content fit mode on tap
									}}
									accessible={false}>
									<Image
										style={[createPostStyles.photoStyle,{
												width: '100%',
												height: '100%',
										
										}]}
										transition={300}
										contentFit={photoContentFit}
										contentPosition={'center'}
										allowDownscaling={false}
										borderRadius={10}
										source={{ uri: photo }}></Image>
								</TouchableWithoutFeedback>
							)}
							{vid && (
								<View >
									<Video
										source={{ uri: vid }}
										style={{
											width: Dimensions.get('window')
												.width,
											height: '100%',
											// resizeMode: 'cover',
										}}
										shouldPlay
											isLooping
											resizeMode='contain'
									/>
								</View>
							)}

							<View style={createPostStyles.inputContainer}>
								<TextInput
									style={createPostStyles.input}
									maxLength={MAX_CAPTION_LENGTH}
									placeholder='Write a caption...'
									placeholderTextColor={
										theme.grayShades.gray500
									}
									keyboardAppearance='dark'
									// multiline={true}
									value={caption}
									onChangeText={setCaption}
									onFocus={() => {
										setIsFocused(true);
									}}
									onBlur={() => {
										setIsFocused(false);
									}}
									returnKeyType='done'
									onSubmitEditing={Keyboard.dismiss}
								/>
								{isFocused ? (
									<TouchableOpacity
										style={
											createPostStyles.submitCaptionButton
										}
										onPress={() => {
											Keyboard.dismiss();
										}}>
										<Text
											style={
												createPostStyles.submitCaptionText
											}>
											Submit
										</Text>
									</TouchableOpacity>
								) : null}
							</View>
						</View>
						<TouchableHighlight
							style={createPostStyles.sendPostContainer}
							onPress={
								loading
									? null
									: () => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											sendPost();
									  }
							}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 10,
								}}>
								<Text style={createPostStyles.sendPostText}>
									Post
								</Text>

								<Ionicons
									name='send'
									size={30}
									color='#ffffff'
								/>
							</View>
						</TouchableHighlight>
					</View>
					{loading ? (
						<View style={createPostStyles.sendLoadingContainer}>
							<LoadingSpinner />
						</View>
					) : null}
				</>
			)}
		</TouchableWithoutFeedback>
	);
}
