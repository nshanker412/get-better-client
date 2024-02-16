import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useFooterStyles = () => {
	const { theme } = useThemeContext();

	const footerStyles = StyleSheet.create({
		safeArea: {
			position: 'absolute',
			right: 0,
			left: 0,
			bottom: 0,
			zIndex: 1,
			height: 80,
			backgroundColor: 'rgba(0, 0, 0, 0.15)',
		},
		divbar: {
			color: theme.div.color,
			opacity: theme.div.opacity,
		},
		footerContainer: {
			borderTopWidth: 1,
			borderTopColor: theme.innerBorderColor,
			backgroundColor: 'transparent',
			paddingTop: 15,
		},

		footerInnerContainer: {
			flexDirection: 'row',
			justifyContent: 'space-evenly',
			alignItems: 'center',
			alignContent: 'stretch',
			backgroundColor: 'transparent',
		},

		footerIcon: {
			height: 30,
			width: 30,
		},

		leaderboardIcon: {
			height: 35,
			width: 35,
		},

		gbIcon: {
			height: 35,
			width: 35,
		},

		postIconContainer: {
			height: 48,
			width: 48,
		},
		iconBox: {
			height: 40,
			width: 40,
			justifyContent: 'center',
			alignSelf: 'center',
			alignItems: 'center',
		},
		iconListContianer: {
			flex: 1,
		},
		listItem: {
			borderRadius: 5,
			alignSelf: 'baseline',
		},
	});

	return footerStyles;
};
