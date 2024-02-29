


import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { FontAwesome6 } from '@expo/vector-icons';
import { Button, Divider, ListItem } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePlanBuilder } from '../PlanBuilderContext';
import { ActionType, usePlanScreen } from '../PlanScreenContext';
import {
    ExerciseDetail,
    ExerciseMainCategory,
    ExerciseRoutine,
    PlanCategory
} from '../plan.types';

interface ReviewExerciseListProps {
    routines: ExerciseRoutine[];
    category: ExerciseMainCategory;
    list: ExerciseDetail[];
    onInitChanged: (ready: boolean) => void;
  }
  
  const ReviewExerciseList: React.FC<ReviewExerciseListProps> = ({ list , routines, category, onInitChanged}) => {
    const { state: planState } = usePlanBuilder();
  
    useEffect(() => {
      const allInitialized = planState.routine.every(item => item.init === true);
    
      if (!allInitialized) {
        onInitChanged(false);
      }
    }, [planState.routine]);
  
    const [expanded, setExpanded] = useState<string | null>(null);
  
    const onAccordionPress = (id: string) => {
      if (expanded === id) {
        setExpanded(null);
      } else {
        setExpanded(id);
      }
    }
  
  
    return (
      <View style={{ flex: 1, width: "100%" }}> 
        <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Exercises</Text>
      <> 
        {
            routines?.map((item, index) => {
            
              return (
                <>
                <Divider key={`review-div-${index}`}/>
  
                <ListItem.Accordion
                    key={`review-li-${index}`}
                    style={{ backgroundColor: grayDark.gray5, borderRadius: 8 }}
                  content={
                    <>
                      
                      <FontAwesome6 style={{paddingRight: 10}} name="dumbbell" size={24} color="black"  />
                      <ListItem.Content>
  
                        <ListItem.Title>{ list[index].name}</ListItem.Title>
                      </ListItem.Content>
                    </>
                  }
                  isExpanded={expanded === `${item.id}`}
                  onPress={
                    () => onAccordionPress(`${item.id}`)
                  }
                  >
                    <>
                
                    {item.reps && item.sets && item.weight && (
                        <ListItem key={`${item.id}-li1`} onPress={() => { }} topDivider bottomDivider>
                        <ListItem.Content >
                          <ListItem.Title style={{ color: grayDark.gray10, fontFamily: fonts.inter.light, fontSize: 14 }}>{"Routine"}</ListItem.Title>
                          <ListItem.Subtitle style={{color: grayDark.gray5, fontFamily: fonts.inter.bold, fontSize: 14}}>{item.sets} Sets of {item.reps} reps of {item.weight} Lbs</ListItem.Subtitle>
                        </ListItem.Content>
                      </ListItem>
                    )}
                  
                      {item.notes && (
                        <ListItem key={ `${item.id}-li2`} onPress={() => { }} bottomDivider>
                      <ListItem.Content>
                        <ListItem.Title style={{ color: grayDark.gray10, fontFamily: fonts.inter.regular, fontSize: 18 }}>{"Notes"}</ListItem.Title>
                        <Text style={{ color: grayDark.gray10, fontFamily: fonts.inter.regular, fontSize: 18 }}>{item.notes}</Text>
                      </ListItem.Content>
  
                      <ListItem.Chevron />
                        </ListItem>
                      )
                    }
                    </>
                    </ListItem.Accordion>
                    
                  
                </>
                  )
          })
        }
        </>
      </View>
    );
  };
  
  
  
  
  
  const reviewStyles = StyleSheet.create({
    planTitle: {
      color: grayDark.gray12,
      fontFamily: fonts.inter.semi_bold,
      fontSize: 20,
    },
    planDescription: {
      color: grayDark.gray12,
      fontFamily: fonts.inter.regular,
      fontSize: 16,
    },
    planImage: {
      width: 100,
      height: 100,
    },
    exerciseContainer: {
      color: grayDark.gray12,
      fontFamily: fonts.inter.semi_bold,
      fontSize: 16,
    },
    exerciseItem: {
      color: grayDark.gray12,
      fontFamily: fonts.inter.regular,
      fontSize: 14,
    },
  
  })
  
  
  export const PreviewPlan: React.FC = () => {
    const { state: planState, dispatch } = usePlanBuilder();
    const { state: screenState, dispatch: screenDispatch } = usePlanScreen();
  
    useEffect(() => {
      console.log('planState', planState);
    }, [planState]);
  
  
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'flex-start',  width: "100%", padding: 20 }}>
          <Text style={reviewStyles.planTitle}>{planState?.name}</Text>
        <Text style={reviewStyles.planDescription}>{planState.description}</Text>
        </View>
  
  
        <View style={{ flex: 1,  width: "100%", padding: 20 }}>
          {planState.init.planCategory === PlanCategory.Workout && planState.init.planCategory && (
              <ReviewExerciseList category={ planState.init.subcategory} list={planState.init.selectedExercises} routines={planState.routine} onInitChanged={() => {}} />
          )}
        </View>
  
  
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: "row" }}>
          <View style={{ width: 100, maxWidth: 150 }}>
            <Button buttonStyle={styles.button} titleStyle={styles.buttonTitle}  title="Back" onPress={() => screenDispatch({ type: ActionType.PrevStep })} />
          </View>
          <View style={{ width: 100, maxWidth: 150 }}>
                    <Button buttonStyle={styles.button} titleStyle={styles.buttonTitle}  title="Submit" onPress={() => screenDispatch({ type: ActionType.NextStep })} />
          </View>
        </View>
        
        </View>
        
    );
  }

  const styles = StyleSheet.create({
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

