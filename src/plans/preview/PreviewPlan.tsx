
    import { grayDark, greenDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, Divider, ListItem } from '@rneui/base';
import axios from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { MediaSource, usePlanBuilder } from '../PlanBuilderContext';
import { PlanModel } from "../models/plan";
import {
    ExerciseDetail,
    ExerciseMainCategory,
    ExerciseRoutine,
    PlanCategory
} from '../plan.types';


    interface PreviewUserPlanProps {
        planID: string;
    }


      export const PreviewUserPlan: React.FC<PreviewUserPlanProps> = ({planID}) => {
          const navigation = useNavigation();
          const [loading, setLoading] = useState<boolean>(false);
          const [planState, setPlan] = useState<PlanModel | null>( null);


          useEffect(() => {
              const getPlan = async (planID: string) => {
                setLoading(true);
                  try {
                    const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/fetch/plan/${planID}`);
                      const plan = response.data.plan; 
                      console.log("plan", plan)
                      setPlan(plan);
                    
                    console.log("plan", plan)
                } catch (error) {
                    console.error('Error fetching plans:', error);
                } finally {
                    setLoading(false);
                  }
                }
              
                getPlan(planID)
          }, [planID]);
          

          useEffect(() => {
            planState && console.log("plan", planState)
          }, [planState])
          
          
          if (loading || !planState) {
                return (
                    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <Text>Loading...</Text>
                    </View>
                )
            }

    
        return (
            <View style={{flex: 1,  alignItems: "center", justifyContent: "center", width: "100%", padding: 10}}>
                <View style={{ flex:  4}}>
                <Card
                    containerStyle={styles.cardContainer}
                    wrapperStyle={styles.cardWrapper}
                    >
                    <LinearGradient colors={[grayDark.gray3, grayDark.gray2, grayDark.gray1 ]} style={{ borderRadius: 8, width: '100%'}}>
                    <Card.Title style={styles.cardTitle }>{planState.name}</Card.Title>
                    <Card.FeaturedSubtitle style={ styles.cardFeaturedSubtitle}>{planState.init.planCategory}</Card.FeaturedSubtitle>
                    {planState.media?.length && (
                        <>
                            <Card.Divider style={{marginBottom: 2}} />
                        <Card.Image style={{  backgroundColor: "transparent", width: "100%"}} >
                            <MediaTile media={planState.media[0]} />
                        </Card.Image>
                        </>
                    )}
                    <Card.Divider />
                    <ScrollView>
    
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10}}>
                    <Text style={styles.cardDescription}>
                        {planState.description}
                        </Text>
                    </View>
    
                    {planState.data.planCategory === PlanCategory.Lifting &&
                    planState.data.subcategory &&
                    planState.data.selectedExercises &&
                    planState.data.routine && (
                    <View style={styles.exerciseList}>
                    <ReviewExerciseList 
                      category={planState.data.subcategory} 
                      list={planState.data.selectedExercises} 
                      routines={planState.data.routine} 
                      onInitChanged={() => {}} />
                    </View>
                        )}
                        </ScrollView>
                        </LinearGradient>
                    </Card>
                </View>

              </View>
          );
      }
    
      const styles = StyleSheet.create({
        container: {
            flex: 1,
            borderRadius: 8,
            height: "100%",
            width: "100%",
            backgroundColor: '#121212', // Dark background for the card
        },
        content: {
          flex: 1,
          justifyContent: 'flex-start',
          width: "100%",
          padding: 20,
        },
        exerciseList: {
          flex: 5,
          width: "100%",
          padding: 20,
        },
        footerButtons: {
            paddingTop: 10,
            width: "100%",
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexDirection: "row",
        },
        submitButton: {
            borderColor: greenDark.green1,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            color: greenDark.green1,
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
          cardContainer: {
              display: "flex",
              alignSelf: "center",
            margin: 0,
            padding: 0,
              borderWidth: 0.5,
            minWidth: "80%",
            width: "100%",
            borderColor: 'rgba(137, 133, 133, 0.3)',
            backgroundColor: grayDark.gray2, // Dark background for the card
            borderRadius: 8,
          },
          cardWrapper: {
            backgroundColor: grayDark.gray2, // Dark background for the card
            borderRadius: 8,
        },
        cardTitle: {
            fontSize: 20,
            color: grayDark.gray12, // White text for dark mode
            fontFamily: fonts.inter.black, // Assuming you have this weight; adjust as needed
            marginBottom: 2,
        },
         cardFeaturedSubtitle: {
            textAlign: "center",
            fontSize: 16,
            color: grayDark.gray10, // Lighter text for subtitles
            fontFamily: fonts.inter.extra_light, // Assuming you have this weight; adjust as needed
            marginBottom: 2,
        },
          cardDescription: {
            paddingLeft: 10,
            paddingRight: 10,
            textAlign: "center",
            fontSize: 14,
            color: grayDark.gray11, // Lighter text for subtitles
            fontFamily: fonts.inter.regular, // Assuming you have this weight; adjust as needed
        },
      });
    
    
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
                    <React.Fragment key={`routine-fragment-${index}`}>
    
                          <View style={{width: "100%", padding: 2, alignItems: "center", justifyContent: "flex-start",}}/>
                          <ListItem.Accordion
                              containerStyle={{ backgroundColor: grayDark.gray10, borderRadius: 8}}
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
                                  <Divider style={{ backgroundColor: grayDark.gray8, width: "90%", alignSelf: "center"}}/>
                    
                        {item.reps!==undefined && item.sets !==undefined && item.weight!== undefined && (
                            <ListItem key={`${item.id}-li1`} onPress={() => { }} topDivider bottomDivider containerStyle={{backgroundColor: grayDark.gray8, borderRadius: 4, width: "90%", alignSelf: "center"}}>
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
                    </React.Fragment>
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
      
    
    interface MediaTileProps {
        media: MediaSource;
        }
    
    
    const MediaTile: React.FC<MediaTileProps> = ({ media }) => {
        
      const [isFullscreen, setIsFullscreen] = useState(false);
    
        const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
        
    
        console.log("in media tile", media)
    
      return (
        <View style={stylesD.container}>
              <TouchableOpacity style={{flex: 1}} onPress={toggleFullscreen}>
            {media.type === 'image' ? (
                      <Image
                          source={{ uri: media.url }}
                          style={stylesD.media}
                          blurRadius={0}
                          contentFit={"cover"}
                          allowDownscaling={false} 
              />
            ) : (
              <Video
                source={{ uri: media.url }}
                style={stylesD.media}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping={false}
                useNativeControls
              />
                )}
                {/* <BlurView intensity={10} style={StyleSheet.absoluteFill}/> */}
          </TouchableOpacity>
    
          <Modal visible={isFullscreen} transparent={false} animationType="slide">
            <TouchableOpacity style={stylesD.fullscreenContainer} onPress={toggleFullscreen}>
              {media.type === 'image' ? (
                <Image source={{ uri: media.url }} style={stylesD.fullscreenMedia} />
              ) : (
                <Video
                  source={{ uri: media.url }}
                  style={stylesD.fullscreenMedia}
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                  isLooping
                  useNativeControls
                />
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      );
    };
    
    const stylesD = StyleSheet.create({
        container: {
            flex: 1,
            // height: 100,
            width: "100%",
    
        // justifyContent: 'center',
        // alignItems: 'center',
      },
        media: {
            flex: 1,
    
            // borderRadius: 8,
            // width: 200,
            height: '100%',
            width: '100%',
      },
      fullscreenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'black',
      },
      fullscreenMedia: {
        width: '100%',
        height: '100%',
      },
    });
    
    export default MediaTile;