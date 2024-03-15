import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { useThemeContext } from '@context/theme/useThemeContext';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActionButton } from '../../../../primitives/action-button/ActionButton';
import { Modal } from '../../../../primitives/action-modal/ActionModal';


export interface DeletePlanModalProps {
	isVisible: boolean;
	onClosePress: (isPostDeleted: boolean) => void;
	deletePlanId: string;
}

 const _DeletePlanModal: React.FC<DeletePlanModalProps> = ({
	isVisible,
	onClosePress,
	deletePlanId,
}) => {
	const {deletePlan } = useMyUserInfo();
	const { theme } = useThemeContext();
	 const [loading, setLoading] = useState<boolean>(false);

	const onDeletePressCb = async () => {
		setLoading(true);
		console.log("deletepost ID: ",deletePlanId )
		await deletePlan(deletePlanId);
		setLoading(false);
		onClosePress(true);
	};

	return (
		<Modal
			isVisible={isVisible}
			hasBackdrop
			animateOut='fadeOut'
			onBackdropPress={onClosePress}>
			
			<Modal.Container
				containerStyle={{
					backgroundColor: theme.innerContainer.backgroundColor,
				}}>
				
				<Modal.Header
					title='Are you sure you want to delete this plan?'
					headerStyle={{ text: { color: grayDark.gray12, fontSize: 18, fontFamily: fonts.inter.bold } }}
				/>
		
				<Modal.Body bodyStyle={{ alignItems: 'center' }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 15,
						}}>
						<ActionButton
							isPrimary={true}
							styles={{ container: { padding: 10 } }}
							defaultPressed={false}
							title='Cancel'
							onPress={onClosePress}
						/>
						<ActionButton
							loading={loading}
							isPrimary={true}
							styles={{ container: { padding: 10 } }}
							defaultPressed={false}
							title='Delete'
							onPress={onDeletePressCb}
						/>
					</View>
				</Modal.Body>
			</Modal.Container>
		</Modal>
	);
};


export const DeletePlanModal = React.memo(_DeletePlanModal);