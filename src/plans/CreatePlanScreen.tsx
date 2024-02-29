import { ProgressBar } from '@components/primitives/progress/Progress';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { PlanBuilderProvider } from './PlanBuilderContext';
import { ActionType, PlanScreenProvider, Step, usePlanScreen } from './PlanScreenContext';
import { AddPlanDetails } from './steps/AddPlanDetails';
import { ChooseCategory } from './steps/ChooseCategory';
import { PreviewPlan } from './steps/PreviewPlan';


// Helper functions
const getStepNumber = (step: Step) => {
  switch (step) {
    case Step.ChooseCategory:
      return 0;
    case Step.AddInfo:
      return 1;
    case Step.Review:
      return 2;
  }
}


const getStepTitle = (step: Step) => {
  switch (step) {
    case Step.ChooseCategory:
      return "Create your plan";
    case Step.AddInfo:
      return "Add Plan Details";
    case Step.Review:
      return "Preview";

  }
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
          <ChooseCategory/>
        )}
        
        {screenState.currentStep === Step.AddInfo && (
          <AddPlanDetails />
        )}
        {screenState.currentStep === Step.Review && (
          <PreviewPlan />
        )}

      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}/>

    </SafeAreaView>
  );
}




export const CreatePlanScreen: React.FC = () => {
  
  return (
      <PlanBuilderProvider>
        <PlanScreenProvider>
          <_CreatePlanScreen />
        </PlanScreenProvider>
      </PlanBuilderProvider>
  );
}
