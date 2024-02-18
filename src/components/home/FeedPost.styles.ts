/**
 * TODO:
 * - prob need ot implement breakpoints for diff screen sizes to make sure layout is consistent
 */

import { useThemeContext } from '@context/theme/useThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useFeedPostStyles = () => {
	const { theme } = useThemeContext();



	const feedPostStyles = useMemo(() => StyleSheet.create({
		userPostContainer: {
			...theme.container,
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
		},

		backArrowContainer: {
			...theme.innerContainer,
			position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			top: 50,
			left: 10,
			width: '100%',
			zIndex: 1,
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		postHeader: {
			...theme.text.header,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
			position: 'absolute',
			width: 'auto',
			height: 50, // todo - wrap uname incase some boi has long name
			top: 100,
			left: 0,
			padding: 10,
			zIndex: 1,
			gap: 10,
		},

		profileImage: {
			width: 50,
			height: 50,
			borderRadius: 25,
		},

		postHeaderInfoContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			paddingTop: 2,
			paddingBottom: 2,
		},

		username: {
			color: theme.textColorPrimary,
			fontFamily: theme.fontFamily,
			fontSize: 16,
			fontWeight: '700',
			textAlign: 'left',
		},

		dots: {
			width: 25,
			height: 25,
		},

		postImageContainer: {
			flex: 1, // Take up all available space
			width: '100%', // Ensure the container is full width
			alignItems: 'center', // Center children horizontally
			justifyContent: 'center', // Center children vertically
		},

		postImage: {
			width: '100%',
			height: '100%',
		},

		postFooter: {
			position: 'absolute',
			bottom: 80,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-start',
			paddingLeft: 15,
			paddingRight: 15,
			paddingBottom: 30,
			zIndex: 1,
		},

		postDataContainer: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: 15,
		},

		postDataRow: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		postDataInnerRow: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			gap: 10,
		},

		iconsContainer: {
			// width: '30%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		iconsInnerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 15,
		},

		icon: {
			justifyContent: 'center',
			backgroundColor: 'transparent',
			shadowColor: '#000000',
			shadowOffset: { width: 2, height: 4 },
			shadowOpacity: 0.3,
			shadowRadius: 4,
			width: 40,
			height: 40,
			zIndex: 1,
		},
		iconStyle: { width: 40, height: 40 },
		gbIcon: {
			width: 50,
			height: 50,
		},

		deleteIcon: {
			width: 30,
			height: 30,
		},

		deleteContainer: {
			position: 'absolute',
			backgroundColor: theme.container.backgroundColor,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		deleteButton: {
			...theme.button.primary.default,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 15,
			borderRadius: 10,
		},

		deleteText: {
			...theme.button.primary.default.buttonText,
			fontSize: 20,
			fontWeight: 'bold',
		},

		cancelText: {
			fontSize: 16,
			textDecorationLine: 'underline',
			margin: 25,
		},

		captionContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

		caption: {
			...theme.text.body.mediumer,
			fontSize: 16,
		},

		commentsContainer: {
			position: 'absolute',
			top: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: theme.container.backgroundColor,
			zIndex: 1000,
		},

		commentsHeader: {
			...theme.text.body.large,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			width: '90%',
			height: '20%',
			marginTop: 100,
		},

		noCommentsContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			height: '50%',
		},

		closeIcon: {
			height: 25,
			width: 25,
		},

		inputContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '85%',
		},

		input: {
			...theme.input,
			height: 50,
			maxWidth: '70%',
			minWidth: '40%',
			marginTop: 5,
			marginBottom: 15,
			paddingTop: 15,
			paddingLeft: 15,
			paddingRight: 15,
			borderWidth: 0,
			borderRadius: 25,
			fontSize: 16,
			textAlign: 'center',
			overflow: 'hidden',
			zIndex: 1000,
		},

		submitCommentButton: {
			...theme.button.primary.default,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
			width: 125,
			borderWidth: 1,
		},

		submitCommentText: {
			...theme.button.primary.default.buttonText,
			padding: 7.5,
			fontSize: 16,
			fontWeight: 'bold',
		},

		commentsScroll: {
			width: 390,
		},

		commentContainer: {
			backgroundColor: theme.innerContainer.backgroundColor,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopColor: theme.container.backgroundColor,
			borderTopWidth: 1,
		},

		lastComment: {
			backgroundColor: theme.innerContainer.backgroundColor,

			width: 'auto',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopColor: theme.container.backgroundColor,
			borderTopWidth: 1,
		},

		profileImageComments: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginLeft: 15,
			marginRight: 15,
		},

		commentInfoContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			width: 'auto',
		},

		commentInfoInnerContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			paddingBottom: 5,
		},

		commentContentContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
			width: '87.5%',
		},

		commentUser: {
			fontSize: 16,
			fontWeight: 'bold',
			paddingRight: 10,
		},

		commentContent: {
			fontSize: 16,
			fontWeight: 'normal',
		},

		timestamp: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontWeight: '400',
		},

		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			marginTop: 100,
		},

		mediaLoadingContainer: {
			position: 'absolute',
			top: '0%',
			left: '0%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			zIndex: 1000,
			backgroundColor: theme.container.backgroundColor,
		},

		loader: {
			width: 75,
			height: 75,
		},
	})
	, [theme]);

	return feedPostStyles;
};
