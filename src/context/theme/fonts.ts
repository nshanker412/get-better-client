import * as Font from 'expo-font';

export const fonts = {
	inter: {
		black: 'inter_black',
		bold: 'inter_bold',
		extra_bold: 'inter_extra_bold',
		extra_light: 'inter_extra_light',
		light: 'inter_light',
		medium: 'inter_medium',
		regular: 'inter_regular',
		semi_bold: 'inter_semi_bold',
		thin: 'inter_thin',
	},
};

export const fontsAll = [
	{ inter_black: require('@assets/fonts/Inter-Black.ttf') },
	{ inter_bold: require('@assets/fonts/Inter-Bold.ttf') },
	{ inter_extra_bold: require('@assets/fonts/Inter-ExtraBold.ttf') },
	{ inter_extra_light: require('@assets/fonts/Inter-ExtraLight.ttf') },
	{ inter_light: require('@assets/fonts/Inter-Light.ttf') },
	{ inter_medium: require('@assets/fonts/Inter-Medium.ttf') },
	{ inter_regular: require('@assets/fonts/Inter-Regular.ttf') },
	{ inter_semi_bold: require('@assets/fonts/Inter-SemiBold.ttf') },
	{ inter_thin: require('@assets/fonts/Inter-Thin.ttf') },
];
export const fontAssets = fontsAll.map((x) => Font.loadAsync(x));
