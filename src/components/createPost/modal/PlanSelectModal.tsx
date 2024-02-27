import { ActionButton } from '@components/primitives/action-button/ActionButton';
import { PlanType } from '@components/profile/profile-body/plan-list/plan-item/PlanItem.types';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark, greenDark } from '@context/theme/colors_neon';
import { fonts } from "@context/theme/fonts";
import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { Modal } from '../../primitives/action-modal/ActionModal';
import { useProfileBodyStyles } from '../../profile/profile-body/ProfileBody.styles';
import { ConnectedPlanItem } from '../../profile/profile-body/plan-list/plan-item/ConnectedPlanItem';

const actions = [

	{
	  text: "Plan",
		//   icon: require("./images/ic_language_white.png"),
		name: "bt_link_post",
		textStyle: {fontFamily: fonts.inter.light},
		color: "rgba(137, 133, 133, 0.9)",
		icon: <FontAwesome5 name="link" size={24} color="white" />,

	  position: 1
	},
	{
	  text: "Location",
		//   icon: require("./images/ic_room_white.png"),
		// icon: <MapIcon />,
		icon: <FontAwesome5 name="map-marked-alt" size={24} color="white" />,


		name: "bt_room",
		textStyle: { fontFamily: fonts.inter.light },
	  color: "rgba(137, 133, 133, 0.9)",

	  position: 3
	},

  ];





const planModalStyles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	planItemSelected: {
		flex: 1,
		width: 130,
		height: 130,
		borderColor: greenDark.green9,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		backgroundColor: greenDark.green5,
		alignItems: "center",
		justifyContent: "center"
	},
	planItemDefault: {
		flex: 1,
		width: 130,
		height: 130,
		borderColor: grayDark.gray9,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		backgroundColor: grayDark.gray5,
		alignItems: "center",
		justifyContent: "center"
	}
	
	
});


//   type PlanType = 'someType'; // Define your PlanType here
  type PlanItemProps = { timestamp: string; planType: PlanType; title: string }; // Adjust according to your data structure
  
  interface PlanModalProps {
	isVisible: boolean;
	onPlanModalClose: (chosenPlans: string[] | []) => void;
  }
  

export  const PlanSelectModal: React.FC<PlanModalProps> = ({ isVisible, onPlanModalClose }) => {
	const [plans, setPlans] = useState<PlanItemProps[]>([]);
	const { theme } = useThemeContext();
	const { username } = useMyUserInfo();
	  const profileBodyStyles = useProfileBodyStyles();
	  const chosenPlansRef = useRef<string[] | []>([]);
	  const [numSelected, setNumSelected] = useState(0);
  
	useEffect(() => {
	  const fetchPlans = async () => {
		try {
		  const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plans/fetch/${username}`);
		  console.log('fetchPlans', response.data);
		  setPlans(response.data.plans);
		} catch (error) {
		  console.error('Failed to fetch plans', error);
		}
	  };
	  fetchPlans();
	}, [username]);
	  
	  
	 

	  const onToggleSelection = (planID: string | undefined) => {
		  if (chosenPlansRef.current.includes(planID)) {
			chosenPlansRef.current = chosenPlansRef.current.filter((plan) => plan !== planID);

		  } else {
			chosenPlansRef.current.push(planID!);

		  }

		  console.log("currentPlanlength", chosenPlansRef.current.length)

		}	



  
	  const PlanItem = ({ item }: { item: PlanItemProps }) => {
	
		  const [sty, setSty] = useState(planModalStyles.planItemDefault);

		  const onPlanPress = (planID: string) => {
			  console.log('plan pressed', planID);
			  if (chosenPlansRef.current?.includes(planID)) {
				  setSty(planModalStyles.planItemDefault);


			} else {
				setSty(planModalStyles.planItemSelected);

			}
			  onToggleSelection(planID);
			
		  }

		  
		  return (
			  <View style={{ flex: 1, width: "100%", height: "100%", alignItems: "center", justifyContent: "center", gap: 10, padding: 10 }}>
				  <TouchableOpacity onPress={() => onPlanPress(item.timestamp)}>
					  <View style={sty}>
						  <ConnectedPlanItem planType={item.planType} planTitle={item.title} />
					  </View>
				  </TouchableOpacity>
			  </View>
	  
		  );
	  }
  
	  return (
		  <SafeAreaView style={{ flex: 1, margin: 20, alignItems: "center", justifyContent: "center", padding: 10, marginBottom: 40 }}>
	  <Modal isVisible={isVisible} style={{ flex: 1, alignSelf: "center",  width: "90%" , height: "70", maxHeight: "60%", marginTop: "40%"}}>
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
		
			<Modal.Container
			  containerStyle={{
				backgroundColor: grayDark.gray4,
				// gap: 20,
				flexDirection: 'column',
				alignContent: 'center',
								  justifyContent: 'space-around',
								  flex: 1,

				
			  }}
			>
			  <TouchableOpacity style={{ alignItems: "flex-start", justifyContent: "flex-start", width: 40, height: 40 }} onPress={() => onPlanModalClose(chosenPlansRef.current)}>
				<View style={{ padding: 10 }}>
				  <AntDesign name='close' size={24} color={"white"} />
				</View>
			  </TouchableOpacity>
			  <Modal.Header
				title="Select plan(s) to link"
				headerStyle={{
				  container: {
					alignSelf: 'center',
						justifyContent: 'center',
					// gap: 10
				  },
					text: {
						fontFamily: fonts.inter.black,
						fontSize: 24,
						color: grayDark.gray12,
						alignSelf: 'center',
				  },
				}}
			  />
			  <Modal.Body bodyStyle={{flex:1, height: "auto", width: "100%", gap: 10}}>
				  <View style={{flex: 1, minHeight: 350, height: 350, width: "100%", backgroundColor: grayDark.gray3, borderRadius: 5}}>
					<FlashList
					  estimatedItemSize={100}
					  data={plans}
					  numColumns={2}
					  keyExtractor={(item) => item.timestamp}
					  renderItem={({ item }) => <PlanItem item={item} />}
					/>
				  </View>
			  </Modal.Body>
			  <Modal.Footer>
							  <ActionButton
								  
				  	loading={false}
					isPrimary={true}
					onPress={() => onPlanModalClose(chosenPlansRef.current!)}
				  	styles={{ container: { padding: 10, backgroundColor: grayDark.gray12 }, text: {fontFamily: fonts.inter.extra_bold} }}
				  	defaultPressed={false}
				  	title="Link"
				/>
			  </Modal.Footer>
			</Modal.Container>
		</TouchableWithoutFeedback>
			  </Modal>
		</SafeAreaView>
	);
  };
