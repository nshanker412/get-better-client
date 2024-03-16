import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';


interface InfinityAnimationProps {
	height?: number;
	width?: number;
}
export const InfinityAnimation: React.FC<InfinityAnimationProps> = ({height=100, width= 100}) => {
	const animation = useRef(null);
	
	
	
	useEffect(() => {

		animation.current?.play();
	}, []);



  
	return (
	  <View style={styles.animationContainer}>
		<LottieView
		  autoPlay
		  ref={animation}
			style={[styles.animation, {height, width}]}
			source={require('@assets/lottie/inf_loader_2.json')}
		/>
		
	  </View>
	);
  }

const styles = StyleSheet.create({
	animation: {
		width: 100,
		height: 100,
		backgroundColor: 'transparent',
	},
	animationContainer: {
		backgroundColor: 'transparent',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	buttonContainer: {
	  paddingTop: 20,
	},
  });
