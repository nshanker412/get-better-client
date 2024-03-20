import { Modal } from '@components/primitives/action-modal/ActionModal';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CardioExerciseDetail, CardioGoalCategory, CardioRoutine } from '../plan.types';


import { Input } from '@rneui/themed';

export interface CardioItemModalProps {
    cardio: CardioExerciseDetail | undefined;
    isOpen: boolean;
    onClose: () => void;
  onSetDataCB: (data: CardioRoutine) => void;
}
  


const servingChoices = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];



  
export const CardioItemModal: React.FC<CardioItemModalProps> = ({ cardio: cardioExercise, isOpen, onClose, onSetDataCB }) => {

  useEffect(() => {
    console.log('cardioExercise', cardioExercise);
  }, [cardioExercise]);

  const [servings, setServings] = useState<number >(1);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [cookingInstructions, setCookingInstructions] = useState<string | undefined>(undefined);
  const [metadata, setMetadata] = useState<string | undefined>(undefined);

  const [selectedIndex, setSelectedIndex] = useState(4);
 
  

    if (!cardioExercise) {
        return null;
    }




  const [targetDistance, setTargetDistance] = useState<number | undefined>(undefined);
  const [targetDuration, setTargetDuration] = useState<number | undefined>(undefined);
  const [targetTime, setTargetTime] = useState<number | undefined>(undefined);
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [goal, setGoal] = useState<string | undefined>(undefined);
  const [goalCategory, setGoalCategory] = useState<CardioGoalCategory | undefined>(undefined);


  const onAddPress = () => {
  
        const newRoutine: CardioRoutine = {
          id: cardioExercise.id,
          name: cardioExercise.name,
          type: cardioExercise,
          targetDuration: targetDuration,
          targetDistance: targetDistance,
          targetTime: targetTime,
          intensity: intensity,
          goal: goal,
          goalCategory: goalCategory,
          notes: notes,
          metadata: null,
          init: true
        }
        onSetDataCB(newRoutine);
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
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Add detail to your {cardioExercise.name} routine</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
            <View style={{ flex: 1, width: "100%", gap: 10  }}> 
              <View style={{ flex: 1, width: "100%", justifyContent: "flex-start", padding: 10 }}>

                {/* <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'flex-start', gap: 10, alignItems: 'center', borderRadius: 6, borderWidth: 0.5, borderColor: grayDark.gray6 }}>
                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                    <Text style={[styles.smallLabel]}>{"Servings"}</Text>
                    </View>


            </View> */}
                <Input 
                  style={styles.input}
                  label={
                    <Text style={styles.smallLabel}>Goal</Text>
                  }
                placeholder="e.g. get better"
                value={goal}
                  onChangeText={setGoal}
                  keyboardAppearance='dark'

                />
              <Input 
                  style={styles.input}
                  label={
                    <Text style={styles.smallLabel}>Notes</Text>
                  }
                placeholder="Enter any notes"
                value={notes}
                  onChangeText={setNotes}
                  keyboardAppearance='dark'
              />
     



        
              {/* <View style={{  width: "100%", padding: 10 }}>
                <Text style={styles.smallLabel}>When will you eat?</Text>
                <ButtonGroup  
                  buttonStyle={styles.buttonGroup}
                  selectedButtonStyle={{ backgroundColor: grayDark.gray7, borderColor: grayDark.gray9, borderWidth: 1, borderRadius: 1 }}
                  containerStyle={styles.buttonContainer}
                  buttons={[
                    <Text style={styles.timeOfDayLabel}>{TimeOfDay.Breakfast}</Text>,
                    <Text style={styles.timeOfDayLabel}>{TimeOfDay.Lunch}</Text>,
                    <Text style={styles.timeOfDayLabel}>{TimeOfDay.Dinner}</Text>,
                    <Text style={styles.timeOfDayLabel}>{TimeOfDay.Snack}</Text>,
                    <Text style={styles.timeOfDayLabel}>N/A</Text>,
                  ]}
                  selectedIndex={selectedIndex}
                  onPress={(selectedIndex) => setSelectedIndex(selectedIndex)}
                />
              </View> */}
              </View>
              </View>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
            <Button title="Save" onPress={onAddPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
          </View>
        </View>
      </Modal>
    );
  };
CardioItemModal.displayName = 'CardioItemModal';
  


const styles = StyleSheet.create({
  headerStyles: {
    backgroundColor: grayDark.gray11,
    padding: 10,

    fontFamily: fonts.inter.semi_bold,
    color: grayDark.gray12,

  },


    unitLabel: {
    fontFamily: fonts.inter.light,
    fontSize: 18,
    color: grayDark.gray11
  },
  input: {
    color: grayDark.gray11,
    fontFamily: fonts.inter.light,
    fontSize: 14,
  },
  smallLabel: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: grayDark.gray11
  },
  buttonContainer: {
    backgroundColor: grayDark.gray8, // Dark background for the ButtonGroup container
    borderWidth: 0, // Optional: remove container border
  },
  buttonGroup: {
    backgroundColor: grayDark.gray11, // Dark background for the ButtonGroup container
  },
  timeOfDayLabel: {
    fontFamily: fonts.inter.black,
    color: grayDark.gray3,
    fontSize: 10,
  },
  item: {
    width: 80,
    height: 50,
    // alignItems: 'flex-start',
    // alignSelf: 'center',
    fontSize: 14,
    color: grayDark.gray12,
    // textAlign: 'left',
    fontWeight: 'bold',
    padding: 0,
    margin: 0,

  },
    picker: {
        // marginTop: 10,
        // backgroundColor: 'white',
      // backgroundColor: theme.innerContainer.backgroundColor,
      padding: 0,
      margin: 0,
        borderRadius: 4,
        fontSize: 12,
        // width: '27.5%',
    },
    headerTitle: {
            fontFamily: fonts.inter.bold,
            color: grayDark.gray12,
            fontSize: 18,
    },
    subHeaderTitle: {
        fontFamily: fonts.inter.light,
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