import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	Keyboard,
	Text,
	TextInput,
	TouchableHighlight,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View
} from 'react-native';
import { FloatingAction, IActionProps } from "react-native-floating-action";
import Toast from 'react-native-toast-message';
import { Header } from '../header/Header';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useCreatePostStyles } from './createPost.styles';
import { PlanSelectModal } from "./modal/PlanSelectModal";

const actions: IActionProps[] = [
	{
		text: "Plan",
		name: "bt_link_post",
		// color: "rgba(137, 133, 133, 0.9)",
		icon: <FontAwesome5 name="link" size={24} color="white" />,
		color: "gray"

	},
	{
		text: "Location",
		icon: <FontAwesome5 name="map-marked-alt" size={24} color="white" />,
		name: "bt_room",
		// color: "rgba(137, 133, 133, 0.9)",
		color: "gray"
		
	},

  ];



const MAX_CAPTION_LENGTH = 200;

export default function CreatePost() {
	const route = useRoute();
	const { theme } = useThemeContext();
	const challengeUsername = route?.params?.challengeUsername;
	const challengeID = route?.params?.challengeID;
	const challenge = route?.params?.challenge;

	const [permission, requestPermission] = Camera.useCameraPermissions();

	const cameraRef = useRef<Camera>(null);

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
	const [video, setVideo] = useState(null);
	const [timer, setTimer] = useState(10); // Initial countdown time
	const [timerId, setTimerId] = useState(null); // To store the timer ID
	const [linkedPlans, setLinkedPlans] = useState<string[] | []>([]);

	const [mediaSrc, setMediaScr] = useState < "upload" | "taken" | undefined>(undefined);


	const navigate = useNavigation();
	const { username: myUsername, refreshMyUserInfo } = useMyUserInfo();
	const createPostStyles = useCreatePostStyles();


	const onFloatingActionPress = (name) => {
		if (name === "bt_link_post") {
			setIsVisible(true);
		}
	}

	const onPlanModalClose = (plans: string[] | []) => {
		console.log('onPlanModalClose', plans);
		setLinkedPlans(plans)
		setIsVisible(false);
	}


	const [isVisible, setIsVisible] = useState(false);
	const [photoContentFit, setPhotoContentFit] = useState<"contain" | "cover">('contain');

	const toggleContentFit = () => {
		if (mediaSrc === "upload") {
			setPhotoContentFit(photoContentFit === 'cover' ? 'contain' : 'cover');
		} else {
			setPhotoContentFit('cover');
		
		}
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
	const pickMedia = async () => {

		console.log("before picker")
		if (isPhoto) {

			const imageResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: false,
				quality: 1,
			});

			console.log("image after picker: ", imageResult)

			// console.log('result', result);
			if (imageResult == null || imageResult.assets == null || imageResult.assets[0] == null || imageResult.canceled) {
				console.log('picked camera roll media is null');
				return;
			}


			setVideo(null);
			setMediaScr("upload");
			setPhoto(imageResult?.assets[0]?.uri);
			return;
				
		} else {

			const videoResult = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
                videoMaxDuration: 10
			});
			setMediaScr("video result: ", videoResult);


			if (videoResult == null || videoResult.assets == null || videoResult.assets[0] == null || videoResult.canceled) {
				console.log('picked camera roll media is null');
				return;
			}
			console.log(videoResult?.assets[0]?.duration)

			

			
				setPhoto(null);
				setMediaScr("upload");
				setVideo(videoResult?.assets[0]?.uri);
				return;
	
		}

	}


	const takePhoto = async () => {
		if (cameraRef) {

			try {

				const photo = await cameraRef?.current?.takePictureAsync({
					quality: 1,
				});

				setMediaScr("taken");

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

					setMediaScr("taken");
					setPhoto(flippedImage.uri);
				} else {
					setPhoto(photo.uri);
				}

			} catch (error) {
				console.log('Error taking photo:', error);

			}
		}
	}



	const handleVideoRecording = async () => {
		if (cameraRef && cameraRef.current) {
			if (isRecording) {
				console.log('recording stopped');
				cameraRef.current.stopRecording();
				clearInterval(timerId);
				setTimer(10);
			} else {
				console.log('recording started');
				setIsRecording(true);

				// Start the countdown timer
				const id = setInterval(() => {
					setTimer((prevTimer) => {
						if (prevTimer === 1) {
							cameraRef.current.stopRecording();
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
					const recordingPromise = await cameraRef.current.recordAsync({quality: Camera.Constants.VideoQuality['1080p']});

					// Wait for recording to finish
					const videoData = recordingPromise;
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
		const formData = new FormData();
		formData.append('user', myUsername);
		formData.append('caption', caption);
		formData.append('challenge', challenge ? true : false);
		if (linkedPlans) {
			formData.append('linkedPlans', JSON.stringify(linkedPlans));
		}

		if (photo) {
			formData.append('postMedia', {
				uri: photo,
				type: 'image/jpeg', // Adjust based on your image format
				name: `${Math.floor(Date.now() / 1000)}.jpeg`,
			});
		} else if (video) {
			formData.append('postMedia', {
				uri: video,
				type: 'video/mp4', // Adjust based on your video format
				name: `${Math.floor(Date.now() / 1000)}.mp4`,
			});
		}

		await axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/post/save`,
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
				setLoading(false);
		

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
				console.log(error);
			})
			.finally(() => {
				setPhoto(null);
				setVideo(null);
				setCaption('');

				navigate.goBack();
				() => refreshMyUserInfo() 		

			});
	};

	const onPressCloseMediaSelection = () => {
		setCaption('');
		setPhoto(null);
		setVideo(null);
		setMediaScr(undefined);
	}


	useEffect(() => {
		console.log('permission', permission);
		if (permission?.granted === false) {
			requestPermission();
		}
	}, [permission]);

	if (permission === null) {
		return (
			<View style={createPostStyles.loadingContainer}>
				<LoadingSpinner />
			</View>
		);
	}
	if (permission?.granted === false) {
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
			{photo === null && video === null ? (
				<>
					<Header />
					<TouchableOpacity
						activeOpacity={0.7}
						style={createPostStyles.cameraRollContainer}
						onPress={pickMedia}>
						<FontAwesome
							style={createPostStyles.cameraRollIcon}
							name='picture-o'
							size={24}
							// color='white'
							// backgroundColor='white'
						/>
					</TouchableOpacity>
					<View style={createPostStyles.createPostContainer}>
						<View style={createPostStyles.cameraContainer}>
							<Camera
								// ratio='16:9'
								style={createPostStyles.camera}
								type={
									isCameraFront
										? CameraType.front
										: CameraType.back
								}
								flashMode={
									isFlashOn
										?FlashMode.on
										: FlashMode.off
								}
								ref={cameraRef}
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
							onPress={onPressCloseMediaSelection}
						>
						<AntDesign
							style={createPostStyles.retakeIcon}
							name='close'
							size={25}
							color='#ffffff'
						/>
					</TouchableHighlight>
					<View style={createPostStyles.createPostContainer}>
						<View style={[createPostStyles.takenPhotoContainer]}>
							{photo && (
								<TouchableWithoutFeedback
									style={{ flex: 1 }}
									onPress={() => {
										Keyboard.dismiss();
										toggleContentFit(); // Toggle content fit mode on tap
									}}
									accessible={false}>
									<Image
										style={createPostStyles.photoStyle}
										transition={100}
										contentFit={mediaSrc == "taken" ? "cover" : photoContentFit}
										contentPosition={'center'}
										allowDownscaling={false}
										// borderRadius={10}
										source={{ uri: photo }}
										/>
								</TouchableWithoutFeedback>
							)}
							{video && (
								<View>
									<Video
										source={{ uri: video }}
										style={{
											width: Dimensions.get('window')
												.width,
											height: '100%',
										}}
											shouldPlay={true}
											isLooping={true}
											resizeMode={ResizeMode.COVER}
									/>
								</View>
								)}
				

							<View style={[createPostStyles.inputContainer]}>
								<TextInput
									style={createPostStyles.input}
									maxLength={MAX_CAPTION_LENGTH}
									placeholder='Write a caption...'
									placeholderTextColor={
										theme.grayShades.gray500
									}
									value={caption}
									onChangeText={setCaption}
									onFocus={() => {
										setIsFocused(true);
									}}
									onBlur={() => {
										setIsFocused(false);
									}}
										returnKeyType='done'
										keyboardAppearance='dark'
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
							<View style={{ height: 80,  bottom: 100, width: "100%", alignItems: "flex-end", justifyContent: "flex-end"  }}>
								<View style={{width: "100%", height: 40}}> 
									<FloatingAction
										onPressItem={onFloatingActionPress}
										color={"rgba(137, 133, 133, 0.9)"}
										overlayColor={"transparent"}
										showBackground={true}
										actions={actions}
									/>
									</View>
								
								<View style={{display: "flex", right: 0}}>
						<TouchableHighlight
							style={[createPostStyles.sendPostContainer, {right: 0}]}
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
					</View>
						
						</View>
					{loading ? (
						<View style={createPostStyles.sendLoadingContainer}>
							<LoadingSpinner />
						</View>
					) : null}
					
					
					<PlanSelectModal isVisible={isVisible} onPlanModalClose={onPlanModalClose} />

					</>
					

			)}
						
						
		</TouchableWithoutFeedback>

	);
}
