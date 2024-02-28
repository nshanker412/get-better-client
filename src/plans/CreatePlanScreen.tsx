import { Dropdown } from '@components/primitives/dropdown/Dropdown';
import { MultiSelectComponent } from '@components/primitives/dropdown/MultiSelect';
import { ProgressBar } from '@components/primitives/progress/Progress';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { Input } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PlanBuilderProvider, PlanInitSelection, usePlanBuilder } from './PlanBuilderContext';
import { ActionType, PlanScreenProvider, Step, usePlanScreen } from './PlanScreenContext';
import {
  CardioDropdownItem,
  CardioExerciseDetail,
  CategoryDropdownItem,
  ExerciseDropdownItem,
  ExerciseMainCategory,
  ExerciseType,
  PlanCategory,
  WorkoutSubcategoryDropdownItem,
  generateCardioDropdownItems,
  generateExerciseDropdownItems,
  planCategoryDropdownItems,
  workoutSubcategoryDropdownItems
} from './plan.types';

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
      
      <View style={{ flex: 10, padding: 10 }}>     
        
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
  const [selectedCategory, setSelectedCategory] = useState< PlanCategory | undefined>(planState?.init?.planCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<ExerciseMainCategory | undefined>(planState?.init?.subcategory);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>(planState?.init?.selectedExercises || []);
  const [selectedCardioExercise, setSelectedCardioExercise] = useState<CardioExerciseDetail | undefined>(planState?.init?.selectedCardioExercise); 
  const {  dispatch: screenDispatch } = usePlanScreen();


  const onCardioTypeChange = (item: CardioDropdownItem) => {
    console.log('onCardioTypeChange', item);
    setSelectedCardioExercise(item);
  }

  const onCategorySelectionChange = (item: CategoryDropdownItem) => {
    console.log('onSelectionChange', item);
    setSelectedCategory(item.type);
  }

  const onSubcategoryChange = (item: WorkoutSubcategoryDropdownItem) => {
    console.log('onSubcategoryChange', item);
    setSelectedSubcategory(item.type);
  }

  const onExercisesChange = (items: ExerciseDropdownItem[]) => {
    console.log('onSubcategoryChange', items);
    setSelectedExercises(items);
  }

  const handleNextPress = () => {
    console.log("handlingPress")
    if (selectedCategory === PlanCategory.Workout) {

      console.log('selectedCategory', selectedCategory);
      const packet: PlanInitSelection = {
        planCategory: selectedCategory,
        subcategory: selectedSubcategory!,
        selectedExercises: selectedExercises,
        selectedCardioExercise: null,
      };
      dispatch(
        {
          type: 'SET_PLAN_BASE',
          payload: packet
        }
      );
    } else if (selectedCategory === PlanCategory.Cardio) {
      console.log('cardio', selectedCategory);

      const packet: PlanInitSelection = {
        planCategory: selectedCategory,
        subcategory: null,
        selectedExercises: [],
        selectedCardioExercise: selectedCardioExercise!,
      };
      dispatch(
        {
          type: 'SET_PLAN_BASE',
          payload: packet
        }
      );
    } else if (selectedCategory === PlanCategory.Nutrition) {
      console.log('nutrition', selectedCategory);

      const packet: PlanInitSelection = {
        planCategory: selectedCategory,
        subcategory: null,
        selectedExercises: [],
        selectedCardioExercise: null,
      };
      dispatch(
        {
          type: 'SET_PLAN_BASE',
          payload: packet
        }
      );
    }

    console.log('starting dispatch', selectedCategory);

    screenDispatch({ type: ActionType.NextStep });
  }


  const handleClosePress = () => {
    setSelectedCategory(undefined);
    setSelectedSubcategory(undefined);
    setSelectedExercises([]);
    setSelectedCardioExercise(undefined);
    dispatch({ type: ActionType.Reset });
  }

  const canGoNext = selectedCategory === PlanCategory.Workout && selectedSubcategory && selectedExercises.length > 0 || selectedCategory === PlanCategory.Cardio && selectedCardioExercise !== undefined || selectedCategory === PlanCategory.Nutrition;

  return (
    <>
        <Dropdown<CategoryDropdownItem>
          key="plan-category"
          label="Category"
          data={planCategoryDropdownItems}
          onSelectionChange={onCategorySelectionChange}
         />
        {selectedCategory === PlanCategory.Workout && (
          <>
            <Dropdown
              key="subcategory"
              label="Workout Type"
              data={workoutSubcategoryDropdownItems}
              onSelectionChange={onSubcategoryChange}
            />
            {selectedSubcategory && (
              <MultiSelectComponent
                icon="weight-lifter"
                key="exerciseType"
                label="Exercise"
                data={generateExerciseDropdownItems(selectedSubcategory)}
                onSelectionChange={onExercisesChange}
              />
            )}
          </>
      )}
      {selectedCategory === PlanCategory.Cardio && (
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




const FillPlanDetails: React.FC<{ name: string, onAdd: () => void }> = ({ name, onAdd }) => {
  const [planDeets, setPlanDeets] = useState<string>("");
  
  const addCb = () => {

    onAdd();
  }
  
  return (
    <View style={{ flex: 1 }}>  
      
      <Text>Fill Plan Details</Text>
      <Text>{name}</Text>
      <Picker selectedValue={planDeets} onValueChange={(itemValue, itemIndex) => setPlanDeets(itemValue)}>
        <Picker.Item label="Strength" value="strength" />
        <Picker.Item label="Endurance" value="endurance" />
        <Picker.Item label="HIIT" value="hiit" />
      </Picker>
      <ButtonBase title="Add" onPress={onAdd} />
    </View>
      )
}

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


const AddPlanDetails: React.FC = () => {
  const { state: planState, dispatch: dispatchPlanState } = usePlanBuilder();
  const { state: screenState, dispatch: screenDispatch } = usePlanScreen();

  const [planName, setPlanName] = useState<string>(planState?.init?.planName || '');
  const [planDescription, setPlanDescription] = useState<string>(planState?.init?.planDescription || '');

  const ableToGoNext = planName !== "" && planDescription !== "";


  const onNext = () => {
    dispatchPlanState({ type: "SET_PLAN_DETAILS", payload: { name: planName, description: planDescription } });
    screenDispatch({ type: ActionType.NextStep });
  };

  return (

    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <Text>Plan Details</Text>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        <Input
          label="Name"
          value={planName}
          style={{ color: "white" }}
          onChangeText={setPlanName}
          placeholderTextColor={grayDark.gray9}
          placeholder="my sick leg workout"
        />
        <Text>Plan Description</Text>
        <Input
          label="Description"
          value={planDescription}
          style={{ color: "white" }}
          containerStyle={styleszz.inputContainerStyle}
          multiline={true}
          numberOfLines={4}
          placeholderTextColor={grayDark.gray9}
          onChangeText={setPlanDescription}
          placeholder="This is a leg workout that will make you cry."
        />
      </View>

      {/* {planState?.init.planCategory === PlanCategory.Workout &&
        planState?.init?.selectedExercises?.map((item, index) => (
          <DD
            key={ index} // Adjust according to your data structure
            placeholder="Select an exercise"
            containerStyle={styleszz.ddContainerStyle}
            label={item}
            // Ensure this prop is used correctly according to the DD component's documentation
          />
        ))} */}

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Plan Image</Text>
        <TouchableOpacity onPress={() => console.log('upload image')}>
          <Text>Upload Image</Text>
        </TouchableOpacity>
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

  const exercises = planState?.init?.selectedExercises?.map((item) => {
    return {
      "label": item,
      "value": item,
      "complete": false,
      "key": item
    };
  })
    
  return (
    <View style={{ flex: 1 }}>

      {exercises && (<Dropdown
        key="planName"
        label="PlanDetails"
        data={exercises}
        onSelectionChange={(item) => console.log(item)}
        placeholder={"Select an exercise"}
      />)}
      
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
          <ButtonBase title="Next" onPress={() => screenDispatch({ type: ActionType.NextStep })} />
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
