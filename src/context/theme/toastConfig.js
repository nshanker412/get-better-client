// App.jsx
import React from 'react';
import { Text, View } from 'react-native';
import {
	greenDark,
	greenDarkMoreTranslucent,
	redDark,
	redDarkMoreTranslucent,
} from './colors_pastel';

export const toastConfig = {
	success: ({ text1, text2, props }) => (
		<View
			style={{
				maxWidth: '80%',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 15,
				backgroundColor: `rgba(${greenDarkMoreTranslucent.green10}, 0.85)`, // 85% translucent
				borderColor: greenDarkMoreTranslucent.green11,
				borderWidth: 1,
				borderRadius: 8,
			}}>
			<Text
				style={{
					color: `rgba(${greenDark.green12}, 0.9)`, // 90% translucent
					fontSize: 16,
					fontWeight: 'bold',
					textAlign: 'center',
					fontFamily: 'Poppins_400Regular',
				}}>
				{text1}
			</Text>
			{text2 && (
				<Text
					style={{
						color: `rgba(${greenDark.green12}, 0.9)`, // 90% translucent
						fontSize: 15,
					}}>
					{text2}
				</Text>
			)}
		</View>
	),

	/*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */

	error: ({ text1, text2, props }) => (
		<View
			style={{
				maxWidth: '80%',
				alignItems: 'center',
				justifyContent: 'center',
				padding: 15,
				backgroundColor: `rgba(${redDarkMoreTranslucent.red10}, 0.85)`, // 85% translucent
				borderColor: redDarkMoreTranslucent.red11,
				borderWidth: 1,
				borderRadius: 8,
			}}>
			<Text
				style={{
					color: `rgba(${redDark.red12}, 0.9)`, // 90% translucent
					fontSize: 16,
					fontWeight: 'bold',
					textAlign: 'center',
					fontFamily: 'Poppins_400Regular',
				}}>
				{text1}
			</Text>
			{text2 && (
				<Text
					style={{
						color: `rgba(${redDark.red12}, 0.9)`, // 90% translucent
						fontSize: 15,
					}}>
					{text2}
				</Text>
			)}
		</View>
	),

	// error: ({ text1, text2, props }) => (
	//   <View style={{  maxWidth: '80%', alignItems: "center", justifyContent: 'center', padding:15, backgroundColor: `rgba(${redDarkMoreTranslucent.red10}, 0.85)`, // 85% translucent
	//   borderColor: redDarkMoreTranslucent.red11,
	//   borderWidth: 1,
	//   borderRadius: 8, }}>
	//     <Text style={{
	//     color: `rgba(${redDark.red12}, 0.9)`, // 90% translucent
	//       fontSize: 16,
	//       fontWeight: 'bold',
	//       textAlign: 'center',
	//     fontFamily: 'Poppins_400Regular',
	//   }}>{text1}</Text>
	//     {text2 && <Text style={{
	//       color: `rgba(${redDark.red12}, 0.9)`, // 90% translucent
	//       fontSize: 15,
	//     }}>{text2}</Text>}
	//   </View>
	// )
};
