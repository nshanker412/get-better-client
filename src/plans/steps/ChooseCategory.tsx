import { Dropdown } from '@components/primitives/dropdown/Dropdown';
import { MultiSelectComponent } from '@components/primitives/dropdown/MultiSelect';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { Button } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { usePlanBuilder } from '../PlanBuilderContext';
import { ActionType, usePlanScreen } from '../PlanScreenContext';
import {
    CardioDropdownItem,
    CategoryDropdownItem,
    ExerciseDetail,
    ExerciseDropdownItem,
    PlanCategory,
    WorkoutSubcategoryDropdownItem,
    findExerciseByName, generateCardioDropdownItems,
    generateExerciseDropdownItems,
    planCategoryDropdownItems,
    workoutSubcategoryDropdownItems
} from '../plan.types';

interface ChooseCategoryProps {
    // init: PlanInitSelection;
  }
  
   export const ChooseCategory: React.FC<ChooseCategoryProps> = () => {
    const { state: planState, dispatch } = usePlanBuilder();
  
    const {  dispatch: screenDispatch } = usePlanScreen();
  
  
    const onCardioTypeChange = (item: CardioDropdownItem) => {  
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
              }   data={generateExerciseDropdownItems(planState.init.subcategory)}
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
    
  
        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Button style={styles.buttonBase} disabled={!canGoNext} buttonStyle={styles.button } titleStyle={styles.buttonTitle} title="Next"  onPress={handleNextPress} />
        </View>
  
        </>
    );
  }
  


const styles = StyleSheet.create({
    buttonBase: {
        width: 100,
        maxWidth: 150
        },
    button: {
      backgroundColor: grayDark.gray12,
      borderRadius: 10,
      padding: 10,
      color: grayDark.gray5,
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
  