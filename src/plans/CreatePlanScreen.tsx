import { Dropdown } from '@components/primitives/dropdown/Dropdown';
import { MultiSelectComponent } from '@components/primitives/dropdown/MultiSelect';
import { ProgressBar } from '@components/primitives/progress/Progress';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useReducer, useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { CategoryDropdownItem, ExerciseDropdownItem, ExerciseMainCategory, ExerciseType, PlanCategory, WorkoutSubcategoryDropdownItem, generateExerciseDropdownItems, planCategoryDropdownItems, workoutSubcategoryDropdownItems } from './plan.types';

// Define the steps as an enum
enum Step {
  ChooseCategory = 'choose category',
  AddInfo = 'add info',
  Review = 'review',
  Submit = 'submit',
}

// Define action types
enum ActionType {
  NextStep = 'NEXT_STEP',
  PrevStep = 'PREV_STEP',
  Submit = 'SUBMIT',
  Reset = 'RESET',
}

// Define the state shape
interface State {
  currentStep: Step;
}

// Define the action shape
type Action =
  | { type: ActionType.NextStep }
  | { type: ActionType.PrevStep }
  | { type: ActionType.Submit }
  | { type: ActionType.Reset };

// Initial state
const initialState: State = {
  currentStep: Step.ChooseCategory,
};

// Reducer function
function reducer(state: State, action: Action): State {
  const steps = [Step.ChooseCategory, Step.AddInfo, Step.Review, Step.Submit];
  const currentIndex = steps.indexOf(state.currentStep);

  switch (action.type) {
    case ActionType.NextStep:
      return { ...state, currentStep: steps[(currentIndex + 1) % steps.length] };
    case ActionType.PrevStep:
      return { ...state, currentStep: steps[(currentIndex - 1 + steps.length) % steps.length] };
    case ActionType.Reset:
      return initialState;
    default:
      throw new Error('Unhandled action type');
  }
}



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
      return "Add info";
    case Step.Review:
      return "Review";
    case Step.Submit:
      return "Submit";
  }
}



const ButtonBase = ({disabled=false,  title, onPress }: { disabled?: boolean, title: string; onPress: () => void }) => {
  return (
    <View style={{ padding: 10 }}>
      <Pressable disabled={disabled}  style={{ padding: 15, backgroundColor: disabled ? grayDark.gray9 : "white" , borderRadius: 10, maxHeight: 50, alignItems: "center", justifyContent: "center"}} onPress={onPress} >
      <Text style={{ fontFamily: fonts.inter.black }}>{title}</Text>
      </Pressable>
    </View>
  );
}


// Component
export const CreatePlanScreen: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState< PlanCategory | undefined>();
  const [selectedSubcategory, setSelectedSubcategory] = useState<ExerciseMainCategory | undefined>();
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);


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


  useEffect(() => {
    return () => {
      setSelectedCategory(undefined);
      setSelectedSubcategory(undefined);
      setSelectedExercises([]);
      dispatch({ type: ActionType.Reset });
    };
  }
    , []);
  
  const onSubmit = () => {
    dispatch({ type: ActionType.Reset });
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10, justifyContent: "center"}}>
        <ProgressBar totalSteps={3} currentStep={getStepNumber(state.currentStep)} />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: grayDark.gray12, fontFamily: fonts.inter.black, fontSize: 20 }}>{getStepTitle(state.currentStep)}</Text>
      </View>
      
      <View style={{ flex: 5, justifyContent: 'flex-start', alignItems: "stretch",  width: "100%", height: "100%"}}>

   
          <Dropdown<CategoryDropdownItem> key="plan-category" label="Category" data={planCategoryDropdownItems} onSelectionChange={onCategorySelectionChange} />
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




      </View>
      <View style={{ flex: 1, flexDirection: 'row', width: "100%", alignItems: "flex-end", justifyContent: "space-around" }}>
       
        {state.currentStep !== Step.ChooseCategory && (<ButtonBase title="Back" onPress={() => dispatch({ type: ActionType.PrevStep })} />)}
        {state.currentStep !== Step.Submit && <ButtonBase title="Next" disabled={selectedExercises.length <= 0}  onPress={() => dispatch({ type: ActionType.NextStep })} /> }
        {state.currentStep === Step.Submit && (<ButtonBase title="Submit" onPress={onSubmit} />)}


      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}/>
    </SafeAreaView>
  );
}





// const ChooseCategoryBody: React.FC<{ onNext: () => void; onPrev: () => void}> = ({onNext, onPrev}) => {

//   const [selectedCategory, setSelectedCategory] = useState< PlanCategory | undefined>();
//   const [subcategories, setSubcategories] = useState<ExerciseMainCategory | undefined>();

//   return (
//     <View style={{ flex: 5, justifyContent: 'flex-start', alignItems: "stretch", borderColor: "red", borderWidth: 1, width: "100%", height: "100%" }}>
//       <Dropdown<CategoryDropdownItem> key="plan-category" label="Category" data={planCategoryDropdownItems} onSelectionChange={onCategorySelectionChange} />
//       {selectedCategory === PlanCategory.Workout && <Dropdown<WorkoutSubcategoryDropdownItem> key="subcategory" label="Workout type" data={exerciseDropdownItems} onSelectionChange={onSubcategoryChange} />}
//       {selectedCategory === PlanCategory.Workout && <Dropdown<WorkoutSubcategoryDropdownItem> key="subcategory" label="Workout type" data={exerciseDropdownItems} onSelectionChange={onSubcategoryChange} />}

//     </View>

//   );
// }