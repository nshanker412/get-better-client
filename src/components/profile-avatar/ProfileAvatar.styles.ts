import { useThemeContext } from '@context/theme/useThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useProfileAvatarStyles = () => {
	const { theme } = useThemeContext();

	const ProfileAvatarStyles = useMemo(() =>StyleSheet.create({
		container: {
			backgroundColor: theme.grayShades.gray600,
			shadowColor: '#000000',
			shadowOffset: { width: -2, height: 4 },
			shadowOpacity: 0.5,
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
	})
	, [theme]);

	return ProfileAvatarStyles;
};
