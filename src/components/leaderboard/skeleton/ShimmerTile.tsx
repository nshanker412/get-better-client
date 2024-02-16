import { useThemeContext } from '@context/theme/useThemeContext';
import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';



export const ShimmerTile = () => {
	const { theme } = useThemeContext();
  
	return (
  <>
		<View style={{width: "100%", height: 90, flexDirection: "row", padding: 20, alignItems: "center", gap: 15}}>
	
	
			  <ShimmerPlaceholder
				LinearGradient={LinearGradient}
				style={{ marginLeft: 47, width: 50, height: 50, borderRadius: 30, opacity: 0.5 }}
				shimmerColors={[
					theme.grayShades.gray500,			
					theme.grayShades.gray600,
					theme.grayShades.gray700,
				]}
			  />
			  <ShimmerPlaceholder
				LinearGradient={LinearGradient}
				style={ { width:"70%", height: "100%", borderRadius: 6, opacity: 0.5}} // Assuming this is defined in your styles
				shimmerColors={[
				  theme.grayShades.gray500,
				  theme.grayShades.gray600,
				  theme.grayShades.gray700,
				]}
			  />
			 
		</View>
	  </>
	);
  };