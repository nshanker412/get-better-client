import { fonts } from './fonts';

// Light Theme
const lightTheme = {
	footerColor: 'rgba(0, 0, 0, 0.15)',
	errorColor: '#FF0000',
	errorColorOpaque: 'rgba(255, 0, 0, 0.3)',

	backgroundColor: '#FFFFFF', // Inverted from darkTheme
	textColorPrimary: '#000000', // Inverted from darkTheme
	textColorSecondary: '#59636D',
	textColorThird: '#9A9A9A',
	borderColor: '#D9D9D9',
	containerColor: '#1E1D1D',
	containerDefaultTextColor: '#AFAFAF',
	postButtonColor: '#4E565F',
	navbarTextColor: '#59636D',
	innerborderColor: 'rgba(205, 201, 201, 0.3)',
	fontFamily: fonts.inter.bold,
	fontFamilyLight: fonts.inter.regular.fontFamily,

	container: {
		backgroundColor: '#FFFFFF', // Inverted from darkTheme
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	innerContainer: {
		backgroundColor: '##F8F8F8',
	},
	button: {
		primary: {
			default: {
				backgroundColor: '#000000', // Inverted from darkTheme
				buttonText: {
					color: '#FFFFFF',
					fontFamily: fonts.inter.bold,
					fontSize: 16,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(0, 0, 0, 0.25)',
					textShadowOffset: { width: 0, height: 2 },
					textShadowRadius: 2,
				},
			},
			disabled: {
				backgroundColor: '#666666',
				buttonText: {
					fontFamily: fonts.inter.bold,
					fontSize: 16,
					color: '#FFFFFF',
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(0, 0, 0, 0.25)',
					textShadowOffset: { width: 0, height: 2 },
					textShadowRadius: 2,
				},
			},
		},
		secondary: {
			default: {
				borderColor: '#D9D9D9',
				backgroundColor: '#FFFFFF', // Inverted from darkTheme
				buttonText: {
					color: '#000000', // Inverted from darkTheme
					fontFamily: fonts.inter.regular.fontFamily,
					fontSize: 16,
					textAlign: 'center',
					fontWeight: 'normal',
					textShadowColor: 'rgba(0, 0, 0, 0.25)',
					textShadowOffset: { width: 0, height: 2 },
					textShadowRadius: 2,
				},
			},
			disabled: {
				backgroundColor: '#666666',
				buttonText: {
					fontFamily: fonts.inter.regular.fontFamily,
					fontSize: 16,
					color: '#333333',
					textAlign: 'center',
					fontWeight: 'normal',
					textShadowColor: 'rgba(0, 0, 0, 0.25)',
					textShadowOffset: { width: 0, height: 2 },
					textShadowRadius: 2,
				},
			},
		},
	},
	input: {
		color: '#000000', // Inverted from darkTheme
		backgroundColor: '#FFFFFF', // Inverted from darkTheme
	},
	text: {
		chungusTitle: {
			fontFamily: fonts.inter.bold,

			color: '#000000', // Inverted from darkTheme
			fontSize: 45,
			textAlign: 'center',
			textShadowColor: 'rgba(255, 255, 255, 0.25)',
			textShadowOffset: { width: 0, height: 4 },
			textShadowRadius: 4,
		},
		title: {
			fontFamily: fonts.inter.bold,

			color: '#000000', // Inverted from darkTheme
			fontSize: 30,
			textAlign: 'center',
			textShadowColor: 'rgba(255, 255, 255, 0.25)',
			textShadowOffset: { width: 0, height: 3 },
			textShadowRadius: 3,
		},
		header: {
			fontFamily: fonts.inter.bold,

			fontSize: 20,
			color: '#000000', // Inverted from darkTheme
			textAlign: 'center',
			textShadowColor: 'rgba(0, 0, 0, 0.25)',
			textShadowOffset: { width: 0, height: 2 },
			textShadowRadius: 2,
		},
		body: {
			small: {
				fontFamily: fonts.inter.regular.fontFamily,
				fontSize: 10,
				color: '#000000', // Inverted from darkTheme
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(0, 0, 0, 0.25)',
				// textShadowOffset: { width: 0, height: 1 },
				// textShadowRadius: 1,
			},
			medium: {
				fontFamily: fonts.inter.regular.fontFamily,
				fontSize: 14,
				color: '#000000', // Inverted from darkTheme
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(0, 0, 0, 0.25)',
				// textShadowOffset: { width: 0, height: 1 },
				// textShadowRadius: 1,
			},
			mediumer: {
				fontFamily: fonts.inter.regular.fontFamily,
				fontSize: 16,
				color: '#000000', // Inverted from darkTheme
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(0, 0, 0, 0.25)',
				// textShadowOffset: { width: 0, height: 1 },
				// textShadowRadius: 1,
			},
			large: {
				fontFamily: fonts.inter.regular.fontFamily,
				fontSize: 16,
				color: '#000000', // Inverted from darkTheme
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(0, 0, 0, 0.25)',
				// textShadowOffset: { width: 0, height: 2 },
				// textShadowRadius: 2,
			},
		},
		subtext: {
			color: '#59636D',
		},
	},
	div: {
		opacity: 0.3,
		color: '#C9C5C5',
	},
	grayShades: {
		gray50: '#E6E6E6', // Inverted from darkTheme
		gray100: '#CCCCCC', // Inverted from darkTheme
		gray200: '#B3B3B3', // Inverted from darkTheme
		gray300: '#999999', // Inverted from darkTheme
		gray400: '#666666',
		gray500: '#404040', // Inverted from darkTheme
		gray600: '#333333', // Inverted from darkTheme
		gray700: '#292929', // Inverted from darkTheme
		gray800: '#1C1C1C', // Inverted from darkTheme
		gray900: '#000000', // Inverted from darkTheme
	},
	opacity: {
		low: '0.6',
		medium: '0.8',
		high: '0.95',
	},
};

const darkTheme = {
	footerColor: 'rgba(0, 0, 0, 0.15)',
	errorColor: '#FF0000',
	errorColorOpaque: 'rgba(255, 0, 0, 0.3)',
	backgroundColor: '#000000',
	textColorPrimary: '#FFFFFF',
	textColorSecondary: '#59636D',
	textColorThird: '#9A9A9A',
	borderColor: '#D9D9D9',
	containerColor: '#1E1D1D',
	containerDefaultTextColor: '#AFAFAF',
	postButtonColor: '#4E565F',
	navbarTextColor: '#59636D',
	innerBorderColor: 'rgba(137, 133, 133, 0.3)',
	fontFamily: fonts.inter.bold,
	container: {
		backgroundColor: '#000000',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	innerContainer: {
		borderRadius: 40,
		backgroundColor: '#1E1D1D',
	},

	button: {
		primary: {
			default: {
				backgroundColor: '#FFFFFF',
				buttonText: {
					color: '#000000',
					fontFamily: fonts.inter.bold,
					fontSize: 16,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
					textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
					textShadowRadius: 2, // Shadow radius
				},
			},
			disabled: {
				backgroundColor: '#666666', // Darker gray for disabled state
				buttonText: {
					fontFamily: fonts.inter.bold,
					fontSize: 16,
					color: '#FFFFFF',
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
					textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
					textShadowRadius: 2, // Shadow radius
				},
			},
		},
		secondary: {
			default: {
				borderColor: '#D9D9D9',
				backgroundColor: '#000000',
				buttonText: {
					color: '#FFFFFF',
					fontFamily: fonts.inter.regular.fontFamily,
					fontSize: 16,
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
					textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
					textShadowRadius: 2, // Shadow radius
				},
			},
			disabled: {
				backgroundColor: '#666666', // Darker gray for disabled state
				buttonText: {
					fontFamily: fonts.inter.regular.fontFamily,
					fontSize: 16,
					color: '#333333',
					textAlign: 'center',
					fontWeight: 'bold',
					textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
					textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
					textShadowRadius: 2, // Shadow radius
				},
			},
		},
	},
	input: {
		flex: 1,
		color: '#FFFFFF',
		textShadowColor: 'rgba(0, 0, 0, 0.25)',
		textShadowOffset: { width: 0, height: 4 },
		textShadowRadius: 4,
		fontFamily: fonts.inter.bold,
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: '400',
		alignSelf: 'center',
	},
	text: {
		chungusTitle: {
			color: '#FFFFFF',
			fontFamily: fonts.inter.bold,
			fontSize: 45,
			textAlign: 'center',
			textShadowColor: 'rgba(0, 0, 0, 0.25)', // Shadow color (black with 25% opacity)
			textShadowOffset: { width: 0, height: 4 }, // Shadow offset (horizontal and vertical)
			textShadowRadius: 4, // Shadow radius
		},
		title: {
			fontFamily: fonts.inter.bold,
			color: '#FFFFFF',
			fontSize: 30,
			textAlign: 'center',
			textShadowColor: 'rgba(0, 0, 0, 0.25)', // Shadow color (black with 25% opacity)
			textShadowOffset: { width: 0, height: 3 }, // Shadow offset (horizontal and vertical)
			textShadowRadius: 3, // Shadow radius
		},
		header: {
			fontFamily: fonts.inter.bold,
			fontSize: 20,
			color: '#FFFFFF',
			textAlign: 'center',
			textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
			textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
			textShadowRadius: 2, // Shadow radius
		},
		body: {
			small: {
				fontFamily: fonts.inter.regular.fontFamily,

				fontSize: 10,
				color: '#FFFFFF',
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
				// textShadowOffset: { width: 0, height: 1 }, // Shadow offset (horizontal and vertical)
				// textShadowRadius: 1, // Shadow radius
			},
			medium: {
				fontFamily: fonts.inter.regular.fontFamily,

				fontSize: 14,
				color: '#FFFFFF',
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
				// textShadowOffset: { width: 0, height: 1 }, // Shadow offset (horizontal and vertical)
				// textShadowRadius: 1, // Shadow radius
			},
			mediumer: {
				fontFamily: fonts.inter.regular.fontFamily,
				fontSize: 16,
				color: '#FFFFFF',
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
				// textShadowOffset: { width: 0, height: 1 }, // Shadow offset (horizontal and vertical)
				// textShadowRadius: 1, // Shadow radius
			},
			large: {
				fontFamily: fonts.inter.regular.fontFamily,

				fontSize: 16,
				color: '#FFFFFF',
				textAlign: 'center',
				fontWeight: 'normal',
				// textShadowColor: 'rgba(255, 255,255, 0.25)', // Shadow color (black with 50% opacity)
				// textShadowOffset: { width: 0, height: 2 }, // Shadow offset (horizontal and vertical)
				// textShadowRadius: 2, // Shadow radius
			},
		},
		subtext: {
			color: '#59636D',
			fontSize: 18,
		},
	},
	div: {
		opacity: 0.3,
		color: '#C9C5C5',
	},
	grayShades: {
		gray50: '#1C1C1C',
		gray100: '#292929',
		gray200: '#333333',
		gray300: '#404040',
		gray400: '#666666',
		gray500: '#7C7C7C',
		gray600: '#999999',
		gray700: '#B3B3B3',
		gray800: '#CCCCCC',
		gray900: '#E6E6E6',
	},
	opacity: {
		low: '0.6',
		medium: '0.8',
		high: '0.95',
	},
};

export { darkTheme, lightTheme };
