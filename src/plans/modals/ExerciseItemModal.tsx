import { Modal } from '@components/primitives/action-modal/ActionModal';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { usePlanBuilder } from '../PlanBuilderContext';
import { ExerciseDetail, ExerciseRoutine, repOptions, setOptions, weightOptions } from '../plan.types';
export interface ExerciseItemModalProps {
    exercise: ExerciseDetail | undefined;
    isOpen: boolean;
    onClose: () => void;
  }


  
export const ExerciseItemModal: React.FC<ExerciseItemModalProps> = ({ exercise, isOpen, onClose }) => {

    const [currentWeight, setCurrentWeight] = useState<number | undefined>(undefined);
    const [currentReps, setCurrentReps] = useState<number | undefined>(undefined);
    const [currentSets, setCurrentSets] = useState<number | undefined>(undefined);
    const [currentNotes, setCurrentNotes] = useState<string | undefined>(undefined);


    if (!exercise) {
        return null;
    }

    const { state: planState, dispatch: planDispatch } = usePlanBuilder();



    const onAddPress = () => {

        const newRoutine: ExerciseRoutine = {
                id: exercise.id,
                sets: currentSets,
                reps: currentReps,
                weight: currentWeight,
                notes: currentNotes,
                init: true
        }

        const newRoutineList: ExerciseRoutine[] = planState.routine?.map((item) => {
            if (item.id === exercise.id) {
                return newRoutine
            }
            return item;
        });

    

        console.log('newRoutineList', newRoutineList);
        planDispatch({
            type: 'SET_PLAN_ROUTINE',
            payload: newRoutineList
        });
        onClose();
    }
  
    return (
      <Modal
        isVisible={isOpen}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}
        animationInTiming={350}
        animationOutTiming={350}
      >
        <View style={{ height: '70%', width: '95%', borderRadius: 16, backgroundColor: grayDark.gray5 }}>
          <Pressable onPress={onClose} style={{ padding: 5 }}>
            <Ionicons name="close-sharp" size={24} color="black" />
          </Pressable>
                <View style={{  flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                 <Text style={styles.headerTitle}>Enter your workout details</Text>
                    <Text style={styles.subHeaderTitle }>Exercise: {exercise.name}</Text>
                </View>
  
                <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <>
            <Picker selectedValue={currentSets} onValueChange={setCurrentSets} style={styles.picker}>
              {setOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
            <Text style={styles.label}>x</Text>
            <Picker selectedValue={currentReps} onValueChange={setCurrentReps}  style={styles.picker}>
              {repOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
            <Text style={styles.label}>at</Text>
            <Picker selectedValue={currentWeight} onValueChange={setCurrentWeight} mode="dropdown" style={styles.picker}>
              {weightOptions.map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
            <Text style={styles.label}>lbs</Text>
                        </>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
                    <Button title="Add" onPress={onAddPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle}  />
                    </View>
        </View>
      </Modal>
    );
  };
ExerciseItemModal.displayName = 'ExerciseItemModal';
  


const styles = StyleSheet.create({
    picker: {
        marginTop: 10,
        backgroundColor: 'white',
        // backgroundColor: theme.innerContainer.backgroundColor,
        borderRadius: 10,
        fontSize: 12,
        width: '27.5%',
    },
    headerTitle: {
            fontFamily: fonts.inter.semi_bold,
            color: grayDark.gray12,
            fontSize: 25,
    },
    subHeaderTitle: {
        fontFamily: fonts.inter.regular,
        color: grayDark.gray12,
        fontSize: 20,
    },
    button: {
        backgroundColor: grayDark.gray12,
        borderRadius: 10,
        padding: 10,
        color: grayDark.gray5,
        // width: '50%',
        // marginTop: 10,
    },
    buttonTitle: {
        color: grayDark.gray5,
        fontFamily: fonts.inter.semi_bold,
        fontSize: 16,
    },
    label: {
        fontFamily: fonts.inter.regular,
        color: grayDark.gray12,
        fontSize: 16,
    },
    
});