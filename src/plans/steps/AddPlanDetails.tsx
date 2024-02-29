

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark, greenDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button, Input, ListItem } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePlanBuilder } from '../PlanBuilderContext';
import { ActionType, usePlanScreen } from '../PlanScreenContext';
import { ExerciseItemModal } from '../modals/ExerciseItemModal';
import {
    ExerciseDetail,
    ExerciseRoutine,
    PlanCategory
} from '../plan.types';


  
  export const AddPlanDetails: React.FC = () => {
    const { state: planState, dispatch: dispatchPlanState } = usePlanBuilder();
    const { dispatch: screenDispatch } = usePlanScreen();
  
  
  
    const [planName, setPlanName] = useState<string>(planState?.init?.planName || '');
    const [planDescription, setPlanDescription] = useState<string>(planState?.init?.planDescription || '');
    const [isExerciseReady, setIsExerciseReady] = useState<boolean>(false);
    // const ableToGoNext = planName !== "" && planDescription !== "";
    const ableToGoNext = true; 
    
    const { username: myUsername } = useMyUserInfo();
  
  
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
            style={{ color: "white", borderRadius: 2, borderColor: grayDark.gray12, fontSize: 16, fontFamily: fonts.inter.regular, backgroundColor: grayDark.gray4 }}
            onChangeText={setPlanName}
            placeholderTextColor={grayDark.gray9}
            placeholder={`e.g. ${myUsername}'s leg destroyer`}
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
  
   
  
                    <Button style={ buttonStyles.buttonBase} buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle} title="Browse" onPress={() => {console.log("upoading") }} icon={<Ionicons name="document-attach-outline" size={24} color="black" />} />
  
          </View>
          </View>
        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'flex-end', flexDirection: "row" }}>
                <Button style={ buttonStyles.buttonBase}  buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle}  title="Back" onPress={() => screenDispatch({ type: ActionType.PrevStep })} />

            <Button style={ buttonStyles.buttonBase}   buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle}  disabled={ !ableToGoNext} title="Next" onPress={onNext} />
 
        </View>
      </View>
    );
  };




interface ExerciseListProps {
    list: ExerciseDetail[];
    onInitChanged: (ready: boolean) => void;
  }
  
  const ExerciseList: React.FC<ExerciseListProps> = ({ list , onInitChanged}) => {
    const [selected, setSelected] = useState<ExerciseDetail | null>(null);
    const { state: planState, dispatch: dispatchPlan } = usePlanBuilder();
  
  
    useEffect(() => {
      planState.routine.forEach((item) => {
        if (item.init === false) {
          onInitChanged(false);
          return;
        }
      });
    }, [planState.routine])
  
  
    const setDataCB = (data: ExerciseRoutine) => {
      const newRoutineList: ExerciseRoutine[] = planState.routine?.map((item) => {
        if (item.id === data.id) {
          return data
        }
        return item;
      });
  
      dispatchPlan({
        type: 'SET_PLAN_ROUTINE',
        payload: newRoutineList
      });
      closeModal();
    }
  
    const closeModal = () => setSelected(null);
  
  
    return (
      <>
        {list?.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem
              bottomDivider
              style={{ borderRadius: 8 }}
              containerStyle={{ backgroundColor: grayDark.gray5, borderRadius: 2}} 
              onPress={() => setSelected(item)}
            >
              <ListItem.Content style={{ borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
              <ListItem.Title style={{ color: grayDark.gray12, fontFamily: fonts.inter.regular, flex: 1 }}>
                {item?.name}
              </ListItem.Title>
              <FontAwesome5
                name="check-circle"
                size={24}
                color={planState.routine[index].init ? greenDark.green11 : grayDark.gray8}
              />
            </ListItem.Content>
            </ListItem>
            {selected?.id === item.id && (
              <ExerciseItemModal
                key={`${item.id}-modal`}
                exercise={selected}
                isOpen={selected !== undefined}
                onClose={closeModal}
                onSetDataCB={setDataCB}
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  };


const buttonStyles = StyleSheet.create({
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