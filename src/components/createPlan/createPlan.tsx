import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Axios from 'axios';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { useCreatePlanStyles } from './createPlan.styles';

export default function CreatePlan() {
	const navigate = useNavigation();
	const { theme } = useThemeContext();
	const { username: myUsername, refreshMyUserInfo } = useMyUserInfo();

	// const { profileUsername } = useParams();
	const [isWorkoutPlan, setIsWorkoutPlan] = useState(true);
	const workoutOptions = ['Lifting', 'Cardio'];
	const [workoutType, setWorkoutType] = useState(workoutOptions[0]);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const createPlanStyles = useCreatePlanStyles();

	const weights = Array.from({ length: 501 / 5 }, (_, index) =>
		(index * 5).toString(),
	);
	const sets = Array.from({ length: 101 }, (_, index) => index.toString());
	const reps = Array.from({ length: 101 }, (_, index) => index.toString());
	const miles = Array.from({ length: 101 }, (_, index) => index.toString());
	const minutes = Array.from({ length: 31 }, (_, index) => index.toString());
	const seconds = Array.from({ length: 61 }, (_, index) => index.toString());

	const [currentWeight, setCurrentWeight] = useState(weights[20]);
	const [currentSets, setCurrentSets] = useState(sets[4]);
	const [currentReps, setCurrentReps] = useState(reps[12]);
	const [currentMiles, setCurrentMiles] = useState(miles[3]);
	const [currentMinutes, setCurrentMinutes] = useState(minutes[10]);
	const [currentSeconds, setCurrentSeconds] = useState(seconds[30]);

	const savePlan = () => {
		if (!image || !title || !description) {
			Toast.show({
				type: 'error',
				position: 'top',
				text1: 'Please enter all fields!',
				visibilityTime: 3000,
				autoHide: true,
				topOffset: 50,
			});
			return;
		}

		setLoading(true);
		let formData = new FormData();
		formData.append('user', myUsername);
		formData.append('title', title);
		formData.append('description', description);
		if (isWorkoutPlan) {
			formData.append('planType', workoutType);
			if (workoutType === 'Lifting') {
				formData.append('data1', currentWeight);
				formData.append('data2', currentSets);
				formData.append('data3', currentReps);
			} else if (workoutType === 'Cardio') {
				formData.append('data1', currentMiles);
				formData.append('data2', currentMinutes);
				formData.append('data3', currentSeconds);
			}
		} else {
			formData.append('planType', 'Nutrition');
		}

		formData.append('planImage', {
			uri: image,
			type: 'image/jpeg',
			name: `${myUsername}_${Math.floor(Date.now() / 1000)}.jpeg`,
		});

		Axios.post(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plan/save`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		)
			.then((response) => {
				console.log('savePlan', response.data);
				Toast.show({
					type: 'success',
					position: 'top',
					text1: 'Plan Saved!',
					visibilityTime: 1000,
					autoHide: true,
					topOffset: 150,
				});
			})
			.catch((error) => {
				console.log(error);
				Toast.show({
					type: 'error',
					position: 'top',
					text1: 'Hmm.. something went wrong',
					text2: 'There was an error saving your plan',
					visibilityTime: 1000,
					autoHide: true,
					topOffset: 150,
				});
			})
			.finally(() => {
				refreshMyUserInfo()
					.catch((error) => {
						console.log('refreshMyUserInfoError', error);
					})
					.finally(() => {
						setLoading(false);

						navigate.goBack();
					});
			});
	};

	// pick an image from camera roll
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 1,
			allowsMultipleSelection: false,
		});

		console.log('pickImage');

		if (!result.canceled && result.assets && result.assets[0].uri) {
			setImage(result.assets[0].uri);
		}
	};
	useEffect(() => {
		console.log('image', image);
		console.log('title', title);
		console.log('description', description);
	}, [image, title, description]);

	return (
		<SafeAreaView style={{ flex: 1, width: '100%' }}>
			<TouchableOpacity
				style={createPlanStyles.backArrowContainer}
				onPress={() => navigate.goBack()}>
				<EvilIcons
					name='chevron-left'
					size={50}
					color='white'
				/>
			</TouchableOpacity>

			<View style={createPlanStyles.createPlanContainer}>
				<View>
					<Text style={createPlanStyles.createPlanTitleText}>
						Create Plan
					</Text>
				</View>
				<View style={createPlanStyles.planTypeContainer}>
					<TouchableOpacity
						onPress={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium,
							);
							setIsWorkoutPlan(true);
						}}>
						<Text
							style={
								isWorkoutPlan
									? createPlanStyles.planTypeTextSelected
									: createPlanStyles.planTypeText
							}>
							Workout
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium,
							);
							setIsWorkoutPlan(false);
						}}>
						<Text
							style={
								isWorkoutPlan
									? createPlanStyles.planTypeText
									: createPlanStyles.planTypeTextSelected
							}>
							Nutrition
						</Text>
					</TouchableOpacity>
				</View>
				{isWorkoutPlan ? (
					<>
						<View style={createPlanStyles.workoutTypeContainer}>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium,
									);
									setWorkoutType('Lifting');
								}}>
								<Text
									style={
										workoutType === 'Lifting'
											? createPlanStyles.planTypeTextSelected
											: createPlanStyles.planTypeText
									}>
									Lifting
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium,
									);
									setWorkoutType('Cardio');
								}}>
								<Text
									style={
										workoutType === 'Cardio'
											? createPlanStyles.planTypeTextSelected
											: createPlanStyles.planTypeText
									}>
									Cardio
								</Text>
							</TouchableOpacity>
						</View>

						<TextInput
							style={createPlanStyles.titleInput}
							placeholder='Title'
							onChangeText={setTitle}
							placeholderTextColor={theme.textColorSecondary}
						/>
						<TextInput
							style={createPlanStyles.descriptionInput}
							placeholder='description'
							onChangeText={setDescription}
							placeholderTextColor={theme.textColorSecondary}
						/>
						<View style={createPlanStyles.planInfoContainer}>
							{workoutType === 'Lifting' ? (
								<>
									<Picker
										selectedValue={currentSets}
										style={createPlanStyles.numberPicker}
										onValueChange={(value) => {
											setCurrentSets(value);
										}}>
										{sets.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										x
									</Text>
									<Picker
										selectedValue={currentReps}
										style={createPlanStyles.numberPicker}
										onValueChange={(value) => {
											setCurrentReps(value);
										}}>
										{reps.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										{' '}
										at{' '}
									</Text>
									<Picker
										selectedValue={currentWeight}
										style={
											createPlanStyles.numberPickerWide
										}
										onValueChange={(value) => {
											setCurrentWeight(value);
										}}
										mode='dropdown'
										selectionColor={theme.textColorPrimary}>
										{weights.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
												style={
													createPlanStyles.pickerItemStyle
												}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										{' '}
										lbs
									</Text>
								</>
							) : (
								<>
									<Picker
										selectedValue={currentMinutes}
										style={createPlanStyles.numberPicker}
										onValueChange={(value) => {
											setCurrentMinutes(value);
										}}>
										{minutes.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										:
									</Text>
									<Picker
										selectedValue={currentSeconds}
										style={createPlanStyles.numberPicker}
										onValueChange={(value) => {
											setCurrentSeconds(value);
										}}>
										{seconds.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										{' '}
										for{' '}
									</Text>
									<Picker
										selectedValue={currentMiles}
										style={
											createPlanStyles.numberPickerWide
										}
										onValueChange={(value) => {
											setCurrentMiles(value);
										}}>
										{miles.map((weight) => (
											<Picker.Item
												key={weight}
												label={weight}
												value={weight}
											/>
										))}
									</Picker>
									<Text style={createPlanStyles.planInfoText}>
										{' '}
										miles
									</Text>
								</>
							)}
						</View>
						{image ? (
							<View
								style={[
									createPlanStyles.previewImageContainer,
									{ marginTop: 20 },
								]}>
								<Image
									style={createPlanStyles.previewImage}
									source={{ uri: image }}
								/>
							</View>
						) : (
							<View
								style={createPlanStyles.previewImageContainer}>
								<TouchableOpacity
									style={createPlanStyles.selectImageButton}
									onPress={pickImage}>
									<Text
										style={
											createPlanStyles.selectImageText
										}>
										Select Image
									</Text>
									<AntDesign
										name='picture'
										size={40}
										color='black'
									/>
								</TouchableOpacity>
							</View>
						)}
						<View style={{ gap: 20 }}>
							<TouchableOpacity
								style={createPlanStyles.submitButtonDisabled}
								onPress={savePlan}>
								<Text style={createPlanStyles.submitText}>
									Submit
								</Text>
							</TouchableOpacity>
						</View>
					</>
				) : (
					<>
						<TextInput
							style={createPlanStyles.titleInput}
							placeholder='Title'
							onChangeText={setTitle}
							placeholderTextColor={theme.textColorSecondary}
						/>
						<TextInput
							style={createPlanStyles.descriptionInputNutrition}
							placeholder='description'
							onChangeText={setDescription}
							multiline={true}
							placeholderTextColor={theme.textColorSecondary}
						/>
						{image ? (
							<View
								style={createPlanStyles.previewImageContainer}>
								<Image
									style={createPlanStyles.previewImage}
									source={{ uri: image }}></Image>
							</View>
						) : (
							<View
								style={createPlanStyles.previewImageContainer}>
								<TouchableOpacity
									style={createPlanStyles.selectImageButton}
									onPress={pickImage}>
									<Text
										style={
											createPlanStyles.selectImageText
										}>
										Select Image
									</Text>
									<AntDesign
										name='picture'
										size={40}
										color='black'
									/>
								</TouchableOpacity>
							</View>
						)}
						<TouchableOpacity
							style={createPlanStyles.submitButtonDisabled}
							onPress={savePlan}>
							<Text style={createPlanStyles.submitText}>
								Submit
							</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
			{loading ? (
				<View style={createPlanStyles.sendLoadingContainer}>
					<LoadingSpinner />
				</View>
			) : null}
		</SafeAreaView>
	);
}
