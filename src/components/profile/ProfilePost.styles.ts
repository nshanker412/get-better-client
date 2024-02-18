import { useThemeContext } from '@context/theme/useThemeContext';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

export const useProfilePostStyles = () => {
	const { theme } = useThemeContext();

	const profilePostSyles = useMemo(() => StyleSheet.create({
		header: {
			...theme.text.header,
		},
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
			zIndex: 1000,
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		deleteIconContainer: {
			position: 'absolute',
			top: 50,
			right: 15,
			zIndex: 1000,
		},

	

		postHeader: {
			...theme.text.header,
			position: 'absolute',
			width: '100%',
			top: 100,
			left: 15,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			gap: 10,
			zIndex: 1,
		},

		profileImage: {
			width: 40,
			height: 40,
			borderRadius: 17.5,
			marginRight: 10,
		},

		postHeaderInfoContainer: {
			display: 'flex',
			flexDirection: 'column',
			gap: 2.5,
		},

		username: {
			...theme.text.primary,
			fontWeight: 'bold',
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
			bottom: '11.1%',
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-start',
			paddingLeft: 15,
			paddingRight: 15,
			paddingBottom: 20,
			zIndex: 1,
		},

		postDataContainer: {
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'flex-start',
			gap: 10,
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
			gap: 15,
		},

		iconsContainer: {
			...theme.innerContainer,
			width: '30%',
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
			width: 40,
			height: 40,
		},

		gbIcon: {
			width: 50,
			height: 50,
		},

		deleteIcon: {
			width: 30,
			height: 30,
		},

		deleteContainer: {
			...theme.conatiner,
			position: 'absolute',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		deleteButton: {
			...theme.button.secondary,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'black',
			padding: 15,
			borderRadius: 10,
		},

		deleteText: {
			...theme.button.buttonText,
			fontWeight: 'bold',
		},

		cancelText: {
			...theme.text.secondary,
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
			...theme.text.secondary,
		},

		commentsContainer: {
			...theme.innerContainer,
			position: 'absolute',
			top: 0,
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 1000,
		},

		commentsHeader: {
			...theme.text.header,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			width: '90%',
			height: '20%',
			marginTop: 100,
		},

		noCommentsContainer: {
			...theme.innerContainer,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
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
			...theme.text.secondary,
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
			textAlign: 'center',
			overflow: 'hidden',
		},

		submitCommentButton: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#000000',
			borderRadius: 10,
			width: 125,
			borderWidth: 1,
			borderColor: '#000000',
		},

		submitCommentText: {
			...theme.text.secondary,
			padding: 7.5,
			fontWeight: 'bold',
		},

		commentsScroll: {
			width: 390,
		},

		commentContainer: {
			...theme.container,
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopWidth: 1,
		},

		lastComment: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
			paddingTop: 10,
			paddingBottom: 10,
			borderTopColor: '#00000040',
			borderTopWidth: 1,
			borderBottomColor: '#00000040',
			borderBottomWidth: 1,
		},

		profileImageComments: {
			width: 40,
			height: 40,
			borderRadius: 25,
			marginLeft: 15,
			marginRight: 15,
		},

		commentInfoContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'flex-start',
			width: '90%',
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
			...theme.text.secondary,
			fontSize: 13,
		},

		loadingContainer: {
			...theme.innerContainer,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
			marginTop: 100,
		},

		loader: {
			width: 75,
			height: 75,
		},
	}), [theme]);

	return profilePostSyles;
};
