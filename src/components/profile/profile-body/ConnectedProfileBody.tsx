import { fonts } from "@context/theme/fonts";
// import { FlashList } from "@shopify/flash-list";
import { grayDark } from "@context/theme/colors_neon";
import React from 'react';
import { Text, View } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { ProfileBody } from './ProfileBody';
import { useProfileBodyStyles } from "./ProfileBody.styles";
import { ConnectedProfileBodyProps } from './ProfileBody.types';

type Bar = {
	i: string;
	h: string;
	s: string;

}
/**
 * Connected ProfileBody Component
 * Details:
 */
export const ConnectedProfileBody: React.FC<ConnectedProfileBodyProps> = ({
	isMyProfile,
	bio,
}) => {


	const styles = useProfileBodyStyles();


	const data: Bar[] = [
		
		{
			i: "1",
			h: "Steps",
			s: "12,542",
		}, 
		{
			i: "2",
			h: "Weights lifted",
			s: "1593 lbs"
		},
		{
			i: "4", 
			h: "Running",
			s: "40.0k mi",
		}, 
		{
			i: "5", 
			h: "Calories burned",
			s: "8743 cal",
		}, 
		{
			i: "6",
			h: "Flights climbed", 
			s: "2000 flights"
		}
	]


	const renderItemS = ({ item }: { item: Bar }) => {
		return (
			
			<View style={{ flex: 1, height: 60, width: "100%", paddingLeft:5, paddingRight:5,  backgroundColor: "black", alignItems:"center" , justifyContent:"center"}}>
				
			<View style={{ height: 60, width: 150,  borderWidth:1 ,padding: 2, borderRadius: 5, backgroundColor: "black", borderColor: grayDark.gray9, shadowColor: grayDark.gray4, shadowOffset: {width: -5, height: 5}, shadowRadius:8, shadowOpacity:0}}>
					<Text style={{ padding: 2, fontSize: 14, color: "white", fontFamily: fonts.inter.extra_bold }}>{item.h}</Text>
					<Text style={{ padding: 2,  fontSize: 25, color: grayDark.gray10, fontFamily: fonts.inter.extra_light }}>{item.s}</Text>

					</View>
					
			
			</View>
		)
	}

	return (
		<View style={{ flexGrow: 1, flexDirection: "column", alignItems: "flex-start" }}>
	
			<View style={{ flexBasis: 60 }}>
				<FlatList 
					data={data}
					renderItem={renderItemS}		
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					/>
			</View>
				<ProfileBody isMyProfile={isMyProfile} />
			
		</View>
	)
};

