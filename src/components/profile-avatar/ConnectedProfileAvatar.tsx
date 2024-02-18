import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ImageErrorEventData, ImageSource } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { ConnectedProfileAvatarProps } from './ProfileAvatar.types';

/**
 * Connected ProfileAvatar Component
 * Details:
 */
export const ConnectedProfileAvatar: React.FC<ConnectedProfileAvatarProps> = ({
	username,
	fetchSize = 200,
	size = 40,
	priority = 'normal',
	onNavigateToProfile,
}) => {
	const [profileImage, setProfileImage] = useState<ImageSource | null>(null);
	const [hasProfileImage, setHasProfileImage] = useState<boolean>(true);
	const navigation = useNavigation();

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`,
				);
				const image = await response.data.image;
				const imageSource: ImageSource = {
					uri: `data:image/jpeg;base64,${image}`,
				};
				setProfileImage(imageSource);
			} catch (error) {
				setHasProfileImage(false);
				if (
					error?.response === `No image exists at ${username}_profile`
				) {
					console.log('handlederror', error);
					// Expected error if no image exists for this user
					return;
				} else {
					console.log(
						`Error fetching profile image for ${username}: `,
						error,
					);
				}
			}
		};
		fetchProfileImage();
	}, []);

	const onErrorCallback = (event: ImageErrorEventData) => {
		throw new Error(event.error);
		console.log(
			`Error loading ProfileAvatar image for ${username}: `,
			event,
		);
	};

	const onPressCallback = () => {
		if (onNavigateToProfile) {
			onNavigateToProfile();
		} else {
			navigation.navigate('profile', { profileUsername: username });
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			onPress={onPressCallback}
			style={{
				width: size,
				height: size,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<ProfileAvatar
				key={username}
				username={username}
				size={size}
				onError={onErrorCallback}
				imgSrc={profileImage}
				hasProfileImage={hasProfileImage}
				priority={priority}
			/>
		</TouchableOpacity>
	);
};
