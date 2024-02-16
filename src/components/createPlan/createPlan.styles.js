import { useThemeContext } from '@context/theme/useThemeContext';
import { StyleSheet } from 'react-native';

export const useCreatePlanStyles = () => {
	const { theme } = useThemeContext();

	const createPlanStyles = StyleSheet.create({
		backArrowContainer: {
			// position: 'absolute',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-start',
			// top: 50,
			// left: 10,
			// width: '100%',
			// flex: 1
			// zIndex: 1000
		},

		backArrow: {
			width: 30,
			height: 30,
		},

		createPlanContainer: {
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			marginTop: 25,
		},

		createPlanTitleText: {
			color: theme.textColorPrimary,
			fontFamily: theme.text.header.fontFamily,
			fontSize: 30,
			fontWeight: 'bold',
		},

		createPlanSubHeaderText: {
			color: theme.textColorSecondary,
			fontFamily: theme.text.header.fontFamily,
			fontSize: 20,
			width: '75%',
			fontWeight: 'bold',
		},

		planTypeContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 25,
			margin: 25,
		},

		planTypeText: {
			...theme.text.body.large,
			fontSize: 18,
			opacity: 0.5,
			
		},

		planTypeTextSelected: {
			...theme.text.body.large,
			fontSize: 20,
			fontWeight: 'bold',
		},

		workoutTypeContainer: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: 25,
			marginBottom: 25,
		},
		workoutTypePicker: {
			marginTop: 10,
			backgroundColor: theme.textColorPrimary,
			// backgroundColor: theme.innerContainer.backgroundColor,
			borderRadius: 10,
			width: '25%',
			fontSize: 12,
			// width: '40%',
		},

		titleInput: {
			// ...theme.text.body.large,
			backgroundColor: theme.innerContainer.backgroundColor,
			color: theme.textColorPrimary,

			width: '75%',
			textAlign: 'center',
			padding: 10,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			fontSize: 20,
			overflow: 'hidden',
		},

		planInfoContainer: {
			// backgroundColor: theme.grayShades.gray100,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			width: '95%',
		},

		numberPicker: {
			marginTop: 10,
			backgroundColor: theme.textColorPrimary,
			// backgroundColor: theme.innerContainer.backgroundColor,
			borderRadius: 10,
			width: '25%',
			fontSize: 12,
		},
		pickerItemStyle: {
			// color: theme.textColorPrimary,
			// textColor: theme.textColorPrimary,
			fontSize: 12,
		},

		numberPickerWide: {
			marginTop: 10,
			backgroundColor: theme.textColorPrimary,
			// backgroundColor: theme.innerContainer.backgroundColor,
			borderRadius: 10,
			fontSize: 12,
			width: '27.5%',
		},

		planInfoText: {
			...theme.text.body.mediumer,
			fontSize: 16,
		},

		descriptionInput: {
			// ...theme.text.body.medium,
			backgroundColor: theme.innerContainer.backgroundColor,
			color: theme.textColorPrimary,

			width: '75%',
			height: 50,
			fontSize: 16,
			padding: 10,
			marginTop: 25,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			textAlign: 'center',
		},

		descriptionInputNutrition: {
			...theme.innerContainer,
			color: theme.textColorPrimary,
			width: '75%',
			height: '30%',
			fontSize: 16,
			padding: 10,
			margin: 25,
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
			textAlign: 'center',
		},

		previewImageContainer: {
			width: '100%',
			height: '10%',
			marginBottom: 25,
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},

		previewImageText: {
			...theme.text.primary,
			fontSize: 20,
			fontWeight: 'bold',
		},

		previewImage: {
			width: '20%',
			height: '100%',
		},

		cameraRollIcon: {
			width: 40,
			height: 40,
			margin: 5,
		},

		selectImageButton: {
			width: 200,
			display: 'flex',
			flexDirection: 'row',
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'white',
			borderRadius: 10,
			borderWidth: 1,
			borderColor: theme.innerBorderColor,
		},

		selectImageText: {
			color: 'black',
			fontSize: 20,
			fontWeight: 'bold',
			padding: 10,
		},

		submitButton: {
			// ...theme.button.primary.default,
			backgroundColor: theme.button.primary.default.backgroundColor,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
		},

		submitButtonDisabled: {
			// ...theme.button.primary.disabled,
			// color: theme.textColorSecondary,
			backgroundColor: theme.button.primary.disabled.backgroundColor,
			width: 200,
			textAlign: 'center',
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: 10,
		},

		submitText: {
			...theme.text.body.large,
			fontSize: 20,
			padding: 10,
		},

		sendLoadingContainer: {
			position: 'absolute',
			backgroundColor: theme.grayShades.gray200,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			width: '100%',
			height: '100%',
		},

		loader: {
			width: 75,
			height: 75,
		},
	});

	return createPlanStyles;
};
