import { useThemeContext } from '@context/theme/useThemeContext';
import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';


export const ShimmerTile: React.FC<ShimmerTileProps> = ({opacity}) => {
	const { theme } = useThemeContext();
  
	return (
  <>
		<View style={{width: "100%", height: 90, flexDirection: "row", paddingBottom: 20, paddingRight: 20,  paddingTop: 20, alignItems: "center", gap: 15}}>

			  <ShimmerPlaceholder
				LinearGradient={LinearGradient}
				style={{ marginLeft: 40, width: 50, height: 50, borderRadius: 30, opacity: opacity }}
				shimmerColors={[
					theme.grayShades.gray500,			
					theme.grayShades.gray600,
					theme.grayShades.gray700,
				]}
			  />
			  <ShimmerPlaceholder
				LinearGradient={LinearGradient}
				style={ { width:"70%", height: "100%", borderRadius: 6, opacity: opacity}} // Assuming this is defined in your styles
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