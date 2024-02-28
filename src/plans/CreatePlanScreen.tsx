import { Dropdown } from '@components/primitives/dropdown/Dropdown';
import { MultiSelectComponent } from '@components/primitives/dropdown/MultiSelect';
import { ProgressBar } from '@components/primitives/progress/Progress';
import { grayDark, greenDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button, Input, ListItem } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlanBuilderProvider, usePlanBuilder } from './PlanBuilderContext';
import { ActionType, PlanScreenProvider, Step, usePlanScreen } from './PlanScreenContext';
import {
  CardioDropdownItem,
  CategoryDropdownItem,
  ExerciseDetail,
  ExerciseDropdownItem,
  PlanCategory,
  WorkoutSubcategoryDropdownItem, findExerciseByName, generateCardioDropdownItems,
  generateExerciseDropdownItems,
  planCategoryDropdownItems,
  workoutSubcategoryDropdownItems
} from './plan.types';

import { ExerciseItemModal } from './modals/ExerciseItemModal';

// Helper functions
const getStepNumber = (step: Step) => {
  switch (step) {
    case Step.ChooseCategory:
      return 0;
    case Step.AddInfo:
      return 1;
    case Step.Review:
      return 2;
    case Step.Submit:
      return 3;
  }
}


const getStepTitle = (step: Step) => {
  switch (step) {
    case Step.ChooseCategory:
      return "Create your plan";
    case Step.AddInfo:
      return "Add Plan Details";
    case Step.Review:
      return "Review";
    case Step.Submit:
      return "Submit";
  }
}

const ButtonBase = ({ disabled = false, title, onPress }: { disabled?: boolean, title: string; onPress: () => void }) => {
  console.log("disabled", disabled)
  return (
    <View style={{ padding: 10 }}>
      <Pressable disabled={disabled}  style={{ padding: 15, backgroundColor: disabled ? grayDark.gray9 : "white" , borderRadius: 10, maxHeight: 50, alignItems: "center", justifyContent: "center"}} onPress={onPress} >
      <TouchableOpacity disabled={disabled}>
      <Text style={{ fontFamily: fonts.inter.black }}>{title}</Text>
        </TouchableOpacity>
        </Pressable>
    </View>
  );
}


  // Component
  const _CreatePlanScreen: React.FC = () => {
  const navigation = useNavigation();
    const { state: screenState, dispatch: screenDispatch } = usePlanScreen();
    

    useEffect(() => {
      console.log(screenState.currentStep);
    }, [screenState.currentStep]);
      


  useEffect(() => {
    return () => {
      screenDispatch({ type: ActionType.Reset });
    };
  }, []);
  
  const onSubmit = () => {
    screenDispatch({ type: ActionType.Reset });
  }
   
   const onClosePress = () => {
      screenDispatch({ type: ActionType.Reset });
      navigation.goBack();
    }

  return (
    <SafeAreaView style={{ flex: 1, width:"100%", height:"100%" }}>
      <View style={{ flex: 1, padding: 10, justifyContent: "space-around"}}>
        <ProgressBar totalSteps={3} currentStep={getStepNumber(screenState.currentStep)} />
          <Text style={{ color: grayDark.gray12, fontFamily: fonts.inter.black, fontSize: 20 }}>{getStepTitle(screenState.currentStep)}</Text>
      </View>
      <View style={{flex: 1}} />
      
      <View style={{ flex: 12, margin: 10 }}>     
        
        {screenState.currentStep === Step.ChooseCategory && (
          <ChooseCategoryBody
            onClosePress={onClosePress}
            onNext={() => screenDispatch({ type: ActionType.NextStep })}
            onPrev={() => screenDispatch({ type: ActionType.PrevStep })}
          />
        )}
        
        {screenState.currentStep === Step.AddInfo && (
          <AddPlanDetails />
        )}
        {screenState.currentStep === Step.Review && (
          <Review />
        )}

      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}/>

    </SafeAreaView>
  );
}


interface ChooseCategoryBodyProps {
  onNext: () => void;
  onPrev: () => void;
  onClosePress?: () => void;
}

const ChooseCategoryBody: React.FC<ChooseCategoryBodyProps> = ({closePress}) => {
  const { state: planState, dispatch } = usePlanBuilder();

  const {  dispatch: screenDispatch } = usePlanScreen();


  const onCardioTypeChange = (item: CardioDropdownItem) => {
    console.log('onCardioTypeChange', item);
    // setSelectedCardioExercise(item);

    dispatch(
      {
        type: 'SET_PLAN_BASE',
        payload: {
          init: {
            planCategory: PlanCategory.Cardio,
            subcategory: null,
            selectedExercises: [],
            selectedCardioExercise: {
              id: item.id,
              name: item.label,
              type: item.type,
            }
          },
          routine: [],
        }
      }
    );
  }

  const onCategorySelectionChange = (item: CategoryDropdownItem) => {
    console.log('onSelectionChange', item);
    // setSelectedCategory(item.type);
    dispatch(
      {
        type: 'SET_PLAN_BASE',
        payload: {
          init: {
            planCategory: item.type,
            subcategory: null,
            selectedExercises: [],
            selectedCardioExercise: null,
          },
          routine: [],
        }
      }
    );
  }

  const onSubcategoryChange = (item: WorkoutSubcategoryDropdownItem) => {
    console.log('onSubcategoryChange', item);
    // setSelectedSubcategory(item.type);
    dispatch(
      {
        type: 'SET_PLAN_BASE',
        payload: {
          init: {
            planCategory: PlanCategory.Workout,
            subcategory: item.type,
            selectedExercises: [],
            selectedCardioExercise: null,
          },
          routine: [],
        }
      }
    );
  }

  const onExercisesChange = (items: string[]) => {
    console.log('onSubcategoryChange', items);
      if (planState.init?.subcategory && items.length > 0) {
        const exerciseList: ExerciseDetail[] = items.map((ex) => findExerciseByName(planState.init.subcategory!, ex)!);
        console.log('exerciseList', exerciseList);
        // setSelectedExercises(exerciseList!);

        const routines = exerciseList.map((item) => {
          return {
            id: item.id,
            sets: undefined,
            reps: undefined,
            weight: undefined,
            notes: undefined,
            init: false
          }
        })
        
        dispatch(
          {
            type: 'SET_PLAN_BASE',
            payload: {
              init: {
                ...planState.init,
                selectedExercises: exerciseList,
                selectedCardioExercise: null,
              },
              routine: routines

            }
          }
        );
      }
    }


  const handleNextPress = () => {
    screenDispatch({ type: ActionType.NextStep });
  }

  const handleClosePress = () => {
    dispatch({ type: ActionType.Reset });
  }

  const cardoSet = planState?.init?.planCategory === PlanCategory.Cardio && planState?.init?.selectedCardioExercise !== undefined;
  const workoutSet = planState?.init?.planCategory === PlanCategory.Workout && planState?.init?.selectedExercises && planState?.init?.selectedExercises?.length > 0 && planState?.init?.subcategory !== undefined;
  const nutritionSet = planState?.init?.planCategory === PlanCategory.Nutrition;

  const canGoNext = cardoSet || workoutSet || nutritionSet;
  return (
    <>
        <Dropdown<CategoryDropdownItem>
        key="plan-category"

          placeholder={planState.init.planCategory ?? "select category"}
          label="Category"
          data={planCategoryDropdownItems}
          onSelectionChange={onCategorySelectionChange}
         />
        {planState.init.planCategory === PlanCategory.Workout && (
          <>
            <Dropdown
            key="subcategory"
            placeholder={planState.init.subcategory ?? "select type"}
              label="Workout Type"
              data={workoutSubcategoryDropdownItems}
              onSelectionChange={onSubcategoryChange}
            />
          {planState.init.subcategory && (
            <MultiSelectComponent<ExerciseDropdownItem>
              icon="weight-lifter"
              key="exerciseType"
              label="Exercise"
              initial={
                planState.init.selectedExercises 
                ? planState.init.selectedExercises.map(exercise => exercise.name) 
                : []
            }                data={generateExerciseDropdownItems(planState.init.subcategory)}
                onSelectionChange={onExercisesChange}
              />
            )}
          </>
      )}
      {planState.init.planCategory === PlanCategory.Cardio && (
        <>
            <Dropdown
                key="cardioType"
                label="Cardio Type"
                data={generateCardioDropdownItems()}
                onSelectionChange={onCardioTypeChange} // Assume this handler is defined
            />
            </>
      )}
  

      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        <View style={{ width: 200 }}>
          <ButtonBase disabled={!canGoNext}  title="Next"  onPress={handleNextPress} />
          </View>
      </View>

      </>
  );
}


interface ExerciseListProps {
  list: ExerciseDetail[];
  onInitChanged: (ready: boolean) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ list , onInitChanged}) => {
  const [selected, setSelected] = useState<ExerciseDetail | undefined>(undefined);
  const { state: planState, dispatch } = usePlanBuilder();

  const closeModal = () => {
    setSelected(undefined);
  }


  useEffect(() => {
    planState.routine.forEach((item) => {
      if (item.init === false) {
        onInitChanged(false);
        return;
      }
    });
  }, [planState.routine])


  return (
    <>
      {
        list?.map((item, index) => (
          <ListItem.Accordion
          bottomDivider
            key={item.id} 
            style={{ borderRadius: 8}}
            icon={{ name: 'check-circle', type: 'font-awesome-5', color: planState.routine[index].init ? greenDark.green11 : grayDark.gray8 }}
            animation={true}
            content={
              <ListItem.Content style={{borderRadius: 8}}>
                <ListItem.Title style={{ color: grayDark.gray12, fontFamily: fonts.inter.regular  }}>{item?.name}</ListItem.Title>
              </ListItem.Content>
            }
            isExpanded={false}
            onPress={() =>   setSelected(list[index])}
            containerStyle={{ backgroundColor: grayDark.gray5 , borderRadius: 2}} // Replace 'gray' with your actual color variable
          >
            <ExerciseItemModal key={ `${item.id}-modal`} exercise={selected} isOpen={selected !== undefined} onClose={closeModal} />

          </ListItem.Accordion>
        ))

      }
      
    </>
  );
};



const styleszz = {
  inputContainerStyle: {
    width: "100%",
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: grayDark.gray4,
    borderRadius: 8,
    marginRight: 20,
    marginLeft: 20,
  },
  ddContainerStyle: {
    container: { backgroundColor: 'white', height: 150 },
    itemContainer: { backgroundColor: grayDark.gray5 },
    itemTextStyle: { color: "white", fontFamily: fonts.inter.regular },
  },
};



// containerStyle?: StyleProp<ViewStyle>;
// disabled?: boolean;
// disabledInputStyle?: StyleProp<TextStyle>;
// inputContainerStyle?: StyleProp<ViewStyle>;
// leftIcon?: IconNode;
// leftIconContainerStyle?: StyleProp<ViewStyle>;
// rightIcon?: IconNode;
// rightIconContainerStyle?: StyleProp<ViewStyle>;
// inputStyle?: StyleProp<TextStyle>;
// InputComponent?: typeof React.Component;
// errorProps?: object;
// errorStyle?: StyleProp<TextStyle>;
// errorMessage?: string;
// label?: string | React.ReactNode;
// labelStyle?: StyleProp<TextStyle>;
// labelProps?: object;
// renderErrorMessage?: boolean;


const detailsStyles = StyleSheet.create({
  button: {
    backgroundColor: grayDark.gray11,
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
})

const AddPlanDetails: React.FC = () => {
  const { state: planState, dispatch: dispatchPlanState } = usePlanBuilder();
  const { dispatch: screenDispatch } = usePlanScreen();

  const [planName, setPlanName] = useState<string>(planState?.init?.planName || '');
  const [planDescription, setPlanDescription] = useState<string>(planState?.init?.planDescription || '');
  const [isExerciseReady, setIsExerciseReady] = useState<boolean>(false);
  const ableToGoNext = planName !== "" && planDescription !== "";


  const onNext = () => {
    dispatchPlanState({ type: "SET_PLAN_DETAILS", payload: { name: planName, description: planDescription } });
    screenDispatch({ type: ActionType.NextStep });
  };

  return (

    <View style={{ flex: 1, width: "100%", height: "100%" }}>
 

      <View style={{ flex: 1, justifyContent: 'center', width:"100%"  }}>
      <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Name</Text>
        <Input
          // labelStyle={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}
          // label="Name"
          value={planName}
          style={{ color: "white" , borderRadius: 2, borderColor: grayDark.gray12, fontSize: 16, fontFamily: fonts.inter.regular,  backgroundColor: grayDark.gray4}}
          onChangeText={setPlanName}
          placeholderTextColor={grayDark.gray9}
          placeholder=" e.g. leg destroyer"
        />
       <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Description</Text>

        <Input
          // label="Description"
          // labelStyle={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}
          value={planDescription}
          style={{ color: "white" , borderRadius: 2, borderColor: grayDark.gray12, fontSize: 16, fontFamily: fonts.inter.regular,  backgroundColor: grayDark.gray4}}         
          multiline={true}
          placeholderTextColor={grayDark.gray9}
          maxLength={200}
          onChangeText={setPlanDescription}
          placeholder=" e.g. this is a leg workout that makes me cry"
        />
      </View>
      <View style={{ flex: 1, flexGrow: 2,  width: "100%",   justifyContent: "center" }}>
        
   

        {planState?.init?.planCategory === PlanCategory.Workout && planState?.init?.selectedExercises && (
          <>
            <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Exercise Details</Text>
            < ExerciseList list={planState.init.selectedExercises} onInitChanged={(ready) => setIsExerciseReady(ready)}/>
            </>
        )}
      </View>

      <View style={{ flex: 1, width: "100%",  }}>
        
        <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Plan Media</Text>

        <View style={{ flex: 1, width: "100%", padding: 10,  
          borderWidth: 1, 
          borderColor: grayDark.gray10, 
          borderStyle: 'dashed', 
          borderRadius: 10,
          justifyContent: "space-around",
          alignItems: "center",
          }}>

 

          <Button buttonStyle={detailsStyles.button} titleStyle={detailsStyles.buttonTitle} title="Upload" onPress={() => {console.log("upoading") }} icon={<Ionicons name="document-attach-outline" size={24} color="black" />} />

        </View>
        </View>
      <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: "row" }}>
        <View style={{ width: 200 }}>
          <ButtonBase title="Back" onPress={() => screenDispatch({ type: ActionType.PrevStep })} />
        </View>
        <View style={{ width: 200 }}>
          <ButtonBase disabled={ !ableToGoNext} title="Next" onPress={onNext} />
        </View>
      </View>
    </View>
  );
};



const Review: React.FC = () => {
  const { state: planState, dispatch } = usePlanBuilder();
  const { state: screenState, dispatch: screenDispatch } = usePlanScreen();

  useEffect(() => {
    console.log('planState', planState);
  }, [planState]);


  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{color: "white"}}>Plan Name</Text>
        <Text style={{color: "white"}}>{planState?.name}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{color: "white"}}>Plan Description</Text>
      <Text style={{color: "white"}}>{planState.description}</Text>
      </View>
      {planState?.media && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Plan Image</Text>
        <Text>Image</Text>

      </View>
      )}

      <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: "row" }}>
        <View style={{ width: 200 }}>
          <ButtonBase title="Back" onPress={() => screenDispatch({ type: ActionType.PrevStep })} />
        </View>
        <View style={{ width: 200 }}>
          <ButtonBase title="Submit" onPress={() => screenDispatch({ type: ActionType.NextStep })} />
        </View>
      </View>
      
    </View>
  );
}


export const CreatePlanScreen: React.FC = () => {
  
  return (
    <PlanScreenProvider>
      <PlanBuilderProvider>
        <_CreatePlanScreen />
      </PlanBuilderProvider>
    </PlanScreenProvider>
  );
}
