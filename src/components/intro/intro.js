import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Header } from '../header/Header';
import { useIntroStyles } from './intro.styles';

export default function Intro() {
	const { setShownIntroPage } = useMyUserInfo();
	const navigation = useNavigation();

	const introStyles = useIntroStyles();

	return (
		<>
			<Header />
			<View style={introStyles.introContainer}>
				<View style={introStyles.questionContainer}>
					<Text style={introStyles.questionText}>
						Did you Get Better today?
					</Text>
				</View>
				<TouchableOpacity
					style={introStyles.yesButton}
					onPress={() => {
						setShownIntroPage();
						navigation.navigate('Main', {
							screen: 'post',
						});
					}}>
					<Text style={introStyles.yesText}>Yes</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={introStyles.noButton}
					onPress={() => {
						setShownIntroPage();
						navigation.navigate('Main');
					}}>
					<Text style={introStyles.noText}>Not Yet</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
