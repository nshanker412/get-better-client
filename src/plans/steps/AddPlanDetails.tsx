

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark, greenDark, red } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Button, Input, ListItem } from '@rneui/base';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MediaSource, usePlanBuilder } from '../PlanBuilderContext';
import { ActionType, usePlanScreen } from '../PlanScreenContext';
import { ExerciseItemModal } from '../modals/ExerciseItemModal';
import {
  ExerciseDetail,
  ExerciseRoutine,
  PlanCategory,
  nutrition
} from '../plan.types';

import { AntDesign } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
  export const AddPlanDetails: React.FC = () => {
    const { state: planState, dispatch: dispatchPlanState } = usePlanBuilder();
    const { dispatch: screenDispatch } = usePlanScreen();

    const [planName, setPlanName] = useState<string>(planState?.name || '');
      const [planDescription, setPlanDescription] = useState<string>(planState?.description || '');

    const [isExerciseReady, setIsExerciseReady] = useState<boolean>(false);
    // const ableToGoNext = planName !== "" && planDescription !== "";
      const ableToGoNext = planName !== ""; 
    const { username: myUsername } = useMyUserInfo();
  
  
    const onNext = () => {
      dispatchPlanState({ type: "SET_PLAN_DETAILS", payload: { name: planName, description: planDescription } });
      screenDispatch({ type: ActionType.NextStep });
    };
  
    return (
  
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
   
  
        <View style={{ flex: 1, justifyContent: 'center', width:"100%" , paddingTop: 20, minWidth: "80%" }}>
        <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Name</Text>
          <Input
            // labelStyle={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}
            // label="Name"
            value={planName ?? planState?.name }
            style={{ color: "white", borderRadius: 2, borderColor: grayDark.gray12, fontSize: 16, fontFamily: fonts.inter.regular, backgroundColor: grayDark.gray4 }}
            onChangeText={setPlanName}
            placeholderTextColor={grayDark.gray9}
            placeholder={`e.g. ${myUsername}'s leg destroyer`}
          />
         <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Description</Text>
  
          <Input
            // label="Description"
            // labelStyle={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}
            value={ planDescription ?? planState?.description}
            style={{ color: "white" , borderRadius: 2, borderColor: grayDark.gray12, fontSize: 16, fontFamily: fonts.inter.regular,  backgroundColor: grayDark.gray4}}         
            multiline={true}
            placeholderTextColor={grayDark.gray9}
            maxLength={200}
            onChangeText={setPlanDescription}
            placeholder=" e.g. this is a leg workout that makes me cry"
          />
        </View>
        <View style={{ flex: 1, flexGrow: 2,  width: "100%",   justifyContent: "center" }}>
          
     
  
          {planState?.init?.planCategory === PlanCategory.Lifting && planState?.init?.selectedExercises && (
            <>
              <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Exercise Details</Text>
              < ExerciseList list={planState.init.selectedExercises} onInitChanged={(ready) => setIsExerciseReady(ready)}/>
              </>
          )}
          
          {planState?.init?.planCategory === PlanCategory.Nutrition && planState?.init?.selectedNutritionFoodGroups && (
            <>

              <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Customize</Text>
              <ScrollView>


              {planState.init.selectedNutritionFoodGroups.map((item) => {
                const foodGroupList = nutrition[item]
                console.log("foodGroupList", foodGroupList);


                const [selectedFoodGroup, setSelectedFoodGroup] = useState<string | null>(null);


                const onPressGroup = (group: string) => {
                  if (selectedFoodGroup === group) {
                    setSelectedFoodGroup(null);
                  } else {
                    setSelectedFoodGroup(group);
                  }
                }
                
                //set of added foods 
                 const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

                return (
                  <ListItem.Accordion
                    key={`${item}-nutrition-food-group-accordion`}
                    bottomDivider
                    style={{ borderRadius: 8, backgroundColor: grayDark.gray5, borderColor: grayDark.gray5, overflow:  "hidden" }}
                    containerStyle={{ borderRadius: 8 , backgroundColor: grayDark.gray12, borderColor: grayDark.gray5}}
              
                    isExpanded={item ==selectedFoodGroup}
                    onPress={() => onPressGroup(item)}
                    
                    content={
                      <ListItem.Content style={{ borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <ListItem.Title
                          style={{ color: grayDark.gray4, fontFamily: fonts.inter.bold, fontSize: 19, flex: 1, }}
                        > 
                          {item}
                        </ListItem.Title>
              
                      </ListItem.Content>
                    }
                  >

                    <>
                      {foodGroupList?.map((foodGroup) => {
                        return (
                          <ListItem key={foodGroup.id}
                            bottomDivider style={{ borderRadius: 8, borderColor: grayDark.gray5, backgroundColor: 'transparent' }}
                            containerStyle={{ borderRadius: 2 , backgroundColor: grayDark.gray11 , width: "95%", alignSelf: "center"}}
                          >
                            
                            <ListItem.Content style={{ borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}>
                              <ListItem.Title style={{ color: grayDark.gray7, fontFamily: fonts.inter.medium, fontSize: 15, flex: 1 }}>
                                {foodGroup?.name}

                              </ListItem.Title>
                              <AntDesign name="pluscircleo" size={24} color="green" />
                            </ListItem.Content>
                          </ListItem>
                        )
                      })}
                    </>
                    </ListItem.Accordion>
                )
              
              }
                )}
              </ScrollView>


              </>
          )}
        </View>
  
        <View style={{ flex: 1, width: "100%",  }}>
          
          <Text style={{ color: grayDark.gray12, marginBottom: 5, textAlign: "left", fontFamily: fonts.inter.semi_bold }}>Media</Text>
                <MediaPicker />
          </View>
        <View style={{ flex: 1, justifyContent: 'flex-end', width: "100%",  alignItems: 'flex-end', flexDirection: "row", paddingBottom: 10 }}>
               <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <Button style={buttonStyles.buttonBase} buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle} title="Back" onPress={() => screenDispatch({ type: ActionType.PrevStep })} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Button style={ buttonStyles.buttonBase}   buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle}  disabled={ !ableToGoNext} title="Next" onPress={onNext} />
                </View> 
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



export const MediaPicker: React.FC = () => {
    const [selectedMedia, setSelectedMedia] = useState<MediaSource | null>(null);

    const { state: planState, dispatch: dispatchPlan } = usePlanBuilder();

    const onMediaChange = (media: MediaSource | null) => {
        if (media) {
          dispatchPlan({ type: 'SET_PLAN_MEDIA', payload: [{ id: "im", url: media.url, type: media.type }] });
        } else {
          dispatchPlan({ type: 'SET_PLAN_MEDIA', payload: null });
        }
      }


    const pickMedia = async () => {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
  
      const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true, // Note: Editing is only available for images
        aspect: [4, 3],
        quality: 1,
        videoMaxDuration: 10, // Limit video duration to 10 seconds
      });
        
        console.log("result", result);
  
        if (!result.canceled) {
          
            const media = result.assets[0];
        if (media.type === 'video' && media.duration && media.duration > 10000) {
          Alert.alert('Video too long', 'Please select a video that is less than 10 seconds long.');
        } else {
            onMediaChange({ id: media.assetId ?? "plan-media", url: media.uri, type: media.type ?? 'image' });
        }
      }
    };

    const onDeselectMedia = () => {
        console.log("deselecting media");   
        onMediaChange(null);
        }
  
    return (
        <View style={{
            flex: 1,
            flexGrow: 2,
            width: "100%",
            height: 200,
            padding: 10,
            borderWidth: 1,
            borderColor: grayDark.gray10,
            borderStyle: 'dashed',
            borderRadius: 10,
            justifyContent: "space-around",
            alignItems: "center",
            }}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                {planState && planState?.media?.length && planState.media[0] ? (
                    
                    <MediaTile media={planState.media[0]} handleDelete={onDeselectMedia} />

                ) : (
                    <Button style={buttonStyles.buttonBase} buttonStyle={buttonStyles.button} titleStyle={buttonStyles.buttonTitle} title="Browse" onPress={pickMedia} icon={<Ionicons name="document-attach-outline" size={24} color="black" />} />

                )}
            </View>
        </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
      media: {
        borderRadius: 10,
      width: 100, // Adjusted for better visibility
      height: 100, // Adjusted for better visibility
    },
  });


// should take in the uri and type and display the media as 100x100 tile  with a red delete button on the top right

    type MediaProps = {
        media: MediaSource;
        handleDelete: () => void;
      };
const MediaTile: React.FC<MediaProps> = ({ media, handleDelete}) => {


  
    return (
        <View style={mediaTileStyles.container}>
                
 
       
        {media.type === 'image' ? (
          <Image source={{ uri: media.url }} style={styles.media} />
        ) : (
          <Video
            source={{ uri: media.url }}
            style={mediaTileStyles.media}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping={false}
            useNativeControls={false}
          />
            )}
        <TouchableOpacity onPress={handleDelete} style={mediaTileStyles.deleteButton}>
        <Ionicons name="close-circle" size={24} color={red.red5} />
        </TouchableOpacity>

      </View>
    );
  };
  
  const mediaTileStyles = StyleSheet.create({
    container: {
      width: 100,
      height: 100,
      position: 'relative',
      marginBottom: 10, // Adjust or remove as needed
    },
    media: {
      width: '100%',
        height: '100%',
    //     maxHeight: 80,
    //   maxWidth: 80,
      borderRadius: 10, // Optional: for rounded corners
    },
      deleteButton: {
        // zIndex: 1,
      position: 'absolute',
      top: -10, // Adjust these values as needed
      right: -10,
      backgroundColor: 'transparent',
    },
  });