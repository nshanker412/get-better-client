import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useProfilePostsStyles = () => {
	const { theme } = useThemeContext();

	const ProfilePostsStyles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'stretch',
			gap: 10,
		},
		noPostsContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		noPostsText: {
			color: theme.grayShades.gray700,
			opacity: 0.5,
			fontSize: 16,
			fontFamily: theme.text.body.medium.fontFamily,
		},
		profileFeedContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			flexWrap: 'wrap',
			width: '100%',
		},
		imageScrollBuffer: {
			height: 300,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		imageContainer: {
			flex: 1,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: 200,
			alignSelf: 'flex-start',
		},
	});

	return ProfilePostsStyles;
};
