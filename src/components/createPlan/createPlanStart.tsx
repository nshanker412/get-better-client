import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActionButton } from '../primitives/action-button/ActionButton';
import { useCreatePlanStyles } from './createPlan.styles';


/**
 * WIP - progressive create plan modal 
 */
export const CreatePlanStart: React.FC = () => {
	const navigate = useNavigation();

	// const { profileUsername } = useParams();
	const [isWorkoutPlan, setIsWorkoutPlan] = useState(true);

	const createPlanStyles = useCreatePlanStyles();

	
	const onSetWorkoutPlan = () => {
		setIsWorkoutPlan(true);
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{flex: 1, alignItems: 'stretch', gap: 10}}>
				<View style={createPlanStyles.headerContainer}>
			<TouchableOpacity
				style={createPlanStyles.backArrowContainer}
				onPress={() => navigate.goBack()}>
				<EvilIcons
					name='chevron-left'
					size={50}
					color='white'
				/>
			</TouchableOpacity>
			</View>
			<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>

				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<View>
						<Text style={createPlanStyles.createPlanTitleText}>
							Create Plan
						</Text>
					</View>
					<View>
						<Text style={createPlanStyles.createPlanSubHeaderText}> Choose your plan type </Text>
					</View>
				</View>
				<View style={{flex: 1, alignItems: "center", justifyContent: "center", gap: 50, width: "50%"}}>

					<ActionButton
					styles={{container: {padding: 10, width: "100%", height: "auto"}, text: {fontSize: 25}}}
					loading={false}
					onPress={onSetWorkoutPlan}
					title={'Workout'}
					defaultPressed={false}
					disabled={false}
					isPrimary={true} />
                <ActionButton
					styles={{container: {padding: 10, width: "100%", height: "auto"}, text: {fontSize: 25}}}
					loading={false}
					onPress={onSetWorkoutPlan}
					title={'Nutrition'}
					defaultPressed={false}
					disabled={false}
					isPrimary={true} />
				</View>
				
				<View style={{flex: 1, alignItems: "center", justifyContent: "center", gap: 20}}> 	
				</View>
				</View>

		</View>
		</SafeAreaView>
	);
}
