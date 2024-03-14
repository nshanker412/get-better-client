import { Modal } from '@components/primitives/action-modal/ActionModal';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NutritionDetail, NutritionRoutine, TimeOfDay, findFoodById } from '../plan.types';


import { ButtonGroup } from '@rneui/base';
import { Input } from '@rneui/themed';

export interface FoodItemModalProps {
    food: NutritionDetail | undefined;
    isOpen: boolean;
    onClose: () => void;
  onSetDataCB: (data: NutritionRoutine) => void;
}
  


const servingChoices = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

// export enum TimeOfDay {
//   Breakfast = 'Breakfast',
//   Lunch = 'Lunch',
//   Dinner = 'Dinner',
//   Snack = 'Snack',
// }

//  interface Ingredient {
//   id: string;
//   name: string;
//   quantity: number; // Quantity could be in grams, milliliters, or unit count
//   unit: 'g' | 'ml' | 'unit' | 'cups'| 'oz' | string;
// }

//  interface Meal {
//   id: string;
//   name: string;
//   time: string; // Suggested time for the meal, e.g., "08:00", "12:30"
//   calories?: number;
//   proteins?: number; // grams
//   carbs?: number; // grams
//   fats?: number; // grams
//   ingredients: Ingredient[] | [];
// }


//  interface NutritionRoutine extends Meal {
  // servings: number | undefined;
  // notes: string | undefined;
  // timeOfDay: TimeOfDay | undefined;
  // cookingInstructions: string | undefined;
  // init: boolean;
  // metadata: []
// }


// export interface ButtonGroupProps extends InlinePressableProps {
//   button?: object;
//   Component?: typeof React.Component;
//   onPress?(...args: any[]): void;
//   buttons?: (string | ButtonComponent | ButtonObject)[];
//   containerStyle?: StyleProp<ViewStyle>;
//   textStyle?: StyleProp<TextStyle>;
//   selectedTextStyle?: StyleProp<TextStyle>;
//   selectedButtonStyle?: StyleProp<ViewStyle>;
//   underlayColor?: string;
//   selectedIndex?: number | null;
//   selectedIndexes?: number[];
//   activeOpacity?: number;
//   onHideUnderlay?(): void;
//   onShowUnderlay?(): void;
//   setOpacityTo?: (value: number) => void;
//   innerBorderStyle?: {
//       color?: string;
//       width?: number;
//   };
//   buttonStyle?: StyleProp<ViewStyle>;
//   buttonContainerStyle?: StyleProp<ViewStyle>;
//   selectMultiple?: boolean;
//   disabled?: boolean | number[];
//   disabledStyle?: StyleProp<ViewStyle>;
//   disabledTextStyle?: StyleProp<TextStyle>;
//   disabledSelectedStyle?: StyleProp<ViewStyle>;
//   disabledSelectedTextStyle?: StyleProp<TextStyle>;
//   vertical?: boolean;
// }
// export declare const ButtonGroup: RneFunctionComponent<ButtonGroupProps>;
// export {};



  
export const FoodItemModal: React.FC<FoodItemModalProps> = ({ food, isOpen, onClose, onSetDataCB }) => {



  const [servings, setServings] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | undefined>(undefined);
  const [cookingInstructions, setCookingInstructions] = useState<string | undefined>(undefined);
  const [metadata, setMetadata] = useState<string | undefined>(undefined);

  const [selectedIndex, setSelectedIndex] = useState(4);

  const foodDetails = findFoodById(food?.type, food?.id);

  const [calories, setCalories] = useState<number | undefined>(undefined);
  const [proteins, setProteins] = useState<number | undefined>(undefined);
  const [carbs, setCarbs] = useState<number | undefined>(undefined);
  const [fats, setFats] = useState<number | undefined>(undefined);
  



    if (!food || !foodDetails) {
        return null;
    }

  // const { state: planState, dispatch: planDispatch } = usePlanBuilder();
  

  //calculate calories, proteins, carbs, fats based on servings
  useEffect(() => {
    if (servings) {

      const { calories, protien, carbs, fats } = foodDetails;
      const newCalories = calories * servings;
      const newProteins = protien! * servings;
      const newCarbs = carbs! * servings;
      const newFats = fats! * servings;
      setCalories(newCalories);
      setProteins(newProteins);
      setCarbs(newCarbs);
      setFats(newFats);
    }
  }, [servings]);



  const onAddPress = () => {
      

    //calculate 

        const newRoutine: NutritionRoutine = {
          id: food.id,
          name: food.name,
          init: true,
          time: "00:00",
          servings,
          notes,
          timeOfDay,
          cookingInstructions,
          calories,
          proteins,
          carbs,
          fats,
          ingredients: [],
          metadata: []
        }
        onSetDataCB(newRoutine);

        // const newRoutineList: ExerciseRoutine[] = planState.routine?.map((item) => {
        //     if (item.id === exercise.id) {
        //         return newRoutine
        //     }
        //     return item;
        // });

    

        // console.log('newRoutineList', newRoutineList);
        // planDispatch({
        //     type: 'SET_PLAN_ROUTINE',
        //     payload: newRoutineList
        // });
        // onClose();
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
            <Text style={styles.headerTitle}>Enter your meal details</Text>
            <Text style={styles.subHeaderTitle}>Food: {foodDetails.name}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>
            <View style={{ flex: 1, width: "100%", gap: 10  }}> 
              <View style={{ flex: 1, width: "100%", justifyContent: "flex-start" }}>
              {/* <Text style={styles.smallLabel}>Servings</Text> */}

                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'flex-start', gap: 20,alignItems: 'center', borderRadius: 6, borderWidth: 0.5, borderColor: grayDark.gray6 }}>
                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: 5 }}>
                  <Text style={styles.smallLabel}>{"Servings"}</Text>

                  <Picker
                    mode='dialog'
                    style={{width: 50, height : 50}}  
                    itemStyle={styles.item}
                    selectedValue={servings}
                    selectionColor="rgba(0, 0, 0, 0.3)"
                    onValueChange={(value) => setServings(value)}>
                    {servingChoices.map((value) => (
                      <Picker.Item
                        key={value}
                        value={value}
                        label={value}
                      />
                    ))}
                    </Picker>
                  </View>
                  <View style={{flexDirection: "row", gap: 10}}>
                    

                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                  <Text style={styles.unitLabel}>{carbs}g</Text>
                    <Text style={styles.smallLabel}>carbs</Text>
                  </View>
                  <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                  <Text style={styles.unitLabel}>{proteins}g</Text>
                    <Text style={styles.smallLabel}>protein</Text> 
                    </View>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                  <Text style={styles.unitLabel}>{fats}g</Text>
                    <Text style={styles.smallLabel}>fat</Text> 
                    </View>
                    </View>



            </View>
              <Input 
                  label={
                    <Text style={styles.smallLabel}>Notes</Text>
                  }
                placeholder="Enter any notes"
                value={notes}
                onChangeText={setNotes}
                style={styles.picker}
              />
              <Input 

                  label={
                    <Text style={styles.smallLabel}>Cooking Instructions</Text>
                  }
                placeholder="Enter any cooking instructions"
                value={cookingInstructions}
                onChangeText={setCookingInstructions}
                style={styles.picker}
                />
                       <Input 

                    label={
                      <Text style={styles.smallLabel}>Ingredients</Text>
                    }
                  placeholder="Enter any ingredients"
                  value={metadata}
                  onChangeText={setMetadata}
                  style={styles.picker}

/>
            </View>



        
              <View style={{  width: "100%",  }}>
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
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 10 }}>
            <Button title="Add" onPress={onAddPress} buttonStyle={styles.button} titleStyle={styles.buttonTitle} />
          </View>
        </View>
      </Modal>
    );
  };
FoodItemModal.displayName = 'FoodItemModal';
  


const styles = StyleSheet.create({
    unitLabel: {
    fontFamily: fonts.inter.light,
    fontSize: 12,
    color: grayDark.gray12 
  },
  smallLabel: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: grayDark.gray12 
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
    width: 50,
    height: 50,
    alignItems: 'flex-start',
    fontSize: 14,
    color: grayDark.gray12,
    textAlign: 'left',
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
            fontFamily: fonts.inter.semi_bold,
            color: grayDark.gray12,
            fontSize: 25,
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