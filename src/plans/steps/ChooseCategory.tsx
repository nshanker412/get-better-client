import { Dropdown } from '@components/primitives/dropdown/Dropdown';
import { MultiSelectComponent } from '@components/primitives/dropdown/MultiSelect';
import { grayDark, redDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { usePlanBuilder } from '../PlanBuilderContext';
import { ActionType, usePlanScreen } from '../PlanScreenContext';
import {
  CardioDropdownItem,
  CardioRoutine,
  CategoryDropdownItem,
  ExerciseDetail,
  ExerciseDropdownItem,
  NutritionFoodDropdownItem,
  NutritionFoodGroupsDropdownItem,
  NutritionPlanMainCategory,
  NutritionSubcategoryDropdownItem,
  PlanCategory,
  WorkoutSubcategoryDropdownItem,
  findExerciseByName,
  generateCardioDropdownItems,
  generateExerciseDropdownItems,
  nutrition,
  nutritionFoodGroupsDropdownItems,
  nutritionSubcategoryDropdownItems,
  planCategoryDropdownItems,
  workoutSubcategoryDropdownItems
} from '../plan.types';

interface ChooseCategoryProps {
    // init: PlanInitSelection;
  }
  
   export const ChooseCategory: React.FC<ChooseCategoryProps> = () => {
    const { state: planState, dispatch: dispatch } = usePlanBuilder();
       const { dispatch: screenDispatch } = usePlanScreen();
     const navigation = useNavigation();
     const [nutritionDropdownBlur, setNutritionDropdownBlur] = useState(false);
     const [potentialFoodChoices, setPotentialFoodChoices] = useState<NutritionFoodDropdownItem[] | null>(null);



     useEffect(() => {

       // generated and update the potential food choices
       if (planState.init?.selectedNutritionFoodGroups) {
         const foodGroups = planState.init.selectedNutritionFoodGroups;
         const potentialFoods: NutritionFoodDropdownItem[] = [];
         foodGroups.forEach((foodGroup) => {
          const foodGroupItems = nutrition[foodGroup];
          if (foodGroupItems) {
            const transformedItems: NutritionFoodDropdownItem[] = foodGroupItems.map((item) => ({
              id: item.id,
              value: item.name,
              key: item.id,
              label: item.name,
              type: foodGroup,
            }));
        
            if (transformedItems.length > 0) {
              potentialFoods.push(...transformedItems); // Using spread operator to flatten the array
            }
          }
        });

         setPotentialFoodChoices(potentialFoods);
       }
     }, [planState.init.selectedNutritionFoodGroups])

     useEffect(() => {
       console.log("potential food choicess", potentialFoodChoices)
      }, [potentialFoodChoices])
     
     const onCardioTypeChange = (item: CardioDropdownItem) => {  
       
       const routine: CardioRoutine[] = [{
        id: item.id,
        name: undefined,
        type: undefined,
        targetDuration:  undefined, // Duration in minutes
        targetDistance: undefined, // Distance in miles
        intensity: undefined,
         goal: undefined,
         metadata: null,
        goalCategory: undefined,
          init: false

      }]
      
       console.log('onCardioTypeChange', item); 
      dispatch(
        {
          type: 'SET_PLAN_BASE',
          payload: {
            init: {
            planCategory: PlanCategory.Cardio,
              subcategory: null,
              selectedExercises: [],
              selectedNutritionFoodGroups: null,
              selectedFoods: null,
              selectedCardioExercise: {
                id: item.id,
                name: item.label,
                type: item.type,
              }
            },
            routine: routine
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
              selectedNutritionFoodGroups: null,
              selectedFoods: null,

            },
            routine: [],
          }
        }
      );
    }
  
     const onSubcategoryChange = (item: WorkoutSubcategoryDropdownItem | NutritionSubcategoryDropdownItem) => {
       console.log('onSubcategoryChange', item);

       if (planState.init?.planCategory === PlanCategory.Lifting) {
         dispatch(
           {
             type: 'SET_PLAN_BASE',
             payload: {
               init: {
                 ...planState.init,
                 subcategory: item.type,
                 selectedExercises: [],
                 selectedCardioExercise: null,
                 selectedNutritionFoodGroups: null,
                 selectedFoods: null,

               },
               routine: [],
             }
           }
         );
       }
       // otherwise nutrition
     else if (planState.init?.planCategory === PlanCategory.Nutrition) {
         dispatch(
           {
             type: 'SET_PLAN_BASE',
             payload: {
               init: {
                 planCategory: PlanCategory.Nutrition,
                 subcategory: item.type,
                 selectedExercises: null,
                 selectedCardioExercise: null,
                 selectedNutritionFoodGroups: [],
                 selectedFoods: [],
               },
               routine: [],
             }
           }
         );

       }
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
                  selectedNutritionFoodGroups: null,
                  selectedFoods: null,

                },
                routine: routines
  
              }
            }
          );
        }
      }
  
     
       
     const onFoodGroupsChange = (items: string[]) => {
       if (planState.init?.subcategory && items.length > 0) {

         dispatch(
           {
             type: 'SET_PLAN_BASE',
             payload: {
               init: {
                  ...planState.init,
                  selectedExercises: null,
                  selectedCardioExercise: null,
                 selectedNutritionFoodGroups: items,
                 selectedFoods: null,

               },
               routine: []
  
             }
           }
         );
      
     }
     }
     
const onFoodsChange = (items: string[]) => {
       
       
      //  const foodList: NutritionDetail[] = items.map((ex) => findFoodByName(planState.init.subcategory!, ex)!);

       const foodList = potentialFoodChoices?.filter((item) => items.includes(item.label));
       console.log('onFoodsChange', foodList);
       if (!foodList) {
         return;
       }

       const routines = foodList?.map((item) => {
        return {
          id: item.key,
          sets: undefined,
          reps: undefined,
          weight: undefined,
          notes: undefined,
          init: false
        }
      })

        if (planState.init?.subcategory && items.length > 0) {
          dispatch(
            {
              type: 'SET_PLAN_BASE',
              payload: {
                init: {
                    ...planState.init,
                    selectedExercises: null,
                    selectedCardioExercise: null,
                    selectedFoods: foodList,
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
       
    const handleBackPress = () => {
        screenDispatch({ type: ActionType.Reset });
        dispatch({ type: ActionType.Reset });
        navigation.goBack();
      }
  
    const cardoSet = planState?.init?.planCategory === PlanCategory.Cardio && planState?.init?.selectedCardioExercise !== undefined;
    const workoutSet = planState?.init?.planCategory === PlanCategory.Lifting && planState?.init?.selectedExercises && planState?.init?.selectedExercises?.length > 0 && planState?.init?.subcategory !== undefined;
     
     const nutritionSet = planState?.init?.planCategory === PlanCategory.Nutrition && planState?.init?.subcategory !== undefined 
     const nutritionCustomSet = planState?.init?.planCategory === PlanCategory.Nutrition && planState?.init?.subcategory !== undefined && planState?.init?.selectedNutritionFoodGroups && planState?.init?.selectedNutritionFoodGroups?.length > 0;

     const nutritionFullSet = planState?.init?.subcategory === NutritionPlanMainCategory.Custom ? nutritionCustomSet : nutritionSet;
  
    const canGoNext = cardoSet || workoutSet || nutritionFullSet;
    return (
      <>
          <Dropdown<CategoryDropdownItem>
          key="plan-category"
  
            placeholder={planState.init.planCategory ?? "select category"}
            label="Category"
            data={planCategoryDropdownItems}
            onSelectionChange={onCategorySelectionChange}
           />
          
        {planState.init.planCategory === PlanCategory.Lifting && (
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
                placeholder = "Choose your exercises..."
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
         {planState.init.planCategory === PlanCategory.Nutrition && (
            <>
              <Dropdown<NutritionSubcategoryDropdownItem> 
                key="subcategory"
                placeholder={planState.init.subcategory ?? "select type"}
                label="Plan"
              data={nutritionSubcategoryDropdownItems} 
                onSelectionChange={onSubcategoryChange}
            />
              {planState.init.subcategory == NutritionPlanMainCategory.Custom && (
              <MultiSelectComponent<NutritionFoodGroupsDropdownItem>
                icon="food-apple"
                placeholder = "Choose your food groups..."
                key="foodGroups"
                label="food-apple"
                initial={
                  planState.init.selectedNutritionFoodGroups 
                  ? planState.init.selectedNutritionFoodGroups.map(foodgroup => foodgroup.name) 
                    : []
                }
                data={nutritionFoodGroupsDropdownItems}
                onSelectionChange={onFoodGroupsChange}
                onBlur={() => setNutritionDropdownBlur(true)}


                />
            )}

            {nutritionDropdownBlur
              && planState.init.subcategory == NutritionPlanMainCategory.Custom
              && planState.init.selectedNutritionFoodGroups.length > 0
              && potentialFoodChoices && potentialFoodChoices?.length > 0 && (
                <MultiSelectComponent<NutritionFoodDropdownItem>
                  icon="food-apple"
                  placeholder="Choose your foods..."
                  key="foodGroupsChild"
                  label="food-apple"
                  initial={
                    planState.init.selectedFoods
                      ? planState.init.selectedFoods.map(food => food.name)
                    : []
                }
                data={potentialFoodChoices}
                onSelectionChange={onFoodsChange}
                />
            )}
 
            </>
        )}
        <View style={{ paddingBottom: 10, flex: 1, flexDirection: "row", justifyContent: 'flex-end', width:"100%", alignItems: 'flex-end' }}>
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Button type="outline" buttonStyle={{backgroundColor:redDark.red3, borderColor: redDark.red11, borderWidth: 2, borderRadius: 8} } style={styles.buttonBase}  titleStyle={{color: redDark.red12, fontFamily: fonts.inter.bold}} title="Exit"  onPress={handleBackPress} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Button style={styles.buttonBase} disabled={!canGoNext} buttonStyle={styles.button } titleStyle={styles.buttonTitle} title="Next"  onPress={handleNextPress} />
          </View>
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
  