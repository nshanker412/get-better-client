import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ActionButton } from '../../../../primitives/action-button/ActionButton';
import { Modal } from '../../../../primitives/action-modal/ActionModal';

export interface DeletePostModalProps {
	isVisible: boolean;
	onClosePress: (isPostDeleted: boolean) => void;
	deletePostId: string;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
	isVisible,
	onClosePress,
	deletePostId,
}) => {
	const { deletePost } = useMyUserInfo();
	const { theme } = useThemeContext();
	const [loading, setLoading] = useState<boolean>(false);

	const onDeletePressCb = async () => {
		setLoading(true);
		deletePost(deletePostId);
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
					title='Are you sure you want to delete this post?'
					headerStyle={{ text: { ...theme.text.header } }}
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
