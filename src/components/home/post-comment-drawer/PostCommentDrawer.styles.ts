import { useThemeContext } from '@context/theme/useThemeContext';
import { ImageStyle, StyleSheet, TextStyle } from 'react-native';

export const usePostCommentDrawerStyles = () => {
	const { theme } = useThemeContext();

	const PostCommentDrawerStyles = StyleSheet.create({
		placeholderText: {
			color: theme.containerDefaultTextColor,
		},
		headerInnerContainer: {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			paddingBottom: 15,
			width: '100%',
			borderBottomWidth: 1,
			borderBottomColor: theme.innerBorderColor,
		},
		headerContainer: {
			backgroundColor: theme.containerBackgroundColor,
			width: '100%',
			height: 50,
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		headerText: {
			color: theme.textColorThird,
			fontSize: 22,
			fontFamily: theme.text.title.fontFamily,
			textAlign: 'center',
		},
		modalContent: {
			display: 'flex',
			width: '100%',
			backgroundColor: theme.innerContainer.backgroundColor,
			opacity: 0.95,
			paddingVertical: 20,
			paddingHorizontal: 20,
			borderTopRightRadius: 18,
			borderTopLeftRadius: 18,
			position: 'absolute',
			bottom: 0,
		},
		titleContainer: {
			backgroundColor: '#464C55',
			borderTopRightRadius: 10,
			borderTopLeftRadius: 10,
			paddingHorizontal: 20,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		title: {
			color: '#fff',
			fontSize: 16,
		},
		pickerContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 50,
			paddingVertical: 20,
		},

		commentInfoContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'flex-start',
		},

		commentInfoInnerContainer: {
			paddingLeft: 10,
			flexDirection: 'row',
			display: 'flex',
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
			...theme.text.body.large,
			fontFamily: theme.fontFamily,
			alignSelf: 'flex-start',
			textAlign: 'left',
		},
		scrollView: {
			bottom: 0,
		},

		commentContent: {
			...theme.text.body.mediumer,
			fontSize: 15
		} as TextStyle,
		timestamp: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			textAlign: 'left',
			fontWeight: '400',
			fontSize: 12,
		},
		commentScrollContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},
		username: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			fontSize: 12,
			textAlign: 'left',
			// alignSelf: 'flex-start'
		},
		loadingContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: 50,
			// marginTop: 100
		},
		noCommentsText: {
			fontFamily: theme.text.body.medium.fontFamily,
			color: theme.textColorThird,
			textAlign: 'center',
			fontWeight: '400',
			fontSize: 16,
			// marginTop: 100
		},
		noCommentsContainer: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
			width: '100%',
			padding: 10,
			// height: '100%',
			// maxHeight: '10%',
		},
		lastComment: {
			backgroundColor: theme.innerContainer.backgroundColor,
			borderRadius: 10,
			width: '100%',
			paddingTop: 10,
			paddingHorizontal: 10,
			paddingBottom: 100,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
		},
		commentProfileImage: {
			width: 40,
			height: 40,
			borderRadius: 20,
			paddingRight: 10,
			alignSelf: 'center',
			justifyContent: 'flex-start',
		},
		profileImageComments: {
			paddingRight: 10,
			flex: 1,
			width: 40,
			height: 40,
			borderRadius: 20,
		} as ImageStyle,
		inputContainer: {
			backgroundColor: theme.innerBorderColor,
			borderRadius: 10,
			flexDirection: 'row',
			width: '60%',
			// padding: 10,
			paddingTop: 10,
			paddingBottom: 10,
			paddingLeft: 20,
			alignSelf: 'center',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		inputContainerGrow: {
			// backgroundColor: theme.grayShades.gray500
			backgroundColor: 'transparent',
			borderWidth: 1,
			borderColor: theme.grayShades.gray600,
			borderRadius: 10,
			flexDirection: 'row',
			width: '90%',
			paddingLeft: 10,
			paddingTop: 10,
			paddingBottom: 10,

			// padding: 20,
			alignSelf: 'center',
			alignItems: 'center',
			justifyContent: 'space-between',
		},
		commentInputInnerContainer: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-around',
			alignItems: 'center',
		},

		commentInputContainer: {
			gap: 10,
			flexDirection: 'column',
		},
		commentContainer: {
			flex: 1,
			display: 'flex',
			width: '100%',
			padding: 10,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'flex-start',
		},
		lastcommentContainer: {
			flex: 1,
			display: 'flex',
			width: '100%',
			paddingRight: 10,
			paddingLeft: 10,
			paddingTop: 10,
			paddingBottom: 100,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'flex-start',
		},

		commentInnerContainer: {
			borderColor: theme.grayShades.gray200,
			borderWidth: 1,
			borderRadius: 10,
			gap: 8,
			width: '100%',
			padding: 15,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'flex-start',
		},
		ellipse: {
			color: theme.textColorThird,
		},
		placeholderInput: {
			color: theme.containerDefaultTextColor,
		},
		input: {
			color: theme.textColorPrimary,
			backgroundColor: theme.input.backgroundColor,
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 3,
			},
			shadowOpacity: 0.27,
			// width: '100%',
			alignSelf: 'flex-start',
		},
		inputOuterContainer: {
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderBottomColor: theme.innerBorderColor,
		},
		submitCommentButton: {
			// backgroundColor: theme.button.primary.backgroundColor,
			flexDirection: 'row', // Arrange children in a row
			justifyContent: 'center', // Space between children
			alignItems: 'center', // Center children vertically
			// backgroundColor: 'red',
			// flexShrink: 1,
			height: '100%',
			width: 50,
		},
		submitCommentButtonInnerContainer: {
			// flexDirection: 'row', // Align icon and text in a row
			// display: 'flex',
			// flex: 1,
			width: 20,
			// padding: 10,
			// backgroundColor: 'red',
			alignItems: 'center', // Center icon and text vertically
			justifyContent: 'center', // Center icon and text horizontally
			// width: '100%',
		},
		blurLoadingOverlayContainer: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			backgroundColor: theme.containerBackgroundColor,
			opacity: 0.95,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: 100,
		},
		blurLoadingOverlay: {
			width: '100%',
			height: '100%',
			position: 'absolute',
			zIndex: 100,
		},
	});

	return PostCommentDrawerStyles;
};
