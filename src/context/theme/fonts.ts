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
	work_sans:{
		black:'work_sans_black',
		bold:'work_sans_bold',
		extra_bold:'work_sans_extra_bold',
		extra_light:'work_sans_extra_light',
		light:'work_sans_light',
		medium:'work_sans_medium',
		regular:'work_sans_regular',
		semi_bold:'work_sans_semi_bold',
		thin:'work_sans_thin',
	},
	nord:{
		black:'nord_font_black',
		bold:'nord_font_bold',
		light:'nord_font_light',
		medium:'nord_font_medium',
		regular:'nord_font_regular',
		thin:'nord_font_thin',
	}
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
export const workSansFonts = [
	{ work_sans_black: require('@assets/fonts/work_sans/WorkSans-Black.ttf') },
	{ work_sans_bold: require('@assets/fonts/work_sans/WorkSans-Bold.ttf') },
	{ work_sans_extra_bold: require('@assets/fonts/work_sans/WorkSans-ExtraBold.ttf') },
	{ work_sans_extra_light: require('@assets/fonts/work_sans/WorkSans-ExtraLight.ttf') },
	{ work_sans_light: require('@assets/fonts/work_sans/WorkSans-Light.ttf') },
	{ work_sans_medium: require('@assets/fonts/work_sans/WorkSans-Medium.ttf') },
	{ work_sans_regular: require('@assets/fonts/work_sans/WorkSans-Regular.ttf') },
	{ work_sans_semi_bold: require('@assets/fonts/work_sans/WorkSans-SemiBold.ttf') },
	{ work_sans_thin: require('@assets/fonts/work_sans/WorkSans-Thin.ttf') },
];
export const nordAllFonts = [
	{ nord_font_black: require('@assets/fonts/nord_font/Nord-Black.ttf') },
	{ nord_font_bold: require('@assets/fonts/nord_font/Nord-Bold.ttf') },
	{ nord_font_light: require('@assets/fonts/nord_font/Nord-Light.ttf') },
	{ nord_font_medium: require('@assets/fonts/nord_font/Nord-Medium.ttf') },
	{ nord_font_regular: require('@assets/fonts/nord_font/Nord-Regular.ttf') },
	{ nord_font_thin: require('@assets/fonts/nord_font/Nord-Thin.ttf') },

]
export const fontAssets = fontsAll.map((x) => Font.loadAsync(x));
