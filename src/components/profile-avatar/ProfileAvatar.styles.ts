import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfileAvatarStyles = () => {
	const { theme } = useThemeContext();

	const ProfileAvatarStyles = StyleSheet.create({
		container: {
			backgroundColor: theme.grayShades.gray600,
			shadowColor: '#000000',
			shadowOffset: { width: 2, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
		},
		avatar: {
			backgroundColor: theme.grayShades.gray200,
			width: '100%',
			height: '100%',
		},
		fallbackAvatar: {
			// backgroundColor: theme.grayShades.gray400,
			// alignSelf: 'center',
		},
	});

	return ProfileAvatarStyles;
};
