import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Importing a specific color from your theme
// Ensure you have this color defined or replace it with a valid color
const greenDark = { green9: '#008000' }; // Example color, replace with your actual color

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ totalSteps, currentStep }) => {
  const progress = useSharedValue((currentStep / totalSteps) * 100);

  useEffect(() => {
    progress.value = withTiming((currentStep / totalSteps) * 100, {
      duration: 500,
    });
  }, [currentStep, totalSteps]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  // Render step markers
  const renderStepMarkers = () => {
    let markers = [];
    for (let i = 1; i <= totalSteps; i++) {
      markers.push(
        <View key={i} style={[styles.stepMarker, { left: `${(100 / totalSteps) * (i) - (100 / totalSteps)}%` }]}>
          <Text style={styles.stepText}>{i}</Text>
        </View>
      );
    }
    return markers;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, animatedStyle]} />
      {renderStepMarkers()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 5,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    position: 'relative',
    margin: 10,
  },
  bar: {
    height: '100%',
    backgroundColor: greenDark.green9,
    borderRadius: 10,
  },
  stepMarker: {
    position: 'absolute',
    bottom: 0, // Adjust based on your UI needs
    width: 20,
      height: 20,
    opacity: 0.5,
    borderRadius: 10,
    backgroundColor: `rgba(255, 255, 255, 0.5)`, // Replace with your color or
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }], // Adjust to align with the progress bar properly
  },
  stepText: {
    fontSize: 10,
    color: 'white',
  },
});
