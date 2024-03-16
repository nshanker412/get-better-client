import LottieView from 'lottie-react-native';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';

// Defines the methods available on the component's ref
export interface StarExplodeAnimationHandles {
  play: () => void;
}

// Props for the StarExplodeAnimation component (empty in this case, but defined for future extensibility)
export interface StarExplodeAnimationProps {}

const StarExplodeAnimation = forwardRef<StarExplodeAnimationHandles, StarExplodeAnimationProps>((props, ref) => {
   const animation = useRef<LottieView>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('play in lottie')
      animation?.current?.play();
    },
  }));

  return (
    <View style={{ width: 100, height: 100 }}>
      <LottieView
        ref={animation}
        style={{ width: 100, height: 100 }}
        source={require('@assets/lottie/starExplode.json')}
        autoPlay={false}
        loop={false}
      />
    </View>
  );
});

StarExplodeAnimation.displayName = 'StarExplode';

export default StarExplodeAnimation;